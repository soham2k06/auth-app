import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { encrypt } from "@/lib/actions/auth";
import dbConnect from "@/lib/dbConnect";
import { registerSchema } from "@/lib/validation/auth";
import OrganizationModel from "@/models/organization";
import UserModel from "@/models/user";

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10).then((hash) => hash);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, success, error } = registerSchema.safeParse(body);

  if (!success)
    return NextResponse.json(
      { message: "Invalid data", error },
      { status: 400 }
    );

  const { email, password, firstname, lastname, organization, role } = data;

  try {
    await dbConnect();
    // Verify the email if it already exists
    const user = await UserModel.findOne({ email });

    if (user)
      return NextResponse.json(
        { message: "User already exists, please try login", error },
        { status: 404 }
      );

    const hashedPassword = await hashPassword(password);

    const newUser = await UserModel.create({
      email,
      hashedPassword,
      firstname,
      lastname,
      organization,
      role,
    });

    console.log(newUser);

    await OrganizationModel.findByIdAndUpdate(organization, {
      $push: { members: newUser._id },
    });

    const session = await encrypt({ user: newUser });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
