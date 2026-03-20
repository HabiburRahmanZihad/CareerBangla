
import { ApiResponse } from "@/types/api.types";
import envConfig from "@/lib/envConfig";
import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
    baseURL: envConfig.apiBaseUrl,
    timeout: 30000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor for better error handling
axiosInstance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        if (envConfig.isDevelopment) {
            console.error("[API Error]", {
                status: error.response?.status,
                message: error.message,
                data: error.response?.data,
            });
        }

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
}

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        if (envConfig.isDevelopment) {
            console.error(`GET request to ${endpoint} failed:`, error);
        }
        throw error;
    }
};

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        if (envConfig.isDevelopment) {
            console.error(`POST request to ${endpoint} failed:`, error);
        }
        throw error;
    }
};

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance.put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        if (envConfig.isDevelopment) {
            console.error(`PUT request to ${endpoint} failed:`, error);
        }
        throw error;
    }
};

const httpPatch = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        if (envConfig.isDevelopment) {
            console.error(`PATCH request to ${endpoint} failed:`, error);
        }
        throw error;
    }
};

const httpDelete = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        if (envConfig.isDevelopment) {
            console.error(`DELETE request to ${endpoint} failed:`, error);
        }
        throw error;
    }
};

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
};
