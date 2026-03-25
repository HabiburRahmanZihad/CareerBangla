"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import envConfig from "@/lib/envConfig";
import { logger } from "@/lib/logger";

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
        logger.auth("Attempting token refresh");
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

        logger.auth("Token refresh successful");
        return {
            accessToken,
            refreshToken: newRefreshToken || refreshToken,
            sessionToken: newSessionToken,
        };
    } catch (error) {
        console.error(error);
        logger.auth("Token refresh failed");
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

        logger.auth("getUserInfo check", {
            sessionToken: sessionToken ? "present" : "MISSING",
            accessToken: accessToken ? "present" : "MISSING",
        });

        // Session token is the primary auth indicator (matches middleware check)
        if (!sessionToken) {
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
            logger.auth(`getUserInfo success → user: ${responseData.data?.email}`);
            return responseData.data;
        }

        if (envConfig.isDevelopment) {
            const errorBody = await res.text().catch(() => "unable to read body");
            logger.auth(`getUserInfo /auth/me returned ${res.status}`, { body: errorBody });
        }

        // On 401, try token refresh and retry once
        // NOTE: We do NOT call setTokenInCookies here — cookies cannot be written during
        // Server Component render. We use the freshly obtained tokens for this retry only.
        // The browser will receive updated cookies from the backend's Set-Cookie response headers
        // on the next client-side request.
        if (res.status === 401 && refreshToken) {
            logger.auth("Attempting token refresh for getUserInfo retry");
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
                    logger.auth(`getUserInfo success after refresh → user: ${retryData.data?.email}`);
                    return retryData.data;
                }

                logger.auth(`getUserInfo still failed after refresh → status: ${retryRes.status}`);
            }
        }

        return null;
    } catch (error: unknown) {
        // Re-throw Next.js redirect errors
        if (error && typeof error === "object" && "digest" in error) {
            const digest = (error as { digest?: string }).digest;
            if (digest && typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
                throw error;
            }
        }
        logger.auth("getUserInfo error");
        return null;
    }
});

export async function changePassword(payload: IChangePasswordPayload) {
    logger.update("Changing password");
    return serverHttpClient.post("/auth/change-password", payload);
}

export async function updateMyProfile(data: { name?: string; phone?: string }) {
    logger.update("Updating profile", { fields: Object.keys(data) });
    return serverHttpClient.patch<UserInfo>("/auth/update-profile", data);
}

export async function logoutUser() {
    logger.auth("Logging out user");
    const cookieStore = await cookies();
    cookieStore.delete("better-auth.session_token");
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
}

export async function logoutAllDevices() {
    logger.auth("Logging out from all devices");
    const result = await serverHttpClient.post("/auth/logout-all-devices", {});
    const cookieStore = await cookies();
    cookieStore.delete("better-auth.session_token");
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return result;
}

export async function getActiveSessions() {
    logger.auth("Fetching active sessions");
    return serverHttpClient.get<{
        id: string;
        createdAt: string;
        expiresAt: string;
        ipAddress: string | null;
        userAgent: string | null;
        accessTokenExpiresAt: string | null;
        refreshTokenExpiresAt: string | null;
    }[]>("/auth/active-sessions");
}

export async function revokeSession(sessionId: string) {
    logger.auth("Revoking session", { sessionId });
    return serverHttpClient.delete(`/auth/sessions/${sessionId}`);
}

export async function deleteMyAccount() {
    logger.auth("Deleting account");
    const result = await serverHttpClient.delete("/auth/delete-account");
    const cookieStore = await cookies();
    cookieStore.delete("better-auth.session_token");
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return result;
}
