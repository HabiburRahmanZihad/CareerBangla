"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import envConfig from "@/lib/envConfig";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { UserInfo } from "@/types/user.types";
import { IChangePasswordPayload } from "@/zod/auth.validation";
import { cookies } from "next/headers";
import { cache } from "react";

const BASE_API_URL = envConfig.apiBaseUrl;

export async function getNewTokensWithRefreshToken(refreshToken: string): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        if (!sessionToken) {
            return false;
        }

        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`
            }
        });

        if (!res.ok) {
            return false;
        }

        const { data } = await res.json();

        const { accessToken, refreshToken: newRefreshToken, sessionToken: newSessionToken } = data;

        if (accessToken) {
            await setTokenInCookies("accessToken", accessToken);
        }

        if (newRefreshToken) {
            await setTokenInCookies("refreshToken", newRefreshToken);
        }

        if (newSessionToken) {
            await setTokenInCookies("better-auth.session_token", newSessionToken, 24 * 60 * 60); // 1 day in seconds
        }

        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

// Use React cache to prevent repeated API calls during a single render pass
export const getUserInfo = cache(async (): Promise<UserInfo | null> => {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (envConfig.isDevelopment) {
            console.log("[getUserInfo] sessionToken:", sessionToken ? "present" : "MISSING");
            console.log("[getUserInfo] accessToken:", accessToken ? "present" : "MISSING");
        }

        // Allow access if user has either session token or access token
        if (!sessionToken && !accessToken) {
            return null;
        }

        // Build cookie header from cookies() API to ensure proper forwarding
        const cookieParts: string[] = [];
        if (accessToken) cookieParts.push(`accessToken=${accessToken}`);
        if (refreshToken) cookieParts.push(`refreshToken=${refreshToken}`);
        if (sessionToken) cookieParts.push(`better-auth.session_token=${sessionToken}`);
        const cookieHeader = cookieParts.join("; ");

        // Use direct fetch instead of serverHttpClient to avoid redirect-on-401
        // and get actual error details from the backend
        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            },
            cache: "no-store",
        });

        if (res.ok) {
            const responseData = await res.json();
            if (envConfig.isDevelopment) {
                console.log("[getUserInfo] Success, user:", responseData.data?.email);
            }
            return responseData.data;
        }

        if (envConfig.isDevelopment) {
            const errorBody = await res.text().catch(() => "unable to read body");
            console.error(`[getUserInfo] /auth/me returned ${res.status}:`, errorBody);
        }

        // On 401, try token refresh and retry once
        if (res.status === 401 && refreshToken) {
            if (envConfig.isDevelopment) {
                console.log("[getUserInfo] Attempting token refresh...");
            }
            const refreshed = await getNewTokensWithRefreshToken(refreshToken);
            if (refreshed) {
                // Read refreshed tokens from cookies
                const newCookieStore = await cookies();
                const newAccessToken = newCookieStore.get("accessToken")?.value;
                const newRefreshToken = newCookieStore.get("refreshToken")?.value;
                const newSessionToken = newCookieStore.get("better-auth.session_token")?.value;

                const newCookieParts: string[] = [];
                if (newAccessToken) newCookieParts.push(`accessToken=${newAccessToken}`);
                if (newRefreshToken) newCookieParts.push(`refreshToken=${newRefreshToken}`);
                if (newSessionToken) newCookieParts.push(`better-auth.session_token=${newSessionToken}`);

                const retryRes = await fetch(`${BASE_API_URL}/auth/me`, {
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: newCookieParts.join("; "),
                    },
                    cache: "no-store",
                });

                if (retryRes.ok) {
                    const retryData = await retryRes.json();
                    if (envConfig.isDevelopment) {
                        console.log("[getUserInfo] Success after token refresh, user:", retryData.data?.email);
                    }
                    return retryData.data;
                }

                if (envConfig.isDevelopment) {
                    console.error("[getUserInfo] Still failed after token refresh:", retryRes.status);
                }
            }
        }

        return null;
    } catch (error: unknown) {
        if (envConfig.isDevelopment) {
            console.error("[getUserInfo] Error fetching user info:", error);
        }
        return null;
    }
});

export async function changePassword(payload: IChangePasswordPayload) {
    return serverHttpClient.post("/auth/change-password", payload);
}

export async function updateMyProfile(data: { name?: string; phone?: string }) {
    return serverHttpClient.patch<UserInfo>("/auth/update-profile", data);
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete("better-auth.session_token");
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
}
