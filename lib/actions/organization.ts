"use server";
import { revalidatePath } from "next/cache";

import OrganizationModel from "@/models/organization";
import UserModel from "@/models/user";

export async function removeMember(memberId: string, orgId: string) {
  await UserModel.findByIdAndUpdate(memberId, {
    organization: null,
    role: null,
  });

  await OrganizationModel.findByIdAndUpdate(orgId, {
    $pull: { members: memberId },
  });

  revalidatePath("/members", "page");
}
