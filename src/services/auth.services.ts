"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import envConfig from "@/lib/envConfig";

import { UserInfo } from "@/types/user.types";
import { IChangePasswordPayload } from "@/zod/auth.validation";
import { cookies } from "next/headers";
import { cache } from "react";

const BASE_API_URL = envConfig.apiBaseUrl;

type RefreshResult = {
    accessToken: string;
    refreshToken: string;
    sessionToken: string;
} | null;

/**
 * Refreshes tokens by calling the backend refresh endpoint.
 * NOTE: This does NOT write cookies — cookies can only be set in Server Actions or Route Handlers.
 * Returns the new tokens directly so the caller can use them for a single retry request.
 */
export async function getNewTokensWithRefreshToken(refreshToken: string): Promise<RefreshResult> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        if (!sessionToken) {
            return null;
        }

        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`,
                Authorization: `Bearer ${sessionToken}`,
            }
        });

        if (!res.ok) {
            return null;
        }

        const { data } = await res.json();

        const { accessToken, refreshToken: newRefreshToken, sessionToken: newSessionToken } = data;

        if (!accessToken || !newSessionToken) {
            return null;
        }

        return {
            accessToken,
            refreshToken: newRefreshToken || refreshToken,
            sessionToken: newSessionToken,
        };
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
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

        // Build headers with Bearer token so backend's bearer() plugin can
        // sign the session token properly (plain cookies fail signature check)
        const fetchHeaders: Record<string, string> = {
            "Content-Type": "application/json",
            Cookie: cookieHeader,
        };
        if (sessionToken) {
            fetchHeaders["Authorization"] = `Bearer ${sessionToken}`;
        }

        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            headers: fetchHeaders,
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
        // NOTE: We do NOT call setTokenInCookies here — cookies cannot be written during
        // Server Component render. We use the freshly obtained tokens for this retry only.
        // The browser will receive updated cookies from the backend's Set-Cookie response headers
        // on the next client-side request.
        if (res.status === 401 && refreshToken) {
            if (envConfig.isDevelopment) {
                console.log("[getUserInfo] Attempting token refresh...");
            }
            const freshTokens = await getNewTokensWithRefreshToken(refreshToken);
            if (freshTokens) {
                // Use the new tokens directly for the retry — no cookie write needed
                const newCookieParts: string[] = [];
                newCookieParts.push(`accessToken=${freshTokens.accessToken}`);
                newCookieParts.push(`refreshToken=${freshTokens.refreshToken}`);
                newCookieParts.push(`better-auth.session_token=${freshTokens.sessionToken}`);

                const retryHeaders: Record<string, string> = {
                    "Content-Type": "application/json",
                    Cookie: newCookieParts.join("; "),
                };
                if (freshTokens.sessionToken) {
                    retryHeaders["Authorization"] = `Bearer ${freshTokens.sessionToken}`;
                }

                const retryRes = await fetch(`${BASE_API_URL}/auth/me`, {
                    headers: retryHeaders,
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
