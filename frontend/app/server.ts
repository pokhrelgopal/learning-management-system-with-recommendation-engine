import axios from "axios";
import { endpoints } from "./endpoints";

const getToken = (): string | null => localStorage.getItem("access");

const createHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const register = async (data: any) =>
  await axios.post(endpoints.user.register, data);

export const login = async (data: any) =>
  await axios.post(endpoints.user.login, data);

export const getMe = async () =>
  await axios.get(endpoints.user.me, createHeaders());

export const getCourses = async () => {
  const res = await axios.get(endpoints.courses.list);
  return res.data;
};
