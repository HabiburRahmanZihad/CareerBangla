"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createJob, getJobCategories } from "@/services/job.services";
import { getMyRecruiterProfile } from "@/services/recruiter.services";
import { createJobZodSchema } from "@/zod/job.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isFuture } from "date-fns";
import {
    AlertCircle, ArrowLeft, ArrowRight,
    Briefcase, Building2, CalendarDays,
    Check, Crown, DollarSign, FileText,
    GraduationCap, Lock, MapPin, Save,
    Send, ShieldAlert, Sparkles, Star, Tag,
    Video, Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ── helpers ──────────────────────────────────────────────────────────────────
const splitList = (value: string): string[] =>
    value.split(/,|\n/).map((item) => item.trim()).filter(Boolean);

const getFieldError = (field: { state: { meta: { isTouched: boolean; errors: unknown[] } } }): string | null => {
    if (!field.state.meta.isTouched || field.state.meta.errors.length === 0) return null;
    const firstError = field.state.meta.errors[0];
    return typeof firstError === "string" ? firstError : String(firstError);
};

const STEP_FIELDS: Record<number, string[]> = {
    1: ["title", "categoryId", "vacancies", "company", "companyAddress"],
    2: ["description", "responsibilities", "skills", "education", "experienceYears", "ageMin", "ageMax"],
    3: ["salaryMin", "salaryMax", "location", "locationType", "jobType"],
    4: ["applicationDeadline", "applicationMethod", "applicationEmail", "applicationLink", "contactPhone"],
};

const TOTAL_STEPS = 4;

const STEP_CONFIG = [
    { label: "Job & Company",      icon: Briefcase,    desc: "Basic info & company details" },
    { label: "Details & Criteria", icon: FileText,     desc: "Specs & candidate requirements" },
    { label: "Salary & Location",  icon: DollarSign,   desc: "Compensation & workplace type" },
    { label: "Application",        icon: Send,         desc: "Deadline & advanced options" },
];

// ── SectionCard ──────────────────────────────────────────────────────────────
interface SectionCardProps {
    title: string;
    icon: React.ElementType;
    accent?: string;
    children: React.ReactNode;
}

const SectionCard = ({ title, icon: Icon, accent = "from-primary to-primary/10", children }: SectionCardProps) => (
    <div className="relative rounded-2xl border border-border/40 bg-card overflow-hidden">
        <div className={`absolute left-0 inset-y-0 w-1 bg-linear-to-b ${accent}`} />
        <div className="pl-6 pr-5 py-5 space-y-4">
            <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-black text-sm tracking-wide">{title}</h3>
            </div>
            {children}
        </div>
    </div>
);

// ── StepIndicator ────────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <div className="flex items-start">
        {STEP_CONFIG.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            const Icon = step.icon;

            return (
                <div key={stepNum} className="flex items-start flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5 min-w-0">
                        <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all shrink-0",
                            isCompleted
                                ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/30"
                                : isActive
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-muted/50 border-border text-muted-foreground"
                        )}>
                            {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </div>
                        <div className="hidden sm:block text-center px-1">
                            <p className={cn(
                                "text-[10px] font-black uppercase tracking-wider leading-tight",
                                isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                            )}>{step.label}</p>
                            <p className="text-[9px] text-muted-foreground/70 mt-0.5 hidden lg:block">{step.desc}</p>
                        </div>
                    </div>
                    {idx < STEP_CONFIG.length - 1 && (
                        <div className={cn(
                            "flex-1 h-0.5 mt-5 mx-1.5 rounded-full transition-all",
                            isCompleted ? "bg-primary" : "bg-border"
                        )} />
                    )}
                </div>
            );
        })}
    </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const PostJobContent = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

    const { data: categoriesData } = useQuery({
        queryKey: ["job-categories"],
        queryFn: () => getJobCategories(),
    });

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ["my-recruiter-profile"],
        queryFn: () => getMyRecruiterProfile(),
    });

    const isVerified = (profileData?.data?.status === "APPROVED") || false;
    const profileCompletion = profileData?.data?.profileCompletion ?? 0;
    const draftStorageKey = `careerbangla.post-job-draft.${(profileData as any)?.data?.id || "recruiter"}`;
    const premiumUntil = ((profileData as any)?.data?.premiumUntil ?? (profileData as any)?.data?.user?.premiumUntil) as string | undefined;
    const rawPremium = (profileData as any)?.data?.isPremium ?? (profileData as any)?.data?.user?.isPremium;
    const hasActivePremium = Boolean(rawPremium) && (!premiumUntil || isFuture(new Date(premiumUntil)));
    // Recruiters don't need 100% completion, just need to be verified/approved
    const isProfileComplete = true;
    const canPost = isVerified && hasActivePremium;
    const isGuardLoading = profileLoading;

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: Record<string, unknown>) => createJob(data),
        onSuccess: async () => {
            if (typeof window !== "undefined") localStorage.removeItem(draftStorageKey);
            await queryClient.invalidateQueries({ queryKey: ["recruiter-jobs-by-status"] });
            await queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
            await queryClient.refetchQueries({ queryKey: ["recruiter-jobs-by-status"], type: "active" });
            toast.success("Job posted successfully!");
            router.push("/recruiter/dashboard/my-jobs/pending");
        },
        onError: (err: any) => {
            setServerError(err?.response?.data?.message || "Failed to post job");
        },
    });

    const form = useForm({
        defaultValues: {
            // 1) Basic Information
            title: "",
            categoryId: "",
            vacancies: "1",

            // 2) Company Information
            company: "",
            companyAddress: "",
            companyDescription: "",
            companyLogo: "",

            // 3) Job Details
            description: "",
            responsibilities: "",
            additionalRequirements: "",
            skills: "",

            // 4) Candidate Criteria
            education: "",
            experienceYears: "0",
            experienceLevel: "MID",
            ageMin: "",
            ageMax: "",
            genderPreference: "ANY",

            // 5) Salary & Benefits
            salaryMin: "",
            salaryMax: "",
            salaryType: "NEGOTIABLE",
            compensationBenefits: "",

            // 6) Location & Work Type
            location: "",
            locationType: "ONSITE",
            jobType: "FULL_TIME",

            // 7) Application Information
            applicationDeadline: "",
            applicationMethod: "PLATFORM",
            applicationEmail: "",
            applicationLink: "",
            contactPhone: "",

            // 8) Advanced / Optional
            featuredJob: false,
            urgentHiring: false,
            allowVideoCv: false,
            tags: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);

            if (!hasActivePremium) {
                setServerError("Only premium recruiters can post jobs. Please upgrade your subscription.");
                return;
            }

            const parsed = createJobZodSchema.safeParse(value);
            if (!parsed.success) {
                setServerError(parsed.error.issues[0]?.message || "Please check form validation errors");
                return;
            }

            const skills = splitList(value.skills);
            const responsibilities = splitList(value.responsibilities);
            const requirementLines = splitList(value.additionalRequirements);
            const benefits = splitList(value.compensationBenefits);

            const fallbackRequirements = [
                `Minimum education: ${value.education}`,
                `Experience: ${value.experienceYears} year(s)`,
            ];

            if (value.ageMin || value.ageMax) {
                fallbackRequirements.push(`Preferred age range: ${value.ageMin || "N/A"}-${value.ageMax || "N/A"}`);
            }
            if (value.genderPreference !== "ANY") {
                fallbackRequirements.push(`Gender preference: ${value.genderPreference}`);
            }
            if (value.tags) {
                fallbackRequirements.push(`Keywords: ${value.tags}`);
            }

            const requirements = requirementLines.length > 0 ? requirementLines : fallbackRequirements;

            const payload: Record<string, unknown> = {
                title: value.title,
                description: value.description,
                company: value.company,
                location: value.location,
                jobType: value.jobType,
                experience: `${value.experienceYears} years (${value.experienceLevel})`,
                education: value.education,
                skills,
                responsibilities,
                requirements,
                benefits,
                deadline: value.applicationDeadline,
                vacancies: Number(value.vacancies),
                salaryMin: value.salaryMin ? Number(value.salaryMin) : undefined,
                salaryMax: value.salaryMax ? Number(value.salaryMax) : undefined,
                categoryId: value.categoryId || undefined,

                // Additional spec fields for forward compatibility
                companyAddress: value.companyAddress,
                companyDescription: value.companyDescription || undefined,
                companyLogo: value.companyLogo || undefined,
                locationType: value.locationType,
                salaryType: value.salaryType,
                compensationBenefits: value.compensationBenefits || undefined,
                applicationMethod: value.applicationMethod,
                applicationEmail: value.applicationEmail || undefined,
                applicationLink: value.applicationLink || undefined,
                contactPhone: value.contactPhone || undefined,
                featuredJob: hasActivePremium ? value.featuredJob : false,
                urgentHiring: hasActivePremium ? value.urgentHiring : false,
                allowVideoCv: hasActivePremium ? value.allowVideoCv : false,
                tags: hasActivePremium ? splitList(value.tags) : [],
            };

            await mutateAsync(payload);
        },
    });

    const categoriesRaw = categoriesData as unknown;
    const categories = Array.isArray(categoriesRaw)
        ? categoriesRaw
        : Array.isArray((categoriesRaw as { data?: unknown })?.data)
            ? ((categoriesRaw as { data: unknown[] }).data)
            : [];
    const hasCategories = categories.length > 0;

    const activeFields = STEP_FIELDS[currentStep] || [];

    const getStepFieldError = (name: string, fallback?: string | null): string | undefined => {
        return stepErrors[name] || fallback || undefined;
    };

    const validateCurrentStep = () => {
        const parsed = createJobZodSchema.safeParse(form.state.values);
        if (parsed.success) { setStepErrors({}); return true; }
        const active = new Set(activeFields);
        const nextErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            const key = typeof issue.path[0] === "string" ? issue.path[0] : "";
            if (active.has(key) && !nextErrors[key]) nextErrors[key] = issue.message;
        }
        setStepErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleNextStep = () => {
        setServerError(null);
        if (!validateCurrentStep()) return;
        setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    };

    const handlePreviousStep = () => {
        setServerError(null);
        setStepErrors({});
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSaveDraft = () => {
        if (typeof window === "undefined") return;
        localStorage.setItem(draftStorageKey, JSON.stringify({
            values: form.state.values,
            step: currentStep,
            updatedAt: new Date().toISOString(),
        }));
        toast.success("Draft saved");
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        const rawDraft = localStorage.getItem(draftStorageKey);
        if (!rawDraft) return;
        try {
            const parsedDraft = JSON.parse(rawDraft) as { values?: Record<string, unknown>; step?: number };
            if (parsedDraft.values && typeof parsedDraft.values === "object") {
                Object.entries(parsedDraft.values).forEach(([key, value]) => {
                    form.setFieldValue(key as never, value as never);
                });
            }
            if (typeof parsedDraft.step === "number" && parsedDraft.step >= 1 && parsedDraft.step <= TOTAL_STEPS) {
                const nextStep = parsedDraft.step;
                window.setTimeout(() => setCurrentStep(nextStep), 0);
            }
        } catch {
            localStorage.removeItem(draftStorageKey);
        }
    }, [draftStorageKey, form]);

    return (
        <div className="space-y-5 max-w-4xl">

            {/* ── Hero header ───────────────────────────────────────────────── */}
            <div className="relative rounded-2xl overflow-hidden bg-card border border-border/40">
                <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
                <div className="relative px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/30 shrink-0">
                            <Briefcase className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black">Post a New Job</h1>
                            <p className="text-sm text-muted-foreground">Fill in the details to attract the right candidates</p>
                        </div>
                    </div>
                    {hasActivePremium && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black">
                            <Crown className="h-3.5 w-3.5" />
                            Premium Recruiter
                        </span>
                    )}
                </div>
            </div>

            {/* ── Guard Alerts ──────────────────────────────────────────────── */}
            {isGuardLoading ? (
                <Skeleton className="h-16 w-full rounded-2xl" />
            ) : (
                <div className="space-y-3">
                    {!isVerified && (
                        <div className="relative rounded-2xl overflow-hidden border border-destructive/20 bg-destructive/5">
                            <div className="absolute left-0 inset-y-0 w-1 bg-destructive" />
                            <div className="pl-5 pr-4 py-4 flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <ShieldAlert className="h-4 w-4 text-destructive" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-destructive">Account Not Verified</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Your account is pending admin verification. You cannot post jobs until your profile is approved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isProfileComplete && (
                        <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-amber-500/5">
                            <div className="absolute left-0 inset-y-0 w-1 bg-amber-500" />
                            <div className="pl-5 pr-4 py-4 flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-amber-600 dark:text-amber-400">Profile Incomplete ({profileCompletion}%)</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Complete your profile to 100% before posting jobs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isVerified && !hasActivePremium && (
                        <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-amber-500/5">
                            <div className="absolute left-0 inset-y-0 w-1 bg-amber-500" />
                            <div className="pl-5 pr-4 py-4 flex items-start justify-between gap-3 flex-wrap">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Lock className="h-4 w-4 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-amber-600 dark:text-amber-400">Premium Subscription Required</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Only premium recruiters can post jobs. Upgrade to start posting.
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/recruiter/dashboard/subscriptions"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition-colors shrink-0"
                                >
                                    <Sparkles className="h-3 w-3" /> Upgrade Now
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Step Indicator ────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-border/40 bg-card px-5 pt-4 pb-3">
                <StepIndicator currentStep={currentStep} />
            </div>

            {/* ── Form card ─────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">

                {/* Step header bar */}
                <div className="px-6 py-3.5 border-b border-border/40 bg-muted/20 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Step {currentStep} of {TOTAL_STEPS}</p>
                        <p className="font-black text-base mt-0.5">{STEP_CONFIG[currentStep - 1].label}</p>
                    </div>
                    {/* Mini progress bar */}
                    <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                s < currentStep ? "bg-primary w-5" : s === currentStep ? "bg-primary w-8" : "bg-border w-5"
                            )} />
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    <form
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (currentStep < TOTAL_STEPS) { handleNextStep(); return; }
                            form.handleSubmit();
                        }}
                        className="space-y-5"
                    >

                        {/* ── Step 1: Job & Company ────────────────────────── */}
                        {currentStep === 1 && (
                            <>
                                <SectionCard title="Basic Information" icon={Briefcase}>
                                    <form.Field name="title" validators={{ onChange: createJobZodSchema.shape.title }}>
                                        {(field) => (
                                            <AppField field={field} label="Job Title" placeholder="e.g. Senior React Developer" serverError={getStepFieldError("title")} />
                                        )}
                                    </form.Field>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label>Job Category</Label>
                                            <form.Field name="categoryId">
                                                {(field) => {
                                                    const error = getStepFieldError("categoryId", getFieldError(field));
                                                    return (
                                                        <>
                                                            <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                                <SelectTrigger disabled={!hasCategories}>
                                                                    <SelectValue placeholder={hasCategories ? "Select category" : "No categories available"} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {categories.filter((cat: any) => cat?.id).map((cat: any) => (
                                                                        <SelectItem key={cat.id} value={cat.id}>
                                                                            {cat.name || cat.title}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {!hasCategories && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    No categories available. You can still post without one.
                                                                </p>
                                                            )}
                                                            {error && <p className="text-sm text-destructive">{error}</p>}
                                                        </>
                                                    );
                                                }}
                                            </form.Field>
                                        </div>

                                        <form.Field name="vacancies" validators={{ onChange: createJobZodSchema.shape.vacancies }}>
                                            {(field) => (
                                                <AppField field={field} label="Number of Vacancies" type="number" placeholder="e.g. 3" serverError={getStepFieldError("vacancies")} />
                                            )}
                                        </form.Field>
                                    </div>
                                </SectionCard>

                                <SectionCard title="Company Information" icon={Building2} accent="from-blue-500 to-blue-500/10">
                                    <form.Field name="company" validators={{ onChange: createJobZodSchema.shape.company }}>
                                        {(field) => (
                                            <AppField field={field} label="Company Name" placeholder="Your company name" serverError={getStepFieldError("company")} />
                                        )}
                                    </form.Field>

                                    <form.Field name="companyAddress" validators={{ onChange: createJobZodSchema.shape.companyAddress }}>
                                        {(field) => (
                                            <AppField field={field} label="Company Address" placeholder="e.g. Banani, Dhaka" serverError={getStepFieldError("companyAddress")} />
                                        )}
                                    </form.Field>

                                    <form.Field name="companyDescription">
                                        {(field) => (
                                            <div className="space-y-1.5">
                                                <Label htmlFor={field.name}>
                                                    Company Description{" "}
                                                    <span className="font-normal text-muted-foreground">(optional)</span>
                                                </Label>
                                                <Textarea
                                                    id={field.name}
                                                    value={field.state.value}
                                                    placeholder="Short company overview..."
                                                    rows={3}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </form.Field>

                                    <form.Field name="companyLogo">
                                        {(field) => (
                                            <div className="space-y-1.5">
                                                <Label htmlFor="company-logo">
                                                    Company Logo{" "}
                                                    <span className="font-normal text-muted-foreground">(optional)</span>
                                                </Label>
                                                <Input
                                                    id="company-logo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => field.handleChange(e.target.files?.[0]?.name || "")}
                                                />
                                            </div>
                                        )}
                                    </form.Field>
                                </SectionCard>
                            </>
                        )}

                        {/* ── Step 2: Details & Criteria ───────────────────── */}
                        {currentStep === 2 && (
                            <>
                                <SectionCard title="Job Details" icon={FileText}>
                                    <form.Field name="description" validators={{ onChange: createJobZodSchema.shape.description }}>
                                        {(field) => {
                                            const error = getFieldError(field);
                                            return (
                                                <div className="space-y-1.5">
                                                    <Label htmlFor={field.name}>Job Description</Label>
                                                    <Textarea
                                                        id={field.name}
                                                        value={field.state.value}
                                                        placeholder="Describe the role, day-to-day work, team culture..."
                                                        rows={4}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                    />
                                                    {getStepFieldError("description", error) && (
                                                        <p className="text-sm text-destructive">{getStepFieldError("description", error)}</p>
                                                    )}
                                                </div>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="responsibilities" validators={{ onChange: createJobZodSchema.shape.responsibilities }}>
                                        {(field) => {
                                            const error = getFieldError(field);
                                            return (
                                                <div className="space-y-1.5">
                                                    <Label htmlFor={field.name}>
                                                        Responsibilities{" "}
                                                        <span className="font-normal text-muted-foreground text-xs">(comma or newline separated)</span>
                                                    </Label>
                                                    <Textarea
                                                        id={field.name}
                                                        value={field.state.value}
                                                        placeholder="Manage team, Write clean code, Conduct code reviews..."
                                                        rows={4}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                    />
                                                    {getStepFieldError("responsibilities", error) && (
                                                        <p className="text-sm text-destructive">{getStepFieldError("responsibilities", error)}</p>
                                                    )}
                                                </div>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="additionalRequirements">
                                        {(field) => (
                                            <div className="space-y-1.5">
                                                <Label htmlFor={field.name}>
                                                    Additional Requirements{" "}
                                                    <span className="font-normal text-muted-foreground text-xs">(optional)</span>
                                                </Label>
                                                <Textarea
                                                    id={field.name}
                                                    value={field.state.value}
                                                    placeholder="Any other requirements..."
                                                    rows={3}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </form.Field>

                                    <form.Field name="skills" validators={{ onChange: createJobZodSchema.shape.skills }}>
                                        {(field) => (
                                            <AppField field={field} label="Required Skills (comma separated)" placeholder="React, TypeScript, Node.js, PostgreSQL" serverError={getStepFieldError("skills")} />
                                        )}
                                    </form.Field>
                                </SectionCard>

                                <SectionCard title="Candidate Criteria" icon={GraduationCap} accent="from-violet-500 to-violet-500/10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <form.Field name="education" validators={{ onChange: createJobZodSchema.shape.education }}>
                                            {(field) => (
                                                <AppField field={field} label="Minimum Education" placeholder="e.g. Bachelor's in CS" serverError={getStepFieldError("education")} />
                                            )}
                                        </form.Field>

                                        <form.Field name="experienceYears" validators={{ onChange: createJobZodSchema.shape.experienceYears }}>
                                            {(field) => (
                                                <AppField field={field} label="Experience (Years)" type="number" placeholder="e.g. 2" serverError={getStepFieldError("experienceYears")} />
                                            )}
                                        </form.Field>

                                        <div className="space-y-1.5">
                                            <Label>Experience Level</Label>
                                            <form.Field name="experienceLevel">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ENTRY">Entry Level</SelectItem>
                                                            <SelectItem value="MID">Mid Level</SelectItem>
                                                            <SelectItem value="SENIOR">Senior Level</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label>Gender Preference</Label>
                                            <form.Field name="genderPreference">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ANY">Any</SelectItem>
                                                            <SelectItem value="MALE">Male</SelectItem>
                                                            <SelectItem value="FEMALE">Female</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>

                                        <form.Field name="ageMin">
                                            {(field) => (
                                                <AppField field={field} label="Minimum Age" type="number" placeholder="e.g. 21" serverError={getStepFieldError("ageMin")} />
                                            )}
                                        </form.Field>

                                        <form.Field name="ageMax">
                                            {(field) => (
                                                <AppField field={field} label="Maximum Age" type="number" placeholder="e.g. 35" serverError={getStepFieldError("ageMax")} />
                                            )}
                                        </form.Field>
                                    </div>
                                </SectionCard>
                            </>
                        )}

                        {/* ── Step 3: Salary & Location ────────────────────── */}
                        {currentStep === 3 && (
                            <>
                                <SectionCard title="Salary & Benefits" icon={DollarSign} accent="from-emerald-500 to-emerald-500/10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <form.Field name="salaryMin">
                                            {(field) => (
                                                <AppField field={field} label="Min Salary (BDT)" type="number" placeholder="e.g. 30,000" serverError={getStepFieldError("salaryMin")} />
                                            )}
                                        </form.Field>

                                        <form.Field name="salaryMax">
                                            {(field) => (
                                                <AppField field={field} label="Max Salary (BDT)" type="number" placeholder="e.g. 60,000" serverError={getStepFieldError("salaryMax")} />
                                            )}
                                        </form.Field>

                                        <div className="space-y-1.5">
                                            <Label>Salary Type</Label>
                                            <form.Field name="salaryType">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="NEGOTIABLE">Negotiable</SelectItem>
                                                            <SelectItem value="FIXED">Fixed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>
                                    </div>

                                    <form.Field name="compensationBenefits">
                                        {(field) => (
                                            <div className="space-y-1.5">
                                                <Label htmlFor={field.name}>
                                                    Benefits & Perks{" "}
                                                    <span className="font-normal text-muted-foreground text-xs">(comma separated)</span>
                                                </Label>
                                                <Textarea
                                                    id={field.name}
                                                    value={field.state.value}
                                                    placeholder="Performance bonus, Lunch, Mobile bill, Health insurance..."
                                                    rows={3}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </form.Field>
                                </SectionCard>

                                <SectionCard title="Location & Work Type" icon={MapPin} accent="from-blue-500 to-blue-500/10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <form.Field name="location" validators={{ onChange: createJobZodSchema.shape.location }}>
                                            {(field) => (
                                                <AppField field={field} label="Job Location" placeholder="e.g. Dhaka, Bangladesh" serverError={getStepFieldError("location")} />
                                            )}
                                        </form.Field>

                                        <div className="space-y-1.5">
                                            <Label>Workplace Type</Label>
                                            <form.Field name="locationType">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ONSITE">On-site</SelectItem>
                                                            <SelectItem value="REMOTE">Remote</SelectItem>
                                                            <SelectItem value="HYBRID">Hybrid</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label>Employment Type</Label>
                                            <form.Field name="jobType">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="FULL_TIME">Full-time</SelectItem>
                                                            <SelectItem value="PART_TIME">Part-time</SelectItem>
                                                            <SelectItem value="CONTRACT">Contract</SelectItem>
                                                            <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>
                                    </div>
                                </SectionCard>
                            </>
                        )}

                        {/* ── Step 4: Application ──────────────────────────── */}
                        {currentStep === 4 && (
                            <>
                                <SectionCard title="Application Information" icon={CalendarDays}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <form.Field name="applicationDeadline" validators={{ onChange: createJobZodSchema.shape.applicationDeadline }}>
                                            {(field) => (
                                                <AppField field={field} label="Application Deadline" type="date" serverError={getStepFieldError("applicationDeadline")} />
                                            )}
                                        </form.Field>

                                        <div className="space-y-1.5">
                                            <Label>Application Method</Label>
                                            <form.Field name="applicationMethod">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PLATFORM">Apply via Platform</SelectItem>
                                                            <SelectItem value="EMAIL">Email Application</SelectItem>
                                                            <SelectItem value="LINK">External Link</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>

                                        <form.Subscribe selector={(state) => state.values.applicationMethod}>
                                            {(applicationMethod) =>
                                                applicationMethod === "EMAIL" ? (
                                                    <form.Field name="applicationEmail">
                                                        {(field) => (
                                                            <AppField field={field} label="Application Email" type="email" placeholder="hr@company.com" serverError={getStepFieldError("applicationEmail")} />
                                                        )}
                                                    </form.Field>
                                                ) : null
                                            }
                                        </form.Subscribe>

                                        <form.Subscribe selector={(state) => state.values.applicationMethod}>
                                            {(applicationMethod) =>
                                                applicationMethod === "LINK" ? (
                                                    <form.Field name="applicationLink">
                                                        {(field) => (
                                                            <AppField field={field} label="Application Link" placeholder="https://..." serverError={getStepFieldError("applicationLink")} />
                                                        )}
                                                    </form.Field>
                                                ) : null
                                            }
                                        </form.Subscribe>

                                        <form.Field name="contactPhone">
                                            {(field) => (
                                                <AppField field={field} label="Contact Phone" type="tel" placeholder="+8801XXXXXXXXX" serverError={getStepFieldError("contactPhone")} />
                                            )}
                                        </form.Field>
                                    </div>
                                </SectionCard>

                                {/* Premium / Advanced Features */}
                                <div className={cn(
                                    "relative rounded-2xl border overflow-hidden",
                                    hasActivePremium
                                        ? "border-amber-500/30 bg-amber-500/5"
                                        : "border-border/40 bg-card"
                                )}>
                                    <div className={cn(
                                        "absolute left-0 inset-y-0 w-1 bg-linear-to-b",
                                        hasActivePremium ? "from-amber-500 to-amber-500/10" : "from-border to-border/10"
                                    )} />
                                    <div className="pl-6 pr-5 py-5 space-y-4">
                                        {/* Section header */}
                                        <div className="flex items-center justify-between gap-3 flex-wrap">
                                            <div className="flex items-center gap-2.5">
                                                <div className={cn(
                                                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                                                    hasActivePremium ? "bg-amber-500/20" : "bg-muted"
                                                )}>
                                                    <Crown className={cn(
                                                        "h-4 w-4",
                                                        hasActivePremium ? "text-amber-500" : "text-muted-foreground"
                                                    )} />
                                                </div>
                                                <h3 className="font-black text-sm tracking-wide">Advanced / Premium Features</h3>
                                            </div>
                                            {!hasActivePremium && (
                                                <Link
                                                    href="/recruiter/dashboard/subscriptions"
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-black hover:bg-amber-600 transition-colors shrink-0"
                                                >
                                                    <Sparkles className="h-3 w-3" /> Upgrade
                                                </Link>
                                            )}
                                        </div>

                                        {/* Lock notice */}
                                        {!hasActivePremium && (
                                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/15">
                                                <Lock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                                <p className="text-xs text-amber-700 dark:text-amber-400">
                                                    These features are exclusive to premium recruiters.{" "}
                                                    <Link href="/recruiter/dashboard/subscriptions" className="font-black underline">
                                                        Upgrade to Career Boost
                                                    </Link>
                                                </p>
                                            </div>
                                        )}

                                        {/* Toggle cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <form.Field name="featuredJob">
                                                {(field) => (
                                                    <label className={cn(
                                                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                                                        field.state.value && hasActivePremium
                                                            ? "border-amber-500/40 bg-amber-500/10"
                                                            : "border-border/40 hover:border-border/70",
                                                        !hasActivePremium && "opacity-50 cursor-not-allowed"
                                                    )}>
                                                        <Checkbox
                                                            id={field.name}
                                                            checked={field.state.value}
                                                            disabled={!hasActivePremium}
                                                            onCheckedChange={(checked) => {
                                                                if (!hasActivePremium) return;
                                                                field.handleChange(Boolean(checked));
                                                            }}
                                                        />
                                                        <div>
                                                            <p className="text-xs font-bold flex items-center gap-1">
                                                                <Star className="h-3 w-3 text-amber-500" /> Featured Job
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground mt-0.5">Highlighted listing</p>
                                                        </div>
                                                    </label>
                                                )}
                                            </form.Field>

                                            <form.Field name="urgentHiring">
                                                {(field) => (
                                                    <label className={cn(
                                                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                                                        field.state.value && hasActivePremium
                                                            ? "border-red-500/40 bg-red-500/10"
                                                            : "border-border/40 hover:border-border/70",
                                                        !hasActivePremium && "opacity-50 cursor-not-allowed"
                                                    )}>
                                                        <Checkbox
                                                            id={field.name}
                                                            checked={field.state.value}
                                                            disabled={!hasActivePremium}
                                                            onCheckedChange={(checked) => {
                                                                if (!hasActivePremium) return;
                                                                field.handleChange(Boolean(checked));
                                                            }}
                                                        />
                                                        <div>
                                                            <p className="text-xs font-bold flex items-center gap-1">
                                                                <Zap className="h-3 w-3 text-red-500" /> Urgent Hiring
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground mt-0.5">Urgency badge shown</p>
                                                        </div>
                                                    </label>
                                                )}
                                            </form.Field>

                                            <form.Field name="allowVideoCv">
                                                {(field) => (
                                                    <label className={cn(
                                                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                                                        field.state.value && hasActivePremium
                                                            ? "border-blue-500/40 bg-blue-500/10"
                                                            : "border-border/40 hover:border-border/70",
                                                        !hasActivePremium && "opacity-50 cursor-not-allowed"
                                                    )}>
                                                        <Checkbox
                                                            id={field.name}
                                                            checked={field.state.value}
                                                            disabled={!hasActivePremium}
                                                            onCheckedChange={(checked) => {
                                                                if (!hasActivePremium) return;
                                                                field.handleChange(Boolean(checked));
                                                            }}
                                                        />
                                                        <div>
                                                            <p className="text-xs font-bold flex items-center gap-1">
                                                                <Video className="h-3 w-3 text-blue-500" /> Allow Video CV
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground mt-0.5">Accept video resumes</p>
                                                        </div>
                                                    </label>
                                                )}
                                            </form.Field>
                                        </div>

                                        <form.Field name="tags">
                                            {(field) => (
                                                <div className="space-y-1.5">
                                                    <Label htmlFor={field.name} className={cn(!hasActivePremium && "opacity-50")}>
                                                        <span className="flex items-center gap-1.5">
                                                            <Tag className="h-3.5 w-3.5" />
                                                            Tags / Keywords{" "}
                                                            <span className="font-normal text-muted-foreground">(comma separated)</span>
                                                        </span>
                                                    </Label>
                                                    <AppField field={field} label="" placeholder="frontend, react, urgent, remote" disabled={!hasActivePremium} />
                                                </div>
                                            )}
                                        </form.Field>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── Server error ─────────────────────────────────── */}
                        {serverError && (
                            <div className="relative rounded-2xl overflow-hidden border border-destructive/20 bg-destructive/5">
                                <div className="absolute left-0 inset-y-0 w-1 bg-destructive" />
                                <div className="pl-5 pr-4 py-3 flex items-center gap-3">
                                    <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                                    <p className="text-sm text-destructive">{serverError}</p>
                                </div>
                            </div>
                        )}

                        {/* ── Navigation ───────────────────────────────────── */}
                        <div className="flex items-center justify-between gap-3 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePreviousStep}
                                disabled={currentStep === 1}
                                className="rounded-xl gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" /> Previous
                            </Button>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleSaveDraft}
                                    className="rounded-xl gap-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Save className="h-4 w-4" />
                                    <span className="hidden sm:inline">Save Draft</span>
                                </Button>

                                {currentStep < TOTAL_STEPS ? (
                                    <Button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="rounded-xl gap-2"
                                    >
                                        Next Step <ArrowRight className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <AppSubmitButton
                                        isPending={isPending}
                                        pendingLabel="Posting Job..."
                                        disabled={!canPost || isGuardLoading}
                                    >
                                        Post Job
                                    </AppSubmitButton>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJobContent;
