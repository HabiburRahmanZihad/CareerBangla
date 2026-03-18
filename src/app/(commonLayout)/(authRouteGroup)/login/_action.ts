/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";

interface LoginActionResponse {
    success: boolean;
    message: string;
    redirectPath?: string;
}

export const loginAction = async (payload: ILoginPayload, redirectPath?: string): Promise<LoginActionResponse | ApiErrorResponse> => {
    const parsedPayload = loginZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }
    try {
        console.log("[LoginAction] Calling backend /auth/login");
        console.log("[LoginAction] Redirect path param:", redirectPath);

        const response = await serverHttpClient.post<ILoginResponse>("/auth/login", parsedPayload.data);

        const { accessToken, refreshToken, token, user } = response.data;
        const { role, needPasswordChange, email } = user;

        console.log("[LoginAction] Login successful, role:", role, "needPasswordChange:", needPasswordChange);

        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds

        console.log("[LoginAction] Cookies set successfully");

        // if(!emailVerified){
        //     redirect("/verify-email");
        // }else // in the catch block

        if (needPasswordChange) {
            const path = `/reset-password?email=${email}`;
            console.log("[LoginAction] Password change required, redirecting to:", path);
            return {
                success: true,
                message: "Login successful",
                redirectPath: path,
            };
        } else {
            const targetPath = redirectPath && isValidRedirectForRole(redirectPath, role as UserRole) ? redirectPath : getDefaultDashboardRoute(role as UserRole);
            console.log("[LoginAction] Redirect target:", targetPath, "(requested:", redirectPath, ", role:", role, ")");

            return {
                success: true,
                message: "Login successful",
                redirectPath: targetPath,
            };
        }

    } catch (error: any) {
        console.log(error, "error");

        // Check for email verification error (401 with specific message)
        if (error?.response?.status === 401 && error?.response?.data?.message === "Email not verified") {
            return {
                success: true,
                message: "Email verification required",
                redirectPath: `/verify-email?email=${payload.email}`,
            };
        }

        return {
            success: false,
            message: getRequestErrorMessage(error, "Login failed"),
        }
    }
}
