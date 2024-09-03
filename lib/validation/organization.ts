import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string(),
});

export const getInviteLinkSchema = z.object({
  role: z.enum(["Owner", "Staff"]),
});

export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;
export type GetInviteLinkSchema = z.infer<typeof getInviteLinkSchema>;
