"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";
import { IResume } from "@/types/user.types";

export async function getMyResume() {
    logger.read("Fetching my resume");
    return serverHttpClient.get<IResume & { profileCompletion: number }>("/resumes/my-resume");
}

export async function updateMyResume(data: Record<string, unknown>) {
    logger.update("Updating resume", { fields: Object.keys(data) });
    try {
        const res = await serverHttpClient.patch<IResume & { profileCompletion: number }>("/resumes/my-resume", data);
        return res;
    } catch (error: any) {
        if (error.response?.data) {
            return { success: false, ...error.response.data };
        }
        throw error;
    }
}

export async function getResumeByUserId(userId: string) {
    logger.read(`Fetching resume → userId: ${userId}`);
    return serverHttpClient.get<IResume>(`/resumes/user/${userId}`);
}

export async function getAtsScore(jobId?: string) {
    logger.read("Calculating ATS score", { jobId });
    try {
        return await serverHttpClient.post<{
            atsScore: number;
            profileCompletion: number;
            suggestions: string[];
            categories: { label: string; earned: number; max: number; suggestions: string[] }[];
            jobMatchScore?: number;
            matchedSkills?: string[];
            missingSkills?: string[];
        }>("/resumes/ats-score", { jobId });
    } catch (error) {
        return { data: null };
    }
}


export async function searchCandidates(params?: Record<string, unknown>) {
    logger.read("Searching candidates", params);
    return serverHttpClient.get<IResume[]>("/resumes/search-candidates", { params });
}
