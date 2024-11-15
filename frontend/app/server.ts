import axios from "axios";
import { endpoints } from "./endpoints";

const getToken = (): string | null => localStorage.getItem("token");

const createHeaders: any = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ! ============ User ============ !
export const register = async (data: any) =>
  await axios.post(endpoints.user.register, data);

export const login = async (data: any) =>
  await axios.post(endpoints.user.login, data);

export const getMe = async () => {
  const res = await axios.get(endpoints.user.me, createHeaders());
  return res.data;
};

export const updateUser = async (id: string, data: any) =>
  await axios.patch(endpoints.user.update(id), data, createHeaders());

export const approveUser = async (id: string) =>
  await axios.post(
    endpoints.user.approve(id),
    {
      user_id: id,
    },
    createHeaders()
  );

// ! ============ Categories ============ !
export const getCategories = async () => {
  const res = await axios.get(endpoints.categories.list);
  return res.data;
};
export const createCategory = async (data: any) =>
  await axios.post(endpoints.categories.add, data, createHeaders());

export const updateCategory = async (id: string, data: any) =>
  await axios.patch(endpoints.categories.update(id), data, createHeaders());

export const deleteCategory = async (id: string) =>
  await axios.delete(endpoints.categories.delete(id), createHeaders());
// ! ============ Courses ============ !
export const getCourses = async () => {
  const res = await axios.get(endpoints.courses.published);
  return res.data;
};
export const getMyCourses = async () => {
  const res = await axios.get(
    endpoints.courses.teacherCourses,
    createHeaders()
  );
  return res.data;
};
export const getStats = async () => {
  const res = await axios.get(endpoints.courses.getStats, createHeaders());
  return res.data;
};
export const getCourseDetail = async (slug: string) => {
  const res = await axios.get(endpoints.courses.detail(slug));
  return res.data;
};
export const createCourse = async (data: any) =>
  await axios.post(endpoints.courses.list, data, createHeaders());

export const updateCourse = async (slug: string, data: any) =>
  await axios.patch(endpoints.courses.detail(slug), data, createHeaders());

export const deleteCourse = async (slug: string) =>
  await axios.delete(endpoints.courses.delete(slug), createHeaders());

export const getAllCourses = async () => {
  const res = await axios.get(endpoints.courses.allCourses, createHeaders());
  return res.data;
};

export const getStudentCount = async (courseId: string) => {
  const res = await axios.get(
    endpoints.courses.studentCount(courseId),
    createHeaders()
  );
  return res.data;
};
// ! ============ Sections============ !
export const getPreview = async (courseId: string) => {
  const res = await axios.get(endpoints.sections.preview(courseId));
  return res.data;
};

export const createSection = async (data: any) =>
  await axios.post(endpoints.sections.section, data, createHeaders());

export const updateSection = async (id: string, data: any) =>
  await axios.patch(endpoints.sections.update(id), data, createHeaders());

export const deleteSection = async (id: string) =>
  await axios.delete(endpoints.sections.update(id), createHeaders());

// ! ============ Cart ============ !
export const getCart = async () => {
  const res = await axios.get(endpoints.cart.my, createHeaders());
  return res.data;
};

export const addToCart = async (data: any) =>
  await axios.post(endpoints.cart.cart, data, createHeaders());

export const removeFromCart = async (id: string) =>
  await axios.delete(endpoints.cart.removeFromCart(id), createHeaders());

// ! ============ Enrollments ============ !
export const getMyEnrollments = async () => {
  const res = await axios.get(endpoints.enrollment.my, createHeaders());
  return res.data;
};

export const checkEnrollment = async (courseId: string) => {
  const res = await axios.get(
    endpoints.enrollment.check(courseId),
    createHeaders()
  );
  return res.data;
};

export const createEnrollment = async (data: any) =>
  await axios.post(endpoints.enrollment.enroll, data, createHeaders());

// ! ============ Payments ============ !
export const createPayment = async (data: any) =>
  await axios.post(endpoints.payment.payment, data, createHeaders());

export const completePayment = async (data: any) =>
  await axios.patch(endpoints.payment.complete_payment, data, createHeaders());

export const instructorEarnings = async (instructorId: string) => {
  const res = await axios.get(
    endpoints.payment.earning(instructorId),
    createHeaders()
  );
  return res.data;
};
export const studentSpending = async (studentId: string) => {
  const res = await axios.get(
    endpoints.payment.spending(studentId),
    createHeaders()
  );
  return res.data;
};

// ! ============ Rating ============ !
export const createRating = async (data: any) =>
  await axios.post(endpoints.review.review, data, createHeaders());
export const getReviewDetail = async (courseId: string) => {
  const res = await axios.get(endpoints.review.reviewDetail(courseId));
  return res.data;
};

// ! ============ Discussion ============ !
export const getSectionDiscussion = async (sectionId: string) => {
  const res = await axios.get(
    endpoints.discussion.sectionDiscussion(sectionId),
    createHeaders()
  );
  return res.data;
};

export const createDiscussion = async (data: any) =>
  await axios.post(endpoints.discussion.discussion, data, createHeaders());

export const deleteDiscussion = async (id: string) =>
  await axios.delete(endpoints.discussion.delete(id), createHeaders());

export const updateDiscussion = async (id: string, data: any) =>
  await axios.patch(endpoints.discussion.update(id), data, createHeaders());

// ! ============ Reply ============ !
export const createReply = async (data: any) =>
  await axios.post(endpoints.reply.reply, data, createHeaders());

export const deleteReply = async (id: string) =>
  await axios.delete(endpoints.reply.delete(id), createHeaders());

export const updateReply = async (id: string, data: any) =>
  await axios.patch(endpoints.reply.update(id), data, createHeaders());

// ! ============ Progress ============ !
export const courseProgress = async (courseId: string) => {
  const res = await axios.get(
    endpoints.progress.courseProgress(courseId),
    createHeaders()
  );
  return res.data;
};

export const isSectionCompleted = async (sectionId: string) => {
  const res = await axios.get(
    endpoints.progress.isSectionCompleted(sectionId),
    createHeaders()
  );
  return res.data;
};

export const createProgress = async (data: any) =>
  await axios.post(endpoints.progress.progress, data, createHeaders());

// ! ============ Attachment ============ !
export const createAttachment = async (data: any) =>
  await axios.post(endpoints.attachment.attachment, data, createHeaders());

export const deleteAttachment = async (id: string) =>
  await axios.delete(endpoints.attachment.delete(id), createHeaders());

// ! ============ Certificate ============ !
export const createCertificate = async (data: any) =>
  await axios.post(endpoints.certificate.certificate, data, createHeaders());

export const getCertificate = async (courseId: string) => {
  const res = await axios.get(
    endpoints.certificate.getCertificate(courseId),
    createHeaders()
  );
  return res.data;
};
// ! ============ Recommendation ============ !
export const recommendation = async (slug: string) => {
  const res = await axios.get(endpoints.recommendation.recommendation(slug));
  return res.data;
};
// ! ============ Admin ============ !
export const getAdminStats = async () => {
  const res = await axios.get(endpoints.admin.getStats, createHeaders());
  return res.data;
};

export const getPaymentDetails = async () => {
  const res = await axios.get(endpoints.payment.details, createHeaders());
  return res.data;
};

export const getStudents = async () => {
  const res = await axios.get(endpoints.admin.getStudents, createHeaders());
  return res.data;
};

export const getInstructors = async () => {
  const res = await axios.get(endpoints.admin.getInstructors, createHeaders());
  return res.data;
};
