"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { SignJWT, jwtVerify } from "jose";

import { ISession } from "@/types/auth";

import { EXPIRATION_TIME, OWNER_ONLY_ROUTES } from "../constants";

const JWT_SECRET = process.env.JWT_SECRET;
const key = new TextEncoder().encode(JWT_SECRET);

export async function encrypt(payload: any, expirationTime = EXPIRATION_TIME) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expirationTime / 1000)
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

// Server side
export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
  redirect("/login");
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return (await decrypt(session)) as ISession;
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) {
    // Get if user is trying to access a protected route without session
    const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
    if (!isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    } else return; // if it's an auth route, let user continue
  }

  // Refresh the session so it doesn't expire, it will only expire if the user is inactive for a given time
  // (Optional) You can forcefully expire the session by removing below code
  const parsed = (await decrypt(session)) as ISession;

  // Protect specific routes from roles other than owners
  const url = request.nextUrl.clone();
  if (OWNER_ONLY_ROUTES.includes(url.pathname)) {
    if (parsed.user.role === "Owner") return;
    else return NextResponse.error();
  }

  // Set a new session cookie with a new expiration time
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: new Date(Date.now() + EXPIRATION_TIME),
  });
  return res;
}

export async function updateSessionCookie(updatedSession: string) {
  const cookieStore = cookies();
  cookieStore.set("session", updatedSession, {
    maxAge: EXPIRATION_TIME,
  });
}
