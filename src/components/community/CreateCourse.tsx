import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save, Trash2, BookOpen, Video, FileText, Link as LinkIcon, Type, Upload, Loader2 } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import { courseContentStorage } from '../../lib/storage/courseContent';

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
  resources: Array<{ type: string; url: string; title: string }>;
  order_index: number;
  storage_path?: string;
  storage_bucket?: string;
  is_uploaded_content?: boolean;
  uploading?: boolean;
  uploadProgress?: number;
  quiz_questions?: Array<{
    id: string;
    question_text: string;
    question_type: 'multiple_choice' | 'true_false' | 'short_answer';
    options: Array<{ id: string; text: string; is_correct: boolean }>;
    correct_answer?: string;
    points: number;
    order_index: number;
  }>;
}

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'basic' | 'modules' | 'certificate'>('basic');
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [canHostCourses, setCanHostCourses] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    category: 'business-strategy',
    price: '',
    max_students: '',
    cover_image_url: '',
    tags: [] as string[],
    total_duration_hours: '',
  });

  const [modules, setModules] = useState<Module[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [courseId, setCourseId] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUploading, setCoverImageUploading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  useEffect(() => {
    checkMentorAccess();
  }, []);

  useEffect(() => {
    // Check if we're editing a course
    const editCourseId = new URLSearchParams(location.search).get('edit');
    if (editCourseId && mentorId) {
      setIsEditing(true);
      setCourseId(editCourseId);
      loadCourseForEdit(editCourseId);
    }
  }, [location.search, mentorId]);

  const checkMentorAccess = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        navigate('/community');
        return;
      }

      const { data: member } = await supabase
        .from('community_members')
        .select('id, role, can_host_courses, points')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!member || member.role !== 'mentor') {
        alert('Only mentors can create courses.');
        navigate('/community');
        return;
      }

      // Check if mentor can host courses
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'course_hosting_points_threshold')
        .single();

      const threshold = settings ? parseInt(settings.value as string) : 500;
      const canHost = member.can_host_courses || (member.points >= threshold);

      if (!canHost) {
        alert(`You need ${threshold} points or admin approval to host courses.`);
        navigate('/community');
        return;
      }

      setMentorId(member.id);
      setCanHostCourses(canHost);
    } catch (error) {
      console.error('Error checking mentor access:', error);
      navigate('/community');
    }
  };

  const loadCourseForEdit = async (courseIdToLoad: string) => {
    try {
      setLoading(true);
      setError(null);

      // Load course data
      const { data: course, error: courseError } = await supabase
        .from('mentor_courses')
        .select('*')
        .eq('id', courseIdToLoad)
        .single();

      if (courseError) throw courseError;

      // Verify the course belongs to the current mentor
      const { data: { user } } = await auth.getUser();
      if (!user) {
        navigate('/community');
        return;
      }

      const { data: currentMember } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!currentMember || course.mentor_id !== currentMember.id) {
        alert('You can only edit your own courses.');
        navigate('/community/mentor');
        return;
      }

      // Populate form data
      setFormData({
        title: course.title || '',
        short_description: course.short_description || '',
        description: course.description || '',
        category: course.category || 'business-strategy',
        price: course.price?.toString() || '0',
        max_students: course.max_students?.toString() || '',
        cover_image_url: course.cover_image_url || '',
        tags: course.tags || [],
        total_duration_hours: course.total_duration_hours?.toString() || '',
      });

      // Set cover image preview if URL exists
      if (course.cover_image_url) {
        setCoverImagePreview(course.cover_image_url);
      }

      // Load modules and lessons
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseIdToLoad)
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

          // Load quiz questions for quiz lessons
          const lessonsWithQuizzes = await Promise.all(
            (lessonsData || []).map(async (lesson) => {
              if (lesson.content_type === 'quiz') {
                const { data: quizQuestions } = await supabase
                  .from('course_quiz_questions')
                  .select('*')
                  .eq('lesson_id', lesson.id)
                  .order('order_index', { ascending: true });

                if (quizQuestions && quizQuestions.length > 0) {
                  const formattedQuestions = quizQuestions.map(q => ({
                    id: q.id,
                    question_text: q.question_text,
                    question_type: q.question_type,
                    options: q.options || [],
                    correct_answer: q.correct_answer || '',
                    points: q.points || 0,
                    order_index: q.order_index || 0,
                  }));
                  return { ...lesson, quiz_questions: formattedQuestions };
                }
              }
              return lesson;
            })
          );

          return {
            id: module.id,
            title: module.title,
            description: module.description || '',
            order_index: module.order_index,
            lessons: lessonsWithQuizzes.map(l => ({
              id: l.id,
              title: l.title,
              description: l.description || '',
              content_type: l.content_type,
              content_url: l.content_url || '',
              content_text: l.content_text || '',
              duration_minutes: l.duration_minutes || 0,
              resources: [],
              order_index: l.order_index,
              storage_path: l.storage_path,
              storage_bucket: l.storage_bucket,
              is_uploaded_content: l.is_uploaded_content || false,
              quiz_questions: (l as any).quiz_questions || [],
            })),
          };
        })
      );

      setModules(modulesWithLessons);
    } catch (error: any) {
      console.error('Error loading course for edit:', error);
      setError(error.message || 'Failed to load course data');
      alert('Failed to load course data. Please try again.');
      navigate('/community/mentor');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const addModule = () => {
    const newModule: Module = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      order_index: modules.length,
      lessons: [],
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (moduleId: string, field: string, value: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, [field]: value } : m
    ));
  };

  const removeModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId).map((m, idx) => ({
      ...m,
      order_index: idx,
    })));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.filter(l => l.id !== lessonId).map((l, idx) => ({
          ...l,
          order_index: idx,
        })),
      } : m
    ));
  };

  const addLesson = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const newLesson: Lesson = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      content_type: 'video',
      content_url: '',
      content_text: '',
      duration_minutes: 0,
      resources: [],
      order_index: module.lessons.length,
    };

    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
    ));
  };

  const updateLesson = (moduleId: string, lessonId: string, field: string, value: any) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l =>
          l.id === lessonId ? { ...l, [field]: value } : l
        ),
      } : m
    ));
  };

  const addQuizQuestion = (moduleId: string, lessonId: string) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l => {
          if (l.id === lessonId) {
            const questions = l.quiz_questions || [];
            const newQuestion = {
              id: `q-${Date.now()}-${Math.random()}`,
              question_text: '',
              question_type: 'multiple_choice' as const,
              options: [
                { id: `opt-${Date.now()}-1`, text: '', is_correct: false },
                { id: `opt-${Date.now()}-2`, text: '', is_correct: false },
              ],
              points: 1,
              order_index: questions.length,
            };
            return {
              ...l,
              quiz_questions: [...questions, newQuestion],
            };
          }
          return l;
        }),
      } : m
    ));
  };

  const removeQuizQuestion = (moduleId: string, lessonId: string, questionId: string) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l => {
          if (l.id === lessonId && l.quiz_questions) {
            return {
              ...l,
              quiz_questions: l.quiz_questions.filter(q => q.id !== questionId).map((q, idx) => ({
                ...q,
                order_index: idx,
              })),
            };
          }
          return l;
        }),
      } : m
    ));
  };

  const updateQuizQuestion = (moduleId: string, lessonId: string, questionId: string, field: string, value: any) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l => {
          if (l.id === lessonId && l.quiz_questions) {
            return {
              ...l,
              quiz_questions: l.quiz_questions.map(q => {
                if (q.id === questionId) {
                  if (field === 'question_type' && value === 'true_false') {
                    // Auto-set True/False options
                    return {
                      ...q,
                      question_type: value,
                      options: [
                        { id: `${questionId}-true`, text: 'True', is_correct: false },
                        { id: `${questionId}-false`, text: 'False', is_correct: false },
                      ],
                    };
                  } else if (field === 'question_type' && value === 'short_answer') {
                    // Clear options for short answer
                    return {
                      ...q,
                      question_type: value,
                      options: [],
                      correct_answer: '',
                    };
                  } else if (field === 'question_type' && value === 'multiple_choice' && q.options.length === 0) {
                    // Restore default options for multiple choice
                    return {
                      ...q,
                      question_type: value,
                      options: [
                        { id: `${questionId}-opt1`, text: '', is_correct: false },
                        { id: `${questionId}-opt2`, text: '', is_correct: false },
                      ],
                    };
                  }
                  return { ...q, [field]: value };
                }
                return q;
              }),
            };
          }
          return l;
        }),
      } : m
    ));
  };

  const addQuizOption = (moduleId: string, lessonId: string, questionId: string) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l => {
          if (l.id === lessonId && l.quiz_questions) {
            return {
              ...l,
              quiz_questions: l.quiz_questions.map(q => {
                if (q.id === questionId && q.options.length < 6) {
                  return {
                    ...q,
                    options: [...q.options, {
                      id: `${questionId}-opt-${Date.now()}`,
                      text: '',
                      is_correct: false,
                    }],
                  };
                }
                return q;
              }),
            };
          }
          return l;
        }),
      } : m
    ));
  };

  const removeQuizOption = (moduleId: string, lessonId: string, questionId: string, optionId: string) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l => {
          if (l.id === lessonId && l.quiz_questions) {
            return {
              ...l,
              quiz_questions: l.quiz_questions.map(q => {
                if (q.id === questionId && q.options.length > 2) {
                  return {
                    ...q,
                    options: q.options.filter(opt => opt.id !== optionId),
                  };
                }
                return q;
              }),
            };
          }
          return l;
        }),
      } : m
    ));
  };

  const setCorrectOption = (moduleId: string, lessonId: string, questionId: string, optionId: string) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l => {
          if (l.id === lessonId && l.quiz_questions) {
            return {
              ...l,
              quiz_questions: l.quiz_questions.map(q => {
                if (q.id === questionId) {
                  return {
                    ...q,
                    options: q.options.map(opt => ({
                      ...opt,
                      is_correct: opt.id === optionId,
                    })),
                  };
                }
                return q;
              }),
            };
          }
          return l;
        }),
      } : m
    ));
  };

  const handleFileUpload = async (
    moduleId: string,
    lessonId: string,
    file: File,
    contentType: 'pdf' | 'audio' | 'video' | 'file'
  ) => {
    if (!courseId) {
      alert('Please save basic course info first');
      return;
    }

    // Update lesson to show uploading state
    updateLesson(moduleId, lessonId, 'uploading', true);
    updateLesson(moduleId, lessonId, 'uploadProgress', 0);

    try {
      // Find module to get its ID (might be temp ID)
      const module = modules.find(m => m.id === moduleId);
      if (!module) {
        throw new Error('Module not found');
      }

      // For temp modules, we'll need to create them first
      // For now, use a placeholder approach - files will be uploaded after modules are saved
      // Store the file temporarily and upload after module creation
      
      // Upload file
      const result = await courseContentStorage.uploadCourseContent(
        file,
        courseId,
        moduleId, // Using temp ID for now, will update after module creation
        lessonId,
        contentType
      );

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      // Update lesson with storage info
      updateLesson(moduleId, lessonId, 'storage_path', result.storagePath);
      updateLesson(moduleId, lessonId, 'storage_bucket', courseContentStorage.getBucketForContentType(contentType));
      updateLesson(moduleId, lessonId, 'is_uploaded_content', true);
      updateLesson(moduleId, lessonId, 'uploading', false);
      updateLesson(moduleId, lessonId, 'uploadProgress', 100);

    } catch (error: any) {
      updateLesson(moduleId, lessonId, 'uploading', false);
      updateLesson(moduleId, lessonId, 'uploadProgress', 0);
      alert(error.message || 'Upload failed. Please try again.');
    }
  };

  const handleFileChange = (
    moduleId: string,
    lessonId: string,
    e: React.ChangeEvent<HTMLInputElement>,
    contentType: 'pdf' | 'audio' | 'video' | 'file'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear content_url if uploading a file
    updateLesson(moduleId, lessonId, 'content_url', '');
    
    // Start upload
    handleFileUpload(moduleId, lessonId, file, contentType);
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB for cover images)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Cover image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setCoverImageFile(file);
  };

  const handleCoverImageUpload = async (courseId: string): Promise<string | null> => {
    if (!coverImageFile) return null;

    try {
      setCoverImageUploading(true);
      
      // Upload to public bucket for course covers
      const timestamp = Date.now();
      const sanitizedFileName = coverImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `course-covers/${courseId}/${timestamp}-${sanitizedFileName}`;

      const { data, error } = await supabase.storage
        .from('course-covers')
        .upload(storagePath, coverImageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('course-covers')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading cover image:', error);
      alert(error.message || 'Failed to upload cover image');
      return null;
    } finally {
      setCoverImageUploading(false);
    }
  };

  const handleSaveBasic = async () => {
    if (!mentorId) return;

    try {
      setLoading(true);
      setError(null);

      if (!formData.title.trim() || !formData.short_description.trim() || !formData.price) {
        throw new Error('Please fill in all required fields (Title, Short Description, Price)');
      }

      let coverImageUrl = formData.cover_image_url.trim() || null;

      if (isEditing && courseId) {
        // Update existing course
        // Upload cover image if file is selected
        if (coverImageFile) {
          const uploadedUrl = await handleCoverImageUpload(courseId);
          if (uploadedUrl) {
            coverImageUrl = uploadedUrl;
          }
        }

        const { error: updateError } = await supabase
          .from('mentor_courses')
          .update({
            title: formData.title.trim(),
            short_description: formData.short_description.trim(),
            description: formData.description.trim() || null,
            category: formData.category,
            price: parseFloat(formData.price),
            max_students: formData.max_students ? parseInt(formData.max_students) : null,
            cover_image_url: coverImageUrl,
            tags: formData.tags,
            total_duration_hours: formData.total_duration_hours ? parseInt(formData.total_duration_hours) : null,
            number_of_modules: modules.length,
          })
          .eq('id', courseId);

        if (updateError) throw updateError;
      } else {
        // Create new course
        const { data: course, error: courseError } = await supabase
          .from('mentor_courses')
          .insert({
            mentor_id: mentorId,
            title: formData.title.trim(),
            short_description: formData.short_description.trim(),
            description: formData.description.trim() || null,
            category: formData.category,
            price: parseFloat(formData.price),
            max_students: formData.max_students ? parseInt(formData.max_students) : null,
            cover_image_url: coverImageUrl,
            tags: formData.tags,
            total_duration_hours: formData.total_duration_hours ? parseInt(formData.total_duration_hours) : null,
            number_of_modules: modules.length,
            status: canHostCourses ? 'draft' : 'pending_approval',
            approval_status: canHostCourses ? 'pending' : 'pending',
          })
          .select()
          .single();

        if (courseError) throw courseError;
        setCourseId(course.id);

        // Upload cover image if file is selected and course was just created
        if (coverImageFile && course.id) {
          const uploadedUrl = await handleCoverImageUpload(course.id);
          if (uploadedUrl) {
            // Update course with uploaded image URL
            await supabase
              .from('mentor_courses')
              .update({ cover_image_url: uploadedUrl })
              .eq('id', course.id);
          }
        }
      }

      setStep('modules');
    } catch (err: any) {
      console.error('Error creating course:', err);
      // Show detailed error message
      const errorMessage = err.message || err.error?.message || 'Failed to create course';
      setError(errorMessage);
      
      // If it's an RLS error, provide helpful guidance
      if (errorMessage.includes('row-level security') || errorMessage.includes('RLS')) {
        setError(`${errorMessage}. Please ensure you are logged in as a mentor and have the necessary permissions.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveModules = async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);

      // Validate modules
      if (modules.length === 0) {
        throw new Error('Please add at least one module');
      }

      // Delete existing modules for this course to avoid duplicate order_index errors
      // This ensures a clean state before saving
      const { error: deleteError } = await supabase
        .from('course_modules')
        .delete()
        .eq('course_id', courseId);

      if (deleteError) {
        console.warn('Warning: Could not delete existing modules:', deleteError);
        // Continue anyway - might be first save
      }

      for (const module of modules) {
        if (!module.title.trim()) {
          throw new Error(`Module ${modules.indexOf(module) + 1} needs a title`);
        }

        // Create module with sequential order_index
        const { data: createdModule, error: moduleError } = await supabase
          .from('course_modules')
          .insert({
            course_id: courseId,
            title: module.title.trim(),
            description: module.description.trim() || null,
            order_index: modules.indexOf(module), // Use index to ensure sequential order
          })
          .select()
          .single();

        if (moduleError) throw moduleError;

        // Create lessons for this module with sequential order_index
        const validLessons = module.lessons.filter(l => l.title.trim());
        for (let lessonIdx = 0; lessonIdx < validLessons.length; lessonIdx++) {
          const lesson = validLessons[lessonIdx];

          const { data: createdLesson, error: lessonError } = await supabase
            .from('course_lessons')
            .insert({
              module_id: createdModule.id,
              course_id: courseId,
              title: lesson.title.trim(),
              description: lesson.description.trim() || null,
              content_type: lesson.content_type,
              content_url: lesson.content_url.trim() || null,
              content_text: lesson.content_text.trim() || null,
              duration_minutes: lesson.duration_minutes || 0,
              resources: lesson.resources.length > 0 ? lesson.resources : null,
              order_index: lessonIdx,
              storage_path: lesson.storage_path || null,
              storage_bucket: lesson.storage_bucket || null,
              is_uploaded_content: lesson.is_uploaded_content || false,
            })
            .select()
            .single();

          if (lessonError) throw lessonError;

          // Save quiz questions if this is a quiz lesson
          if (lesson.content_type === 'quiz' && lesson.quiz_questions && lesson.quiz_questions.length > 0) {
            // Validate quiz questions
            for (const question of lesson.quiz_questions) {
              if (!question.question_text.trim()) {
                throw new Error(`Quiz question ${lesson.quiz_questions.indexOf(question) + 1} in "${lesson.title}" needs question text`);
              }
              
              if (question.question_type === 'short_answer' && !question.correct_answer?.trim()) {
                throw new Error(`Quiz question "${question.question_text}" needs a correct answer`);
              }
              
              if (question.question_type !== 'short_answer') {
                const hasCorrectOption = question.options.some(opt => opt.is_correct);
                if (!hasCorrectOption) {
                  throw new Error(`Quiz question "${question.question_text}" needs at least one correct option`);
                }
                if (question.options.length < 2) {
                  throw new Error(`Quiz question "${question.question_text}" needs at least 2 options`);
                }
                const allOptionsFilled = question.options.every(opt => opt.text.trim());
                if (!allOptionsFilled) {
                  throw new Error(`Quiz question "${question.question_text}" has empty options`);
                }
              }
            }

            // Insert quiz questions
            for (const question of lesson.quiz_questions) {
              const { error: questionError } = await supabase
                .from('course_quiz_questions')
                .insert({
                  lesson_id: createdLesson.id,
                  course_id: courseId,
                  question_text: question.question_text.trim(),
                  question_type: question.question_type,
                  options: question.question_type !== 'short_answer' ? question.options : [],
                  correct_answer: question.question_type === 'short_answer' ? question.correct_answer?.trim() : null,
                  points: question.points || 1,
                  order_index: question.order_index,
                });

              if (questionError) throw questionError;
            }
          }
        }
      }

      // Update course module count
      await supabase
        .from('mentor_courses')
        .update({ number_of_modules: modules.length })
        .eq('id', courseId);

      setStep('certificate');
    } catch (err: any) {
      setError(err.message || 'Failed to save modules');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCertificate = async () => {
    // Certificate template will be created separately
    // For now, just mark course as ready
    if (courseId) {
      navigate(`/community/courses/${courseId}`);
    } else {
      navigate('/community/mentor');
    }
  };

  const categories = [
    { value: 'business-strategy', label: 'Business Strategy' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'funding', label: 'Funding & Finance' },
    { value: 'technology', label: 'Technology' },
    { value: 'sales', label: 'Sales' },
    { value: 'operations', label: 'Operations' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/community/mentor')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#1D3A6B]">
                {isEditing ? 'Edit Course' : 'Create New Course'}
              </h1>
              <p className="text-gray-600 mt-2">Step {step === 'basic' ? '1' : step === 'modules' ? '2' : '3'}: {
                step === 'basic' ? 'Basic Information' : step === 'modules' ? 'Modules & Lessons' : 'Certificate Setup'
              }</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Basic Information */}
        {step === 'basic' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-6">Course Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Complete Guide to Solopreneurship"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description * (for listings)
                </label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="One-line description shown in course listings"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  required
                  maxLength={150}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  placeholder="Detailed course description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students (optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_students}
                    onChange={(e) => handleInputChange('max_students', e.target.value)}
                    placeholder="Leave empty for unlimited"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Duration (hours, optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.total_duration_hours}
                    onChange={(e) => handleInputChange('total_duration_hours', e.target.value)}
                    placeholder="Estimated total duration"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image (optional)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Recommended: 1280x720px (16:9 ratio). Max size: 5MB. Formats: JPG, PNG, WebP
                </p>
                
                {/* Image Preview */}
                {(coverImagePreview || formData.cover_image_url) && (
                  <div className="mb-4 relative">
                    <img
                      src={coverImagePreview || formData.cover_image_url}
                      alt="Cover preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImageFile(null);
                        setCoverImagePreview(null);
                        handleInputChange('cover_image_url', '');
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Upload Option */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Image
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {coverImageUploading ? (
                          <>
                            <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                            <p className="text-sm text-gray-500">Uploading...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">JPG, PNG, WebP (MAX. 5MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleCoverImageChange}
                        disabled={coverImageUploading}
                      />
                    </label>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or Enter URL
                    </label>
                    <input
                      type="url"
                      value={formData.cover_image_url}
                      onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                      disabled={!!coverImageFile}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveBasic}
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Next: Add Modules'}
                </button>
                <button
                  onClick={() => navigate('/community/mentor')}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Modules & Lessons */}
        {step === 'modules' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1D3A6B]">Course Modules & Lessons</h2>
              </div>

              {modules.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No modules added yet. Click "Add Module" below to get started.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {modules.map((module, moduleIdx) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                            placeholder={`Module ${moduleIdx + 1} Title *`}
                            className="w-full text-lg font-semibold px-2 py-1 border-b-2 border-transparent hover:border-gray-300 focus:border-[#1D3A6B] focus:outline-none"
                          />
                          <textarea
                            value={module.description}
                            onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                            placeholder="Module description (optional)"
                            rows={2}
                            className="w-full mt-2 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                          />
                        </div>
                        <button
                          onClick={() => removeModule(module.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="ml-4 space-y-3">
                        {module.lessons.map((lesson, lessonIdx) => (
                          <div key={lesson.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                placeholder={`Lesson ${lessonIdx + 1} Title *`}
                                className="flex-1 font-medium px-2 py-1 border-b-2 border-transparent hover:border-gray-300 focus:border-[#1D3A6B] focus:outline-none"
                              />
                              <button
                                onClick={() => removeLesson(module.id, lesson.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Content Type</label>
                                <select
                                  value={lesson.content_type}
                                  onChange={(e) => updateLesson(module.id, lesson.id, 'content_type', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                >
                                  <option value="video">Video</option>
                                  <option value="pdf">PDF</option>
                                  <option value="text">Text</option>
                                  <option value="audio">Audio</option>
                                  <option value="link">Link</option>
                                  <option value="quiz">Quiz</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Duration (minutes)</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={lesson.duration_minutes}
                                  onChange={(e) => updateLesson(module.id, lesson.id, 'duration_minutes', parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                />
                              </div>
                            </div>

                            {lesson.content_type === 'video' && (
                              <div className="mt-3">
                                <label className="block text-xs text-gray-600 mb-1">
                                  Video File or URL (YouTube/Vimeo)
                                </label>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <label className="flex-1 cursor-pointer">
                                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#1D3A6B] transition-colors">
                                        <div className="flex flex-col items-center gap-2">
                                          {lesson.uploading ? (
                                            <>
                                              <Loader2 className="h-6 w-6 text-[#1D3A6B] animate-spin" />
                                              <span className="text-xs text-gray-600">Uploading...</span>
                                              {lesson.uploadProgress !== undefined && (
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                  <div
                                                    className="bg-[#1D3A6B] h-2 rounded-full transition-all"
                                                    style={{ width: `${lesson.uploadProgress}%` }}
                                                  />
                                                </div>
                                              )}
                                            </>
                                          ) : lesson.is_uploaded_content && lesson.storage_path ? (
                                            <>
                                              <Video className="h-6 w-6 text-green-600" />
                                              <span className="text-xs text-green-600 font-medium">File uploaded</span>
                                              <span className="text-xs text-gray-500 truncate max-w-full">{lesson.storage_path.split('/').pop()}</span>
                                            </>
                                          ) : (
                                            <>
                                              <Upload className="h-6 w-6 text-gray-400" />
                                              <span className="text-xs text-gray-600">Click to upload video</span>
                                              <span className="text-xs text-gray-500">or use YouTube/Vimeo URL below</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleFileChange(module.id, lesson.id, e, 'video')}
                                        className="hidden"
                                        disabled={lesson.uploading}
                                      />
                                    </label>
                                  </div>
                                  <div className="text-xs text-gray-500 text-center">OR</div>
                                  <input
                                    type="url"
                                    value={lesson.content_url}
                                    onChange={(e) => updateLesson(module.id, lesson.id, 'content_url', e.target.value)}
                                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                    disabled={lesson.is_uploaded_content}
                                  />
                                  {lesson.is_uploaded_content && (
                                    <p className="text-xs text-green-600">File uploaded. Clear URL field to use uploaded file.</p>
                                  )}
                                  <p className="text-xs text-gray-500">Max file size: 50MB (Free plan limit). Supports MP4, WebM, OGG. YouTube/Vimeo URLs also supported.</p>
                                </div>
                              </div>
                            )}

                            {lesson.content_type === 'audio' && (
                              <div className="mt-3">
                                <label className="block text-xs text-gray-600 mb-1">
                                  Audio File or URL
                                </label>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <label className="flex-1 cursor-pointer">
                                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#1D3A6B] transition-colors">
                                        <div className="flex flex-col items-center gap-2">
                                          {lesson.uploading ? (
                                            <>
                                              <Loader2 className="h-6 w-6 text-[#1D3A6B] animate-spin" />
                                              <span className="text-xs text-gray-600">Uploading...</span>
                                              {lesson.uploadProgress !== undefined && (
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                  <div
                                                    className="bg-[#1D3A6B] h-2 rounded-full transition-all"
                                                    style={{ width: `${lesson.uploadProgress}%` }}
                                                  />
                                                </div>
                                              )}
                                            </>
                                          ) : lesson.is_uploaded_content && lesson.storage_path ? (
                                            <>
                                              <FileText className="h-6 w-6 text-green-600" />
                                              <span className="text-xs text-green-600 font-medium">File uploaded</span>
                                              <span className="text-xs text-gray-500 truncate max-w-full">{lesson.storage_path.split('/').pop()}</span>
                                            </>
                                          ) : (
                                            <>
                                              <Upload className="h-6 w-6 text-gray-400" />
                                              <span className="text-xs text-gray-600">Click to upload audio</span>
                                              <span className="text-xs text-gray-500">or use URL below</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => handleFileChange(module.id, lesson.id, e, 'audio')}
                                        className="hidden"
                                        disabled={lesson.uploading}
                                      />
                                    </label>
                                  </div>
                                  <div className="text-xs text-gray-500 text-center">OR</div>
                                  <input
                                    type="url"
                                    value={lesson.content_url}
                                    onChange={(e) => updateLesson(module.id, lesson.id, 'content_url', e.target.value)}
                                    placeholder="https://example.com/audio.mp3 or direct audio file URL"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                    disabled={lesson.is_uploaded_content}
                                  />
                                  {lesson.is_uploaded_content && (
                                    <p className="text-xs text-green-600">File uploaded. Clear URL field to use uploaded file.</p>
                                  )}
                                  <p className="text-xs text-gray-500">Max file size: 50MB (Free plan limit). Supports MP3, WAV, OGG, WebM.</p>
                                </div>
                              </div>
                            )}

                            {lesson.content_type === 'text' && (
                              <div className="mt-3">
                                <label className="block text-xs text-gray-600 mb-1">Content</label>
                                <textarea
                                  value={lesson.content_text}
                                  onChange={(e) => updateLesson(module.id, lesson.id, 'content_text', e.target.value)}
                                  rows={4}
                                  placeholder="Lesson content..."
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                />
                              </div>
                            )}

                            {lesson.content_type === 'pdf' && (
                              <div className="mt-3">
                                <label className="block text-xs text-gray-600 mb-1">
                                  PDF File or URL
                                </label>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <label className="flex-1 cursor-pointer">
                                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#1D3A6B] transition-colors">
                                        <div className="flex flex-col items-center gap-2">
                                          {lesson.uploading ? (
                                            <>
                                              <Loader2 className="h-6 w-6 text-[#1D3A6B] animate-spin" />
                                              <span className="text-xs text-gray-600">Uploading...</span>
                                              {lesson.uploadProgress !== undefined && (
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                  <div
                                                    className="bg-[#1D3A6B] h-2 rounded-full transition-all"
                                                    style={{ width: `${lesson.uploadProgress}%` }}
                                                  />
                                                </div>
                                              )}
                                            </>
                                          ) : lesson.is_uploaded_content && lesson.storage_path ? (
                                            <>
                                              <FileText className="h-6 w-6 text-green-600" />
                                              <span className="text-xs text-green-600 font-medium">File uploaded</span>
                                              <span className="text-xs text-gray-500 truncate max-w-full">{lesson.storage_path.split('/').pop()}</span>
                                            </>
                                          ) : (
                                            <>
                                              <Upload className="h-6 w-6 text-gray-400" />
                                              <span className="text-xs text-gray-600">Click to upload PDF</span>
                                              <span className="text-xs text-gray-500">or use URL below</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => handleFileChange(module.id, lesson.id, e, 'pdf')}
                                        className="hidden"
                                        disabled={lesson.uploading}
                                      />
                                    </label>
                                  </div>
                                  <div className="text-xs text-gray-500 text-center">OR</div>
                                  <input
                                    type="url"
                                    value={lesson.content_url}
                                    onChange={(e) => updateLesson(module.id, lesson.id, 'content_url', e.target.value)}
                                    placeholder="https://example.com/document.pdf"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                    disabled={lesson.is_uploaded_content}
                                  />
                                  {lesson.is_uploaded_content && (
                                    <p className="text-xs text-green-600">File uploaded. Clear URL field to use uploaded file.</p>
                                  )}
                                  <p className="text-xs text-gray-500">Max file size: 50MB (Free plan limit). Uploaded files are securely stored.</p>
                                </div>
                              </div>
                            )}

                            {lesson.content_type === 'link' && (
                              <div className="mt-3">
                                <label className="block text-xs text-gray-600 mb-1">URL</label>
                                <input
                                  type="url"
                                  value={lesson.content_url}
                                  onChange={(e) => updateLesson(module.id, lesson.id, 'content_url', e.target.value)}
                                  placeholder="https://..."
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                />
                              </div>
                            )}

                            {lesson.content_type === 'quiz' && (
                              <div className="mt-3 space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="block text-xs font-medium text-gray-700">Quiz Questions</label>
                                  <button
                                    type="button"
                                    onClick={() => addQuizQuestion(module.id, lesson.id)}
                                    className="text-xs text-[#1D3A6B] hover:text-[#152A4F] font-medium flex items-center gap-1"
                                  >
                                    <Plus className="h-3 w-3" />
                                    Add Question
                                  </button>
                                </div>
                                
                                {lesson.quiz_questions && lesson.quiz_questions.length > 0 ? (
                                  <div className="space-y-3">
                                    {lesson.quiz_questions.map((question, qIdx) => (
                                      <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-3">
                                        <div className="flex items-start justify-between mb-2">
                                          <span className="text-xs font-medium text-gray-600">Question {qIdx + 1}</span>
                                          <button
                                            type="button"
                                            onClick={() => removeQuizQuestion(module.id, lesson.id, question.id)}
                                            className="text-red-600 hover:text-red-800"
                                          >
                                            <X className="h-4 w-4" />
                                          </button>
                                        </div>
                                        
                                        <input
                                          type="text"
                                          value={question.question_text}
                                          onChange={(e) => updateQuizQuestion(module.id, lesson.id, question.id, 'question_text', e.target.value)}
                                          placeholder="Enter question text"
                                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                        />
                                        
                                        <select
                                          value={question.question_type}
                                          onChange={(e) => updateQuizQuestion(module.id, lesson.id, question.id, 'question_type', e.target.value)}
                                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                        >
                                          <option value="multiple_choice">Multiple Choice</option>
                                          <option value="true_false">True/False</option>
                                          <option value="short_answer">Short Answer</option>
                                        </select>
                                        
                                        {question.question_type === 'short_answer' ? (
                                          <div>
                                            <label className="block text-xs text-gray-600 mb-1">Correct Answer</label>
                                            <input
                                              type="text"
                                              value={question.correct_answer || ''}
                                              onChange={(e) => updateQuizQuestion(module.id, lesson.id, question.id, 'correct_answer', e.target.value)}
                                              placeholder="Expected answer"
                                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                            />
                                          </div>
                                        ) : (
                                          <div className="space-y-2">
                                            <label className="block text-xs text-gray-600">Options</label>
                                            {question.options.map((option, optIdx) => (
                                              <div key={option.id} className="flex items-center gap-2">
                                                <input
                                                  type="radio"
                                                  name={`correct-${question.id}`}
                                                  checked={option.is_correct}
                                                  onChange={() => setCorrectOption(module.id, lesson.id, question.id, option.id)}
                                                  className="text-[#1D3A6B] focus:ring-[#1D3A6B]"
                                                />
                                                <input
                                                  type="text"
                                                  value={option.text}
                                                  onChange={(e) => updateQuizOption(module.id, lesson.id, question.id, option.id, e.target.value)}
                                                  placeholder={`Option ${optIdx + 1}`}
                                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                                />
                                                {question.options.length > 2 && (
                                                  <button
                                                    type="button"
                                                    onClick={() => removeQuizOption(module.id, lesson.id, question.id, option.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                  >
                                                    <X className="h-4 w-4" />
                                                  </button>
                                                )}
                                              </div>
                                            ))}
                                            {question.options.length < 6 && (
                                              <button
                                                type="button"
                                                onClick={() => addQuizOption(module.id, lesson.id, question.id)}
                                                className="text-xs text-[#1D3A6B] hover:text-[#152A4F] flex items-center gap-1"
                                              >
                                                <Plus className="h-3 w-3" />
                                                Add Option
                                              </button>
                                            )}
                                          </div>
                                        )}
                                        
                                        <div className="mt-2">
                                          <label className="block text-xs text-gray-600 mb-1">Points</label>
                                          <input
                                            type="number"
                                            min="1"
                                            value={question.points}
                                            onChange={(e) => updateQuizQuestion(module.id, lesson.id, question.id, 'points', parseInt(e.target.value) || 1)}
                                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-gray-400 text-sm border border-dashed border-gray-300 rounded">
                                    No questions added yet. Click "Add Question" to start.
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="mt-3">
                              <textarea
                                value={lesson.description}
                                onChange={(e) => updateLesson(module.id, lesson.id, 'description', e.target.value)}
                                placeholder="Lesson description (optional)"
                                rows={2}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => addLesson(module.id)}
                          className="flex items-center gap-2 text-sm text-[#1D3A6B] hover:text-[#152A4F] font-medium"
                        >
                          <Plus className="h-4 w-4" />
                          Add Lesson
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Module button moved below modules list */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={addModule}
                  className="flex items-center gap-2 bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Module
                </button>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleSaveModules}
                  disabled={loading || modules.length === 0}
                  className="flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Next: Certificate Setup'}
                </button>
                <button
                  onClick={() => setStep('basic')}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Certificate Setup */}
        {step === 'certificate' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-6">Certificate Setup</h2>
            <p className="text-gray-600 mb-6">
              You can customize your certificate template later. For now, we'll use default settings.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleSaveCertificate}
                className="flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
              >
                <Save className="h-4 w-4" />
                Finish & View Course
              </button>
              <button
                onClick={() => setStep('modules')}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;

