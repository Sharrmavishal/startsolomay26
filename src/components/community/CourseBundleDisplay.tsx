import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Tag, Percent, DollarSign, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
  courses: Course[];
  total_price: number;
  discount_amount: number;
  final_price: number;
}

interface CourseBundleDisplayProps {
  mentorId?: string | null;
  showAll?: boolean;
}

const CourseBundleDisplay: React.FC<CourseBundleDisplayProps> = ({ mentorId, showAll = false }) => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBundles();
  }, [mentorId, showAll]);

  const loadBundles = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('course_bundles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Filter by mentor if specified
      if (mentorId && !showAll) {
        query = query.eq('creator_id', mentorId).eq('creator_type', 'mentor');
      }

      const { data: bundlesData, error } = await query;

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

  const handleBundleClick = (bundleId: string, promoCode: string | null) => {
    // Navigate to bundle enrollment page or show bundle details
    if (promoCode) {
      navigate(`/community/bundles/${bundleId}?promo=${promoCode}`);
    } else {
      navigate(`/community/bundles/${bundleId}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A6B]"></div>
        <p className="mt-2 text-gray-600">Loading bundles...</p>
      </div>
    );
  }

  if (bundles.length === 0) {
    return null; // Don't show anything if no bundles
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-[#1D3A6B]" />
        <h2 className="text-xl font-bold text-[#1D3A6B]">Course Bundles</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            onClick={() => handleBundleClick(bundle.id, bundle.promo_code)}
            className="bg-white rounded-lg shadow-sm border-2 border-green-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1D3A6B] mb-1">{bundle.title}</h3>
                {bundle.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{bundle.description}</p>
                )}
              </div>
              {bundle.promo_code && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded whitespace-nowrap ml-2">
                  {bundle.promo_code}
                </span>
              )}
            </div>

            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Includes {bundle.courses.length} {bundle.courses.length === 1 ? 'course' : 'courses'}:
              </p>
              <div className="space-y-1">
                {bundle.courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                    <span className="truncate">{course.title}</span>
                  </div>
                ))}
                {bundle.courses.length > 3 && (
                  <p className="text-xs text-gray-500 ml-5">+{bundle.courses.length - 3} more</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-600">
                    <span className="line-through">₹{bundle.total_price.toFixed(2)}</span>
                  </div>
                  <div className="text-xl font-bold text-[#1D3A6B]">
                    ₹{bundle.final_price.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-600 font-semibold">
                    Save ₹{bundle.discount_amount.toFixed(2)}
                  </div>
                  {bundle.discount_type === 'percentage' && (
                    <div className="text-xs text-gray-500">
                      {bundle.discount_value}% off
                    </div>
                  )}
                </div>
              </div>
              
              <button className="w-full mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                View Bundle
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseBundleDisplay;

