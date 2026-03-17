import { z } from "zod";

export const createJobZodSchema = z.object({
    title: z.string().min(1, "Job title is required").min(3, "Title must be at least 3 characters"),
    description: z.string().min(1, "Description is required").min(20, "Description must be at least 20 characters"),
    company: z.string().min(1, "Company name is required"),
    location: z.string().min(1, "Location is required"),
    locationType: z.enum(["REMOTE", "ONSITE", "HYBRID"]),
    jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"]),
    experienceLevel: z.enum(["ENTRY", "MID", "SENIOR", "LEAD", "EXECUTIVE"]),
    skills: z.string().min(1, "At least one skill is required"),
    salaryMin: z.string().optional(),
    salaryMax: z.string().optional(),
    applicationDeadline: z.string().optional(),
    categoryId: z.string().optional(),
});

export type ICreateJobPayload = z.infer<typeof createJobZodSchema>;

export const updateJobZodSchema = createJobZodSchema.partial();

export type IUpdateJobPayload = z.infer<typeof updateJobZodSchema>;
