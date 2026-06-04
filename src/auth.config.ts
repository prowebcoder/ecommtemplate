import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@prisma/client";

export const authConfig = {
  pages: {
    signIn: "/account/login",
    newUser: "/account/register",
  },
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      if (path.startsWith("/admin/login") || path.startsWith("/vendor/login")) {
        return true;
      }
      if (path.startsWith("/admin")) {
        return auth?.user?.role === "SUPER_ADMIN";
      }
      if (path.startsWith("/vendor")) {
        return auth?.user?.role === "VENDOR";
      }
      const protectedAccount = [
        "/account/profile",
        "/account/orders",
        "/account/addresses",
      ];
      if (protectedAccount.some((p) => path.startsWith(p))) return !!auth;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
