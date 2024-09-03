import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { encrypt } from "@/lib/actions/auth";
import dbConnect from "@/lib/dbConnect";
import { loginSchema } from "@/lib/validation/auth";
import UserModel from "@/models/user";

async function comparePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword).then((match) => match);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, success, error } = loginSchema.safeParse(body);

  if (!success)
    return NextResponse.json(
      { message: "Invalid data", error },
      { status: 400 }
    );

  const { email, password } = data;

  try {
    await dbConnect();
    // Verify the email && get the user
    const user = await UserModel.findOne({ email });

    if (!user)
      return NextResponse.json(
        { message: "User with that email does not exist", error },
        { status: 404 }
      );

    // Verify the password
    const passwordMatches = await comparePassword(
      password,
      user.hashedPassword
    );
    if (!passwordMatches)
      return NextResponse.json(
        { message: "Invalid password", error },
        { status: 400 }
      );

    // Create the session
    const session = await encrypt({ user });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
