import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define paths that do NOT require authentication
const publicRoutes = ["/", "/login", "/register", "/forgot-password"]

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value
    const { pathname } = request.nextUrl

    // Check if the current path is public
    const isPublicRoute = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    )

    // 1. PROTECTED ROUTES: If it's NOT public and user is NOT logged in -> Redirect to Login
    if (!isPublicRoute && !token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // 2. AUTH ROUTES: If user IS logged in...
    if (token) {
        // ...and tries to access Login/Register -> Redirect to Dashboard
        if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        // ...and tries to access Root '/' -> Redirect to Dashboard
        if (pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    // Match all request paths except for:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public svg files
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}
