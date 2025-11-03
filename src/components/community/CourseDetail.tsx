import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Clock, DollarSign, CheckCircle, XCircle, Star, Play, FileText, Link as LinkIcon, Video, Award, ExternalLink, AlertCircle, Loader2, HelpCircle } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import { razorpayService } from '../../lib/payments/razorpay';
import { notificationService } from '../../lib/notifications/notificationService';
import { courseContentStorage } from '../../lib/storage/courseContent';
import CourseQuiz from './CourseQuiz';
import CourseReviewSection from './CourseReviewSection';

interface Course {
  id: string;
  title: string;
  short_description: string;
  description: string;
  category: string;
  price: number;
  cover_image_url: string | null;
  enrollment_count: number;
  max_students: number | null;
  total_duration_hours: number | null;
  tags: string[];
  featured: boolean;
  status: string;
  mentor: {
    id: string;
    display_name: string;
    full_name: string;
  };
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content_type: 'video' | 'pdf' | 'text' | 'audio' | 'link' | 'quiz';
  content_url: string;
  content_text: string;
  duration_minutes: number;
  order_index: number;
  completed?: boolean;
  storage_path?: string;
  storage_bucket?: string;
  is_uploaded_content?: boolean;
}

interface Enrollment {
  id: string;
  enrollment_status: string;
  progress_percentage: number;
  enrolled_at: string;
  completed_at: string | null;
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [vettingStatus, setVettingStatus] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<any>(null);
  const [signedUrlCache, setSignedUrlCache] = useState<Map<string, { url: string; expiresAt: string }>>(new Map());
  const [loadingContent, setLoadingContent] = useState<string | null>(null);
  const [isMentor, setIsMentor] = useState(false);
  const [isOwnCourse, setIsOwnCourse] = useState(false);
  const [quizLessonId, setQuizLessonId] = useState<string | null>(null);
  const [coverImageError, setCoverImageError] = useState(false);

  // Computed values
  const isEnrolled = enrollment !== null;
  const isCompleted = enrollment?.progress_percentage === 100;
  const canEnroll = !isEnrolled && course && currentMemberId && course.price >= 0 && !isOwnCourse;

  useEffect(() => {
    if (id) {
      loadCourse();
      loadModules();
      loadCurrentMember();
    }
  }, [id]);

  const loadCurrentMember = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) return;

      const { data: member } = await supabase
        .from('community_members')
        .select('id, vetting_status, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member) {
        setCurrentMemberId(member.id);
        setVettingStatus(member.vetting_status);
        setIsMentor(member.role === 'mentor');
        checkEnrollment(member.id);
      }
    } catch (error) {
      console.error('Error loading member:', error);
    }
  };

  const checkEnrollment = async (memberId: string) => {
    if (!id) return;
    try {
      const { data } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('course_id', id)
        .eq('student_id', memberId)
        .eq('enrollment_status', 'active')
        .maybeSingle();

      if (data) {
        setEnrollment(data);
        loadProgress(data.id);
        loadCertificate(data.id);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const loadProgress = async (enrollmentId: string) => {
    try {
      const { data } = await supabase
        .from('lesson_progress')
        .select('lesson_id, is_completed')
        .eq('enrollment_id', enrollmentId);

      if (data) {
        const completedLessons = new Set(data.filter(p => p.is_completed).map(p => p.lesson_id));
        setModules(prev => prev.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => ({
            ...lesson,
            completed: completedLessons.has(lesson.id),
          })),
        })));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadCertificate = async (enrollmentId: string) => {
    try {
      const { data } = await supabase
        .from('course_certificates')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .maybeSingle();

      if (data) {
        setCertificate(data);
        
        // Send completion notification if certificate was just generated
        if (currentMemberId && course) {
          const { data: member } = await supabase
            .from('community_members')
            .select('user_id')
            .eq('id', currentMemberId)
            .single();
          
          if (member?.user_id) {
            await notificationService.sendCourseCompletionNotification(
              member.user_id,
              course.title,
              data.id,
              course.id
            );
          }
        }
      }
    } catch (error) {
      console.error('Error loading certificate:', error);
    }
  };

  const loadCourse = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mentor_courses')
        .select(`
          *,
          community_members!mentor_id (
            id,
            display_name,
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const formattedCourse = {
        ...data,
        mentor: {
          id: data.community_members.id,
          display_name: data.community_members.display_name,
          full_name: data.community_members.full_name,
        },
      };

      setCourse(formattedCourse);
      setCoverImageError(false); // Reset image error when course loads
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user owns the course after both course and member are loaded
  useEffect(() => {
    if (course && currentMemberId && course.mentor.id === currentMemberId) {
      setIsOwnCourse(true);
    } else {
      setIsOwnCourse(false);
    }
  }, [course, currentMemberId]);

  const loadModules = async () => {
    if (!id) return;

    try {
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });

      if (modulesError) throw modulesError;

      const modulesWithLessons = await Promise.all(
        (modulesData || []).map(async (module) => {
          const { data: lessonsData, error: lessonsError } = await supabase
            .from('course_lessons')
            .select('id, title, description, content_type, content_url, content_text, duration_minutes, order_index, storage_path, storage_bucket, is_uploaded_content')
            .eq('module_id', module.id)
            .order('order_index', { ascending: true });

          if (lessonsError) throw lessonsError;

          return {
            ...module,
            lessons: lessonsData || [],
          };
        })
      );

      setModules(modulesWithLessons);
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  const handleEnroll = async () => {
    if (!id || !currentMemberId || !course) return;

    if (enrolling) return;

    try {
      setEnrolling(true);

      // Check if already enrolled
      const { data: existing } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('course_id', id)
        .eq('student_id', currentMemberId)
        .maybeSingle();

      if (existing) {
        alert('You are already enrolled in this course.');
        setEnrolling(false);
        return;
      }

      // Get admin settings for commission
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'course_commission_rate')
        .single();

      const commissionRate = settings ? parseFloat(settings.value as string) : 0.15; // Default 15%
      const commissionAmount = course.price * commissionRate;
      const mentorPayout = course.price - commissionAmount;

      // Create enrollment record with pending payment
      const { data: enrollmentData, error: enrollError } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: id,
          student_id: currentMemberId,
          payment_status: 'pending',
          payment_amount: course.price,
          commission_amount: commissionAmount,
          mentor_payout: mentorPayout,
          enrollment_status: 'active',
        })
        .select()
        .single();

      if (enrollError) throw enrollError;

      // Get user info for payment
      const { data: { user } } = await auth.getUser();
      const { data: member } = await supabase
        .from('community_members')
        .select('full_name, email')
        .eq('id', currentMemberId)
        .single();

      // Initiate Razorpay payment
      await razorpayService.openCheckout({
        orderId: enrollmentData.id,
        amount: course.price * 100, // Convert to paise
        currency: 'INR',
        name: 'Start Solo',
        description: `Enrollment: ${course.title}`,
        notes: {
          course_id: id,
          type: 'course',
        },
        prefill: {
          name: member?.full_name || user?.email?.split('@')[0] || '',
          email: member?.email || user?.email || '',
        },
        handler: async (response) => {
          // Payment successful - update enrollment
          const { error: updateError } = await supabase
            .from('course_enrollments')
            .update({
              payment_status: 'paid',
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            .eq('id', enrollmentData.id);

          if (updateError) {
            console.error('Error updating enrollment:', updateError);
            alert('Payment successful but enrollment update failed. Please contact support.');
          } else {
            // Reload enrollment
            await checkEnrollment(currentMemberId);
            
            // Send enrollment notification
            if (currentMemberId && course) {
              const { data: member } = await supabase
                .from('community_members')
                .select('user_id')
                .eq('id', currentMemberId)
                .single();
              
              if (member?.user_id) {
                await notificationService.sendCourseEnrollmentNotification(
                  member.user_id,
                  course.title,
                  course.id
                );
                await notificationService.sendPaymentConfirmation(
                  member.user_id,
                  'course',
                  course.title,
                  course.price,
                  response.razorpay_payment_id || 'pending'
                );
              }
            }
            
            alert('Enrollment successful! You can now access the course content.');
          }
        },
        onError: (error) => {
          console.error('Payment error:', error);
          // Delete pending enrollment if payment fails
          supabase
            .from('course_enrollments')
            .delete()
            .eq('id', enrollmentData.id);
          alert('Payment failed. Please try again.');
        },
      });
    } catch (error: any) {
      console.error('Error enrolling:', error);
      alert(error.message || 'Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">This course doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/community/courses')}
            className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const getSignedContentUrl = async (lesson: Lesson): Promise<string | null> => {
    // Allow course creators to access content without enrollment
    if (!lesson.is_uploaded_content || !lesson.storage_path) {
      return lesson.content_url || null;
    }

    // For course creators, use direct storage access (they own the content)
    if (isOwnCourse && currentMemberId) {
      try {
        const bucket = lesson.storage_bucket || 'course-pdfs';
        if (!lesson.storage_path) {
          console.error('No storage path for lesson:', lesson.id);
          return lesson.content_url || null;
        }
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUrl(lesson.storage_path, 3600);
        
        if (error) {
          console.error('Error creating signed URL for course creator:', error);
          // Fallback to content_url if signed URL fails
          return lesson.content_url || null;
        }
        
        if (data?.signedUrl) {
          return data.signedUrl;
        }
      } catch (error) {
        console.error('Error getting signed URL for course creator:', error);
        // Fallback to content_url
        return lesson.content_url || null;
      }
    }

    // For enrolled students, use Edge Function with enrollment verification
    if (!enrollment) {
      return lesson.content_url || null;
    }

    // Check cache
    const cacheKey = `${lesson.id}-${enrollment.id}`;
    const cached = signedUrlCache.get(cacheKey);
    if (cached && new Date(cached.expiresAt) > new Date()) {
      return cached.url;
    }

    // Get signed URL via Edge Function
    setLoadingContent(lesson.id);
    try {
      const result = await courseContentStorage.getSignedUrl(lesson.id, enrollment.id);
      if (result.success && result.signedUrl) {
        // Cache it
        setSignedUrlCache(prev => {
          const newCache = new Map(prev);
          newCache.set(cacheKey, {
            url: result.signedUrl!,
            expiresAt: result.expiresAt || new Date(Date.now() + 3600000).toISOString()
          });
          return newCache;
        });
        
        // Log access
        await courseContentStorage.logContentAccess(lesson.id, enrollment.id, 'view');
        
        return result.signedUrl;
      }
      return null;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return null;
    } finally {
      setLoadingContent(null);
    }
  };

  const markLessonAccessed = async (lessonId: string) => {
    if (!enrollment || !currentMemberId) return;
    
    try {
      // Check if progress already exists
      const { data: existing } = await supabase
        .from('lesson_progress')
        .select('id')
        .eq('enrollment_id', enrollment.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (existing) {
        // Update last accessed
        await supabase
          .from('lesson_progress')
          .update({ last_accessed_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        // Create new progress entry
        await supabase
          .from('lesson_progress')
          .insert({
            enrollment_id: enrollment.id,
            lesson_id: lessonId,
            student_id: currentMemberId,
            last_accessed_at: new Date().toISOString(),
          });
      }
    } catch (error) {
      console.error('Error marking lesson accessed:', error);
    }
  };

  const markLessonComplete = async (lessonId: string, isComplete: boolean) => {
    if (!enrollment || !currentMemberId) return;
    
    try {
      // Check if progress already exists
      const { data: existing } = await supabase
        .from('lesson_progress')
        .select('id')
        .eq('enrollment_id', enrollment.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (existing) {
        // Update completion status
        await supabase
          .from('lesson_progress')
          .update({ 
            is_completed: isComplete,
            completed_at: isComplete ? new Date().toISOString() : null,
            last_accessed_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        // Create new progress entry
        await supabase
          .from('lesson_progress')
          .insert({
            enrollment_id: enrollment.id,
            lesson_id: lessonId,
            student_id: currentMemberId,
            is_completed: isComplete,
            completed_at: isComplete ? new Date().toISOString() : null,
            last_accessed_at: new Date().toISOString(),
          });
      }

      // Reload progress to update UI
      await loadProgress(enrollment.id);
      
      // Reload enrollment to get updated progress percentage (trigger updates it)
      // Wait a bit for trigger to fire
      setTimeout(async () => {
        await checkEnrollment(currentMemberId);
      }, 500);
      
      // Check if course is completed and certificate was generated
      if (isComplete) {
        setTimeout(() => {
          loadCertificate(enrollment.id);
        }, 1000); // Give trigger time to fire
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      alert('Failed to update lesson status. Please try again.');
    }
  };

  const openVideoPlayer = async (lesson: Lesson) => {
    let url = lesson.content_url;
    
    if (lesson.is_uploaded_content && (enrollment || isOwnCourse)) {
      // Get signed URL for uploaded videos
      const signedUrl = await getSignedContentUrl(lesson);
      if (signedUrl) {
        url = signedUrl;
      } else {
        alert('Failed to load video. Please try again.');
        return;
      }
    }

    // Convert YouTube URL to embed format if needed
    let embedUrl = url;
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
    }

    // For uploaded videos, use embedded iframe to protect signed URL
    // For YouTube/Vimeo, use embed URL (they handle security)
    if (lesson.is_uploaded_content && (enrollment || isOwnCourse)) {
      // Use embedded viewer to hide URL from address bar
      const videoWindow = window.open('', '_blank', 'width=900,height=700');
      if (videoWindow) {
        videoWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Video Player</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  background: #000;
                  font-family: system-ui, -apple-system, sans-serif;
                }
                .header {
                  background: #1D3A6B;
                  color: white;
                  padding: 15px 20px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .header h2 {
                  font-size: 18px;
                  font-weight: 600;
                }
                .close-btn {
                  background: rgba(255,255,255,0.2);
                  border: none;
                  color: white;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                }
                .close-btn:hover {
                  background: rgba(255,255,255,0.3);
                }
                .viewer-container {
                  width: 100%;
                  height: calc(100vh - 60px);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: #000;
                }
                video {
                  width: 100%;
                  height: 100%;
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                }
                .notice {
                  position: absolute;
                  bottom: 20px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: rgba(255,255,255,0.9);
                  padding: 10px 20px;
                  border-radius: 6px;
                  font-size: 12px;
                  color: #333;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                  z-index: 1000;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>Video Player</h2>
                <button class="close-btn" onclick="window.close()">Close</button>
              </div>
              <div class="viewer-container">
                <video controls autoplay>
                  <source src="${url}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>
              <div class="notice">
                ⚠️ This content is protected. Right-click and download are disabled.
              </div>
              <script>
                // Prevent right-click context menu
                document.addEventListener('contextmenu', (e) => e.preventDefault());
                // Prevent keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'i')) {
                    e.preventDefault();
                  }
                });
              </script>
            </body>
          </html>
        `);
      }
    } else {
      // For YouTube/Vimeo, open in new window (safe - they handle security)
      window.open(embedUrl, '_blank', 'width=800,height=600');
    }
  };

  const openAudioPlayer = async (lesson: Lesson) => {
    let url = lesson.content_url;
    
    if (lesson.is_uploaded_content && (enrollment || isOwnCourse)) {
      // Get signed URL for uploaded audio
      const signedUrl = await getSignedContentUrl(lesson);
      if (signedUrl) {
        url = signedUrl;
      } else {
        alert('Failed to load audio. Please try again.');
        return;
      }
    }

    // Open audio in a new window with audio player
    const audioWindow = window.open('', '_blank', 'width=600,height=200');
    if (audioWindow) {
      audioWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Audio Player</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                background: #1D3A6B; 
                color: white;
                font-family: system-ui, -apple-system, sans-serif;
              }
              audio { width: 100%; margin-top: 20px; }
            </style>
          </head>
          <body>
            <h2>Audio Player</h2>
            <audio controls autoplay>
              <source src="${url}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </body>
        </html>
      `);
    }
  };

  const openPDFViewer = async (lesson: Lesson) => {
    let url = lesson.content_url;
    let errorMessage = '';
    
    if (lesson.is_uploaded_content && (enrollment || isOwnCourse)) {
      // Get signed URL for uploaded PDFs
      try {
        const signedUrl = await getSignedContentUrl(lesson);
        if (signedUrl) {
          url = signedUrl;
        } else {
          // More specific error message based on context
          if (isOwnCourse) {
            errorMessage = 'Failed to load PDF. The file may not exist in storage. Please check the file upload.';
          } else {
            errorMessage = 'Failed to get signed URL. Please check your enrollment status or try again.';
          }
          console.error('PDF URL fetch failed:', { lessonId: lesson.id, enrollmentId: enrollment?.id, isOwnCourse, storagePath: lesson.storage_path });
        }
      } catch (error: any) {
        errorMessage = error.message || 'Failed to load PDF. Please try again.';
        console.error('Error getting signed URL:', error);
      }
    }

    if (!url) {
      alert(errorMessage || 'PDF URL not available.');
      return;
    }

    // Open PDF in an embedded viewer popup to protect IP
    const pdfWindow = window.open('', '_blank', 'width=900,height=700');
    if (pdfWindow) {
      pdfWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>PDF Viewer</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                background: #1a1a1a;
                font-family: system-ui, -apple-system, sans-serif;
              }
              .header {
                background: #1D3A6B;
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
              .header h2 {
                font-size: 18px;
                font-weight: 600;
              }
              .close-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
              }
              .close-btn:hover {
                background: rgba(255,255,255,0.3);
              }
              .viewer-container {
                width: 100%;
                height: calc(100vh - 60px);
                display: flex;
                justify-content: center;
                align-items: center;
                background: #1a1a1a;
                position: relative;
              }
              iframe {
                width: 100%;
                height: 100%;
                border: none;
              }
              .error-message {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255,255,255,0.95);
                padding: 20px 30px;
                border-radius: 8px;
                color: #d32f2f;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                max-width: 400px;
                z-index: 1000;
                display: none;
              }
              .notice {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255,255,255,0.9);
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 12px;
                color: #333;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>PDF Viewer</h2>
              <button class="close-btn" onclick="window.close()">Close</button>
            </div>
            <div class="viewer-container">
              <iframe 
                id="pdfFrame"
                src="${url}#toolbar=0&navpanes=0&scrollbar=1" 
                type="application/pdf"
              ></iframe>
              <div id="errorDiv" class="error-message">
                <h3>Failed to load PDF</h3>
                <p>Please check your connection and try again.</p>
                <button onclick="retryLoad()" style="margin-top: 10px; padding: 8px 16px; background: #1D3A6B; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button>
              </div>
            </div>
            <div class="notice">
              ⚠️ This content is protected. Right-click and download are disabled.
            </div>
          </body>
            <script>
            const pdfUrl = "${url}";
            let retryCount = 0;
            const iframe = document.getElementById('pdfFrame');
            const errorDiv = document.getElementById('errorDiv');
            
            // Enhanced IP protection - disable context menu, downloads, and shortcuts
            document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
              return false;
            }, true);
            
            document.addEventListener('selectstart', function(e) {
              e.preventDefault();
              return false;
            }, true);
            
            document.addEventListener('dragstart', function(e) {
              e.preventDefault();
              return false;
            }, true);
            
            // Disable keyboard shortcuts
            document.addEventListener('keydown', function(e) {
              // Disable Ctrl+S, Ctrl+P, Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, F12, Ctrl+Shift+I
              if (e.ctrlKey || e.metaKey) {
                if (e.key === 's' || e.key === 'S' || 
                    e.key === 'p' || e.key === 'P' ||
                    e.key === 'a' || e.key === 'A' ||
                    e.key === 'c' || e.key === 'C' ||
                    e.key === 'v' || e.key === 'V' ||
                    e.key === 'x' || e.key === 'X') {
                  e.preventDefault();
                  return false;
                }
              }
              if (e.key === 'F12' || 
                  (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i'))) {
                e.preventDefault();
                return false;
              }
            }, true);
            
            // Disable print
            window.addEventListener('beforeprint', function(e) {
              e.preventDefault();
              return false;
            });
            
            function handleError() {
              if (errorDiv) errorDiv.style.display = 'block';
              if (iframe) iframe.style.display = 'none';
            }
            
            function retryLoad() {
              if (retryCount < 3) {
                retryCount++;
                if (iframe) {
                  iframe.src = pdfUrl + '#toolbar=0&navpanes=0&scrollbar=1&t=' + Date.now();
                  iframe.style.display = 'block';
                }
                if (errorDiv) errorDiv.style.display = 'none';
              } else {
                alert('Failed to load PDF after multiple attempts. The file may be corrupted or the URL expired. Please contact support.');
              }
            }
            
            // Check if PDF loads successfully
            if (iframe) {
              iframe.onload = function() {
                console.log('PDF loaded successfully');
                if (errorDiv) errorDiv.style.display = 'none';
              };
              iframe.onerror = function() {
                console.error('PDF failed to load');
                handleError();
              };
              // Fallback timeout
              setTimeout(function() {
                try {
                  if (iframe.contentDocument && iframe.contentDocument.body) {
                    const body = iframe.contentDocument.body;
                    if (body.innerHTML.includes('404') || body.innerHTML.includes('not found') || body.innerHTML.includes('error')) {
                      handleError();
                    }
                  }
                } catch(e) {
                  // Cross-origin - can't check, assume it's loading
                  console.log('Cannot check PDF content (cross-origin)');
                }
              }, 5000);
            }
            
            // Prevent right-click context menu
            document.addEventListener('contextmenu', (e) => e.preventDefault());
            // Prevent common keyboard shortcuts for saving/downloading
            document.addEventListener('keydown', (e) => {
              // Block Ctrl+S, Ctrl+P, Ctrl+Shift+I, F12, etc.
              if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'i')) {
                e.preventDefault();
              }
              if (e.key === 'F12') {
                e.preventDefault();
              }
            });
          </script>
        </html>
      `);
    }
  };

  const openTextContent = (lesson: Lesson) => {
    const textWindow = window.open('', '_blank', 'width=800,height=600');
    if (textWindow) {
      textWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${lesson.title}</title>
            <style>
              body { 
                margin: 0; 
                padding: 40px; 
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
              }
              h1 { color: #1D3A6B; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${lesson.title}</h1>
            ${lesson.description ? `<p><em>${lesson.description}</em></p>` : ''}
            <div>${lesson.content_text.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/community/courses')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1D3A6B] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover Image */}
            {course.cover_image_url && !coverImageError ? (
              <img
                src={course.cover_image_url}
                alt={course.title}
                className="w-full md:w-64 h-48 object-cover rounded-lg"
                onError={() => setCoverImageError(true)}
              />
            ) : (
              <div className="w-full md:w-64 h-48 bg-gradient-to-br from-[#1D3A6B] to-[#152A4F] rounded-lg flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white opacity-50" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {course.featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500" />
                    Featured
                  </span>
                )}
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {course.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-[#1D3A6B] mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.short_description || course.description}</p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-5 w-5" />
                  <span>{course.enrollment_count} enrolled</span>
                </div>
                {course.total_duration_hours && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <span>{course.total_duration_hours} hours</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="h-5 w-5" />
                  <span>{modules.length} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">By</span>
                  <span className="font-medium text-[#1D3A6B]">
                    {course.mentor.display_name || course.mentor.full_name}
                  </span>
                </div>
              </div>

              {isEnrolled && (
                <div className="mb-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Progress</span>
                      <span className="text-sm font-bold text-blue-900">{enrollment.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {isCompleted && certificate && (
                <div className="mb-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <Award className="h-12 w-12 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#1D3A6B] mb-1">Congratulations! 🎉</h3>
                      <p className="text-gray-600">You've completed this course and earned a certificate!</p>
                      <p className="text-sm text-gray-500 mt-1">Certificate Number: {certificate.certificate_number}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        // Open certificate viewer
                        window.open(`/community/certificates/${certificate.id}`, '_blank');
                      }}
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      <Award className="h-5 w-5" />
                      View Certificate
                    </button>
                    {certificate.certificate_url && (
                      <a
                        href={certificate.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        <ExternalLink className="h-5 w-5" />
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {isCompleted && !certificate && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Certificate is being generated. Please refresh the page in a moment.</span>
                  </div>
                </div>
              )}

              {/* Enrollment Button */}
              {currentMemberId && (
                <div className="mb-6">
                  {isOwnCourse ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm font-medium">
                        This is your course. You can view and edit it from your mentor dashboard.
                      </p>
                      <button
                        onClick={() => navigate('/community/mentor')}
                        className="mt-3 text-blue-600 hover:text-blue-800 font-medium underline"
                      >
                        Go to Mentor Dashboard
                      </button>
                    </div>
                  ) : canEnroll && vettingStatus === 'vetted' ? (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="flex items-center gap-2 bg-[#1D3A6B] text-white px-8 py-3 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                    >
                      {enrolling ? (
                        'Processing...'
                      ) : (
                        <>
                          <DollarSign className="h-5 w-5" />
                          {course.price === 0 ? 'Enroll Now (Free)' : `Enroll Now - ₹${course.price}`}
                        </>
                      )}
                    </button>
                  ) : isEnrolled ? (
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <CheckCircle className="h-5 w-5" />
                      Enrolled
                    </div>
                  ) : vettingStatus === 'approved' ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        You have view-only access. Contact an admin to upgrade to vetted status for course enrollment.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        You need to be vetted to enroll in courses. Your application is pending review.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {course.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Preview (for non-enrolled) */}
      {!isEnrolled && !isOwnCourse && modules.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-[#1D3A6B] mb-4">Course Curriculum</h2>
            <p className="text-gray-600 mb-6">Preview what you'll learn in this course</p>
            
            <div className="space-y-4">
              {modules.map((module, moduleIdx) => (
                <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#1D3A6B] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {moduleIdx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1D3A6B] mb-1">{module.title}</h3>
                      {module.description && (
                        <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                      )}
                      <div className="space-y-1">
                        {module.lessons.map((lesson, lessonIdx) => (
                          <div key={lesson.id} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span>{lessonIdx + 1}. {lesson.title}</span>
                            {lesson.duration_minutes > 0 && (
                              <span className="text-xs text-gray-500">({lesson.duration_minutes} min)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Course Content (for enrolled users and course creators) */}
      {(isEnrolled || isOwnCourse) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-[#1D3A6B] mb-6">Course Content</h2>

            {modules.length === 0 ? (
              <p className="text-gray-600">Course content is being prepared. Check back soon!</p>
            ) : (
              <div className="space-y-6">
                {modules.map((module, moduleIdx) => (
                  <div key={module.id} className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#1D3A6B] text-white rounded-full flex items-center justify-center font-bold">
                        {moduleIdx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#1D3A6B] mb-2">{module.title}</h3>
                        {module.description && (
                          <p className="text-gray-600 mb-4">{module.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 ml-14">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <div
                          key={lesson.id}
                          className={`bg-white border-2 rounded-lg p-4 transition-all ${
                            lesson.completed 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-gray-200 hover:border-[#1D3A6B] hover:shadow-md cursor-pointer'
                          }`}
                          onClick={async () => {
                            if (lesson.content_type === 'quiz' && isEnrolled && enrollment) {
                              setQuizLessonId(lesson.id);
                            } else if (lesson.content_url || lesson.content_text || lesson.is_uploaded_content) {
                              // Handle different content types
                              if (lesson.content_type === 'video' && (lesson.content_url || lesson.is_uploaded_content)) {
                                await openVideoPlayer(lesson);
                              } else if (lesson.content_type === 'audio' && (lesson.content_url || lesson.is_uploaded_content)) {
                                await openAudioPlayer(lesson);
                              } else if (lesson.content_type === 'pdf' && (lesson.content_url || lesson.is_uploaded_content)) {
                                await openPDFViewer(lesson);
                              } else if (lesson.content_type === 'text' && lesson.content_text) {
                                openTextContent(lesson);
                              } else if (lesson.content_type === 'link' && lesson.content_url) {
                                window.open(lesson.content_url, '_blank');
                              }
                              // Mark as accessed
                              markLessonAccessed(lesson.id);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              {lesson.completed ? (
                                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-[#1D3A6B] rounded-full"></div>
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {lesson.content_type === 'video' && <Video className="h-4 w-4 text-red-600" />}
                                  {lesson.content_type === 'pdf' && <FileText className="h-4 w-4 text-red-600" />}
                                  {lesson.content_type === 'text' && <FileText className="h-4 w-4 text-blue-600" />}
                                  {lesson.content_type === 'audio' && <Play className="h-4 w-4 text-purple-600" />}
                                  {lesson.content_type === 'link' && <LinkIcon className="h-4 w-4 text-green-600" />}
                                  {lesson.content_type === 'quiz' && <HelpCircle className="h-4 w-4 text-orange-600" />}
                                  <span className="font-semibold text-gray-900">
                                    Lesson {lessonIdx + 1}: {lesson.title}
                                  </span>
                                  {lesson.duration_minutes > 0 && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                      {lesson.duration_minutes} min
                                    </span>
                                  )}
                                </div>
                                {lesson.description && (
                                  <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.content_type === 'video' && (lesson.content_url || lesson.is_uploaded_content) && (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (loadingContent === lesson.id) return;
                                    await openVideoPlayer(lesson);
                                    markLessonAccessed(lesson.id);
                                  }}
                                  disabled={loadingContent === lesson.id}
                                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {loadingContent === lesson.id ? (
                                    <>
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-3 w-3" />
                                      Watch
                                    </>
                                  )}
                                </button>
                              )}
                              {lesson.content_type === 'audio' && (lesson.content_url || lesson.is_uploaded_content) && (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (loadingContent === lesson.id) return;
                                    await openAudioPlayer(lesson);
                                    markLessonAccessed(lesson.id);
                                  }}
                                  disabled={loadingContent === lesson.id}
                                  className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {loadingContent === lesson.id ? (
                                    <>
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-3 w-3" />
                                      Listen
                                    </>
                                  )}
                                </button>
                              )}
                              {lesson.content_type === 'pdf' && (lesson.content_url || lesson.is_uploaded_content) && (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (loadingContent === lesson.id) return;
                                    await openPDFViewer(lesson);
                                    markLessonAccessed(lesson.id);
                                  }}
                                  disabled={loadingContent === lesson.id}
                                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {loadingContent === lesson.id ? (
                                    <>
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="h-3 w-3" />
                                      View PDF
                                    </>
                                  )}
                                </button>
                              )}
                              {lesson.content_type === 'link' && lesson.content_url && (
                                <a
                                  href={lesson.content_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Open
                                </a>
                              )}
                              {lesson.content_type === 'text' && lesson.content_text && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openTextContent(lesson);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                >
                                  <FileText className="h-3 w-3" />
                                  Read
                                </button>
                              )}
                              {lesson.content_type === 'quiz' && isEnrolled && enrollment && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setQuizLessonId(lesson.id);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
                                >
                                  <HelpCircle className="h-3 w-3" />
                                  Take Quiz
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markLessonComplete(lesson.id, !lesson.completed);
                                }}
                                className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
                                  lesson.completed
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                title={lesson.completed ? 'Mark as incomplete' : 'Mark as complete'}
                              >
                                {lesson.completed ? (
                                  <>
                                    <CheckCircle className="h-3 w-3" />
                                    Complete
                                  </>
                                ) : (
                                  <>
                                    <div className="w-3 h-3 border-2 border-gray-400 rounded"></div>
                                    Mark Complete
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Course Description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">About This Course</h2>
          {course.description ? (
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {course.description}
            </div>
          ) : (
            <p className="text-gray-600">{course.short_description}</p>
          )}
        </div>

        {/* Course Reviews & Ratings */}
        {course && (
          <CourseReviewSection
            courseId={course.id}
            studentId={currentMemberId}
            enrollmentId={enrollment?.id || null}
            enrollmentStatus={enrollment?.enrollment_status || null}
            progressPercentage={enrollment?.progress_percentage || 0}
            completedAt={enrollment?.completed_at || null}
          />
        )}
      </div>

      {/* Quiz Modal */}
      {quizLessonId && enrollment && currentMemberId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1D3A6B]">Quiz</h2>
              <button
                onClick={() => {
                  setQuizLessonId(null);
                  if (enrollment) {
                    loadProgress(enrollment.id);
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <CourseQuiz
                lessonId={quizLessonId}
                enrollmentId={enrollment.id}
                studentId={currentMemberId}
                onComplete={() => {
                  if (enrollment) {
                    loadProgress(enrollment.id);
                    setTimeout(() => {
                      checkEnrollment(currentMemberId);
                    }, 500);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;

