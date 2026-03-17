"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAdminProfile, IJob } from "@/types/user.types";

export async function getAllAdmins(params?: Record<string, unknown>) {
    return httpClient.get<IAdminProfile[]>("/admins", { params });
}

export async function getAdminById(id: string) {
    return httpClient.get<IAdminProfile>(`/admins/${id}`);
}

export async function updateAdmin(id: string, data: Record<string, unknown>) {
    return httpClient.patch<IAdminProfile>(`/admins/${id}`, data);
}

export async function deleteAdmin(id: string) {
    return httpClient.delete<void>(`/admins/${id}`);
}

export async function getAllJobsAdmin(params?: Record<string, unknown>) {
    return httpClient.get<IJob[]>("/admins/jobs", { params });
}

export async function changeUserStatus(data: { userId: string; status: string }) {
    return httpClient.patch<void>("/admins/change-user-status", data);
}

export async function changeUserRole(data: { userId: string; role: string }) {
    return httpClient.patch<void>("/admins/change-user-role", data);
}

export async function createRecruiter(data: Record<string, unknown>) {
    return httpClient.post<void>("/users/create-recruiter", data);
}

export async function createAdmin(data: Record<string, unknown>) {
    return httpClient.post<void>("/users/create-admin", data);
}
