"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IRecruiterProfile } from "@/types/user.types";

export async function getAllRecruiters(params?: Record<string, unknown>) {
    return httpClient.get<IRecruiterProfile[]>("/recruiters", { params });
}

export async function getRecruiterById(id: string) {
    return httpClient.get<IRecruiterProfile>(`/recruiters/${id}`);
}

export async function getMyRecruiterProfile() {
    return httpClient.get<IRecruiterProfile>("/recruiters/my-profile");
}

export async function updateMyRecruiterProfile(data: Record<string, unknown>) {
    return httpClient.patch<IRecruiterProfile>("/recruiters/update-my-profile", data);
}

export async function updateRecruiter(id: string, data: Record<string, unknown>) {
    return httpClient.patch<IRecruiterProfile>(`/recruiters/${id}`, data);
}

export async function deleteRecruiter(id: string) {
    return httpClient.delete<void>(`/recruiters/${id}`);
}

export async function approveRecruiter(id: string) {
    return httpClient.patch<IRecruiterProfile>(`/recruiters/approve/${id}`, {});
}

export async function rejectRecruiter(id: string) {
    return httpClient.patch<IRecruiterProfile>(`/recruiters/reject/${id}`, {});
}

export async function viewRecruiterEmail(recruiterId: string) {
    return httpClient.get<{ email: string }>(`/recruiters/view-email/${recruiterId}`);
}
