/* eslint-disable @typescript-eslint/no-explicit-any */

export const getRequestErrorMessage = (error: any, fallbackPrefix: string) => {
    const serverMessage = error?.response?.data?.message;
    const rawMessage = error?.message;

    if (typeof serverMessage === "string" && serverMessage.trim()) {
        return serverMessage;
    }

    const errorCode = error?.code ?? error?.cause?.code;

    if (
        errorCode === "ECONNREFUSED" ||
        errorCode === "ECONNRESET" ||
        (typeof rawMessage === "string" && rawMessage.includes("socket connection was closed unexpectedly"))
    ) {
        return "Backend API is unavailable. Make sure the backend server is running and reachable.";
    }

    return `${fallbackPrefix}: ${rawMessage || "Unexpected error"}`;
};
