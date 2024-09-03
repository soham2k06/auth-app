import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/actions/auth";
import dbConnect from "@/lib/dbConnect";
import { createOrganizationSchema } from "@/lib/validation/organization";
import OrganizationModel from "@/models/organization";
import UserModel from "@/models/user";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, success, error } = createOrganizationSchema.safeParse(body);
  if (!success)
    return NextResponse.json(
      { message: "Invalid data", error },
      { status: 400 }
    );

  const { name } = data;
  try {
    await dbConnect();
    const prevSession = await getSession();
    if (!prevSession || !prevSession.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { user } = prevSession;

    const organization = await OrganizationModel.create({
      name,
      creator: user._id,
      members: [user._id],
    });
    if (!organization)
      return NextResponse.json(
        { message: "Error creating organization" },
        { status: 500 }
      );

    await UserModel.findByIdAndUpdate(user._id, {
      role: "Owner",
      organization: organization._id,
    });

    const updatedUser = await UserModel.findById(user._id);

    return NextResponse.json({ updatedUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
