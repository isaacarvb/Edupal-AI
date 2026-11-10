import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that are allowed for school admins (auth checked in page components)
const SCHOOL_ADMIN_ROUTES = ["/school/dashboard", "/school/subscription", "/school/analytics", "/school/students", "/school/teachers", "/school/lesson-notes", "/school/curriculum", "/school/announcements", "/school/mock-exams", "/school/questions", "/school/settings"];
// Public routes that don't need auth
const PUBLIC_ROUTES = ["/school-session", "/school-register", "/school-login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow school admin routes (auth handled in page components)
  if (SCHOOL_ADMIN_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public school routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect all other /school/* routes to student dashboard
  if (pathname.startsWith("/school")) {
    const dashboardUrl = new URL("/dashboard", req.url);
    dashboardUrl.searchParams.set("notice", "school_portal_suspended");
    return NextResponse.redirect(dashboardUrl);
  }

  // Teacher routes are protected inside each page (role check + teacher API),
  // so the teacher workspace (including Curriculum) is available again.

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next|icons|manifest|favicon.ico).*)"],
};
