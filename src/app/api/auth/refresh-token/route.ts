import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

function getTokenExpirationSeconds(token: string): number {
    try {
        const decoded = jwt.decode(token) as JwtPayload;
        if (decoded?.exp) {
            const remainingSeconds = decoded.exp - Math.floor(Date.now() / 1000);
            return Math.max(remainingSeconds, 3600); // Minimum 1 hour
        }
    } catch (error) {
        console.error("Error decoding token for expiration:", error);
    }
    // Fallback expiration times
    return 3600; // 1 hour for access token
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        if (!refreshToken || !sessionToken) {
            return NextResponse.json(
                { error: "Missing refresh token or session token" },
                { status: 401 }
            );
        }

        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`,
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Token refresh failed" },
                { status: res.status }
            );
        }

        const { data } = await res.json();
        const { accessToken, refreshToken: newRefreshToken, sessionToken: newSessionToken } = data;

        const response = NextResponse.json({ success: true });

        // Set cookies in the response with proper expiration
        if (accessToken) {
            const accessTokenExpiry = getTokenExpirationSeconds(accessToken);
            response.cookies.set("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: accessTokenExpiry,
            });
        }

        if (newRefreshToken) {
            const refreshTokenExpiry = getTokenExpirationSeconds(newRefreshToken);
            response.cookies.set("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: refreshTokenExpiry,
            });
        }

        if (newSessionToken) {
            response.cookies.set("better-auth.session_token", newSessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 24 * 60 * 60, // 1 day
            });
        }

        return response;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

