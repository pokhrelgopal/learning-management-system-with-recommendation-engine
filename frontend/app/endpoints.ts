export const url = "http://127.0.0.1:8000/api/v1/";
export const mediaUrl = "http://127.0.0.1:8000";

export const endpoints = {
  user: {
    register: url + "user/",
    login: url + "user/token/",
    me: url + "user/get_user/",
  },
  courses: {
    list: url + "courses/",
    detail: (slug: string) => url + `courses/${slug}/`,
    teacherCourses: url + "courses/get_my_courses/",
    publishedCourses: url + "courses/get_published_courses/",
  },
  sections: {
    preview: (courseId: string) =>
      url + `sections/get_preview?course_id=${courseId}`,
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
  },
};
