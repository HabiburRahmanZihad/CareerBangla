/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { registerRecruiter } from "@/services/public-auth.services";
import { IRecruiterRegisterPayload, recruiterRegisterZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Briefcase,
    Building2,
    CheckCircle2,
    Eye,
    EyeOff,
    Globe,
    Mail,
    MapPin,
    Phone,
    Sparkles,
    Upload,
    User,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

// ── Constants ─────────────────────────────────────────────────────────────────
const INDUSTRIES = [
    "Technology", "Finance", "Healthcare", "E-commerce", "Manufacturing",
    "Education", "Hospitality", "Real Estate", "Energy", "Retail",
    "Media & Entertainment", "Telecommunications", "Transportation", "Agriculture", "Other",
];

const COMPANY_SIZES = [
    "1-10 employees", "11-50 employees", "51-200 employees",
    "201-500 employees", "501-1000 employees", "1000+ employees",
];

const STEPS = [
    { id: "personal", label: "Personal", icon: User },
    { id: "company", label: "Company", icon: Building2 },
    { id: "additional", label: "Additional", icon: Sparkles },
];

// ── Password strength ─────────────────────────────────────────────────────────
const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
        { label: "Very Weak", color: "bg-red-500" },
        { label: "Weak", color: "bg-orange-500" },
        { label: "Fair", color: "bg-yellow-500" },
        { label: "Good", color: "bg-blue-500" },
        { label: "Strong", color: "bg-green-500" },
        { label: "Very Strong", color: "bg-emerald-500" },
    ];
    return { score, ...map[score] };
};

// ── Styled Select ─────────────────────────────────────────────────────────────
interface StyledSelectProps {
    value: string;
    onChange: (v: string) => void;
    onBlur?: () => void;
    options: string[];
    placeholder: string;
    label: string;
    required?: boolean;
    error?: string;
}

const StyledSelect = ({ value, onChange, onBlur, options, placeholder, label, required, error }: StyledSelectProps) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
            {label}{required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        <div className="relative">
            <select
                title={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                className="w-full h-10 pl-3 pr-8 rounded-xl border border-border/60 bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 appearance-none cursor-pointer transition"
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
);

// ── Upload Zone ───────────────────────────────────────────────────────────────
interface UploadZoneProps {
    preview: string | null;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    label: string;
    hint?: string;
    circular?: boolean;
}

const UploadZone = ({ preview, onUpload, onRemove, label, hint, circular }: UploadZoneProps) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className="flex items-start gap-4">
            {preview ? (
                <div className="relative shrink-0">
                    <Image
                        src={preview}
                        alt={label}
                        width={80}
                        height={80}
                        className={`object-cover border-2 border-border/60 ${circular ? "rounded-full" : "rounded-xl"}`}
                    />
                    <button
                        type="button"
                        title="Remove image"
                        onClick={onRemove}
                        className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center shadow-sm hover:bg-destructive/80 transition"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            ) : (
                <label className={`relative shrink-0 flex flex-col items-center justify-center h-20 w-20 border-2 border-dashed border-border/60 bg-muted/30 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition ${circular ? "rounded-full" : "rounded-xl"}`}>
                    <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground font-medium">Upload</span>
                    <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
                </label>
            )}
            <div className="text-xs text-muted-foreground space-y-0.5 pt-1">
                <p>{hint || "JPG, PNG, GIF"}</p>
                <p>Max 5MB</p>
            </div>
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const ComprehensiveRecruiterRegisterForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState(0);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
    const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (payload: IRecruiterRegisterPayload) => {
            const formData = new FormData();
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== null && value !== undefined && typeof value === "string") {
                    formData.append(key, value);
                }
            });
            if (profilePhotoFile) formData.append("profilePhotoFile", profilePhotoFile);
            if (companyLogoFile) formData.append("companyLogoFile", companyLogoFile);
            return registerRecruiter(formData);
        },
    });

    const form = useForm({
        defaultValues: {
            name: "", email: "", password: "", designation: "", profilePhoto: "",
            companyName: "", industry: "", companyWebsite: "", companyAddress: "",
            companySize: "", description: "", companyLogo: "", contactNumber: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = (await mutateAsync(value)) as any;
                if (result.success) {
                    setSuccess(true);
                } else {
                    setServerError(result.message || "Registration failed");
                }
            } catch (error: any) {
                setServerError(error?.response?.data?.message || error.message || "Registration failed");
            }
        },
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "logo") => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error("File size must be less than 5MB"); return; }
        if (!file.type.startsWith("image/")) { toast.error("Please upload a valid image file"); return; }
        const reader = new FileReader();
        reader.onloadend = () => {
            const preview = reader.result as string;
            if (type === "profile") {
                setProfilePhotoFile(file); setProfilePhotoPreview(preview);
                form.setFieldValue("profilePhoto", file.name);
            } else {
                setCompanyLogoFile(file); setCompanyLogoPreview(preview);
                form.setFieldValue("companyLogo", file.name);
            }
        };
        reader.readAsDataURL(file);
    };

    // ── Success state ──────────────────────────────────────────────────────────
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="pointer-events-none fixed inset-0 bg-linear-to-br from-primary/8 via-background to-background" />
                <div className="pointer-events-none fixed top-0 right-0 h-96 w-96 rounded-full bg-primary/6 blur-3xl" />

                <div className="relative z-10 w-full max-w-md text-center space-y-6">
                    {/* Logo */}
                    <Link href="/">
                        <Image
                            src="/carrerBanglalogo.png"
                            alt="CareerBangla"
                            width={158}
                            height={48}
                            priority
                            className="object-contain"
                        />
                    </Link>

                    <div className="backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 p-10 space-y-5">
                        <div className="h-16 w-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Application Submitted!</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Your recruiter account has been created and is <strong>pending admin approval</strong>. You&apos;ll be notified once approved and can log in to start posting jobs.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                            <Link href="/login">
                                <Button className="w-full gap-2">
                                    Go to Login <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                                    Back to Homepage
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-start px-4 py-10">
            {/* Background */}
            <div className="pointer-events-none fixed inset-0 bg-linear-to-br from-primary/8 via-background to-background" />
            <div className="pointer-events-none fixed top-0 right-0 h-96 w-96 rounded-full bg-primary/6 blur-3xl" />
            <div className="pointer-events-none fixed bottom-0 left-0 h-64 w-64 rounded-full bg-primary/4 blur-2xl" />

            <div className="relative z-10 w-full max-w-2xl">

                {/* ── Brand header ──────────────────────────────────────────── */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/">
                        <Image
                            src="/carrerBanglalogo.png"
                            alt="CareerBangla"
                            width={158}
                            height={48}
                            priority
                            className="object-contain"
                        />
                    </Link>
                    <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Job Seeker Register
                    </Link>
                </div>

                {/* ── Page heading ──────────────────────────────────────────── */}
                <div className="text-center mb-8 space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-semibold text-primary tracking-wide uppercase">Recruiter Registration</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        Start hiring the best talent
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        Create your recruiter account and post jobs to thousands of qualified candidates in Bangladesh.
                    </p>
                </div>

                {/* ── Step indicator ────────────────────────────────────────── */}
                <div className="flex items-center justify-center gap-0 mb-6">
                    {STEPS.map((step, index) => {
                        const isCompleted = index < activeStep;
                        const isActive = index === activeStep;
                        const StepIcon = step.icon;
                        return (
                            <div key={step.id} className="flex items-center">
                                {/* Step bubble */}
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => index < activeStep && setActiveStep(index)}
                                        className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all font-bold text-sm ${isCompleted
                                            ? "bg-primary border-primary text-primary-foreground cursor-pointer hover:opacity-80"
                                            : isActive
                                                ? "bg-background border-primary text-primary shadow-md shadow-primary/20"
                                                : "bg-background border-border text-muted-foreground cursor-default"
                                            }`}
                                    >
                                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <StepIcon className="h-4 w-4" />}
                                    </button>
                                    <span className={`text-xs font-medium mt-1 ${isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-muted-foreground"}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {/* Connector */}
                                {index < STEPS.length - 1 && (
                                    <div className={`h-0.5 w-20 sm:w-32 mx-2 mb-5 rounded-full transition-all ${index < activeStep ? "bg-primary" : "bg-border"}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ── Form card ─────────────────────────────────────────────── */}
                <div className="backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">

                    {/* Card header */}
                    <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-border/40">
                        <div className="flex items-center gap-3">
                            {(() => {
                                const CurrentIcon = STEPS[activeStep].icon;
                                return (
                                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <CurrentIcon className="h-4 w-4 text-primary" />
                                    </div>
                                );
                            })()}
                            <div>
                                <h2 className="text-lg font-bold">
                                    {activeStep === 0 && "Personal Information"}
                                    {activeStep === 1 && "Company Information"}
                                    {activeStep === 2 && "Additional Details"}
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    {activeStep === 0 && "Tell us about yourself"}
                                    {activeStep === 1 && "Tell us about your company"}
                                    {activeStep === 2 && "Optional details to complete your profile"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card body */}
                    <form
                        method="POST"
                        action="#"
                        noValidate
                        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
                    >
                        <div className="px-6 sm:px-8 py-6">

                            {/* Server error */}
                            {serverError && (
                                <Alert variant="destructive" className="border-destructive/40 bg-destructive/5 mb-5">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">{serverError}</AlertDescription>
                                </Alert>
                            )}

                            {/* ── Step 0: Personal ── */}
                            {activeStep === 0 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <form.Field
                                            name="name"
                                            validators={{ onChange: recruiterRegisterZodSchema.shape.name }}
                                        >
                                            {(field) => (
                                                <AppField
                                                    field={field}
                                                    label="Full Name *"
                                                    type="text"
                                                    placeholder="Your full name"
                                                />
                                            )}
                                        </form.Field>

                                        <form.Field
                                            name="designation"
                                        >
                                            {(field) => (
                                                <AppField
                                                    field={field}
                                                    label="Designation"
                                                    type="text"
                                                    placeholder="e.g. HR Manager"
                                                />
                                            )}
                                        </form.Field>
                                    </div>

                                    <form.Field
                                        name="email"
                                        validators={{ onChange: recruiterRegisterZodSchema.shape.email }}
                                    >
                                        {(field) => (
                                            <AppField
                                                field={field}
                                                label="Email Address *"
                                                type="email"
                                                placeholder="you@company.com"
                                            />
                                        )}
                                    </form.Field>

                                    <form.Field
                                        name="contactNumber"
                                    >
                                        {(field) => (
                                            <AppField
                                                field={field}
                                                label="Contact Number"
                                                type="tel"
                                                placeholder="01XXXXXXXXX"
                                            />
                                        )}
                                    </form.Field>

                                    <form.Field
                                        name="password"
                                        validators={{ onChange: recruiterRegisterZodSchema.shape.password }}
                                    >
                                        {(field) => {
                                            const pwd = field.state.value;
                                            const s = getPasswordStrength(pwd);
                                            return (
                                                <div className="space-y-2">
                                                    <AppField
                                                        field={field}
                                                        label="Password *"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Create a strong password"
                                                        append={
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword((v) => !v)}
                                                                className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                                            >
                                                                {showPassword
                                                                    ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                                                                    : <Eye className="h-4 w-4" aria-hidden="true" />
                                                                }
                                                            </button>
                                                        }
                                                    />
                                                    {pwd.length > 0 && (
                                                        <div className="space-y-1">
                                                            <div className="flex gap-1">
                                                                {[1, 2, 3, 4, 5].map((level) => (
                                                                    <div
                                                                        key={level}
                                                                        className={`h-1 flex-1 rounded-full transition-all ${s.score >= level ? s.color : "bg-muted"}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <p className={`text-xs font-medium ${s.color.replace("bg-", "text-")}`}>
                                                                {s.label}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }}
                                    </form.Field>

                                    {/* Profile Photo */}
                                    <UploadZone
                                        preview={profilePhotoPreview}
                                        onUpload={(e) => handleImageUpload(e, "profile")}
                                        onRemove={() => { setProfilePhotoPreview(null); setProfilePhotoFile(null); form.setFieldValue("profilePhoto", ""); }}
                                        label="Profile Photo"
                                        circular
                                    />
                                </div>
                            )}

                            {/* ── Step 1: Company ── */}
                            {activeStep === 1 && (
                                <div className="space-y-4">
                                    <form.Field
                                        name="companyName"
                                        validators={{ onChange: recruiterRegisterZodSchema.shape.companyName }}
                                    >
                                        {(field) => (
                                            <AppField
                                                field={field}
                                                label="Company Name *"
                                                type="text"
                                                placeholder="Your company name"
                                            />
                                        )}
                                    </form.Field>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <form.Field
                                            name="industry"
                                            validators={{ onChange: recruiterRegisterZodSchema.shape.industry }}
                                        >
                                            {(field) => (
                                                <StyledSelect
                                                    value={field.state.value}
                                                    onChange={field.handleChange}
                                                    onBlur={field.handleBlur}
                                                    options={INDUSTRIES}
                                                    placeholder="Select industry"
                                                    label="Industry"
                                                    required
                                                    error={field.state.meta.errors?.[0] ? String(field.state.meta.errors[0]) : undefined}
                                                />
                                            )}
                                        </form.Field>

                                        <form.Field
                                            name="companySize"
                                        >
                                            {(field) => (
                                                <StyledSelect
                                                    value={field.state.value}
                                                    onChange={field.handleChange}
                                                    onBlur={field.handleBlur}
                                                    options={COMPANY_SIZES}
                                                    placeholder="Select company size"
                                                    label="Company Size"
                                                    error={field.state.meta.errors?.[0] ? String(field.state.meta.errors[0]) : undefined}
                                                />
                                            )}
                                        </form.Field>
                                    </div>

                                    <form.Field
                                        name="companyWebsite"
                                    >
                                        {(field) => (
                                            <AppField
                                                field={field}
                                                label="Company Website"
                                                type="text"
                                                placeholder="https://yourcompany.com"
                                            />
                                        )}
                                    </form.Field>

                                    <form.Field
                                        name="companyAddress"
                                    >
                                        {(field) => (
                                            <AppField
                                                field={field}
                                                label="Company Address"
                                                type="text"
                                                placeholder="Dhaka, Bangladesh"
                                            />
                                        )}
                                    </form.Field>
                                </div>
                            )}

                            {/* ── Step 2: Additional ── */}
                            {activeStep === 2 && (
                                <div className="space-y-4">
                                    {/* About Company */}
                                    <form.Field
                                        name="description"
                                    >
                                        {(field) => (
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-foreground">About Company</label>
                                                <textarea
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    onBlur={field.handleBlur}
                                                    placeholder="Tell candidates what makes your company great — culture, mission, benefits..."
                                                    maxLength={500}
                                                    rows={5}
                                                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 resize-none transition placeholder:text-muted-foreground/60"
                                                />
                                                <div className="flex justify-end">
                                                    <span className="text-xs text-muted-foreground">
                                                        {field.state.value?.length || 0}/500
                                                    </span>
                                                </div>
                                                {field.state.meta.errors?.length ? (
                                                    <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                                                ) : null}
                                            </div>
                                        )}
                                    </form.Field>

                                    {/* Company Logo */}
                                    <UploadZone
                                        preview={companyLogoPreview}
                                        onUpload={(e) => handleImageUpload(e, "logo")}
                                        onRemove={() => { setCompanyLogoPreview(null); setCompanyLogoFile(null); form.setFieldValue("companyLogo", ""); }}
                                        label="Company Logo"
                                        hint="JPG, PNG, SVG"
                                    />

                                    {/* Preview card */}
                                    <div className="rounded-xl border border-border/40 bg-muted/20 p-4">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Profile Preview</p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-border/40">
                                                {profilePhotoPreview
                                                    ? <Image src={profilePhotoPreview} alt="Profile" width={48} height={48} className="object-cover w-full h-full" />
                                                    : <User className="h-5 w-5 text-primary/50" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <form.Subscribe selector={(s) => [s.values.name, s.values.designation, s.values.companyName, s.values.industry, s.values.companyWebsite, s.values.contactNumber] as const}>
                                                    {([name, designation, companyName, industry, website, contact]) => (
                                                        <div className="space-y-0.5">
                                                            <p className="text-sm font-semibold truncate">{name || "Your Name"}</p>
                                                            <p className="text-xs text-muted-foreground truncate">{designation || "Designation"}</p>
                                                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                                                                {companyName && (
                                                                    <span className="text-xs text-foreground/70 flex items-center gap-1">
                                                                        <Building2 className="h-3 w-3" />{companyName}{industry ? ` · ${industry}` : ""}
                                                                    </span>
                                                                )}
                                                                {website && (
                                                                    <span className="text-xs text-primary/70 flex items-center gap-1 truncate">
                                                                        <Globe className="h-3 w-3 shrink-0" />{website.replace(/^https?:\/\//, "")}
                                                                    </span>
                                                                )}
                                                                {contact && (
                                                                    <span className="text-xs text-foreground/60 flex items-center gap-1">
                                                                        <Phone className="h-3 w-3" />{contact}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </form.Subscribe>
                                            </div>
                                            {companyLogoPreview && (
                                                <div className="h-10 w-10 rounded-lg border border-border/40 overflow-hidden shrink-0">
                                                    <Image src={companyLogoPreview} alt="Logo" width={40} height={40} className="object-cover w-full h-full" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Navigation footer ───────────────────────────── */}
                        <div className="px-6 sm:px-8 py-5 bg-muted/20 border-t border-border/40 flex items-center justify-between gap-3">
                            {activeStep > 0 ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setActiveStep((s) => s - 1)}
                                    className="gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" /> Previous
                                </Button>
                            ) : (
                                <div />
                            )}

                            <div className="flex items-center gap-1.5">
                                {STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all ${i === activeStep ? "w-6 bg-primary" : i < activeStep ? "w-3 bg-primary/50" : "w-3 bg-muted"}`}
                                    />
                                ))}
                            </div>

                            {activeStep < STEPS.length - 1 ? (
                                <Button
                                    type="button"
                                    onClick={() => setActiveStep((s) => s + 1)}
                                    className="gap-2"
                                >
                                    Next <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                                    {([canSubmit, isSubmitting]) => (
                                        <AppSubmitButton
                                            isPending={isSubmitting || isPending}
                                            pendingLabel="Creating account…"
                                            disabled={!canSubmit}
                                            className="w-auto gap-2"
                                        >
                                            Create Recruiter Account <ArrowRight className="h-4 w-4" />
                                        </AppSubmitButton>
                                    )}
                                </form.Subscribe>
                            )}
                        </div>
                    </form>
                </div>

                {/* ── Info pills ────────────────────────────────────────────── */}
                <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground/60">
                    {[
                        { icon: Mail, text: "Verified email required" },
                        { icon: MapPin, text: "Bangladesh only" },
                        { icon: Briefcase, text: "Admin approval needed" },
                    ].map(({ icon: Icon, text }) => (
                        <span key={text} className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5" /> {text}
                        </span>
                    ))}
                </div>

                {/* ── Footer links ──────────────────────────────────────────── */}
                <p className="mt-4 text-center text-xs text-muted-foreground/60">
                    Already have an account?{" "}
                    <Link href="/login" className="hover:text-primary transition-colors font-medium">
                        Sign in
                    </Link>
                    {" · "}
                    <Link href="/register" className="hover:text-primary transition-colors font-medium">
                        Register as Job Seeker
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ComprehensiveRecruiterRegisterForm;
