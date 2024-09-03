import { NextRequest, NextResponse } from "next/server";

import { encrypt, getSession } from "@/lib/actions/auth";
import dbConnect from "@/lib/dbConnect";
import { getInviteLinkSchema } from "@/lib/validation/organization";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { success, data, error } = getInviteLinkSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      { message: "Invalid data", error },
      { status: 422 }
    );
  }

  const { role } = data;

  try {
    await dbConnect();
    const session = await getSession();
    if (!session || !session.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const invitationSession = await encrypt(
      { organization: session.user.organization, role },
      60 * 60 * 1000 // Expire in 1 hour
    );

    return NextResponse.json({ invitationSession }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
