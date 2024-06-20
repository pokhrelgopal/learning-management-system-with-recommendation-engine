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

// ! ============ Courses ============ !
export const getCourses = async () => {
  const res = await axios.get(endpoints.courses.list);
  return res.data;
};
export const getCourseDetail = async (slug: string) => {
  const res = await axios.get(endpoints.courses.detail(slug));
  return res.data;
};

// ! ============ Modules ============ !
export const getPreview = async (courseId: string) => {
  const res = await axios.get(endpoints.modules.preview(courseId));
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
