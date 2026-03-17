"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { IAdminProfile, IJob } from "@/types/user.types";

export async function getAllAdmins(params?: Record<string, unknown>) {
    return serverHttpClient.get<IAdminProfile[]>("/admins", { params });
}

export async function getAdminById(id: string) {
    return serverHttpClient.get<IAdminProfile>(`/admins/${id}`);
}

export async function updateAdmin(id: string, data: Record<string, unknown>) {
    return serverHttpClient.patch<IAdminProfile>(`/admins/${id}`, data);
}

export async function deleteAdmin(id: string) {
    return serverHttpClient.delete<void>(`/admins/${id}`);
}

export async function getAllJobsAdmin(params?: Record<string, unknown>) {
    return serverHttpClient.get<IJob[]>("/admins/jobs", { params });
}

export async function changeUserStatus(data: { userId: string; status: string }) {
    return serverHttpClient.patch<void>("/admins/change-user-status", data);
}

export async function changeUserRole(data: { userId: string; role: string }) {
    return serverHttpClient.patch<void>("/admins/change-user-role", data);
}

export async function createRecruiter(data: Record<string, unknown>) {
    return serverHttpClient.post<void>("/users/create-recruiter", data);
}

export async function createAdmin(data: Record<string, unknown>) {
    return serverHttpClient.post<void>("/users/create-admin", data);
}
