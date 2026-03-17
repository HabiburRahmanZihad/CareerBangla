import { z } from "zod";

export const updateResumeZodSchema = z.object({
    title: z.string().optional(),
    summary: z.string().optional(),
    skills: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    linkedinUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    portfolioUrl: z.string().optional(),
});

export type IUpdateResumePayload = z.infer<typeof updateResumeZodSchema>;

export const experienceZodSchema = z.object({
    company: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
});

export const educationZodSchema = z.object({
    institution: z.string().min(1, "Institution is required"),
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    grade: z.string().optional(),
});
