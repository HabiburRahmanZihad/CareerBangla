import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";

export async function proxy(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;
        
        // PRIMARY AUTH: better-auth.session_token
        const sessionToken = request.cookies.get("better-auth.session_token")?.value;
        const accessToken = request.cookies.get("accessToken")?.value;

        const isAuthenticated = !!sessionToken;
        let isEmailVerified = true; // Assume true unless accessToken specifically marks it false
        
        // SECONDARY (Optional): Get role from accessToken if available for routing hints
        let userRole: UserRole | null = null;
        if (accessToken) {
            // Decoded JWT locally on edge (very fast, no DB/API call)
            const decodedResult = jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET || "your_access_token_secret");
            if (decodedResult.success && decodedResult.data) {
                const role = decodedResult.data.role as UserRole;
                userRole = role === "SUPER_ADMIN" ? "ADMIN" : role;
                
                if (decodedResult.data.emailVerified !== undefined) {
                    isEmailVerified = decodedResult.data.emailVerified;
                }
            }
        }

        const routerOwner = getRouteOwner(pathname);
        const isAuth = isAuthRoute(pathname);

        // Rule: User is logged in and trying to access auth route (like /login)
        if (isAuth && isAuthenticated) {
            if (pathname !== "/verify-email") {
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole || "USER"), request.url));
            }
        }

        // Rule: Public route -> allow
        if (routerOwner === null) {
            return NextResponse.next();
        }

        // Rule: Not logged in but trying to access protected route -> redirect to login
        if (!isAuthenticated) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Rule: Email verification enforce
        if (isAuthenticated && !isEmailVerified && pathname !== "/verify-email") {
            const verifyEmailUrl = new URL("/verify-email", request.url);
            return NextResponse.redirect(verifyEmailUrl);
        }

        if (isAuthenticated && isEmailVerified && pathname === "/verify-email") {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole || "USER"), request.url));
        }

        // Rule: Common protected route -> allow
        if (routerOwner === "COMMON") {
            return NextResponse.next();
        }

        // Rule: Role-based route mismatch -> redirect if we know the true role
        // If we don't know the role (no accessToken), we let them through and the 
        // Server Components will strictly validate via /auth/me and redirect if needed.
        if (routerOwner === "ADMIN" || routerOwner === "RECRUITER" || routerOwner === "USER") {
            if (userRole && routerOwner !== userRole) {
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Error in middleware:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
};
