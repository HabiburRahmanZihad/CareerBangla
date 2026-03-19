"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { IResume } from "@/types/user.types";

export async function getMyResume() {
    return serverHttpClient.get<IResume & { profileCompletion: number }>("/resumes/my-resume");
}

export async function updateMyResume(data: Record<string, unknown>) {
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
    return serverHttpClient.get<IResume>(`/resumes/user/${userId}`);
}

export async function getAtsScore(jobId?: string) {
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
    return serverHttpClient.get<IResume[]>("/resumes/search-candidates", { params });
}
