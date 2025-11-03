import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Award, Clock, BookOpen, BarChart3, Calendar, Eye, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CourseAnalyticsProps {
  mentorId: string | null;
}

interface CourseStats {
  id: string;
  title: string;
  enrollments: number;
  completed: number;
  inProgress: number;
  revenue: number;
  completionRate: number;
  averageProgress: number;
  totalContentViews: number;
  uniqueContentAccessors: number;
}

interface LessonAccessStats {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  views: number;
  uniqueViewers: number;
}

interface ContentAccessAlert {
  type: 'piracy' | 'suspicious';
  message: string;
  details: string;
}

interface OverallStats {
  totalEnrollments: number;
  totalCompleted: number;
  totalRevenue: number;
  averageCompletionRate: number;
  totalStudents: number;
}

const CourseAnalytics: React.FC<CourseAnalyticsProps> = ({ mentorId }) => {
  const [loading, setLoading] = useState(true);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalEnrollments: 0,
    totalCompleted: 0,
    totalRevenue: 0,
    averageCompletionRate: 0,
    totalStudents: 0,
  });
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '90d' | '1y'>('all');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [lessonAccessStats, setLessonAccessStats] = useState<LessonAccessStats[]>([]);
  const [contentAccessAlerts, setContentAccessAlerts] = useState<ContentAccessAlert[]>([]);

  useEffect(() => {
    if (mentorId) {
      loadAnalytics();
    }
  }, [mentorId, timeRange]);

  useEffect(() => {
    if (selectedCourse && mentorId) {
      loadContentAccessStats(selectedCourse);
    }
  }, [selectedCourse]);

  const loadContentAccessStats = async (courseId: string) => {
    try {
      // Get all enrollments for this course
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('course_id', courseId);

      if (!enrollments || enrollments.length === 0) {
        setLessonAccessStats([]);
        return;
      }

      // Get access logs for lessons in this course
      const { data: accessLogs } = await supabase
        .from('content_access_logs')
        .select('lesson_id, student_id, access_type, signed_url_used, ip_address, accessed_at')
        .in('enrollment_id', enrollments.map(e => e.id));

      // Get lesson details
      const { data: lessons } = await supabase
        .from('course_lessons')
        .select('id, title, module_id')
        .in('id', [...new Set(accessLogs?.map(log => log.lesson_id) || [])]);

      // Get module details
      const moduleIds = [...new Set(lessons?.map(l => l.module_id) || [])];
      const { data: modules } = await supabase
        .from('course_modules')
        .select('id, title')
        .in('id', moduleIds);

      const moduleMap = new Map(modules?.map(m => [m.id, m.title]) || []);

      // Aggregate stats per lesson
      const lessonStatsMap = new Map<string, LessonAccessStats>();

      lessons?.forEach(lesson => {
        const lessonLogs = accessLogs?.filter(log => log.lesson_id === lesson.id) || [];
        const views = lessonLogs.length;
        const uniqueViewers = new Set(lessonLogs.map(log => log.student_id)).size;

        lessonStatsMap.set(lesson.id, {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          moduleTitle: moduleMap.get(lesson.module_id) || 'Unknown Module',
          views,
          uniqueViewers,
        });
      });

      setLessonAccessStats(Array.from(lessonStatsMap.values()).sort((a, b) => b.views - a.views));

      // Check for suspicious access patterns (piracy detection)
      const alerts: ContentAccessAlert[] = [];
      
      // Check for multiple accounts accessing from same IP
      const ipToAccounts = new Map<string, Set<string>>();
      accessLogs?.forEach(log => {
        if (log.ip_address && log.ip_address !== '0.0.0.0') {
          if (!ipToAccounts.has(log.ip_address)) {
            ipToAccounts.set(log.ip_address, new Set());
          }
          ipToAccounts.get(log.ip_address)!.add(log.student_id);
        }
      });

      ipToAccounts.forEach((accounts, ip) => {
        if (accounts.size > 1) {
          alerts.push({
            type: 'suspicious',
            message: `Multiple accounts accessing from same IP`,
            details: `IP ${ip} has ${accounts.size} different student accounts accessing content`,
          });
        }
      });

      setContentAccessAlerts(alerts);
    } catch (error) {
      console.error('Error loading content access stats:', error);
    }
  };

  const loadAnalytics = async () => {
    if (!mentorId) return;

    try {
      setLoading(true);

      // Get date filter
      const dateFilter = getDateFilter(timeRange);

      // Load all courses for this mentor
      const { data: courses, error: coursesError } = await supabase
        .from('mentor_courses')
        .select('id, title, price')
        .eq('mentor_id', mentorId)
        .eq('status', 'published');

      if (coursesError) throw coursesError;

      // Load enrollments with filters
      const enrollmentsQuery = supabase
        .from('course_enrollments')
        .select('course_id, student_id, payment_status, progress_percentage, enrollment_status, payment_amount, mentor_payout, created_at')
        .in('course_id', courses?.map(c => c.id) || [])
        .eq('payment_status', 'paid');

      if (dateFilter) {
        enrollmentsQuery.gte('created_at', dateFilter);
      }

      const { data: enrollments, error: enrollmentsError } = await enrollmentsQuery;

      if (enrollmentsError) throw enrollmentsError;

      // Calculate stats per course
      const courseStatsMap = new Map<string, CourseStats>();

      // Process courses sequentially to use await
      for (const course of courses || []) {
        const courseEnrollments = enrollments?.filter(e => e.course_id === course.id) || [];
        const completed = courseEnrollments.filter(e => e.progress_percentage === 100).length;
        const inProgress = courseEnrollments.filter(e => e.progress_percentage > 0 && e.progress_percentage < 100).length;
        const totalEnrollments = courseEnrollments.length;
        const revenue = courseEnrollments.reduce((sum, e) => sum + (parseFloat(e.mentor_payout) || 0), 0);
        const completionRate = totalEnrollments > 0 ? (completed / totalEnrollments) * 100 : 0;
        const averageProgress = totalEnrollments > 0 
          ? courseEnrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / totalEnrollments 
          : 0;

        // Load content access stats for this course
        const { data: accessLogs } = await supabase
          .from('content_access_logs')
          .select('lesson_id, student_id')
          .in('enrollment_id', courseEnrollments.map(e => e.id));

        const totalContentViews = accessLogs?.length || 0;
        const uniqueContentAccessors = new Set(accessLogs?.map(log => log.student_id) || []).size;

        courseStatsMap.set(course.id, {
          id: course.id,
          title: course.title,
          enrollments: totalEnrollments,
          completed,
          inProgress,
          revenue,
          completionRate,
          averageProgress,
          totalContentViews,
          uniqueContentAccessors,
        });
      }

      // Load content access logs for selected course
      if (selectedCourse) {
        await loadContentAccessStats(selectedCourse);
      }

      setCourseStats(Array.from(courseStatsMap.values()));

      // Calculate overall stats
      const allEnrollments = enrollments || [];
      const uniqueStudents = new Set(allEnrollments.map(e => e.student_id));
      const totalCompleted = allEnrollments.filter(e => e.progress_percentage === 100).length;
      const totalRevenue = allEnrollments.reduce((sum, e) => sum + (parseFloat(e.mentor_payout) || 0), 0);
      const avgCompletionRate = allEnrollments.length > 0 
        ? (totalCompleted / allEnrollments.length) * 100 
        : 0;

      setOverallStats({
        totalEnrollments: allEnrollments.length,
        totalCompleted,
        totalRevenue,
        averageCompletionRate: avgCompletionRate,
        totalStudents: uniqueStudents.size,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateFilter = (range: string): string | null => {
    const now = new Date();
    switch (range) {
      case '30d':
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      case '90d':
        return new Date(now.setDate(now.getDate() - 90)).toISOString();
      case '1y':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A6B]"></div>
        <p className="mt-2 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1D3A6B]">Course Analytics</h2>
          <p className="text-gray-600 text-sm mt-1">Track performance and revenue</p>
        </div>
        <div className="flex gap-2">
          {(['all', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-[#1D3A6B] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === 'all' ? 'All Time' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
          <p className="text-2xl font-bold text-[#1D3A6B]">{overallStats.totalStudents}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            <p className="text-sm text-gray-600">Total Enrollments</p>
          </div>
          <p className="text-2xl font-bold text-[#1D3A6B]">{overallStats.totalEnrollments}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-purple-600" />
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <p className="text-2xl font-bold text-[#1D3A6B]">{overallStats.totalCompleted}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
          <p className="text-2xl font-bold text-[#1D3A6B]">{overallStats.averageCompletionRate.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-[#1D3A6B]">₹{overallStats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Course-wise Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#1D3A6B]">Course Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content Views
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courseStats.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No course data available
                  </td>
                </tr>
              ) : (
                courseStats.map((course) => (
                  <tr 
                    key={course.id} 
                    className={selectedCourse === course.id ? 'bg-blue-50' : 'hover:bg-gray-50 cursor-pointer'}
                    onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.enrollments}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600 font-medium">{course.completed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600">{course.inProgress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${course.averageProgress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{course.averageProgress.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.completionRate.toFixed(1)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">₹{course.revenue.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Eye className="h-4 w-4" />
                        {course.totalContentViews} ({course.uniqueContentAccessors})
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View for Selected Course */}
      {selectedCourse && (
        <div className="space-y-6">
          {/* Content Access Alerts */}
          {contentAccessAlerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <h4 className="font-semibold text-yellow-900">Access Alerts</h4>
              </div>
              <div className="space-y-2">
                {contentAccessAlerts.map((alert, idx) => (
                  <div key={idx} className="text-sm text-yellow-800">
                    <span className="font-medium">{alert.message}:</span> {alert.details}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lesson Access Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#1D3A6B] mb-4">
              {courseStats.find(c => c.id === selectedCourse)?.title} - Content Access Metrics
            </h3>
            
            {lessonAccessStats.length === 0 ? (
              <p className="text-gray-600">No content access data available yet.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <p className="text-sm text-gray-600">Total Content Views</p>
                    </div>
                    <p className="text-2xl font-bold text-[#1D3A6B]">
                      {lessonAccessStats.reduce((sum, stat) => sum + stat.views, 0)}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <p className="text-sm text-gray-600">Unique Viewers</p>
                    </div>
                    <p className="text-2xl font-bold text-[#1D3A6B]">
                      {lessonAccessStats.length > 0 ? Math.max(...lessonAccessStats.map(s => s.uniqueViewers), 0) : 0}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lesson</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unique Viewers</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lessonAccessStats.map((stat) => (
                        <tr key={stat.lessonId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{stat.moduleTitle}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{stat.lessonTitle}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{stat.views}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{stat.uniqueViewers}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseAnalytics;

