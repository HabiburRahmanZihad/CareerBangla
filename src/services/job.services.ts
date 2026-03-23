"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";
import { IJob, IJobCategory } from "@/types/user.types";

export async function getJobs(params?: Record<string, unknown>) {
    logger.read("Fetching jobs", params);
    return serverHttpClient.get<IJob[]>("/jobs", { params });
}

export async function getJobById(id: string) {
    logger.read(`Fetching job → id: ${id}`);
    return serverHttpClient.get<IJob>(`/jobs/${id}`);
}

export async function getMyJobs(params?: Record<string, unknown>) {
    logger.read("Fetching my jobs", params);
    return serverHttpClient.get<IJob[]>("/jobs/my-jobs", { params });
}

export async function createJob(data: Record<string, unknown>) {
    logger.create("Creating job", { title: data.title });
    return serverHttpClient.post<IJob>("/jobs", data);
}

export async function updateJob(id: string, data: Record<string, unknown>) {
    logger.update(`Updating job → id: ${id}`);
    return serverHttpClient.patch<IJob>(`/jobs/${id}`, data);
}

export async function deleteJob(id: string) {
    logger.delete(`Deleting job → id: ${id}`);
    return serverHttpClient.delete<IJob>(`/jobs/${id}`);
}

export async function getJobCategories() {
    logger.read("Fetching job categories");
    return serverHttpClient.get<IJobCategory[]>("/jobs/categories");
}

export async function createJobCategory(data: { name: string }) {
    logger.create(`Creating job category → name: ${data.name}`);
    return serverHttpClient.post<IJobCategory>("/jobs/categories", data);
}

export async function deleteJobCategory(id: string) {
    logger.delete(`Deleting job category → id: ${id}`);
    return serverHttpClient.delete<IJobCategory>(`/jobs/categories/${id}`);
}
