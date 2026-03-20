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

        // Primary Authentication check: ONLY depend on better-auth.session_token
        if (!sessionToken) {
            return null;
        }

        const response = await serverHttpClient.get<UserInfo>("/auth/me");
        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
});

export async function changePassword(payload: IChangePasswordPayload) {
    return serverHttpClient.post("/auth/change-password", payload);
}
