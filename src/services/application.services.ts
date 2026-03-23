"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";
import { IApplication } from "@/types/user.types";

export async function applyToJob(data: { jobId: string; coverLetter?: string }) {
    logger.create(`Applying to job → jobId: ${data.jobId}`);
    return serverHttpClient.post<IApplication>("/applications/apply", data);
}

export async function getMyApplications(params?: Record<string, unknown>) {
    logger.read("Fetching my applications");
    return serverHttpClient.get<IApplication[]>("/applications/my-applications", { params });
}

export async function getAllApplications(params?: Record<string, unknown>) {
    logger.read("Fetching all applications (admin)");
    return serverHttpClient.get<IApplication[]>("/applications/all", { params });
}

export async function getApplicationsByJob(jobId: string, params?: Record<string, unknown>) {
    logger.read(`Fetching applications for job → jobId: ${jobId}`);
    return serverHttpClient.get<{ applications: IApplication[]; isPremiumRecruiter: boolean }>(`/applications/job/${jobId}`, { params });
}

export async function updateApplicationStatus(id: string, data: { status: string; interviewDate?: string; interviewNote?: string }) {
    logger.update(`Updating application status → id: ${id}, status: ${data.status}`);
    return serverHttpClient.patch<IApplication>(`/applications/status/${id}`, data);
}
