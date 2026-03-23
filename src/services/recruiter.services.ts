"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";
import { IRecruiterProfile } from "@/types/user.types";

export async function getAllRecruiters(params?: Record<string, unknown>) {
    logger.read("Fetching all recruiters");
    return serverHttpClient.get<IRecruiterProfile[]>("/recruiters", { params });
}

export async function getRecruiterById(id: string) {
    logger.read(`Fetching recruiter → id: ${id}`);
    return serverHttpClient.get<IRecruiterProfile>(`/recruiters/${id}`);
}

export async function getMyRecruiterProfile() {
    logger.read("Fetching my recruiter profile");
    return serverHttpClient.get<IRecruiterProfile>("/recruiters/my-profile");
}

export async function updateMyRecruiterProfile(data: Record<string, unknown>) {
    logger.update("Updating my recruiter profile");
    return serverHttpClient.patch<IRecruiterProfile>("/recruiters/update-my-profile", data);
}

export async function updateRecruiter(id: string, data: Record<string, unknown>) {
    logger.update(`Updating recruiter → id: ${id}`);
    return serverHttpClient.patch<IRecruiterProfile>(`/recruiters/${id}`, data);
}

export async function deleteRecruiter(id: string) {
    logger.delete(`Deleting recruiter → id: ${id}`);
    return serverHttpClient.delete<void>(`/recruiters/${id}`);
}

export async function approveRecruiter(id: string) {
    logger.update(`Approving recruiter → id: ${id}`);
    return serverHttpClient.patch<IRecruiterProfile>(`/recruiters/approve/${id}`, {});
}

export async function rejectRecruiter(id: string) {
    logger.update(`Rejecting recruiter → id: ${id}`);
    return serverHttpClient.patch<IRecruiterProfile>(`/recruiters/reject/${id}`, {});
}

export async function viewRecruiterEmail(recruiterId: string) {
    logger.read(`Viewing recruiter email → id: ${recruiterId}`);
    return serverHttpClient.get<{ email: string }>(`/recruiters/view-email/${recruiterId}`);
}
