import type { AxiosError } from "axios";
import API from "./apiClient";

export const signup = async (data: unknown) => {
  try {
    const res = await API.post("/auth/signup", data);
    return res.data;
  } catch (error: AxiosError) {
    const message = error?.response?.data?.message || "Something went wrong.";
    console.log(message);
    throw new Error(message);
  }
};

export const login = async (data: unknown) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data;
  } catch (error: AxiosError) {
    const message = error?.response?.data?.message || "Something went wrong.";
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    const res = await API.get("/auth/logout");
    return res.data;
  } catch (error: AxiosError) {
    const message = error?.response?.data?.message || "Something went wrong.";
    throw new Error(message);
  }
};

export const getUser = async () => {
  try {
    const res = await API.get("/user");
    return res.data;
  } catch (error: AxiosError) {
    const message = error?.response?.data?.message || "Something went wrong.";
    throw new Error(message);
  }
};
