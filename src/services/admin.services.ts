"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";
import { IAdminProfile, IJob, IRecruiterProfile, IUserWithDetails } from "@/types/user.types";

export async function getAllAdmins(params?: Record<string, unknown>) {
    logger.read("Fetching all admins");
    return serverHttpClient.get<IAdminProfile[]>("/admins", { params });
}

export async function getAdminById(id: string) {
    logger.read(`Fetching admin → id: ${id}`);
    return serverHttpClient.get<IAdminProfile>(`/admins/${id}`);
}

export async function updateAdmin(id: string, data: Record<string, unknown>) {
    logger.update(`Updating admin → id: ${id}`);
    return serverHttpClient.patch<IAdminProfile>(`/admins/${id}`, data);
}

export async function deleteAdmin(id: string) {
    logger.delete(`Deleting admin → id: ${id}`);
    return serverHttpClient.delete<void>(`/admins/${id}`);
}

export async function getAllJobsAdmin(params?: Record<string, unknown>) {
    logger.read("Fetching all jobs (admin)");
    return serverHttpClient.get<IJob[]>("/admins/jobs", { params });
}

export async function changeUserStatus(data: { userId: string; status: string }) {
    logger.update(`Changing user status → userId: ${data.userId}, status: ${data.status}`);
    return serverHttpClient.patch<void>("/admins/change-user-status", { userId: data.userId, userStatus: data.status });
}

export async function getAllUsers(params?: Record<string, unknown>) {
    logger.read("Fetching all users (admin)");
    return serverHttpClient.get<IAdminProfile[]>("/admins/users", { params });
}

export async function changeUserRole(data: { userId: string; role: string }) {
    logger.update(`Changing user role → userId: ${data.userId}, role: ${data.role}`);
    return serverHttpClient.patch<void>("/admins/change-user-role", data);
}

export async function createRecruiter(data: Record<string, unknown>) {
    logger.create("Creating recruiter");
    return serverHttpClient.post<void>("/users/create-recruiter", data);
}

export async function getAllUsersWithDetails(params?: Record<string, unknown>) {
    logger.read("Fetching all users with details");
    return serverHttpClient.get<IUserWithDetails[]>("/admins/users-with-details", { params });
}

export async function getAllRecruitersWithDetails(params?: Record<string, unknown>) {
    logger.read("Fetching all recruiters with details");
    return serverHttpClient.get<IRecruiterProfile[]>("/admins/recruiters-with-details", { params });
}

export async function updateUser(userId: string, data: Record<string, unknown>) {
    logger.update(`Updating user → userId: ${userId}`);
    return serverHttpClient.patch(`/admins/users/${userId}`, data);
}

export async function deleteUser(userId: string) {
    logger.delete(`Deleting user → userId: ${userId}`);
    return serverHttpClient.delete(`/admins/users/${userId}`);
}

export async function updateRecruiterData(recruiterId: string, data: Record<string, unknown>) {
    logger.update(`Updating recruiter → recruiterId: ${recruiterId}`);
    return serverHttpClient.patch(`/admins/recruiters/${recruiterId}`, data);
}

export async function createAdmin(data: Record<string, unknown>) {
    logger.create("Creating admin");
    return serverHttpClient.post<void>("/users/create-admin", data);
}

export async function updateJob(jobId: string, data: Record<string, unknown>) {
    logger.update(`Updating job → jobId: ${jobId}`);
    return serverHttpClient.patch<IJob>(`/admins/jobs/${jobId}`, data);
}
