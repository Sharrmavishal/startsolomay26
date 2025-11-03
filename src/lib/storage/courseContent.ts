import { supabase } from '../supabase'

export interface UploadResult {
  success: boolean
  storagePath?: string
  error?: string
}

export interface SignedUrlResult {
  success: boolean
  signedUrl?: string
  expiresAt?: string
  error?: string
}

/**
 * Storage helper service for course content
 */
class CourseContentStorage {
  /**
   * Upload course content file to Supabase Storage
   */
  async uploadCourseContent(
    file: File,
    courseId: string,
    moduleId: string,
    lessonId: string,
    contentType: 'pdf' | 'audio' | 'video' | 'file'
  ): Promise<UploadResult> {
    try {
      // Validate file type
      const validation = this.validateFileType(file, contentType)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Validate file size
      const maxSize = this.getFileSizeLimit(contentType)
      if (file.size > maxSize) {
        return {
          success: false,
          error: `File size exceeds limit of ${maxSize / (1024 * 1024)}MB`,
        }
      }

      // Determine bucket
      const bucket = this.getBucketForContentType(contentType)
      if (!bucket) {
        return { success: false, error: `Invalid content type: ${contentType}` }
      }

      // Generate storage path: {course_id}/{module_id}/{lesson_id}/{filename}
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `${courseId}/${moduleId}/${lessonId}/${timestamp}-${sanitizedFileName}`

      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, storagePath: data.path }
    } catch (error: any) {
      return { success: false, error: error.message || 'Upload failed' }
    }
  }

  /**
   * Delete course content from storage
   */
  async deleteCourseContent(
    storagePath: string,
    bucket: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([storagePath])

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Delete failed' }
    }
  }

  /**
   * Get signed URL for course content (via Edge Function)
   */
  async getSignedUrl(
    lessonId: string,
    enrollmentId: string
  ): Promise<SignedUrlResult> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        return { success: false, error: 'Supabase configuration not found' }
      }

      // Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        return { success: false, error: 'Not authenticated' }
      }

      // Call Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/get-course-content-url`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          enrollmentId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        return { success: false, error: errorData.error || 'Failed to get signed URL' }
      }

      const data = await response.json()
      return {
        success: true,
        signedUrl: data.signedUrl,
        expiresAt: data.expiresAt,
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to get signed URL' }
    }
  }

  /**
   * Get watermarked PDF URL (for PDFs)
   */
  async getWatermarkedPdfUrl(
    lessonId: string,
    enrollmentId: string,
    storagePath: string,
    bucket: string
  ): Promise<SignedUrlResult> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        return { success: false, error: 'Supabase configuration not found' }
      }

      // Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        return { success: false, error: 'Not authenticated' }
      }

      // Call Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/watermark-pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          enrollmentId,
          storagePath,
          bucket,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        return { success: false, error: errorData.error || 'Failed to get watermarked PDF' }
      }

      // Create blob URL from response
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      return {
        success: true,
        signedUrl: blobUrl,
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to get watermarked PDF' }
    }
  }

  /**
   * Validate file type
   */
  validateFileType(
    file: File,
    contentType: 'pdf' | 'audio' | 'video' | 'file'
  ): { valid: boolean; error?: string } {
    const allowedTypes: Record<string, string[]> = {
      pdf: ['application/pdf'],
      audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'],
      video: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
      file: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    }

    const allowed = allowedTypes[contentType] || []
    if (allowed.length === 0) {
      return { valid: false, error: `Invalid content type: ${contentType}` }
    }

    if (!allowed.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} not allowed for ${contentType}. Allowed: ${allowed.join(', ')}`,
      }
    }

    return { valid: true }
  }

  /**
   * Get file size limit in bytes
   * 
   * ⚠️ FREE PLAN: Supabase Free plan has 50MB total storage limit across all buckets.
   * TODO: Update to per-content-type limits when upgrading to Pro plan:
   * - PDF: 50MB
   * - Audio: 100MB
   * - Video: 500MB
   * - File: 50MB
   */
  getFileSizeLimit(contentType: 'pdf' | 'audio' | 'video' | 'file'): number {
    // Free plan: 50MB total limit across all buckets
    const FREE_PLAN_LIMIT = 50 * 1024 * 1024; // 50MB
    
    // For now, use free plan limit for all content types
    return FREE_PLAN_LIMIT;
    
    // Pro plan limits (uncomment when upgraded):
    // const limits: Record<string, number> = {
    //   pdf: 50 * 1024 * 1024, // 50MB
    //   audio: 100 * 1024 * 1024, // 100MB
    //   video: 500 * 1024 * 1024, // 500MB
    //   file: 50 * 1024 * 1024, // 50MB
    // };
    // return limits[contentType] || 50 * 1024 * 1024;
  }

  /**
   * Get bucket name for content type
   */
  getBucketForContentType(contentType: 'pdf' | 'audio' | 'video' | 'file'): string | null {
    const buckets: Record<string, string> = {
      pdf: 'course-pdfs',
      audio: 'course-audio',
      video: 'course-videos',
      file: 'course-files',
    }

    return buckets[contentType] || null
  }

  /**
   * Log content access (frontend helper)
   */
  async logContentAccess(
    lessonId: string,
    enrollmentId: string,
    accessType: 'view' | 'download' | 'stream'
  ): Promise<void> {
    try {
      // Get current member
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: member } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!member) return

      // Log access via RPC function
      await supabase.rpc('log_content_access', {
        p_lesson_id: lessonId,
        p_enrollment_id: enrollmentId,
        p_student_id: member.id,
        p_access_type: accessType,
        p_signed_url_used: true,
      })
    } catch (error) {
      console.error('Failed to log content access:', error)
      // Don't throw - logging failures shouldn't break the app
    }
  }
}

export const courseContentStorage = new CourseContentStorage()

