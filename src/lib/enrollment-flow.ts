/**
 * ProCoder enrollment & instruction flow (how the product fits together)
 *
 * 1. **Parent enrolls a child** — Public `POST /api/enrollments` (no auth). Each row is one
 *    `Enrollment`: parent contact + `childName`, optional `childStudentId`, `courseId` (course slug), etc.
 *
 * 2. **Uniqueness** — For non-cancelled enrollments, the combination
 *    `(courseId, parent email, childName, childStudentId)` is unique. The same child cannot be enrolled
 *    twice in the same course while active. Two siblings with the same display name must use different
 *    `childStudentId` values (e.g. national ID, nickname).
 *
 * 3. **Course ↔ students** — A course (`Course` by `slug`) has **many** enrollments; each enrollment is
 *    one seat for one child in that course.
 *
 * 4. **Course ↔ instructor** — Each `Course` may set `instructorId` (single primary instructor). Instructors
 *    also use legacy `User.assignedCourses` (slug list). The API merges both when deciding which course
 *    rosters an instructor sees.
 *
 * 5. **Instructor notes** — `POST /api/instructor/notes` creates a `Note` tied to an `Enrollment`, with
 *    `parentEmail` denormalized. Instructors may only note enrollments in courses they teach (admins exempt).
 *
 * 6. **Parent dashboard** — `GET /api/parent/dashboard` loads `Note` documents where `parentEmail` matches
 *    the logged-in parent, so instructor notes appear on the parent dashboard.
 */

export {};
