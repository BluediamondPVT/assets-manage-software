import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // EDGE LEVEL ROLE CHECK: 
    // Yahan humne edit wale path ko bhi restrict kar diya hai
    const isSuperAdminRoute = 
      path.startsWith("/admin/users") || 
      path.startsWith("/admin/assets/add") ||
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