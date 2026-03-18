/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { IRegisterResponse } from "@/types/auth.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (payload: IRegisterPayload): Promise<IRegisterResponse | ApiErrorResponse> => {
    const parsedPayload = registerZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }

    try {
        const response = await serverHttpClient.post<IRegisterResponse>("/auth/register", parsedPayload.data);

        console.log("[RegisterAction] Full response:", response.data);

        const { accessToken, refreshToken, token } = response.data;

        console.log("[RegisterAction] Response tokens:", {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            hasSessionToken: !!token,
            sessionTokenPreview: token ? token.substring(0, 20) + "..." : "MISSING",
            tokenValue: token
        });

        // During registration with email verification required, token may be null
        // Set tokens if they exist (accessToken and refreshToken may also be missing with email verification)
        if (accessToken) {
            await setTokenInCookies("accessToken", accessToken);
        }
        if (refreshToken) {
            await setTokenInCookies("refreshToken", refreshToken);
        }
        if (token) {
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
        }

        console.log("[RegisterAction] Tokens set in cookies (if they existed)");

        redirect(`/verify-email?email=${parsedPayload.data.email}`);
    } catch (error: any) {
        if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
            throw error;
        }

        return {
            success: false,
            message: getRequestErrorMessage(error, "Registration failed"),
        };
    }
};
