import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  // If the user is authenticated and trying to access auth pages, redirect to home
  if (
    token &&
    (url.pathname === "/sign-in" ||
      url.pathname === "/sign-up" ||
      url.pathname === "/verify" ||
      url.pathname === "/error" ||
      url.pathname === "/forgot-password")
    ) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If the user is not authenticated and trying to access dashboard routes, redirect to sign-in
  if (!token && (url.pathname === "/" || url.pathname.startsWith("/dashboard"))) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/forgot-password", "/verify", "/dashboard/:path*", "/error"],
}






