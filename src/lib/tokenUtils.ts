"use server"

import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";
import envConfig from "./envConfig";


const getTokenSecondsRemaining = (token: string): number => {
    if (!token) return 0;
    try {
        const tokenPayload = jwt.decode(token) as JwtPayload;

        if (!tokenPayload || !tokenPayload.exp) {
            return 0;
        }

        const remainingSeconds = (tokenPayload.exp as number) - Math.floor(Date.now() / 1000)

        return remainingSeconds > 0 ? remainingSeconds : 0;

    } catch (error) {
        if (envConfig.isDevelopment) {
            console.error("Error decoding token:", error);
        }
        return 0;
    }
}

export const setTokenInCookies = async (
    name: string,
    token: string,
    fallbackMaxAgeInSeconds = 60 * 60 * 24 // 1 day
) => {
    // Safety check - don't set empty or undefined tokens
    if (!token || token.trim() === "") {
        if (envConfig.isDevelopment) {
            console.error(`[setTokenInCookies] Token is empty for ${name}`);
        }
        return;
    }

    let maxAgeInSeconds = fallbackMaxAgeInSeconds;

    // Only try to decode JWT tokens (accessToken, refreshToken)
    // Session tokens from better-auth are NOT JWTs, they're random strings
    if (name !== "better-auth.session_token") {
        const decoded = getTokenSecondsRemaining(token);
        if (decoded > 0) {
            maxAgeInSeconds = decoded;
        }
    }

    if (envConfig.isDevelopment) {
        console.log(`[setTokenInCookies] Setting ${name} with maxAge: ${maxAgeInSeconds}s`);
    }

    await setCookie(name, token, maxAgeInSeconds);
}


export async function isTokenExpiringSoon(token: string, thresholdInSeconds = 300): Promise<boolean> {
    if (!token) return true;
    try {
        const remainingSeconds = getTokenSecondsRemaining(token);
        return remainingSeconds < thresholdInSeconds;
    } catch (error) {
        return true;
    }
}

export async function isTokenExpired(token: string): Promise<boolean> {
    if (!token) return true;
    try {
        const remainingSeconds = getTokenSecondsRemaining(token);
        return remainingSeconds === 0;
    } catch (error) {
        return true;
    }
}