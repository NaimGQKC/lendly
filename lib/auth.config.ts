import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      // authorize is handled in the full auth.ts
      async authorize() {
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as Record<string, unknown>).role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as Record<string, unknown>).role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as unknown as Record<string, unknown> | undefined)?.role as string | undefined;
      const { pathname } = nextUrl;

      // Admin routes
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        if (role !== "ADMIN") {
          return Response.redirect(new URL("/catalog", nextUrl));
        }
        return true;
      }

      // Protected routes
      const protectedPaths = ["/my-loans", "/items/new"];
      const isProtected =
        protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
        /^\/items\/[^/]+\/edit/.test(pathname);

      if (isProtected && !isLoggedIn) return false;

      return true;
    },
  },
};
