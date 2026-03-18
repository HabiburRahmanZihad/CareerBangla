import { z } from "zod";

// Personal Information Schema
export const personalInfoSchema = z.object({
    fullName: z.string().min(1, "Full name is required").optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    professionalTitle: z.string().optional(),
    contactNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    nationality: z.string().optional(),
    address: z.string().optional(),
    linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
    portfolioUrl: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
    websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

// Professional Summary Schema
export const summarySchema = z.object({
    professionalSummary: z.string().max(1000, "Summary must be less than 1000 characters").optional(),
});

// Skills Schema
export const skillsSchema = z.object({
    technicalSkills: z.array(z.string().min(1)).optional(),
    softSkills: z.array(z.string().min(1)).optional(),
    toolsAndTechnologies: z.array(z.string().min(1)).optional(),
});

// Work Experience Schema
export const workExperienceSchema = z.object({
    id: z.string().optional(),
    jobTitle: z.string().min(1, "Job title is required"),
    companyName: z.string().min(1, "Company name is required"),
    employmentType: z.string().optional(),
    location: z.string().optional(),
    startDate: z.any().transform(v => String(v)).refine(v => v.length > 0, "Start date is required"),
    endDate: z.any().transform(v => v ? String(v) : undefined).optional(),
    currentlyWorking: z.boolean().optional(),
    responsibilities: z.array(z.string().min(1)).optional(),
    achievements: z.array(z.string().min(1)).optional(),
    technologiesUsed: z.array(z.string().min(1)).optional(),
});

// Education Schema
export const educationSchema = z.object({
    id: z.string().optional(),
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    institutionName: z.string().min(1, "Institution name is required"),
    location: z.string().optional(),
    startDate: z.any().transform(v => String(v)).refine(v => v.length > 0, "Start date is required"),
    endDate: z.any().transform(v => v ? String(v) : undefined).optional(),
    currentlyStudying: z.boolean().optional(),
    cgpaOrResult: z.string().optional(),
    description: z.string().optional(),
});

// Certification Schema
export const certificationSchema = z.object({
    id: z.string().optional(),
    certificationName: z.string().min(1, "Certification name is required"),
    issuingOrganization: z.string().min(1, "Issuing organization is required"),
    issueDate: z.any().transform(v => String(v)).refine(v => v.length > 0, "Issue date is required"),
    expiryDate: z.any().transform(v => v ? String(v) : undefined).optional(),
    credentialId: z.string().optional(),
    credentialUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// Project Schema
export const projectSchema = z.object({
    id: z.string().optional(),
    projectName: z.string().min(1, "Project name is required"),
    role: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    technologiesUsed: z.array(z.string().min(1)).optional(),
    liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    startDate: z.any().transform(v => v ? String(v) : undefined).optional(),
    endDate: z.any().transform(v => v ? String(v) : undefined).optional(),
    highlights: z.array(z.string().min(1)).optional(),
});

// Language Schema
export const languageSchema = z.object({
    id: z.string().optional(),
    language: z.string().min(1, "Language is required"),
    proficiencyLevel: z.enum(["Native", "Fluent", "Intermediate", "Beginner"]),
});

// Award Schema
export const awardSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Award title is required"),
    issuer: z.string().min(1, "Award issuer is required"),
    date: z.any().transform(v => String(v)).refine(v => v.length > 0, "Date is required"),
    description: z.string().optional(),
});

// Reference Schema
export const referenceSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Reference name is required"),
    designation: z.string().optional(),
    company: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional(),
    relationship: z.string().optional(),
});

// Complete Resume Update Schema
export const updateResumeZodSchema = z.object({
    // Personal Information
    fullName: z.string().min(1, "Full name is required").optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    professionalTitle: z.string().optional(),
    contactNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    nationality: z.string().optional(),
    address: z.string().optional(),

    // URLs
    linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
    portfolioUrl: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
    websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
    profilePhoto: z.string().optional(),

    // Professional Summary
    professionalSummary: z.string().max(1000).optional(),

    // Skills
    technicalSkills: z.array(z.string().min(1)).optional(),
    softSkills: z.array(z.string().min(1)).optional(),
    toolsAndTechnologies: z.array(z.string().min(1)).optional(),

    // Nested sections
    workExperience: z.array(workExperienceSchema).optional(),
    education: z.array(educationSchema).optional(),
    certifications: z.array(certificationSchema).optional(),
    projects: z.array(projectSchema).optional(),
    languages: z.array(languageSchema).optional(),
    awards: z.array(awardSchema).optional(),
    interests: z.array(z.string().min(1)).optional(),
    references: z.array(referenceSchema).optional(),
});

// Legacy schema for backward compatibility
export const legacyUpdateResumeZodSchema = z.object({
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
export type IWorkExperience = z.infer<typeof workExperienceSchema>;
export type IEducation = z.infer<typeof educationSchema>;
export type ICertification = z.infer<typeof certificationSchema>;
export type IProject = z.infer<typeof projectSchema>;
export type ILanguage = z.infer<typeof languageSchema>;
export type IAward = z.infer<typeof awardSchema>;
export type IReference = z.infer<typeof referenceSchema>;
