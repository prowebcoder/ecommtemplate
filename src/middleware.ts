import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

function loginRedirect(
  req: Parameters<Parameters<typeof auth>[0]>[0],
  loginPath: string,
  callbackPath: string
) {
  const url = new URL(loginPath, req.nextUrl.origin);
  url.searchParams.set("callbackUrl", callbackPath);
  return NextResponse.redirect(url);
}

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const role = req.auth?.user?.role;

  if (path.startsWith("/admin/login")) {
    if (role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", path);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (path.startsWith("/vendor/login")) {
    if (role === "VENDOR") {
      return NextResponse.redirect(new URL("/vendor", req.url));
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", path);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (path.startsWith("/admin")) {
    if (role !== "SUPER_ADMIN") {
      if (!req.auth) return loginRedirect(req, "/admin/login", path);
      return NextResponse.redirect(
        new URL(role === "VENDOR" ? "/vendor" : "/account/profile", req.url)
      );
    }
  }

  if (path.startsWith("/vendor")) {
    if (role !== "VENDOR") {
      if (!req.auth) return loginRedirect(req, "/vendor/login", path);
      return NextResponse.redirect(
        new URL(role === "SUPER_ADMIN" ? "/admin" : "/account/profile", req.url)
      );
    }
  }

  if (
    path.startsWith("/account") &&
    !path.startsWith("/account/login") &&
    !path.startsWith("/account/register")
  ) {
    if (!req.auth) {
      return loginRedirect(req, "/account/login", path);
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", path);
  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
