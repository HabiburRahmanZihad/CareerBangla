"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IApplication } from "@/types/user.types";

export async function applyToJob(data: { jobId: string; coverLetter?: string }) {
    return httpClient.post<IApplication>("/applications/apply", data);
}

export async function getMyApplications(params?: Record<string, unknown>) {
    return httpClient.get<IApplication[]>("/applications/my-applications", { params });
}

export async function getAllApplications(params?: Record<string, unknown>) {
    return httpClient.get<IApplication[]>("/applications/all", { params });
}

export async function getApplicationsByJob(jobId: string, params?: Record<string, unknown>) {
    return httpClient.get<IApplication[]>(`/applications/job/${jobId}`, { params });
}

export async function updateApplicationStatus(id: string, data: { status: string }) {
    return httpClient.patch<IApplication>(`/applications/status/${id}`, data);
}
