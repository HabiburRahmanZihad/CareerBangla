import { z } from "zod";

// ─── Reusable primitives ─────────────────────────────────────────────────────

const PHONE_RX = /^01\d{9}$/;
const LINKEDIN_RX = /linkedin\.com/i;
const GITHUB_RX = /github\.com/i;
const URL_RX = /^https?:\/\/.+\..+/;

/** Optional string – passes when empty, validates when filled. */
const optStr = (min: number, max: number, label: string) =>
    z.string()
        .refine((v) => !v.trim() || v.trim().length >= min, { message: `${label} must be at least ${min} characters` })
        .refine((v) => !v.trim() || v.trim().length <= max, { message: `${label} must not exceed ${max} characters` });

const optUrl = (rx: RegExp, msg: string) =>
    z.string().refine((v) => !v.trim() || rx.test(v.trim()), { message: msg });

const reqStr = (min: number, max: number, label: string) =>
    z.string()
        .refine((v) => v.trim().length > 0, { message: `${label} is required` })
        .refine((v) => v.trim().length >= min, { message: `${label} must be at least ${min} characters` })
        .refine((v) => v.trim().length <= max, { message: `${label} must not exceed ${max} characters` });

const reqDate = (label: string) =>
    z.string().refine((v) => v.trim().length > 0, { message: `${label} is required` });



// ─── Per-field schemas (used by TanStack Form field-level validators) ────────
// Import these as `import { rv } from "@/zod/resume.validation"` and use as
// `validators={{ onChange: rv.fullName }}` on each <form.Field>.

export const rv = {
    // Basic Information
    fullName: optStr(2, 50, "Full Name"),
    email: z.string().refine((v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), { message: "Please enter a valid email address" }),
    professionalTitle: optStr(2, 100, "Professional Title"),
    contactNumber: z.string().refine((v) => !v.trim() || PHONE_RX.test(v.trim()), { message: "Must be 11 digits starting with 01 (e.g. 01712345678)" }),
    address: optStr(2, 200, "Address"),
    nationality: optStr(2, 50, "Nationality"),
    dateOfBirth: z.string()
        .refine((v) => !v || new Date(v) <= new Date(), { message: "Date of birth must be in the past" })
        .refine((v) => !v || new Date().getFullYear() - new Date(v).getFullYear() >= 10, { message: "You must be at least 10 years old" })
        .refine((v) => !v || new Date().getFullYear() - new Date(v).getFullYear() <= 100, { message: "Please enter a valid date of birth" }),

    // Social Profiles
    linkedinUrl: optUrl(LINKEDIN_RX, "Must be a valid LinkedIn URL"),
    githubUrl: optUrl(GITHUB_RX, "Must be a valid GitHub URL"),
    portfolioUrl: optUrl(URL_RX, "Must be a valid URL (start with http:// or https://)"),

    // Skills & Summary
    technicalSkills: optStr(0, 500, "Technical Skills"),
    softSkills: optStr(0, 500, "Soft Skills"),
    toolsAndTechnologies: optStr(0, 500, "Tools & Technologies"),
    interests: optStr(0, 500, "Interests"),
    professionalSummary: z.string()
        .refine((v) => !v.trim() || v.trim().length >= 10, { message: "Professional Summary must be at least 10 characters" })
        .refine((v) => !v.trim() || v.trim().length <= 2000, { message: "Professional Summary must not exceed 2000 characters" }),

    // Work Experience item fields
    jobTitle: reqStr(2, 100, "Job Title"),
    companyName: reqStr(2, 100, "Company"),
    responsibilities: optStr(0, 2000, "Responsibilities"),

    // Education item fields
    degree: reqStr(2, 100, "Degree"),
    institutionName: reqStr(2, 100, "Institution"),
    fieldOfStudy: optStr(2, 100, "Field of Study"),

    // Certifications
    certificationName: reqStr(2, 150, "Certification Name"),
    issuingOrganization: optStr(2, 100, "Issuing Organization"),

    // Projects
    projectName: reqStr(2, 100, "Project Name"),
    projectRole: optStr(2, 100, "Role"),
    projectDescription: optStr(0, 1000, "Description"),
    projectTechnologies: optStr(0, 500, "Technologies Used"),
    projectLiveUrl: optUrl(URL_RX, "Must be a valid URL (start with http:// or https://)"),
    projectGithubUrl: optUrl(GITHUB_RX, "Must be a valid GitHub URL"),
    projectHighlights: optStr(0, 500, "Highlights"),

    // Languages
    language: reqStr(2, 50, "Language"),
    proficiencyLevel: z.string().refine((v) => v.trim().length > 0, { message: "Proficiency is required" }),

    // Awards
    awardTitle: reqStr(2, 100, "Title"),
    awardIssuer: optStr(2, 100, "Issuer"),
    awardDescription: optStr(0, 500, "Description"),

    // References
    refName: reqStr(2, 100, "Name"),
    refDesignation: optStr(2, 100, "Designation"),
    refCompany: optStr(2, 100, "Company"),
    refRelationship: optStr(2, 100, "Relationship"),
    refEmail: z.string().refine((v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), { message: "Please enter a valid email address" }),
    refPhone: z.string().refine((v) => !v.trim() || PHONE_RX.test(v.trim()), { message: "Must be 11 digits starting with 01 (e.g. 01712345678)" }),

    // Shared date validators
    requiredDate: reqDate("Date"),
    requiredStartDate: reqDate("Start Date"),
    requiredIssueDate: reqDate("Issue Date"),
} as const;

// ─── Object-level schemas (kept for backward compat & external usage) ────────

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

export const summarySchema = z.object({
    professionalSummary: z.string().max(1000, "Summary must be less than 1000 characters").optional(),
});

export const skillsSchema = z.object({
    technicalSkills: z.array(z.string().min(1)).optional(),
    softSkills: z.array(z.string().min(1)).optional(),
    toolsAndTechnologies: z.array(z.string().min(1)).optional(),
});

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

export const certificationSchema = z.object({
    id: z.string().optional(),
    certificationName: z.string().min(1, "Certification name is required"),
    issuingOrganization: z.string().min(1, "Issuing organization is required"),
    issueDate: z.any().transform(v => String(v)).refine(v => v.length > 0, "Issue date is required"),
    expiryDate: z.any().transform(v => v ? String(v) : undefined).optional(),
    credentialId: z.string().optional(),
    credentialUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

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

export const languageSchema = z.object({
    id: z.string().optional(),
    language: z.string().min(1, "Language is required"),
    proficiencyLevel: z.enum(["Native", "Fluent", "Intermediate", "Beginner"]),
});

export const awardSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Award title is required"),
    issuer: z.string().min(1, "Award issuer is required"),
    date: z.any().transform(v => String(v)).refine(v => v.length > 0, "Date is required"),
    description: z.string().optional(),
});

export const referenceSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Reference name is required"),
    designation: z.string().optional(),
    company: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional(),
    relationship: z.string().optional(),
});

export const updateResumeZodSchema = z.object({
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
    profilePhoto: z.string().optional(),
    professionalSummary: z.string().max(1000).optional(),
    technicalSkills: z.array(z.string().min(1)).optional(),
    softSkills: z.array(z.string().min(1)).optional(),
    toolsAndTechnologies: z.array(z.string().min(1)).optional(),
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
