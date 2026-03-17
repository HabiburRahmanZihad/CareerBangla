"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { IJob, IJobCategory } from "@/types/user.types";

export async function getJobs(params?: Record<string, unknown>) {
    return serverHttpClient.get<IJob[]>("/jobs", { params });
}

export async function getJobById(id: string) {
    return serverHttpClient.get<IJob>(`/jobs/${id}`);
}

export async function getMyJobs(params?: Record<string, unknown>) {
    return serverHttpClient.get<IJob[]>("/jobs/my-jobs", { params });
}

export async function createJob(data: Record<string, unknown>) {
    return serverHttpClient.post<IJob>("/jobs", data);
}

export async function updateJob(id: string, data: Record<string, unknown>) {
    return serverHttpClient.patch<IJob>(`/jobs/${id}`, data);
}

export async function deleteJob(id: string) {
    return serverHttpClient.delete<IJob>(`/jobs/${id}`);
}

export async function getJobCategories() {
    return serverHttpClient.get<IJobCategory[]>("/jobs/categories");
}

export async function createJobCategory(data: { name: string }) {
    return serverHttpClient.post<IJobCategory>("/jobs/categories", data);
}

export async function deleteJobCategory(id: string) {
    return serverHttpClient.delete<IJobCategory>(`/jobs/categories/${id}`);
}
