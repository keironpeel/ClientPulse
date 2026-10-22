import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("__Host-auth_token")?.value;

  const isPublic = publicRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));

  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/" && pathname !== "") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
