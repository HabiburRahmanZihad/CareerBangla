"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { IRecruiterProfile } from "@/types/user.types";

export async function getAllRecruiters(params?: Record<string, unknown>) {
    return serverHttpClient.get<IRecruiterProfile[]>("/recruiters", { params });
}

export async function getRecruiterById(id: string) {
    return serverHttpClient.get<IRecruiterProfile>(`/recruiters/${id}`);
}

export async function getMyRecruiterProfile() {
    return serverHttpClient.get<IRecruiterProfile>("/recruiters/my-profile");
}

export async function updateMyRecruiterProfile(data: Record<string, unknown>) {
    return serverHttpClient.patch<IRecruiterProfile>("/recruiters/update-my-profile", data);
}

export async function updateRecruiter(id: string, data: Record<string, unknown>) {
    return serverHttpClient.patch<IRecruiterProfile>(`/recruiters/${id}`, data);
}

export async function deleteRecruiter(id: string) {
    return serverHttpClient.delete<void>(`/recruiters/${id}`);
}

export async function approveRecruiter(id: string) {
    return serverHttpClient.patch<IRecruiterProfile>(`/recruiters/approve/${id}`, {});
}

export async function rejectRecruiter(id: string) {
    return serverHttpClient.patch<IRecruiterProfile>(`/recruiters/reject/${id}`, {});
}

export async function viewRecruiterEmail(recruiterId: string) {
    return serverHttpClient.get<{ email: string }>(`/recruiters/view-email/${recruiterId}`);
}
