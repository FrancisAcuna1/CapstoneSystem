import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = request.nextUrl.pathname;
  const isLandingPage = pathname === "/";
  const isLoginPage = pathname === "/Authentication/Login"


  if (token) {
    const userRole = token.role;

    if (userRole === "User" && pathname.startsWith("/Landlord")) {
      return NextResponse.redirect(new URL("/Unauthorized", request.url));
    }
    if (token.role === "Landlord" && pathname.startsWith("/User")) {
      return NextResponse.redirect(new URL("/Unauthorized", request.url));
    }
    if (isLandingPage) {
      return NextResponse.redirect(new URL(`/${userRole}/Home`, request.url));
    }
    // if(isLoginPage){
    //   return NextResponse.redirect(new URL(`/${userRole}/Home`, request.url));
    // }
    return NextResponse.next();
  }
  
  if (!token && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/Landlord/:path*", "/User/:path*"],
};