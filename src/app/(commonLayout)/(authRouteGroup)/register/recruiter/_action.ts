/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IRecruiterRegisterPayload, recruiterRegisterZodSchema } from "@/zod/auth.validation";

type RecruiterRegisterResult = { success: true; message: string } | ApiErrorResponse;

export const recruiterRegisterAction = async (
    payload: FormData | IRecruiterRegisterPayload
): Promise<RecruiterRegisterResult> => {
    try {
        // Handle FormData input (with files)
        if (payload instanceof FormData) {
            const data = Object.fromEntries(payload) as any;

            // Validate with Zod schema
            const textData = {
                name: data.name,
                email: data.email,
                password: data.password,
                designation: data.designation || "",
                companyName: data.companyName,
                industry: data.industry,
                companyWebsite: data.companyWebsite || "",
                companyAddress: data.companyAddress || "",
                companySize: data.companySize || "",
                description: data.description || "",
                contactNumber: data.contactNumber || "",
                profilePhoto: data.profilePhoto || "",
                companyLogo: data.companyLogo || "",
            };

            const parsed = recruiterRegisterZodSchema.safeParse(textData);
            if (!parsed.success) {
                // Get first validation error with field name
                const firstIssue = parsed.error.issues[0];
                const fieldName = firstIssue.path.length > 0 ? String(firstIssue.path[0]) : "field";
                const errorMessage = firstIssue.message;
                return {
                    success: false,
                    message: `${fieldName}: ${errorMessage}`,
                };
            }

            // Send FormData to backend
            return await serverHttpClient.post("/users/create-recruiter", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }

        // Handle JSON input (backward compatibility)
        const parsed = recruiterRegisterZodSchema.safeParse(payload);
        if (!parsed.success) {
            // Get first validation error with field name
            const firstIssue = parsed.error.issues[0];
            const fieldName = firstIssue.path.length > 0 ? String(firstIssue.path[0]) : "field";
            const errorMessage = firstIssue.message;
            return {
                success: false,
                message: `${fieldName}: ${errorMessage}`,
            };
        }

        const { name, email, password, companyName, contactNumber, designation, industry, companyWebsite, companyAddress, companySize, description } = parsed.data;

        await serverHttpClient.post("/users/create-recruiter", {
            password,
            recruiter: {
                name,
                email,
                companyName,
                ...(industry ? { industry } : {}),
                ...(contactNumber ? { contactNumber } : {}),
                ...(designation ? { designation } : {}),
                ...(companyWebsite ? { companyWebsite } : {}),
                ...(companyAddress ? { companyAddress } : {}),
                ...(companySize ? { companySize } : {}),
                ...(description ? { description } : {}),
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
