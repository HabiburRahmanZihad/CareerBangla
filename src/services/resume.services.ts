"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IResume } from "@/types/user.types";

export async function getMyResume() {
    return httpClient.get<IResume & { profileCompletion: number }>("/resumes/my-resume");
}

export async function updateMyResume(data: Record<string, unknown>) {
    return httpClient.patch<IResume & { profileCompletion: number }>("/resumes/my-resume", data);
}

export async function getResumeByUserId(userId: string) {
    return httpClient.get<IResume>(`/resumes/user/${userId}`);
}

export async function getAtsScore(jobId?: string) {
    return httpClient.post<{
        atsScore: number;
        profileCompletion: number;
        suggestions: string[];
        jobMatchScore?: number;
        matchedSkills?: string[];
        missingSkills?: string[];
    }>("/resumes/ats-score", { jobId });
}

export async function searchCandidates(params?: Record<string, unknown>) {
    return httpClient.get<IResume[]>("/resumes/search-candidates", { params });
}
