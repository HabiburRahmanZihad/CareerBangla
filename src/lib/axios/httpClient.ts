
import { ApiResponse } from "@/types/api.types";
import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
}

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor for better error handling
axiosInstance.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (process.env.NODE_ENV === "development") {
            console.error("[API Error]", {
                status: error.response?.status,
                message: error.message,
                data: error.response?.data,
            });
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
        if (process.env.NODE_ENV === "development") {
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
        if (process.env.NODE_ENV === "development") {
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
        if (process.env.NODE_ENV === "development") {
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
        if (process.env.NODE_ENV === "development") {
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
        if (process.env.NODE_ENV === "development") {
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
