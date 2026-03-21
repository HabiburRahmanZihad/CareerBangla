import envConfig from "@/lib/envConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const sessionToken = searchParams.get("sessionToken");
    const redirectPath = searchParams.get("redirect") || "/dashboard";

    // Validate redirect path to prevent open redirect
    const isValidRedirect = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirect = isValidRedirect ? redirectPath : "/dashboard";

    if (!accessToken || !refreshToken || !sessionToken) {
        return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }

    const response = NextResponse.redirect(new URL(finalRedirect, request.url));

    // Set cookies on the frontend domain
    response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: envConfig.isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
    });

    response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: envConfig.isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("better-auth.session_token", sessionToken, {
        httpOnly: true,
        secure: envConfig.isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
}
