import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes — only login/signup are accessible without auth
  if (pathname === "/login" || pathname === "/signup") {
    return NextResponse.next();
  }

  // Allow NextAuth API routes and static assets
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname.startsWith("/icons") || pathname.startsWith("/manifest")) {
    return NextResponse.next();
  }

  // Check for NextAuth session cookie
  const sessionCookie = req.cookies.get("next-auth.session-token") || req.cookies.get("__Secure-next-auth.session-token");

  if (!sessionCookie) {
    // Not authenticated — redirect to login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next|icons|manifest|favicon.ico).*)"],
};