import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default async function middleware(request: NextRequest) {
  const session = await auth()
  const isLoginPage = request.nextUrl.pathname === "/login"

  // Allow access to public routes
  const publicRoutes = ["/login", "/api/auth"]
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to login
  if (!session && !isLoginPage) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from login page
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"]
} 