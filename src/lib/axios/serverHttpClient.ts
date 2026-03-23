
import "server-only";

import { ApiResponse } from "@/types/api.types";
import envConfig from "@/lib/envConfig";
import { logger } from "@/lib/logger";
import axios from "axios";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ApiRequestOptions } from "./httpClient";

const axiosInstance = async () => {
    // Use raw Cookie header from the incoming request to preserve exact encoding
    // This prevents session token corruption from decode/re-encode cycles
    const headersList = await headers();
    const rawCookieHeader = headersList.get("cookie") || "";

    // Extract session token and send as Bearer so backend's bearer() plugin
    // can properly sign it (plain cookies fail better-auth signature check)
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const reqHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Cookie: rawCookieHeader,
    };
    if (sessionToken) {
        reqHeaders["Authorization"] = `Bearer ${sessionToken}`;
    }

    return axios.create({
        baseURL: envConfig.apiBaseUrl,
        timeout: 30000,
        headers: reqHeaders,
    });
};

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        logger.apiRequest("GET", endpoint);
        const instance = await axiosInstance();
        const response = await instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        logger.apiSuccess("GET", endpoint, response.status);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            redirect("/login");
        }
        logger.apiError("GET", endpoint, { status: error.response?.status, message: error.response?.data?.message || error.message });
        throw error;
    }
};

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        logger.apiRequest("POST", endpoint);
        const instance = await axiosInstance();
        const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        logger.apiSuccess("POST", endpoint, response.status);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            redirect("/login");
        }
        logger.apiError("POST", endpoint, { status: error.response?.status, message: error.response?.data?.message || error.message });
        throw error;
    }
};

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        logger.apiRequest("PUT", endpoint);
        const instance = await axiosInstance();
        const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        logger.apiSuccess("PUT", endpoint, response.status);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            redirect("/login");
        }
        logger.apiError("PUT", endpoint, { status: error.response?.status, message: error.response?.data?.message || error.message });
        throw error;
    }
};

const httpPatch = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        logger.apiRequest("PATCH", endpoint);
        const instance = await axiosInstance();
        const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        logger.apiSuccess("PATCH", endpoint, response.status);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            redirect("/login");
        }
        logger.apiError("PATCH", endpoint, { status: error.response?.status, message: error.response?.data?.message || error.message });
        throw error;
    }
};

const httpDelete = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        logger.apiRequest("DELETE", endpoint);
        const instance = await axiosInstance();
        const response = await instance.delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        logger.apiSuccess("DELETE", endpoint, response.status);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            redirect("/login");
        }
        logger.apiError("DELETE", endpoint, { status: error.response?.status, message: error.response?.data?.message || error.message });
        throw error;
    }
};

export const serverHttpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
};
