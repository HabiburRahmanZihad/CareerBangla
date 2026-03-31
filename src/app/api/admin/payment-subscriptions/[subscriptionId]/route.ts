import envConfig from "@/lib/envConfig";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

const BASE_API_URL = envConfig.apiBaseUrl;

const buildBackendHeaders = async () => {
    const headerStore = await headers();
    const cookieStore = await cookies();

    const rawCookieHeader = headerStore.get("cookie") || "";
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const outgoingHeaders: HeadersInit = {
        Accept: "application/json",
    };

    if (rawCookieHeader) {
        outgoingHeaders.Cookie = rawCookieHeader;
    }

    if (sessionToken) {
        outgoingHeaders.Authorization = `Bearer ${sessionToken}`;
    }

    return outgoingHeaders;
};

const proxyJsonResponse = async (backendResponse: Response) => {
    const contentType = backendResponse.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        const body = await backendResponse.json().catch(() => ({
            success: false,
            message: "Invalid JSON response from backend.",
        }));

        return NextResponse.json(body, { status: backendResponse.status });
    }

    const text = await backendResponse.text().catch(() => "");

    return NextResponse.json(
        {
            success: backendResponse.ok,
            message: text || "Unexpected response from backend.",
        },
        { status: backendResponse.status }
    );
};

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ subscriptionId: string }> }
) {
    try {
        const { subscriptionId } = await params;

        const backendResponse = await fetch(
            `${BASE_API_URL}/subscriptions/admin/payment-details/${subscriptionId}`,
            {
                method: "GET",
                headers: await buildBackendHeaders(),
                cache: "no-store",
            }
        );

        return proxyJsonResponse(backendResponse);
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to load payment subscription details.",
            },
            { status: 500 }
        );
    }
}
