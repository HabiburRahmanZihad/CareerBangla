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

        if (envConfig.isDevelopment) {
            console.log("[getUserInfo] sessionToken:", sessionToken ? "present" : "MISSING");
            console.log("[getUserInfo] accessToken:", accessToken ? "present" : "MISSING");
        }

        // Primary Authentication check: ONLY depend on better-auth.session_token
        if (!sessionToken) {
            return null;
        }

        const response = await serverHttpClient.get<UserInfo>("/auth/me");
        if (envConfig.isDevelopment) {
            console.log("[getUserInfo] Success, user:", response.data?.email);
        }
        return response.data;
    } catch (error: unknown) {
        // NEXT_REDIRECT from serverHttpClient's 401 handler - don't log as error
        const isRedirect = error && typeof error === "object" && "digest" in error &&
            typeof (error as Record<string, unknown>).digest === "string" && (error as Record<string, unknown>).digest === "NEXT_REDIRECT";
        if (isRedirect && envConfig.isDevelopment) {
            console.error("[getUserInfo] Backend /auth/me returned 401 - session may be invalid");
        }
        if (!isRedirect && envConfig.isDevelopment) {
            console.error("[getUserInfo] Error fetching user info:", error);
        }
        // Return null so the caller can decide what to do (redirect, logout, etc.)
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
