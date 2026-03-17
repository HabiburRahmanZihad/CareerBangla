"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IJob, IJobCategory } from "@/types/user.types";

export async function getJobs(params?: Record<string, unknown>) {
    return httpClient.get<IJob[]>("/jobs", { params });
}

export async function getJobById(id: string) {
    return httpClient.get<IJob>(`/jobs/${id}`);
}

export async function getMyJobs(params?: Record<string, unknown>) {
    return httpClient.get<IJob[]>("/jobs/my-jobs", { params });
}

export async function createJob(data: Record<string, unknown>) {
    return httpClient.post<IJob>("/jobs", data);
}

export async function updateJob(id: string, data: Record<string, unknown>) {
    return httpClient.patch<IJob>(`/jobs/${id}`, data);
}

export async function deleteJob(id: string) {
    return httpClient.delete<IJob>(`/jobs/${id}`);
}

export async function getJobCategories() {
    return httpClient.get<IJobCategory[]>("/jobs/categories");
}

export async function createJobCategory(data: { name: string }) {
    return httpClient.post<IJobCategory>("/jobs/categories", data);
}

export async function deleteJobCategory(id: string) {
    return httpClient.delete<IJobCategory>(`/jobs/categories/${id}`);
}
