import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Tag, Percent, DollarSign, BookOpen } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface Course {
  id: string;
  title: string;
  price: number;
}

interface Bundle {
  id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount' | 'promo_code';
  discount_value: number;
  promo_code: string | null;
  is_active: boolean;
  courses: Course[];
  total_price: number;
  discount_amount: number;
  final_price: number;
}

const CourseBundleManagement: React.FC = () => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingBundle, setEditingBundle] = useState<string | null>(null);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<'mentor' | 'admin' | null>(null);
  const [creatorType, setCreatorType] = useState<'mentor' | 'admin'>('mentor');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount' | 'promo_code',
    discount_value: 0,
    promo_code: '',
    selectedCourses: [] as string[],
  });

  useEffect(() => {
    checkUserRole();
  }, []);

  useEffect(() => {
    if (currentMemberId && creatorType) {
      loadCourses();
      loadBundles();
    }
  }, [currentMemberId, creatorType]);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        navigate('/community');
        return;
      }

      const { data: member } = await supabase
        .from('community_members')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member) {
        setCurrentMemberId(member.id);
        setCurrentRole(member.role === 'mentor' ? 'mentor' : member.role === 'admin' ? 'admin' : null);
        setCreatorType(member.role === 'mentor' ? 'mentor' : 'admin');
        
        if (member.role !== 'mentor' && member.role !== 'admin') {
          navigate('/community');
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/community');
    }
  };

  const loadCourses = async () => {
    if (!currentMemberId || !creatorType) return;

    try {
      let query = supabase
        .from('mentor_courses')
        .select('id, title, price')
        .eq('status', 'published');

      // Mentors can only select their own courses
      if (creatorType === 'mentor') {
        query = query.eq('mentor_id', currentMemberId);
      }
      // Admins can select any course

      const { data, error } = await query.order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const loadBundles = async () => {
    if (!currentMemberId || !creatorType) return;

    try {
      setLoading(true);
      const creatorId = creatorType === 'mentor' ? currentMemberId : (await auth.getUser()).data.user?.id;

      if (!creatorId) return;

      const { data: bundlesData, error } = await supabase
        .from('course_bundles')
        .select('*')
        .eq('creator_id', creatorId)
        .eq('creator_type', creatorType)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Load courses for each bundle and calculate prices
      const bundlesWithCourses = await Promise.all(
        (bundlesData || []).map(async (bundle) => {
          const { data: items } = await supabase
            .from('course_bundle_items')
            .select('course_id, mentor_courses(id, title, price)')
            .eq('bundle_id', bundle.id)
            .order('order_index');

          const coursesList = (items || []).map((item: any) => ({
            id: item.course_id,
            title: item.mentor_courses.title,
            price: item.mentor_courses.price,
          }));

          const totalPrice = coursesList.reduce((sum, c) => sum + parseFloat(c.price.toString()), 0);
          
          // Calculate discount
          let discountAmount = 0;
          if (bundle.discount_type === 'percentage') {
            discountAmount = totalPrice * (bundle.discount_value / 100);
          } else if (bundle.discount_type === 'fixed_amount') {
            discountAmount = Math.min(bundle.discount_value, totalPrice);
          }

          const finalPrice = Math.max(totalPrice - discountAmount, 0);

          return {
            ...bundle,
            courses: coursesList,
            total_price: totalPrice,
            discount_amount: discountAmount,
            final_price: finalPrice,
          };
        })
      );

      setBundles(bundlesWithCourses);
    } catch (error) {
      console.error('Error loading bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBundle = async () => {
    if (!formData.title.trim() || formData.selectedCourses.length === 0) {
      alert('Please provide a title and select at least one course');
      return;
    }

    if (formData.discount_type === 'promo_code' && !formData.promo_code.trim()) {
      alert('Please provide a promo code');
      return;
    }

    if (formData.discount_value <= 0) {
      alert('Discount value must be greater than 0');
      return;
    }

    try {
      setCreating(true);
      const { data: { user } } = await auth.getUser();
      if (!user || !currentMemberId) throw new Error('Not authenticated');

      const creatorId = creatorType === 'mentor' ? currentMemberId : user.id;

      // Create bundle
      const { data: bundle, error: bundleError } = await supabase
        .from('course_bundles')
        .insert({
          creator_id: creatorId,
          creator_type: creatorType,
          title: formData.title,
          description: formData.description || null,
          discount_type: formData.discount_type,
          discount_value: formData.discount_value,
          promo_code: formData.discount_type === 'promo_code' ? formData.promo_code : null,
          is_active: true,
        })
        .select()
        .single();

      if (bundleError) throw bundleError;

      // Add courses to bundle
      const items = formData.selectedCourses.map((courseId, index) => ({
        bundle_id: bundle.id,
        course_id: courseId,
        order_index: index,
      }));

      const { error: itemsError } = await supabase
        .from('course_bundle_items')
        .insert(items);

      if (itemsError) throw itemsError;

      // Reset form
      setFormData({
        title: '',
        description: '',
        discount_type: 'percentage',
        discount_value: 0,
        promo_code: '',
        selectedCourses: [],
      });
      setCreating(false);

      await loadBundles();
      alert('Bundle created successfully!');
    } catch (error: any) {
      console.error('Error creating bundle:', error);
      alert(error.message || 'Failed to create bundle');
      setCreating(false);
    }
  };

  const handleToggleActive = async (bundleId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('course_bundles')
        .update({ is_active: !currentStatus })
        .eq('id', bundleId);

      if (error) throw error;
      await loadBundles();
    } catch (error: any) {
      console.error('Error toggling bundle status:', error);
      alert(error.message || 'Failed to update bundle');
    }
  };

  const handleDeleteBundle = async (bundleId: string) => {
    if (!confirm('Are you sure you want to delete this bundle? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('course_bundles')
        .delete()
        .eq('id', bundleId);

      if (error) throw error;
      await loadBundles();
      alert('Bundle deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting bundle:', error);
      alert(error.message || 'Failed to delete bundle');
    }
  };

  const toggleCourseSelection = (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter((id) => id !== courseId)
        : [...prev.selectedCourses, courseId],
    }));
  };

  const calculatePreviewDiscount = () => {
    const selectedCoursesData = courses.filter((c) => formData.selectedCourses.includes(c.id));
    const totalPrice = selectedCoursesData.reduce((sum, c) => sum + parseFloat(c.price.toString()), 0);
    
    if (totalPrice === 0) return { total: 0, discount: 0, final: 0 };

    let discount = 0;
    if (formData.discount_type === 'percentage') {
      discount = totalPrice * (formData.discount_value / 100);
    } else if (formData.discount_type === 'fixed_amount') {
      discount = Math.min(formData.discount_value, totalPrice);
    }

    return {
      total: totalPrice,
      discount: discount,
      final: Math.max(totalPrice - discount, 0),
    };
  };

  const preview = calculatePreviewDiscount();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading bundles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/community/mentor')}
              className="text-gray-600 hover:text-[#1D3A6B] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-[#1D3A6B]">Course Bundles</h1>
          </div>
        </div>

        {/* Create Bundle Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Create New Bundle</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bundle Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                placeholder="e.g., Business Strategy Bundle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                placeholder="Describe what's included in this bundle..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                >
                  <option value="percentage">Percentage Off</option>
                  <option value="fixed_amount">Fixed Amount Off</option>
                  <option value="promo_code">Promo Code</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.discount_type === 'percentage' ? 'Discount Percentage' : 'Discount Amount (₹)'}
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.discount_type === 'percentage' ? '100' : undefined}
                  step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>
            </div>

            {formData.discount_type === 'promo_code' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                <input
                  type="text"
                  value={formData.promo_code}
                  onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  placeholder="BUNDLE2024"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Courses</label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                {courses.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    {creatorType === 'mentor' 
                      ? 'No published courses available. Create and publish courses first.'
                      : 'No published courses available.'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <label
                        key={course.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedCourses.includes(course.id)}
                          onChange={() => toggleCourseSelection(course.id)}
                          className="w-4 h-4 text-[#1D3A6B] border-gray-300 rounded focus:ring-[#1D3A6B]"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">₹{course.price.toFixed(2)}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            {formData.selectedCourses.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Price Preview</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Price:</span>
                    <span className="font-medium">₹{preview.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Discount:</span>
                    <span className="font-medium text-green-600">-₹{preview.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="font-semibold text-blue-900">Final Price:</span>
                    <span className="font-bold text-blue-900">₹{preview.final.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleCreateBundle}
              disabled={creating || formData.selectedCourses.length === 0}
              className="w-full bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Bundle
                </>
              )}
            </button>
          </div>
        </div>

        {/* Existing Bundles */}
        <div>
          <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Your Bundles</h2>
          
          {bundles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No bundles created yet. Create your first bundle above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
                    bundle.is_active ? 'border-green-200' : 'border-gray-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1D3A6B] mb-1">{bundle.title}</h3>
                      {bundle.description && (
                        <p className="text-sm text-gray-600 mb-2">{bundle.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          bundle.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bundle.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {bundle.promo_code && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            Code: {bundle.promo_code}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(bundle.id, bundle.is_active)}
                        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                          bundle.is_active ? 'text-green-600' : 'text-gray-400'
                        }`}
                        title={bundle.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {bundle.is_active ? '✓' : '○'}
                      </button>
                      <button
                        onClick={() => handleDeleteBundle(bundle.id)}
                        className="p-2 text-red-600 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Courses ({bundle.courses.length}):</p>
                    <div className="space-y-1">
                      {bundle.courses.map((course) => (
                        <div key={course.id} className="text-sm text-gray-600 flex justify-between">
                          <span>• {course.title}</span>
                          <span>₹{course.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">
                          <span className="line-through">₹{bundle.total_price.toFixed(2)}</span>
                          {' → '}
                          <span className="font-bold text-[#1D3A6B] text-lg">₹{bundle.final_price.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-green-600">
                          Save ₹{bundle.discount_amount.toFixed(2)} ({bundle.discount_type === 'percentage' ? `${bundle.discount_value}%` : '₹' + bundle.discount_value})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseBundleManagement;

