"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { IResume } from "@/types/user.types";

export async function getMyResume() {
    return serverHttpClient.get<IResume & { profileCompletion: number }>("/resumes/my-resume");
}

export async function updateMyResume(data: Record<string, unknown>) {
    return serverHttpClient.patch<IResume & { profileCompletion: number }>("/resumes/my-resume", data);
}

export async function getResumeByUserId(userId: string) {
    return serverHttpClient.get<IResume>(`/resumes/user/${userId}`);
}

export async function getAtsScore(jobId?: string) {
    return serverHttpClient.post<{
        atsScore: number;
        profileCompletion: number;
        suggestions: string[];
        jobMatchScore?: number;
        matchedSkills?: string[];
        missingSkills?: string[];
    }>("/resumes/ats-score", { jobId });
}

export async function searchCandidates(params?: Record<string, unknown>) {
    return serverHttpClient.get<IResume[]>("/resumes/search-candidates", { params });
}
