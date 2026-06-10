import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/downloads", "/bonus-claim", "/admin"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();
  response.headers.set("x-author-site", "curls-commerce-scaffold");

  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
