import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import envConfig from "@/lib/envConfig";
import { logger } from "@/lib/logger";
import { ApiErrorResponse } from "@/types/api.types";
import { IRecruiterRegisterPayload, recruiterRegisterZodSchema } from "@/zod/auth.validation";
import axios from "axios";

type RecruiterRegisterResult = { success: true; message: string } | ApiErrorResponse;

const getRecruiterTextPayloadFromFormData = (payload: FormData): IRecruiterRegisterPayload => ({
    name: String(payload.get("name") ?? ""),
    email: String(payload.get("email") ?? ""),
    password: String(payload.get("password") ?? ""),
    designation: String(payload.get("designation") ?? ""),
    profilePhoto: String(payload.get("profilePhoto") ?? ""),
    companyName: String(payload.get("companyName") ?? ""),
    industry: String(payload.get("industry") ?? ""),
    companyWebsite: String(payload.get("companyWebsite") ?? ""),
    companyAddress: String(payload.get("companyAddress") ?? ""),
    companySize: String(payload.get("companySize") ?? ""),
    description: String(payload.get("description") ?? ""),
    companyLogo: String(payload.get("companyLogo") ?? ""),
    contactNumber: String(payload.get("contactNumber") ?? ""),
});

export const registerRecruiter = async (
    payload: FormData | IRecruiterRegisterPayload
): Promise<RecruiterRegisterResult> => {
    const textPayload = payload instanceof FormData ? getRecruiterTextPayloadFromFormData(payload) : payload;
    const parsed = recruiterRegisterZodSchema.safeParse(textPayload);

    if (!parsed.success) {
        const firstIssue = parsed.error.issues[0];
        const fieldName = firstIssue.path.length > 0 ? String(firstIssue.path[0]) : "field";

        return {
            success: false,
            message: `${fieldName}: ${firstIssue.message}`,
        };
    }

    try {
        logger.create("Submitting recruiter registration");

        if (payload instanceof FormData) {
            const response = await axios.post(`${envConfig.apiBaseUrl}/users/create-recruiter`, payload, {
                timeout: 30000,
                withCredentials: true,
            });

            return {
                success: true,
                message: response.data?.message || "Registration successful! Your account is pending admin approval.",
            };
        }

        const response = await axios.post(
            `${envConfig.apiBaseUrl}/users/create-recruiter`,
            {
                password: parsed.data.password,
                recruiter: {
                    name: parsed.data.name,
                    email: parsed.data.email,
                    companyName: parsed.data.companyName,
                    ...(parsed.data.industry ? { industry: parsed.data.industry } : {}),
                    ...(parsed.data.contactNumber ? { contactNumber: parsed.data.contactNumber } : {}),
                    ...(parsed.data.designation ? { designation: parsed.data.designation } : {}),
                    ...(parsed.data.companyWebsite ? { companyWebsite: parsed.data.companyWebsite } : {}),
                    ...(parsed.data.companyAddress ? { companyAddress: parsed.data.companyAddress } : {}),
                    ...(parsed.data.companySize ? { companySize: parsed.data.companySize } : {}),
                    ...(parsed.data.description ? { description: parsed.data.description } : {}),
                },
            },
            {
                timeout: 30000,
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            success: true,
            message: response.data?.message || "Registration successful! Your account is pending admin approval.",
        };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        logger.apiError("POST", "/users/create-recruiter", {
            status: error?.response?.status,
            message: error?.response?.data?.message || error?.message,
        });

        return {
            success: false,
            message: getRequestErrorMessage(error, "Registration failed"),
        };
    }
};
