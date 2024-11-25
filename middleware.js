// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher([ "/sign-up(.*)"]);

// export default clerkMiddleware((auth, request) => {
//   if (!isPublicRoute(request)) {
//     auth().protect();
//   }
// });

// export const config = {
//   matcher: [
//     // // Skip Next.js internals and all static files, unless found in search params
//     // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // // Always run for API routes
//     // "/(api|trpc)(.*)",
//   ],
// };
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) {
    // If the user is trying to access the '/Landlord' route but has a role of 'User', redirect them to the home page or an unauthorized page
    if (token.role === "User" && request.nextUrl.pathname.startsWith("/Landlord")) {
      return NextResponse.redirect(new URL("/User/Home", request.url)); // Redirect to the home page or any other page you want
    }
    if (token.role === "Landlord" && request.nextUrl.pathname.startsWith("/User")) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to the home page or any other page you want
    }

    if (token && request.nextUrl.pathname === "/") {
      return NextResponse.redirect(
        new URL(`/${token.role}/Home`, request.url)
      );
    }
    return NextResponse.next();
  }

  if (!token && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Landlord/:path*", "/User/:path*"],
};