/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";

interface IVerifyEmailResponse {
    token: string | null;
    accessToken: string;
    refreshToken: string;
    user: unknown;
}

interface VerifyEmailActionResponse {
    success: boolean;
    message: string;
    redirectPath?: string;
}

export const verifyEmailAction = async (
    email: string,
    otp: string
): Promise<VerifyEmailActionResponse> => {
    if (!email || !otp || otp.length !== 6) {
        return {
            success: false,
            message: "Invalid email or OTP",
        };
    }

    try {
        const response = await serverHttpClient.post<IVerifyEmailResponse>("/auth/verify-email", { email, otp });

        const { token, accessToken, refreshToken } = response.data;

        // Set cookies here — this IS a Server Action, so cookie writes are allowed
        if (accessToken) {
            await setTokenInCookies("accessToken", accessToken);
        }
        if (refreshToken) {
            await setTokenInCookies("refreshToken", refreshToken);
        }
        if (token) {
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
        }

        return {
            success: true,
            message: "Email verified successfully",
            redirectPath: "/dashboard",
        };
    } catch (error: any) {
        return {
            success: false,
            message: getRequestErrorMessage(error, "Verification failed"),
        };
    }
};
