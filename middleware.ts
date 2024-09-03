import { NextRequest } from "next/server";

import { updateSession } from "./lib/actions/auth";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/main", "/members"],
};
