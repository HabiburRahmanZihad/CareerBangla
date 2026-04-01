/* eslint-disable @typescript-eslint/no-explicit-any */

import envConfig from "@/lib/envConfig";

const FRIENDLY_MESSAGE_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
    {
        pattern: /(not yet approved|pending admin approval|still under verification|wait for admin approval)/i,
        message: "Your account is still under verification. Please wait for admin approval.",
    },
    {
        pattern: /email not verified/i,
        message: "Your email is not verified yet. Please verify your email to continue.",
    },
    {
        pattern: /(user is blocked|account has been blocked)/i,
        message: "Your account is currently blocked. Please contact support for assistance.",
    },
    {
        pattern: /(invalid credentials|incorrect password|password does not matched)/i,
        message: "The email or password you entered is incorrect.",
    },
    {
        pattern: /(access denied|not authorized|unauthorized|forbidden)/i,
        message: "You do not have permission to perform this action.",
    },
];

const getServerMessage = (error: any): string | undefined => {
    const serverMessage = error?.response?.data?.message;
    return typeof serverMessage === "string" && serverMessage.trim() ? serverMessage.trim() : undefined;
};

const getRawMessage = (error: any): string | undefined => {
    const rawMessage = error?.message;
    return typeof rawMessage === "string" && rawMessage.trim() ? rawMessage.trim() : undefined;
};

const logExactErrorInDevelopment = (error: any) => {
    if (!envConfig.isDevelopment || !error || error.__requestErrorLogged) return;

    Object.defineProperty(error, "__requestErrorLogged", {
        value: true,
        enumerable: false,
        configurable: true,
    });

    console.error("[Request Error Debug]", {
        status: error?.response?.status,
        serverMessage: getServerMessage(error),
        rawMessage: getRawMessage(error),
        error,
    });
};

const getFriendlyMessageFromPattern = (message?: string): string | undefined => {
    if (!message) return undefined;

    const normalized = message.trim();
    const match = FRIENDLY_MESSAGE_PATTERNS.find(({ pattern }) => pattern.test(normalized));
    return match?.message;
};

export const resolveRequestErrorMessage = (error: any, fallbackPrefix: string) => {
    const serverMessage = getServerMessage(error);
    const rawMessage = getRawMessage(error);
    const messageCandidate = serverMessage || rawMessage;
    const status = error?.response?.status;
    const errorCode = error?.code ?? error?.cause?.code;

    logExactErrorInDevelopment(error);

    if (envConfig.isDevelopment) {
        if (serverMessage) return serverMessage;
        if (
            errorCode === "ECONNREFUSED" ||
            errorCode === "ECONNRESET" ||
            errorCode === "ENOTFOUND" ||
            errorCode === "ETIMEDOUT" ||
            (typeof rawMessage === "string" && rawMessage.includes("socket connection was closed unexpectedly"))
        ) {
            return "Backend API is unavailable. Make sure the backend server is running and reachable.";
        }
        if (status === 429) return "Too many requests. Please wait a moment and try again.";
        if (status === 500) return "An unexpected server error occurred. Please try again later.";
        return `${fallbackPrefix}: ${rawMessage || "Unexpected error"}`;
    }

    const mappedMessage = getFriendlyMessageFromPattern(messageCandidate);
    if (mappedMessage) return mappedMessage;

    if (
        errorCode === "ECONNREFUSED" ||
        errorCode === "ECONNRESET" ||
        errorCode === "ENOTFOUND" ||
        errorCode === "ETIMEDOUT" ||
        (typeof rawMessage === "string" && rawMessage.includes("socket connection was closed unexpectedly"))
    ) {
        return "The service is temporarily unavailable. Please try again in a moment.";
    }

    if (status === 401) return "Your session has expired. Please log in again.";
    if (status === 403) return "You do not have permission to perform this action.";
    if (status === 404) return "We couldn't find what you were looking for.";
    if (status === 429) return "Too many requests. Please wait a moment and try again.";
    if (status >= 500) return "Something went wrong on our side. Please try again later.";

    if (serverMessage) return serverMessage;

    return fallbackPrefix;
};

export const normalizeRequestErrorForUi = (error: any, fallbackPrefix: string) => {
    const uiMessage = resolveRequestErrorMessage(error, fallbackPrefix);

    if (!envConfig.isDevelopment) {
        if (error?.response?.data && typeof error.response.data === "object") {
            error.response.data.message = uiMessage;
        }

        if (error && typeof error === "object") {
            error.message = uiMessage;
        }
    }

    return uiMessage;
};
