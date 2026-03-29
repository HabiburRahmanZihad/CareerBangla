

import { IResume } from "@/types/user.types";

/**
 * Helper Types & Constants
 */
export const USERS_PER_PAGE = 32;

export type CandidateListItem = {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    resume?: IResume | null;
};

/**
 * Extract data array from various response formats
 */
export const extractDataArray = <T,>(value: unknown): T[] => {
    if (Array.isArray(value)) {
        return value as T[];
    }

    if (value && typeof value === "object" && "data" in value) {
        const maybeData = (value as { data?: unknown }).data;
        if (Array.isArray(maybeData)) {
            return maybeData as T[];
        }
    }

    return [];
};

/**
 * Parse comma-separated strings into array
 */
export const parseStringList = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }

    if (typeof value === "string") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

/**
 * Get all skills from resume
 */
export const getSkills = (resume?: IResume | null): string[] => {
    if (!resume) {
        return [];
    }

    const allSkills = [
        ...parseStringList(resume.skills),
        ...parseStringList(resume.technicalSkills),
        ...parseStringList(resume.toolsAndTechnologies),
        ...parseStringList(resume.softSkills),
    ];

    return Array.from(new Set(allSkills));
};

/**
 * Get education summary from resume
 */
export const getEducationSummary = (resume?: IResume | null): string => {
    const educationList = Array.isArray(resume?.education) ? resume.education : [];
    if (educationList.length === 0) {
        return "Education not provided";
    }

    const topEducation = educationList[0];
    const degree = topEducation?.degree || "";
    const fieldOfStudy = topEducation?.fieldOfStudy || "";
    const institutionName = topEducation?.institutionName || "";

    const degreeLabel = [degree, fieldOfStudy].filter(Boolean).join(" in ");

    if (degreeLabel && institutionName) {
        return `${degreeLabel} - ${institutionName}`;
    }

    return degreeLabel || institutionName || "Education not provided";
};

/**
 * Convert various payload types to PDF Blob
 */
export const toPdfBlob = (payload: unknown): Blob => {
    if (payload instanceof Blob) {
        return payload;
    }

    if (payload instanceof ArrayBuffer) {
        return new Blob([payload], { type: "application/pdf" });
    }

    if (ArrayBuffer.isView(payload)) {
        const view = payload as ArrayBufferView;
        const byteOffset = view.byteOffset || 0;
        const byteLength = view.byteLength || 0;
        const bytes = new Uint8Array(view.buffer, byteOffset, byteLength);
        return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    }

    if (payload && typeof payload === "object" && "type" in payload && "data" in payload) {
        const maybeBuffer = payload as { type?: unknown; data?: unknown };
        if (maybeBuffer.type === "Buffer" && Array.isArray(maybeBuffer.data)) {
            return new Blob([new Uint8Array(maybeBuffer.data)], { type: "application/pdf" });
        }
    }

    return new Blob([payload as BlobPart], { type: "application/pdf" });
};
