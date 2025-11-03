# Testing Checklist - Secure Course Content

## Test 1: PDF Access with Signed URLs

**Setup:**
- Create a course with PDF lesson (uploaded file)
- Enroll as student
- Complete enrollment payment

**Steps:**
1. Navigate to course detail page
2. Click "View PDF" on a PDF lesson
3. **Expected:**
   - PDF opens in embedded viewer (not address bar)
   - URL not visible in browser address bar
   - Right-click disabled
   - PDF loads correctly

**Verify:**
- Check `content_access_logs` table - should see access logged
- Check signed URL expires after 1 hour

---

## Test 2: Video Access (Uploaded)

**Setup:**
- Course with uploaded video lesson

**Steps:**
1. Click "Watch" on uploaded video
2. **Expected:**
   - Video opens in embedded player popup
   - Signed URL not visible in address bar
   - Video plays correctly

**Verify:**
- Access logged in database
- Video URL expires after 1 hour

---

## Test 3: Video Access (YouTube/Vimeo)

**Setup:**
- Course with YouTube/Vimeo URL lesson

**Steps:**
1. Click "Watch" on YouTube/Vimeo lesson
2. **Expected:**
   - Opens in new window with embed URL
   - Video plays correctly

---

## Test 4: Course Creator Access

**Setup:**
- Log in as course creator (mentor)

**Steps:**
1. View own course detail page
2. **Expected:**
   - See "This is your course" message
   - Can view all course content (without enrollment)
   - "Add Module" button positioned below modules list

**Verify:**
- Can access PDFs/videos without enrollment
- Direct storage access works

---

## Test 5: Non-Enrolled User Access

**Setup:**
- Log in as user who hasn't enrolled

**Steps:**
1. View published course
2. **Expected:**
   - See course curriculum preview
   - Cannot access actual content
   - See enrollment button

---

## Test 6: Content Upload

**Setup:**
- Log in as mentor
- Create new course

**Steps:**
1. Upload PDF file
2. Upload video file
3. Upload audio file
4. **Expected:**
   - Files upload successfully
   - Progress bar shows
   - Files stored in correct buckets
   - `storage_path` and `storage_bucket` set correctly

---

## Test 7: Access Logging & Analytics

**Setup:**
- Multiple users enrolled in course
- Access various lessons

**Steps:**
1. Check `content_access_logs` table
2. View Course Analytics dashboard
3. **Expected:**
   - All accesses logged with IP, user agent, timestamp
   - Analytics show access metrics
   - Unique viewers counted correctly

---

## Test 8: Free Course Enrollment

**Setup:**
- Create course with price = 0

**Steps:**
1. View course as non-enrolled user
2. Click "Enroll Now (Free)"
3. **Expected:**
   - Enrolls without payment
   - Gains access to content
   - Enrollment record created

---

## Issues to Watch For

- ❌ "Course Not Found" error when viewing PDF
- ❌ Signed URLs exposed in address bar
- ❌ PDFs downloadable via browser dev tools (expected limitation)
- ❌ Videos not loading
- ❌ Course creators can't access own content
- ❌ Access logs not recording

---

## Quick Test Commands

Check access logs:
```sql
SELECT * FROM content_access_logs 
ORDER BY accessed_at DESC 
LIMIT 10;
```

Check enrollment:
```sql
SELECT * FROM course_enrollments 
WHERE course_id = 'YOUR_COURSE_ID';
```

Check storage paths:
```sql
SELECT id, title, storage_path, storage_bucket, is_uploaded_content 
FROM course_lessons 
WHERE course_id = 'YOUR_COURSE_ID';
```

