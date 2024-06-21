import axios from "axios";
import { endpoints } from "./endpoints";

const getToken = (): string | null => localStorage.getItem("token");

const createHeaders = () => {
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

// ! ============ Courses ============ !
export const getCourses = async () => {
  const res = await axios.get(endpoints.courses.list);
  return res.data;
};
export const getCourseDetail = async (slug: string) => {
  const res = await axios.get(endpoints.courses.detail(slug));
  return res.data;
};
// ! ============ Sections============ !
export const getPreview = async (courseId: string) => {
  const res = await axios.get(endpoints.sections.preview(courseId));
  return res.data;
};

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

// ! ============ Rating ============ !
export const createRating = async (data: any) =>
  await axios.post(endpoints.review.review, data, createHeaders());

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

// ! ============ Reply ============ !
export const createReply = async (data: any) =>
  await axios.post(endpoints.reply.reply, data, createHeaders());

export const deleteReply = async (id: string) =>
  await axios.delete(endpoints.reply.delete(id), createHeaders());

// ! ============ Progress ============ !
export const courseProgress = async (courseId: string) => {
  const res = await axios.get(
    endpoints.progress.courseProgress(courseId),
    createHeaders()
  );
  return res.data;
};

export const createProgress = async (data: any) =>
  await axios.post(endpoints.progress.progress, data, createHeaders());
