import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { getUserInfo } from "./services/auth.services";

export async function proxy(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;
        const accessToken = request.cookies.get("accessToken")?.value;

        const decodedAccessToken = accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).data;

        const isValidAccessToken = accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).success;

        let userRole: UserRole | null = null;

        if (decodedAccessToken) {
            userRole = decodedAccessToken.role as UserRole;
        }

        const routerOwner = getRouteOwner(pathname);

        const unifySuperAdminAndAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;

        userRole = unifySuperAdminAndAdminRole;

        const isAuth = isAuthRoute(pathname);

        // Skip token refresh logic in middleware - let it be handled by the client or Route Handlers
        // This prevents "Cookies can only be modified in a Server Action or Route Handler" errors

        // Rule 1: User is logged in and trying to access auth route -> redirect to dashboard
        // Exception: Allow /verify-email even if logged in, as email verification is required
        if (isAuth && isValidAccessToken) {
            // Only redirect from verify-email if email is already verified
            if (pathname !== "/verify-email") {
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
            }
            // If on /verify-email, fall through to check email verification status
        }

        // Rule 2: User is trying to access reset password page
        if (pathname === "/reset-password") {
            const email = request.nextUrl.searchParams.get("email");

            if (accessToken && email) {
                const userInfo = await getUserInfo();

                if (userInfo && userInfo.needPasswordChange) {
                    return NextResponse.next();
                } else {
                    return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
                }
            }

            if (email) {
                return NextResponse.next();
            }

            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Rule 3: Public route -> allow
        if (routerOwner === null) {
            return NextResponse.next();
        }

        // Rule 4: Not logged in but trying to access protected route -> redirect to login
        if (!accessToken || !isValidAccessToken) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Rule 5: Enforce email verification and password change
        if (accessToken) {
            const userInfo = await getUserInfo();

            if (userInfo) {
                if (userInfo.emailVerified === false) {
                    if (pathname !== "/verify-email") {
                        const verifyEmailUrl = new URL("/verify-email", request.url);
                        verifyEmailUrl.searchParams.set("email", userInfo.email);
                        return NextResponse.redirect(verifyEmailUrl);
                    }
                    return NextResponse.next();
                }

                if (userInfo.emailVerified && pathname === "/verify-email") {
                    return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
                }

                if (userInfo.needPasswordChange) {
                    if (pathname !== "/reset-password") {
                        const resetPasswordUrl = new URL("/reset-password", request.url);
                        resetPasswordUrl.searchParams.set("email", userInfo.email);
                        return NextResponse.redirect(resetPasswordUrl);
                    }
                    return NextResponse.next();
                }

                if (!userInfo.needPasswordChange && pathname === "/reset-password") {
                    return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
                }
            }
        }

        // Rule 6: Common protected route -> allow
        if (routerOwner === "COMMON") {
            return NextResponse.next();
        }

        // Rule 7: Role-based route mismatch -> redirect to their dashboard
        if (routerOwner === "ADMIN" || routerOwner === "RECRUITER" || routerOwner === "USER") {
            if (routerOwner !== userRole) {
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Error in proxy middleware:", error);
        // Return login redirect on any middleware error to prevent hangs
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
};
