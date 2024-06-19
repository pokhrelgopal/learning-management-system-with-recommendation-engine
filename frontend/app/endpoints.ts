export const url = "http://127.0.0.1:8000/api/v1/";

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
};
