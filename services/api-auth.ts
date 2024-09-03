import { LoginSchema, RegisterSchema } from "@/lib/validation/auth";

import { axiosInstance } from "./axios";

export async function loginAPI(data: LoginSchema) {
  const res = await axiosInstance.post("/auth/login", data);

  if (res.status !== 201) throw new Error("Network response was not ok");

  return res.data;
}

export async function registerAPI(data: RegisterSchema) {
  const res = await axiosInstance.post("/auth/register", data);

  if (res.status !== 201) throw new Error("Network response was not ok");

  return res.data;
}
