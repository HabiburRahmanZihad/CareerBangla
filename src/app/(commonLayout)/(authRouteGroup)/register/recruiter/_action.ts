/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IRecruiterRegisterPayload, recruiterRegisterZodSchema } from "@/zod/auth.validation";

type RecruiterRegisterResult = { success: true; message: string } | ApiErrorResponse;

export const recruiterRegisterAction = async (
    payload: IRecruiterRegisterPayload
): Promise<RecruiterRegisterResult> => {
    const parsed = recruiterRegisterZodSchema.safeParse(payload);

    if (!parsed.success) {
        return {
            success: false,
            message: parsed.error.issues[0].message || "Invalid input",
        };
    }

    const { name, email, password, companyName, contactNumber, designation } = parsed.data;

    try {
        await serverHttpClient.post("/users/create-recruiter", {
            password,
            recruiter: {
                name,
                email,
                companyName,
                ...(contactNumber ? { contactNumber } : {}),
                ...(designation ? { designation } : {}),
            },
        });

        return {
            success: true,
            message: "Registration successful! Your account is pending admin approval.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: getRequestErrorMessage(error, "Registration failed"),
        };
    }
};
