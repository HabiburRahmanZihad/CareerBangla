
import "server-only";

import { ApiResponse } from "@/types/api.types";
import envConfig from "@/lib/envConfig";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ApiRequestOptions } from "./httpClient";

const axiosInstance = async () => {
    const cookieStore = await cookies();


    // Token refresh is handled by the client-side Route Handler or middleware
    // Not attempted here to avoid 401 errors and cookie issues

    const cookieHeader = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

    return axios.create({
        baseURL: envConfig.apiBaseUrl,
        timeout: 30000,
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieHeader,
        },
    });
};

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            redirect("/login");
        }
        if (error.response?.status !== 400 && envConfig.isDevelopment) {
            console.error(`GET request to ${endpoint} failed:`, error.response?.data?.message || error.message);
        }
        throw error;
    }
};

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            redirect("/login");
        }
        if (error.response?.status !== 400 && envConfig.isDevelopment) {
            console.error(`POST request to ${endpoint} failed:`, error.response?.data?.message || error.message);
        }
        throw error;
    }
};

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            redirect("/login");
        }
        if (error.response?.status !== 400 && envConfig.isDevelopment) {
            console.error(`PUT request to ${endpoint} failed:`, error.response?.data?.message || error.message);
        }
        throw error;
    }
};

const httpPatch = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            redirect("/login");
        }
        if (error.response?.status !== 400 && envConfig.isDevelopment) {
            console.error(`PATCH request to ${endpoint} failed:`, error.response?.data?.message || error.message);
        }
        throw error;
    }
};

const httpDelete = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            redirect("/login");
        }
        if (error.response?.status !== 400 && envConfig.isDevelopment) {
            console.error(`DELETE request to ${endpoint} failed:`, error.response?.data?.message || error.message);
        }
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
