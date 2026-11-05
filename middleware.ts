import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Suspend school/teacher portal routes — redirect to student dashboard
  if (pathname.startsWith("/school") || pathname.startsWith("/teacher")) {
    const dashboardUrl = new URL("/dashboard", req.url);
    dashboardUrl.searchParams.set("notice", "school_portal_suspended");
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next|icons|manifest|favicon.ico).*)"],
};