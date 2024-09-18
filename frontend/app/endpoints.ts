export const url = "http://127.0.0.1:8000/api/v1/";
export const mediaUrl = "http://127.0.0.1:8000";

export const endpoints = {
  user: {
    register: url + "user/",
    login: url + "user/token/",
    me: url + "user/get_user/",
    update: (id: string) => url + `user/${id}/`,
    approve: (id: string) => url + `user/approve_instructor/`,
  },
  categories: {
    list: url + "categories/",
  },
  courses: {
    list: url + "courses/",
    detail: (slug: string) => url + `courses/${slug}/`,
    delete: (slug: string) => url + `courses/${slug}/`,
    teacherCourses: url + "courses/get_my_courses/",
    publishedCourses: url + "courses/get_published_courses/",
    getStats: url + "courses/get_stats/",
    published: url + "courses/get_published_courses/",
    allCourses: url + "courses/get_all_courses/",
    studentCount: (courseId: string) =>
      url + `courses/get_student_count?course_id=${courseId}`,
  },
  sections: {
    section: url + "sections/",
    update: (id: string) => url + `sections/${id}/`,
    preview: (courseId: string) =>
      url + `sections/get_preview?course_id=${courseId}`,
  },
  attachment: {
    attachment: url + "attachments/",
    delete: (id: string) => url + `attachments/${id}/`,
  },
  cart: {
    cart: url + "carts/",
    removeFromCart: (id: string) => url + `carts/${id}/`,
    my: url + "carts/my_cart/",
  },
  enrollment: {
    enroll: url + "enrollments/",
    my: url + "enrollments/my_enrollments/",
    check: (courseId: string) =>
      url + `enrollments/enrollment_check?course_id=${courseId}`,
  },
  payment: {
    payment: url + "payments/",
    details: url + "payments/get_details/",
    earning: (instructorId: string) =>
      url + `payments/get_earning_of_instructor?instructor_id=${instructorId}`,
    spending: (studentId: string) =>
      url + `payments/get_student_spending?student_id=${studentId}`,
    complete_payment: url + "payments/complete_payment/",
  },
  review: {
    review: url + "reviews/",
    reviewDetail: (courseId: string) =>
      url + `reviews/get_review_detail?course_id=${courseId}`,
  },
  discussion: {
    discussion: url + "discussions/",
    delete: (id: string) => url + `discussions/${id}/`,
    update: (id: string) => url + `discussions/${id}/`,
    sectionDiscussion: (sectionId: string) =>
      url + `discussions/get_section_discussions?section_id=${sectionId}`,
  },
  reply: {
    reply: url + "replies/",
    delete: (id: string) => url + `replies/${id}/`,
    update: (id: string) => url + `replies/${id}/`,
  },
  progress: {
    progress: url + "progress/",
    courseProgress: (courseId: string) =>
      url + `progress/get_course_progress/?course_id=${courseId}`,
    isSectionCompleted: (sectionId: string) =>
      url + `progress/is_completed/?section_id=${sectionId}`,
  },
  certificate: {
    certificate: url + "certificates/",
    getCertificate: (courseId: string) =>
      url + `certificates/get_certificate?course_id=${courseId}`,
  },
  recommendation: {
    recommendation: (slug: string) => url + `recommendation?course=${slug}`,
  },
  admin: {
    getStats: url + "admin/get_stats/",
    getStudents: url + "user/get_students/",
    getInstructors: url + "user/get_instructors/",
  },
};
