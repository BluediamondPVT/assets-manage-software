import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // EDGE LEVEL ROLE CHECK: 
    // Yahan se humne "/admin/assets/add" hata diya hai taaki Normal Admin bhi add kar sake.
    // Lekin Edit aur Delete (users) abhi bhi lock hain.
    const isSuperAdminRoute = 
      path.startsWith("/admin/users") || 
      path.startsWith("/admin/assets/edit");

    if (isSuperAdminRoute && token?.role !== "super-admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*", 
  ],
};