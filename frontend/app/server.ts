import axios from "axios";

export const url = "http://127.0.0.1:8000/api/v1/";

export const endpoints = {
  user: {
    register: url + "user/",
    login: url + "user/token/",
    me: url + "user/get_user/",
  },
};

export const register = async (data: any) => {
  try {
    const res = await axios.post(endpoints.user.register, data);
    return res;
  } catch (error: any) {
    return error.response.data;
  }
};
