import { UserRole } from "@/lib/authUtils";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

// Forward declarations for circular references
export interface IApplication {
    id: string;
    userId: string;
    jobId: string;
    coverLetter?: string;
    status: "PENDING" | "SHORTLISTED" | "INTERVIEW" | "HIRED" | "REJECTED";
    interviewDate?: string;
    interviewNote?: string;
    hiredDate?: string;
    hiredCompany?: string;
    hiredDesignation?: string;
    user?: Omit<UserInfo, 'applications'> & { resume?: IResume };
    job?: IJob;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserInfo {
    id: string;
    name: string;
    email: string;
    phone?: string;
    country?: string;
    role: UserRole;
    image?: string;
    status?: UserStatus;
    emailVerified?: boolean;
    isDeleted?: boolean;
    needPasswordChange?: boolean;
    isPremium?: boolean;
    premiumUntil?: string;
    isHired?: boolean;
    referralCode?: string;
    applications?: IApplication[];
    resume?: { profilePhoto?: string | null; professionalTitle?: string | null } | null;
}

export interface IUserWithDetails extends UserInfo {
    recruiter?: IRecruiterProfile | null;
    admin?: IAdminProfile | null;
    resume?: IResume | null;
    applications?: IApplication[];
    createdAt?: string;
    updatedAt?: string;
}

export interface IRecruiterProfile {
    id: string;
    userId: string;
    name: string;
    email: string;
    contactNumber?: string;
    companyName?: string;
    companyWebsite?: string;
    companyAddress?: string;
    companyLogo?: string;
    profilePhoto?: string;
    designation?: string;
    industry?: string;
    companySize?: string;
    description?: string;
    isVerified: boolean;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    profileCompletion?: number;
    jobs?: IJob[];
    user?: UserInfo;
    createdAt?: string;
    updatedAt?: string;
}

export interface IAdminProfile {
    id: string;
    userId: string;
    name: string;
    email: string;
    contactNumber?: string;
    role?: UserRole;
    status?: UserStatus;
    user?: UserInfo;
    createdAt?: string;
    updatedAt?: string;
}

export interface IResume {
    id: string;
    userId: string;

    // Personal Information
    fullName?: string;
    email?: string;
    professionalTitle?: string;
    contactNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    address?: string;

    // URLs
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    websiteUrl?: string;
    profilePhoto?: string;

    // Professional Summary
    professionalSummary?: string;

    // Skills
    technicalSkills?: string[];
    softSkills?: string[];
    toolsAndTechnologies?: string[];

    // Legacy fields
    skills?: string[];
    title?: string;
    summary?: string;

    // Nested sections
    workExperience?: IWorkExperience[];
    education?: IEducation[];
    certifications?: ICertification[];
    projects?: IProject[];
    languages?: ILanguage[];
    awards?: IAward[];
    interests?: string[];
    references?: IReference[];

    // Legacy nested data
    experience?: IExperience[];
    certifications_legacy?: ICertification[];

    // User info
    user?: { id: string; name: string; email: string; image?: string; isPremium?: boolean };

    // Metadata
    profileCompletedAt?: string;
    createdAt?: string;
    updatedAt?: string;

    // Subscription & Premium
    isPremium?: boolean;
    profileCompletion?: number;
}

export interface IWorkExperience {
    id?: string;
    jobTitle: string;
    companyName: string;
    employmentType?: string;
    location?: string;
    startDate: string | Date;
    endDate?: string | Date;
    currentlyWorking?: boolean;
    responsibilities?: string[];
    achievements?: string[];
    technologiesUsed?: string[];
}

export interface IEducation {
    id?: string;
    degree: string;
    fieldOfStudy: string;
    institutionName: string;
    location?: string;
    startDate: string | Date;
    endDate?: string | Date;
    currentlyStudying?: boolean;
    cgpaOrResult?: string;
    description?: string;
}

export interface ICertification {
    id?: string;
    certificationName?: string;
    name?: string; // legacy
    issuer?: string;
    issuingOrganization?: string; // new field
    issueDate: string | Date;
    expiryDate?: string | Date;
    credentialId?: string;
    credentialUrl?: string;
}

export interface IProject {
    id?: string;
    projectName: string;
    role?: string;
    description: string;
    technologiesUsed?: string[];
    liveUrl?: string;
    githubUrl?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    highlights?: string[];
}

export interface ILanguage {
    id?: string;
    language: string;
    proficiencyLevel: "Native" | "Fluent" | "Intermediate" | "Beginner";
}

export interface IAward {
    id?: string;
    title: string;
    issuer: string;
    date: string | Date;
    description?: string;
}

export interface IReference {
    id?: string;
    name: string;
    designation?: string;
    company?: string;
    email?: string;
    phone?: string;
    relationship?: string;
}

// Legacy interfaces (kept for backward compatibility)
export interface IExperience {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
}
export interface IJob {
    id: string;
    recruiterId: string;
    title: string;
    description: string;
    company: string;
    location: string;
    locationType: "REMOTE" | "ONSITE" | "HYBRID";
    jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";
    experienceLevel: "ENTRY" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE";
    skills: string[];
    requirements?: string[];
    responsibilities?: string[];
    benefits?: string[];
    salaryMin?: number;
    salaryMax?: number;
    vacancies?: number;
    experience?: string;
    education?: string;
    applicationDeadline?: string;
    deadline?: string;
    featuredJob?: boolean;
    urgentHiring?: boolean;
    allowVideoCv?: boolean;
    tags?: string[];
    status: "PENDING" | "LIVE" | "CLOSED" | "INACTIVE";
    isDeleted: boolean;
    category?: IJobCategory;
    categoryId?: string;
    recruiter?: IRecruiterProfile & { user?: UserInfo };
    _count?: { applications: number };
    createdAt?: string;
    updatedAt?: string;
}

export interface IJobCategory {
    id: string;
    title: string;
    icon?: string;
    createdAt?: string;
    _count?: {
        jobs: number;
    };
}

export interface INotification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
    isRead: boolean;
    createdAt?: string;
}

export interface ISubscriptionPlan {
    id: string;
    name: string;
    price: number;
    features: string[];
    duration: number;
    isActive: boolean;
}

export interface ISubscription {
    id: string;
    userId: string;
    planId: string;
    plan?: ISubscriptionPlan;
    status: "ACTIVE" | "CANCELLED" | "EXPIRED";
    startDate: string;
    endDate: string;
    createdAt?: string;
}

export type CouponType =
    | "FREE_DAYS"
    | "LIFETIME_FREE"
    | "PERCENT_DISCOUNT"
    | "AMOUNT_DISCOUNT"
    | "RECRUITER_DAYS"
    | "RECRUITER_MONTHS"
    | "REFERRAL";

export type CouponTargetRole = "USER" | "RECRUITER" | "BOTH";
export type CouponStatus = "ACTIVE" | "USED" | "EXPIRED";

export interface ICouponUsage {
    id: string;
    couponId: string;
    userId: string;
    usedAt: string;
}

export interface ICoupon {
    id: string;
    code: string;
    type: CouponType;
    targetRole: CouponTargetRole;
    description?: string;
    discountPercent?: number;
    discountAmount?: number;
    isLifetime: boolean;
    freeDays?: number;
    freeMonths?: number;
    commissionAmount?: number;
    linkedRecruiterId?: string;
    maxUsage: number;
    usageCount: number;
    status: CouponStatus;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
    usages?: ICouponUsage[];
}
