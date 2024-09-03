import {
  CreateOrganizationSchema,
  GetInviteLinkSchema,
} from "@/lib/validation/organization";

import { axiosInstance } from "./axios";

export async function createOrganizationAPI(data: CreateOrganizationSchema) {
  const res = await axiosInstance.post("/organization", data);

  if (res.status !== 201) throw new Error("Network response was not ok");

  return res.data;
}

export async function getOrganizationInviteLinkAPI(data: GetInviteLinkSchema) {
  const res = await axiosInstance.post("/organization/invite-link", data);

  if (res.status !== 201) throw new Error("Network response was not ok");

  return res.data;
}
