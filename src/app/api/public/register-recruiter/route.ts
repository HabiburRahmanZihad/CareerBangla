import envConfig from "@/lib/envConfig";
import { NextRequest, NextResponse } from "next/server";

const BASE_API_URL = envConfig.apiBaseUrl;

const getMessageFromBackendResponse = async (response: Response): Promise<string> => {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        const json = await response.json().catch(() => null);
        if (typeof json?.message === "string" && json.message.trim()) {
            return json.message;
        }
    } else {
        const text = await response.text().catch(() => "");
        if (text.trim()) {
            return text;
        }
    }

    return response.ok
        ? "Registration successful! Your account is pending admin approval."
        : "Registration failed. Please try again.";
};

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get("content-type") || "";
        let backendResponse: Response;

        if (contentType.includes("multipart/form-data")) {
            const incomingFormData = await request.formData();
            const outgoingFormData = new FormData();

            for (const [key, value] of incomingFormData.entries()) {
                outgoingFormData.append(key, value);
            }

            backendResponse = await fetch(`${BASE_API_URL}/users/create-recruiter`, {
                method: "POST",
                body: outgoingFormData,
                cache: "no-store",
            });
        } else {
            const body = await request.json();

            backendResponse = await fetch(`${BASE_API_URL}/users/create-recruiter`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                cache: "no-store",
            });
        }

        const message = await getMessageFromBackendResponse(backendResponse);

        return NextResponse.json(
            {
                success: backendResponse.ok,
                message,
            },
            { status: backendResponse.status }
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Registration failed. Please try again.",
            },
            { status: 500 }
        );
    }
}
