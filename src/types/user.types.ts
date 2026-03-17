import { UserRole } from "@/lib/authUtils";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface UserInfo {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string;
    status?: UserStatus;
    emailVerified?: boolean;
    isDeleted?: boolean;
    needPasswordChange?: boolean;
}

export interface IUserWithDetails extends UserInfo {
    recruiter?: IRecruiterProfile | null;
    admin?: IAdminProfile | null;
    resume?: IResume | null;
    wallet?: IWallet | null;
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
    designation?: string;
    isVerified: boolean;
    profileCompletion?: number;
    jobs?: IJob[];
    createdAt?: string;
    updatedAt?: string;
}

export interface IAdminProfile {
    id: string;
    userId: string;
    name: string;
    email: string;
    contactNumber?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IResume {
    id: string;
    userId: string;
    title?: string;
    summary?: string;
    skills?: string[];
    experience?: IExperience[];
    education?: IEducation[];
    certifications?: ICertification[];
    languages?: string[];
    contactNumber?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    profileCompletedAt?: string;
    user?: { id: string; name: string; email: string; image?: string };
    createdAt?: string;
    updatedAt?: string;
}

export interface IExperience {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
}

export interface IEducation {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    grade?: string;
}

export interface ICertification {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialUrl?: string;
}

export interface IWallet {
    id: string;
    userId: string;
    balance: number;
    transactions?: ICoinTransaction[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ICoinTransaction {
    id: string;
    walletId: string;
    amount: number;
    type: "CREDIT" | "DEBIT";
    purpose: string;
    details?: string;
    createdAt?: string;
}

export interface IJob {
    id: string;
    recruiterId: string;
    title: string;
    description: string;
    company: string;
    location: string;
    locationType: "REMOTE" | "ONSITE" | "HYBRID";
    jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
    experienceLevel: "ENTRY" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE";
    skills: string[];
    salaryMin?: number;
    salaryMax?: number;
    applicationDeadline?: string;
    status: "OPEN" | "CLOSED" | "DRAFT" | "PAUSED";
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
    name: string;
    createdAt?: string;
}

export interface IApplication {
    id: string;
    userId: string;
    jobId: string;
    coverLetter?: string;
    status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "ACCEPTED" | "WITHDRAWN";
    user?: UserInfo & { resume?: IResume };
    job?: IJob;
    createdAt?: string;
    updatedAt?: string;
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
    coins: number;
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

export interface ICoupon {
    id: string;
    code: string;
    discount: number;
    maxUses: number;
    usedCount: number;
    expiresAt: string;
    isActive: boolean;
}
