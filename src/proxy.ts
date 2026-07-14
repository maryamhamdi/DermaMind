import { NextRequest, NextResponse } from "next/server";


const protectedRoutes = [
    "/checkout",
    "/allorders",
    "/profile"
]


const authRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-code"
]


export default function proxy(request: NextRequest) {

    const {pathname} = request.nextUrl
    const token = request.cookies.get("token")?.value || null

    const isAuthenticated= !!token

    const isProtectedRoute = protectedRoutes.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    )

    const isAuthRoute = authRoutes.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    )

    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    if(isAuthRoute && isAuthenticated){
        const homeUrl = new URL("/", request.url);
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next()

}


export const config = {
    matcher: [
        "/checkout/:path*",
        "/allorders/:path*",
        "/profile/:path*",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/verify-code"
    ]
}