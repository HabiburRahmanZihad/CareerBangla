import { z } from "zod";

const jobSchemaBase = z.object({
    // 1) Basic Information
    title: z.string().min(1, "Job title is required").min(3, "Title must be at least 3 characters"),
    categoryId: z.string().optional(),
    vacancies: z.string().min(1, "Vacancy is required"),

    // 2) Company Information
    company: z.string().min(1, "Company name is required"),
    companyAddress: z.string().min(1, "Company address is required"),
    companyDescription: z.string().optional(),
    companyLogo: z.string().optional(),

    // 3) Job Details
    description: z.string().min(1, "Job description is required").min(20, "Description must be at least 20 characters"),
    responsibilities: z.string().min(1, "Responsibilities & context is required"),
    additionalRequirements: z.string().optional(),
    skills: z.string().min(1, "At least one skill is required"),

    // 4) Candidate Criteria
    education: z.string().min(1, "Education level is required"),
    experienceYears: z.string().min(1, "Experience years is required"),
    experienceLevel: z.enum(["ENTRY", "MID", "SENIOR"]),
    ageMin: z.string().optional(),
    ageMax: z.string().optional(),
    genderPreference: z.enum(["ANY", "MALE", "FEMALE"]),

    // 5) Salary & Benefits
    salaryMin: z.string().optional(),
    salaryMax: z.string().optional(),
    salaryType: z.enum(["NEGOTIABLE", "FIXED"]),
    compensationBenefits: z.string().optional(),

    // 6) Location & Work Type
    location: z.string().min(1, "Job location is required"),
    locationType: z.enum(["REMOTE", "ONSITE", "HYBRID"]),
    jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),

    // 7) Application Information
    applicationDeadline: z.string().min(1, "Application deadline is required"),
    applicationMethod: z.enum(["PLATFORM", "EMAIL", "LINK"]),
    applicationEmail: z.string().optional(),
    applicationLink: z.string().optional(),
    contactPhone: z.string().optional(),

    // 8) Advanced / Optional
    featuredJob: z.boolean().optional(),
    urgentHiring: z.boolean().optional(),
    allowVideoCv: z.boolean().optional(),
    tags: z.string().optional(),
});

const applyJobFormRefinements = (data: z.infer<typeof jobSchemaBase>, ctx: z.RefinementCtx) => {
    const asNumber = (value?: string): number | null => {
        if (!value || value.trim() === "") return null;
        const parsed = Number(value);
        return Number.isNaN(parsed) ? null : parsed;
    };

    const salaryMin = asNumber(data.salaryMin);
    const salaryMax = asNumber(data.salaryMax);
    const vacancy = asNumber(data.vacancies);
    const years = asNumber(data.experienceYears);
    const ageMin = asNumber(data.ageMin);
    const ageMax = asNumber(data.ageMax);

    if (vacancy === null || vacancy < 1) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Vacancy must be at least 1",
            path: ["vacancies"],
        });
    }

    if (years === null || years < 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Experience years must be a valid number",
            path: ["experienceYears"],
        });
    }

    if (data.salaryType === "FIXED") {
        if (salaryMin === null || salaryMax === null) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Min and Max salary are required for fixed salary",
                path: ["salaryMin"],
            });
        }
        if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Minimum salary cannot be greater than maximum salary",
                path: ["salaryMin"],
            });
        }
    } else if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Minimum salary cannot be greater than maximum salary",
            path: ["salaryMin"],
        });
    }

    const deadline = new Date(data.applicationDeadline);
    if (Number.isNaN(deadline.getTime())) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid application deadline",
            path: ["applicationDeadline"],
        });
    } else {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (deadline <= now) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Deadline must be a future date",
                path: ["applicationDeadline"],
            });
        }
    }

    if (data.applicationMethod === "EMAIL") {
        if (!data.applicationEmail || data.applicationEmail.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Application email is required",
                path: ["applicationEmail"],
            });
        } else if (!z.string().email().safeParse(data.applicationEmail).success) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Enter a valid email address",
                path: ["applicationEmail"],
            });
        }
    }

    if (data.applicationMethod === "LINK") {
        if (!data.applicationLink || data.applicationLink.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Application link is required",
                path: ["applicationLink"],
            });
        } else if (!z.string().url().safeParse(data.applicationLink).success) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Enter a valid URL",
                path: ["applicationLink"],
            });
        }
    }

    if (data.contactPhone && !/^\+?[0-9\s-]{8,15}$/.test(data.contactPhone.trim())) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter a valid phone number",
            path: ["contactPhone"],
        });
    }

    if (ageMin !== null && ageMax !== null && ageMin > ageMax) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Minimum age cannot be greater than maximum age",
            path: ["ageMin"],
        });
    }
};

export const createJobZodSchema = jobSchemaBase.superRefine(applyJobFormRefinements);

export type ICreateJobPayload = z.infer<typeof createJobZodSchema>;

export const updateJobZodSchema = jobSchemaBase.partial();

export type IUpdateJobPayload = z.infer<typeof updateJobZodSchema>;
