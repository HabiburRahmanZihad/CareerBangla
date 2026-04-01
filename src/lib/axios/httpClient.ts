
import envConfig from "@/lib/envConfig";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@/types/api.types";
import type { AxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";
import { normalizeRequestErrorForUi } from "./resolveRequestErrorMessage";

const axiosInstance = axios.create({
    baseURL: envConfig.apiBaseUrl,
    timeout: 30000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for logging
axiosInstance.interceptors.request.use(
    (config) => {
        logger.apiRequest(config.method?.toUpperCase() || "?", config.url || "");
        return config;
    },
);

// Response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => {
        logger.apiSuccess(
            response.config.method?.toUpperCase() || "?",
            response.config.url || "",
            response.status,
        );
        return response;
    },
    async (error: AxiosError) => {
        logger.apiError(
            error.config?.method?.toUpperCase() || "?",
            error.config?.url || "",
            {
                status: error.response?.status,
                message: (error.response?.data as { message?: string } | undefined)?.message || error.message,
            },
        );

        normalizeRequestErrorForUi(
            error,
            `${error.config?.method?.toUpperCase() || "REQUEST"} ${error.config?.url || ""} failed`
        );

        // Gracefully handle 401 Unauthorized across the app
        if (error.response?.status === 401) {
            const originalRequest = error.config;
            const isAuthRoute = originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/refresh-token");

            // If it's not an auth route, the session might be expired
            if (!isAuthRoute && typeof window !== 'undefined') {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login?error=session_expired';
                }
            }
        }

        return Promise.reject(error);
    }
);

export interface ApiRequestOptions {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    responseType?: AxiosRequestConfig["responseType"];
}

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await axiosInstance.get<ApiResponse<TData>>(endpoint, {
        params: options?.params,
        headers: options?.headers,
        responseType: options?.responseType,
    });
    return response.data;
};

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await axiosInstance.post<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
        responseType: options?.responseType,
    });
    return response.data;
};

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await axiosInstance.put<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
        responseType: options?.responseType,
    });
    return response.data;
};

const httpPatch = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await axiosInstance.patch<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
        responseType: options?.responseType,
    });
    return response.data;
};

const httpDelete = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await axiosInstance.delete<ApiResponse<TData>>(endpoint, {
        params: options?.params,
        headers: options?.headers,
        responseType: options?.responseType,
    });
    return response.data;
};

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
};
