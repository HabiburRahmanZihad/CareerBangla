"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import ProfileCompletionBar from "@/components/shared/ProfileCompletionBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import envConfig from "@/lib/envConfig";
import { getMyResume, updateMyResume } from "@/services/resume.services";
import Link from "next/link";
import { useState } from "react";
import ResumeTwoPageLayout from "./ResumeTwoPageLayout";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowDownToLine,
    Award, BookOpen,
    Briefcase,
    ChevronDown,
    Code2,
    Crown,
    FileText,
    Globe,
    GraduationCap,
    Info,
    Languages,
    Lightbulb,
    Loader2,
    Lock,
    Plus,
    Star,
    Trash2,
    User,
    Users,
} from "lucide-react";
import { toast } from "sonner";

// ─── Reusable helpers ────────────────────────────────────────────────────────

/** Inline Select wired to a TanStack form field */
const SelectField = ({
    field,
    label,
    placeholder,
    options,
    serverErrors,
}: {
    field: any;
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    serverErrors: Record<string, string>;
}) => {
    const error =
        field.state.meta.isTouched && field.state.meta.errors.length > 0
            ? field.state.meta.errors[0]
            : null;
    const serverErr = serverErrors[field.name];
    const finalError = error || serverErr;
    const errorMsg =
        typeof finalError === "string"
            ? finalError
            : (finalError as any)?.message || String(finalError || "");

    return (
        <div className="space-y-1.5">
            <Label htmlFor={field.name} className={error ? "text-destructive" : ""}>
                {label}
            </Label>
            <Select
                value={(field.state.value as string) || undefined}
                onValueChange={(v) => field.handleChange(v)}
            >
                <SelectTrigger
                    id={field.name}
                    className={error ? "border-destructive focus:ring-destructive" : ""}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
        </div>
    );
};

/** Collapsible section wrapper with icon, title, count badge, and Add button */
const FormSection = ({
    icon: Icon,
    title,
    count,
    onAdd,
    children,
    defaultOpen = true,
    isLocked = false,
}: {
    icon: React.ElementType;
    title: string;
    count?: number;
    onAdd?: () => void;
    children: React.ReactNode;
    defaultOpen?: boolean;
    isLocked?: boolean;
}) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-left hover:bg-muted/40 transition-colors"
            >
                <span className="flex items-center gap-2 text-base font-semibold">
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    {title}
                    {count !== undefined && count > 0 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                            {count}
                        </Badge>
                    )}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <div className="space-y-3">
                    {onAdd && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed"
                            onClick={onAdd}
                            disabled={isLocked}
                            title={isLocked ? "Profile is locked - unable to add" : ""}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add {title}
                        </Button>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
};

/** Textarea field wired to TanStack form */
const TextareaField = ({
    field,
    label,
    placeholder,
    hint,
    serverErrors,
}: {
    field: any;
    label: string;
    placeholder?: string;
    hint?: string;
    serverErrors: Record<string, string>;
}) => {
    const error =
        field.state.meta.isTouched && field.state.meta.errors.length > 0
            ? field.state.meta.errors[0]
            : null;
    const serverErr = serverErrors[field.name];
    const finalError = error || serverErr;
    const errorMsg =
        typeof finalError === "string"
            ? finalError
            : (finalError as any)?.message || String(finalError || "");

    return (
        <div className="space-y-1.5">
            <Label htmlFor={field.name} className={errorMsg ? "text-destructive" : ""}>
                {label}
            </Label>
            <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value as string}
                placeholder={placeholder}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={errorMsg ? "border-destructive focus-visible:ring-destructive/20 min-h-20" : "min-h-20"}
            />
            {hint && !errorMsg && <p className="text-xs text-muted-foreground">{hint}</p>}
            {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
        </div>
    );
};

/** Card for array items with delete button */
const ItemCard = ({ index, onRemove, children, isLocked }: { index: number; onRemove: () => void; children: React.ReactNode; isLocked?: boolean }) => (
    <Card className="relative bg-muted/20 border-border/60">
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onRemove}
            disabled={isLocked}
            aria-label={`Remove item ${index + 1}`}
            title={isLocked ? "Profile is locked - unable to delete" : "Delete"}
        >
            <Trash2 className="w-3.5 h-3.5" />
        </Button>
        <CardContent className="pt-5 pb-4 pr-10">
            {children}
        </CardContent>
    </Card>
);

const EmptyState = ({ label }: { label: string }) => (
    <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-lg">
        No {label} added yet. Click &ldquo;Add {label}&rdquo; above.
    </p>
);

// ─── Main form ────────────────────────────────────────────────────────────────

const MyResumeForm = ({ resume, isPremium }: { resume: any; isPremium: boolean }) => {
    const queryClient = useQueryClient();
    const [isDownloading, setIsDownloading] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: Record<string, unknown>) => updateMyResume(payload),
        onSuccess: (response: any) => {
            if (response && response.success === false) {
                const newErrors: Record<string, string> = {};
                if (response.errorSources) {
                    response.errorSources.forEach((source: any) => {
                        const parts = source.path.split(" => ");
                        const formattedPath = parts.reduce((acc: string, curr: string) => {
                            if (!isNaN(Number(curr))) return `${acc}[${curr}]`;
                            return acc ? `${acc}.${curr}` : curr;
                        }, "");
                        newErrors[formattedPath] = source.message;
                    });
                    setServerErrors(newErrors);
                    toast.error("Please fix the field errors marked below.");
                } else {
                    toast.error(response.message || "Failed to update resume");
                }
            } else {
                setServerErrors({});
                toast.success("Resume updated successfully!");
                queryClient.invalidateQueries({ queryKey: ["my-resume"] });
            }
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update resume");
        },
    });

    const form = useForm({
        defaultValues: {
            fullName: resume?.fullName || "",
            email: resume?.email || "",
            professionalTitle: resume?.professionalTitle || "",
            professionalSummary: resume?.professionalSummary || "",
            nationality: resume?.nationality || "",
            technicalSkills: resume?.technicalSkills?.join(", ") || "",
            softSkills: resume?.softSkills?.join(", ") || "",
            toolsAndTechnologies: resume?.toolsAndTechnologies?.join(", ") || "",
            interests: resume?.interests?.join(", ") || "",
            contactNumber: resume?.contactNumber || "",
            address: resume?.address || "",
            dateOfBirth: resume?.dateOfBirth ? resume.dateOfBirth.split("T")[0] : "",
            gender: resume?.gender || "",
            linkedinUrl: resume?.linkedinUrl || "",
            githubUrl: resume?.githubUrl || "",
            portfolioUrl: resume?.portfolioUrl || "",
            workExperience: (resume?.workExperience?.map((exp: any) => ({
                jobTitle: exp.jobTitle || "",
                companyName: exp.companyName || "",
                startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
                endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
                responsibilities: exp.responsibilities?.join(", ") || "",
            })) || []) as any[],
            education: (resume?.education?.map((edu: any) => ({
                degree: edu.degree || "",
                institutionName: edu.institutionName || "",
                fieldOfStudy: edu.fieldOfStudy || "",
                startDate: edu.startDate ? edu.startDate.split("T")[0] : "",
                endDate: edu.endDate ? edu.endDate.split("T")[0] : "",
            })) || []) as any[],
            certifications: (resume?.certifications?.map((cert: any) => ({
                certificationName: cert.certificationName || "",
                issuingOrganization: cert.issuingOrganization || "",
                issueDate: cert.issueDate ? cert.issueDate.split("T")[0] : "",
            })) || []) as any[],
            projects: (resume?.projects?.map((proj: any) => ({
                projectName: proj.projectName || "",
                role: proj.role || "",
                description: proj.description || "",
                technologiesUsed: proj.technologiesUsed?.join(", ") || "",
                liveUrl: proj.liveUrl || "",
                githubUrl: proj.githubUrl || "",
                startDate: proj.startDate ? proj.startDate.split("T")[0] : "",
                endDate: proj.endDate ? proj.endDate.split("T")[0] : "",
                highlights: proj.highlights?.join(", ") || "",
            })) || []) as any[],
            languages: (resume?.languages?.map((lang: any) => ({
                language: lang.language || "",
                proficiencyLevel: lang.proficiencyLevel || "",
            })) || []) as any[],
            awards: (resume?.awards?.map((award: any) => ({
                title: award.title || "",
                issuer: award.issuer || "",
                date: award.date ? award.date.split("T")[0] : "",
                description: award.description || "",
            })) || []) as any[],
            references: (resume?.references?.map((ref: any) => ({
                name: ref.name || "",
                designation: ref.designation || "",
                company: ref.company || "",
                email: ref.email || "",
                phone: ref.phone || "",
                relationship: ref.relationship || "",
            })) || []) as any[],
        },
        onSubmit: async ({ value }) => {
            const payload: Record<string, unknown> = { ...value };

            // Sanitize URL fields
            const urlFields = ["linkedinUrl", "githubUrl", "portfolioUrl"];
            urlFields.forEach((f) => {
                if (typeof payload[f] === "string") {
                    let trimmed = (payload[f] as string).trim();
                    if (!trimmed) {
                        delete payload[f];
                    } else {
                        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
                            trimmed = "https://" + trimmed;
                        }
                        payload[f] = trimmed;
                    }
                }
            });

            if (!payload.gender) delete payload.gender;

            const csvFields = ["technicalSkills", "softSkills", "toolsAndTechnologies", "interests"];
            csvFields.forEach((f) => {
                const val = (value as Record<string, unknown>)[f];
                if (typeof val === "string") {
                    payload[f] = val.split(",").map((s: string) => s.trim()).filter(Boolean);
                }
            });

            const csvArr = (s: string | string[]) =>
                typeof s === "string" ? s.split(",").map((x) => x.trim()).filter(Boolean) : s;

            if (Array.isArray(value.workExperience)) {
                payload.workExperience = value.workExperience.map((exp: any) => ({
                    ...exp,
                    responsibilities: csvArr(exp.responsibilities),
                    startDate: exp.startDate ? new Date(exp.startDate).toISOString() : new Date().toISOString(),
                    endDate: exp.endDate ? new Date(exp.endDate).toISOString() : undefined,
                }));
            }
            if (Array.isArray(value.education)) {
                payload.education = value.education.map((edu: any) => ({
                    ...edu,
                    startDate: edu.startDate ? new Date(edu.startDate).toISOString() : new Date().toISOString(),
                    endDate: edu.endDate ? new Date(edu.endDate).toISOString() : undefined,
                }));
            }
            if (Array.isArray(value.certifications)) {
                payload.certifications = value.certifications.map((cert: any) => ({
                    ...cert,
                    issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString() : new Date().toISOString(),
                }));
            }
            if (Array.isArray(value.projects)) {
                payload.projects = value.projects.map((proj: any) => ({
                    ...proj,
                    technologiesUsed: csvArr(proj.technologiesUsed),
                    highlights: csvArr(proj.highlights),
                    startDate: proj.startDate ? new Date(proj.startDate).toISOString() : undefined,
                    endDate: proj.endDate ? new Date(proj.endDate).toISOString() : undefined,
                }));
            }
            if (Array.isArray(value.awards)) {
                payload.awards = value.awards.map((award: any) => ({
                    ...award,
                    date: award.date ? new Date(award.date).toISOString() : new Date().toISOString(),
                }));
            }

            await mutateAsync(payload);
        },
    });

    // Calculate profile completion based on actual form fields filled
    const calculateProfileCompletion = (formValue: any) => {
        const checklist: Record<string, boolean> = {
            fullName: !!formValue?.fullName?.trim(),
            email: !!formValue?.email?.trim(),
            professionalTitle: !!formValue?.professionalTitle?.trim(),
            professionalSummary: !!formValue?.professionalSummary?.trim(),
            technicalSkills: !!formValue?.technicalSkills?.trim(),
            softSkills: !!formValue?.softSkills?.trim(),
            toolsAndTechnologies: !!formValue?.toolsAndTechnologies?.trim(),
            contactNumber: !!formValue?.contactNumber?.trim(),
            address: !!formValue?.address?.trim(),
            dateOfBirth: !!formValue?.dateOfBirth?.trim(),
            gender: !!formValue?.gender?.trim(),
            linkedinUrl: !!formValue?.linkedinUrl?.trim(),
            githubUrl: !!formValue?.githubUrl?.trim(),
            portfolioUrl: !!formValue?.portfolioUrl?.trim(),
            hasEducation: (formValue?.education || []).some((edu: any) => edu.degree?.trim()),
            hasWorkExperience: (formValue?.workExperience || []).some((we: any) => we.jobTitle?.trim()),
            hasProjects: (formValue?.projects || []).some((proj: any) => proj.projectName?.trim()),
            hasLanguages: (formValue?.languages || []).some((lang: any) => lang.language?.trim()),
        };

        const completedFields = Object.values(checklist).filter(Boolean).length;
        const totalFields = Object.keys(checklist).length;
        return Math.round((completedFields / totalFields) * 100);
    };


    const handleDownloadPdf = async () => {
        if (!isPremium) return;
        setIsDownloading(true);
        try {
            const res = await fetch(`${envConfig.apiBaseUrl}/resumes/download-pdf`, { credentials: "include" });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.message || "Failed to download PDF");
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${form.store.state.values.fullName || "Resume"}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success("Resume PDF downloaded!");
        } catch (err: any) {
            toast.error(err.message || "Failed to download PDF");
        } finally {
            setIsDownloading(false);
        }
    };

    const se = serverErrors; // shorthand

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Resume</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Build your ATS-optimised resume
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {isPremium ? (
                        <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isDownloading}>
                            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowDownToLine className="w-4 h-4 mr-2" />}
                            {isDownloading ? "Downloading…" : "Download PDF"}
                        </Button>
                    ) : (
                        <Link href="/dashboard/subscriptions">
                            <Button variant="outline" size="sm" className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950">
                                <Crown className="w-4 h-4 mr-2" /> Download PDF
                                <Badge variant="secondary" className="ml-2 text-[10px] py-0 px-1.5">PRO</Badge>
                            </Button>
                        </Link>
                    )}
                    <Link href="/dashboard/profile-completion-guide">
                        <Button variant="outline" size="sm">
                            <Info className="w-4 h-4 mr-2" /> ATS Guide
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ── Profile completion bar ── */}
            <form.Subscribe selector={(s) => s.values}>
                {(values) => {
                    const computedCompl = calculateProfileCompletion(values);
                    const profileComp = computedCompl > 0 ? computedCompl : (resume?.profileCompletion ?? 0);
                    const isLockedStatus = !isPremium && profileComp === 100;

                    return (
                        <>
                            <ProfileCompletionBar completion={profileComp} />

                            {/* ── Status banner ── */}
                            {isPremium ? (
                                <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                                    <Crown className="h-5 w-5 shrink-0 text-amber-500" />
                                    <span>You have <strong>Career Boost</strong> — unlimited updates & professional ATS PDF downloads.</span>
                                </div>
                            ) : isLockedStatus ? (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-300">
                                    <div className="flex items-center gap-3">
                                        <Lock className="h-5 w-5 shrink-0 text-red-500" />
                                        <span>Your profile is 100% complete and <strong>locked</strong>. Upgrade to keep editing.</span>
                                    </div>
                                    <Link href="/dashboard/subscriptions">
                                        <Button size="sm" variant="destructive">Upgrade Now</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 px-4 py-3 text-sm text-blue-800 dark:text-blue-300">
                                    <AlertCircle className="h-5 w-5 shrink-0 text-blue-500" />
                                    <span>Fill in all sections to reach 100%. Editing is disabled at 100% on the Free tier.</span>
                                </div>
                            )}
                        </>
                    );
                }}
            </form.Subscribe>

            {/* ── Side-by-side layout ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* ─── LEFT: Form ─── */}
                <div>
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form.Subscribe selector={(s) => s.values}>
                                {(values) => {
                                    const computedIsLocked = !isPremium && calculateProfileCompletion(values) === 100;
                                    return (
                                        <form
                                            noValidate
                                            onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
                                            className="space-y-6"
                                        >
                                            {/* ── BASIC INFO ── */}
                                            <FormSection icon={User} title="Basic Information" defaultOpen={true}>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <form.Field name="fullName">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Full Name" placeholder="John Doe" />}
                                                    </form.Field>
                                                    <form.Field name="email">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Email" type="email" placeholder="john@example.com" />}
                                                    </form.Field>
                                                    <form.Field name="professionalTitle">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Professional Title" placeholder="e.g. Full Stack Developer" />}
                                                    </form.Field>
                                                    <form.Field name="contactNumber">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Contact Number" placeholder="+880…" />}
                                                    </form.Field>
                                                    <form.Field name="address">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Address" placeholder="Dhaka, Bangladesh" />}
                                                    </form.Field>
                                                    <form.Field name="nationality">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Nationality" placeholder="e.g. Bangladeshi" />}
                                                    </form.Field>
                                                    <form.Field name="dateOfBirth">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Date of Birth" type="date" />}
                                                    </form.Field>
                                                    <form.Field name="gender">
                                                        {(f) => (
                                                            <SelectField field={f} label="Gender" placeholder="Select gender" serverErrors={se} options={[
                                                                { value: "MALE", label: "Male" },
                                                                { value: "FEMALE", label: "Female" },
                                                                { value: "OTHER", label: "Other" },
                                                            ]} />
                                                        )}
                                                    </form.Field>
                                                </div>
                                            </FormSection>

                                            <hr className="border-border/60" />

                                            {/* ── SOCIAL PROFILES ── */}
                                            <FormSection icon={Globe} title="Social Profiles" defaultOpen={true}>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <form.Field name="linkedinUrl">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="LinkedIn URL" placeholder="linkedin.com/in/…" />}
                                                    </form.Field>
                                                    <form.Field name="githubUrl">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="GitHub URL" placeholder="github.com/…" />}
                                                    </form.Field>
                                                    <form.Field name="portfolioUrl">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Portfolio URL" placeholder="https://…" />}
                                                    </form.Field>
                                                </div>
                                            </FormSection>

                                            <hr className="border-border/60" />

                                            {/* ── SKILLS & SUMMARY ── */}
                                            <FormSection icon={Code2} title="Skills & Summary" defaultOpen={true}>
                                                <div className="space-y-4">
                                                    <form.Field name="technicalSkills">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Technical Skills" placeholder="React, TypeScript, Node.js, …  (comma-separated)" />}
                                                    </form.Field>
                                                    <form.Field name="softSkills">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Soft Skills" placeholder="Communication, Leadership, …  (comma-separated)" />}
                                                    </form.Field>
                                                    <form.Field name="toolsAndTechnologies">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Tools & Technologies" placeholder="Git, Docker, Figma, …  (comma-separated)" />}
                                                    </form.Field>
                                                    <form.Field name="interests">
                                                        {(f) => <AppField field={f} serverError={se[f.name]} label="Interests" placeholder="Open Source, Reading, …  (comma-separated)" />}
                                                    </form.Field>
                                                    <form.Field name="professionalSummary">
                                                        {(f) => (
                                                            <TextareaField
                                                                field={f}
                                                                label="Professional Summary"
                                                                placeholder="A concise overview of your experience, skills, and career goals…"
                                                                hint="A strong summary significantly boosts your ATS score."
                                                                serverErrors={se}
                                                            />
                                                        )}
                                                    </form.Field>
                                                </div>
                                            </FormSection>

                                            <hr className="border-border/60" />

                                            {/* ── WORK EXPERIENCE ── */}
                                            <form.Field name="workExperience" mode="array">
                                                {(field) => (
                                                    <FormSection
                                                        icon={Briefcase}
                                                        title="Work Experience"
                                                        count={field.state.value.length}
                                                        onAdd={() => field.pushValue({ jobTitle: "", companyName: "", startDate: "", endDate: "", responsibilities: "" })}
                                                        defaultOpen={true}
                                                        isLocked={computedIsLocked}
                                                    >
                                                        {field.state.value.length === 0 ? (
                                                            <EmptyState label="Work Experience" />
                                                        ) : (
                                                            field.state.value.map((_: any, i: number) => (
                                                                <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <form.Field name={`workExperience[${i}].jobTitle`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Job Title" placeholder="Software Engineer" />}
                                                                        </form.Field>
                                                                        <form.Field name={`workExperience[${i}].companyName`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Company" placeholder="Google" />}
                                                                        </form.Field>
                                                                        <form.Field name={`workExperience[${i}].startDate`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Start Date" type="date" />}
                                                                        </form.Field>
                                                                        <form.Field name={`workExperience[${i}].endDate`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="End Date (leave blank if current)" type="date" />}
                                                                        </form.Field>
                                                                        <div className="sm:col-span-2">
                                                                            <form.Field name={`workExperience[${i}].responsibilities`}>
                                                                                {(sf) => (
                                                                                    <TextareaField field={sf as any} label="Responsibilities (comma-separated)" placeholder="Built RESTful APIs, Improved performance by 40%, …" serverErrors={se} />
                                                                                )}
                                                                            </form.Field>
                                                                        </div>
                                                                    </div>
                                                                </ItemCard>
                                                            ))
                                                        )}
                                                    </FormSection>
                                                )}
                                            </form.Field>

                                            <hr className="border-border/60" />

                                            {/* ── EDUCATION ── */}
                                            <form.Field name="education" mode="array">
                                                {(field) => (
                                                    <FormSection
                                                        icon={GraduationCap}
                                                        title="Education"
                                                        count={field.state.value.length}
                                                        onAdd={() => field.pushValue({ degree: "", institutionName: "", fieldOfStudy: "", startDate: "", endDate: "" })}
                                                        defaultOpen={true}
                                                        isLocked={computedIsLocked}
                                                    >
                                                        {field.state.value.length === 0 ? (
                                                            <EmptyState label="Education" />
                                                        ) : (
                                                            field.state.value.map((_: any, i: number) => (
                                                                <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <form.Field name={`education[${i}].degree`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Degree" placeholder="BSc in Computer Science" />}
                                                                        </form.Field>
                                                                        <form.Field name={`education[${i}].institutionName`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Institution" placeholder="University Name" />}
                                                                        </form.Field>
                                                                        <form.Field name={`education[${i}].fieldOfStudy`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Field of Study" placeholder="Computer Science" />}
                                                                        </form.Field>
                                                                        <form.Field name={`education[${i}].startDate`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Start Date" type="date" />}
                                                                        </form.Field>
                                                                        <form.Field name={`education[${i}].endDate`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="End Date" type="date" />}
                                                                        </form.Field>
                                                                    </div>
                                                                </ItemCard>
                                                            ))
                                                        )}
                                                    </FormSection>
                                                )}
                                            </form.Field>

                                            <hr className="border-border/60" />

                                            {/* ── CERTIFICATIONS ── */}
                                            <form.Field name="certifications" mode="array">
                                                {(field) => (
                                                    <FormSection
                                                        icon={BookOpen}
                                                        title="Certifications"
                                                        count={field.state.value.length}
                                                        onAdd={() => field.pushValue({ certificationName: "", issuingOrganization: "", issueDate: "" })}
                                                        defaultOpen={false}
                                                        isLocked={computedIsLocked}
                                                    >
                                                        {field.state.value.length === 0 ? (
                                                            <EmptyState label="Certifications" />
                                                        ) : (
                                                            field.state.value.map((_: any, i: number) => (
                                                                <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <form.Field name={`certifications[${i}].certificationName`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Certification Name" placeholder="AWS Certified Solutions Architect" />}
                                                                        </form.Field>
                                                                        <form.Field name={`certifications[${i}].issuingOrganization`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Issuing Organization" placeholder="Amazon Web Services" />}
                                                                        </form.Field>
                                                                        <form.Field name={`certifications[${i}].issueDate`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Issue Date" type="date" />}
                                                                        </form.Field>
                                                                    </div>
                                                                </ItemCard>
                                                            ))
                                                        )}
                                                    </FormSection>
                                                )}
                                            </form.Field>

                                            <hr className="border-border/60" />

                                            {/* ── PROJECTS ── */}
                                            <form.Field name="projects" mode="array">
                                                {(field) => (
                                                    <FormSection
                                                        icon={Star}
                                                        title="Projects"
                                                        count={field.state.value.length}
                                                        onAdd={() => field.pushValue({ projectName: "", role: "", description: "", technologiesUsed: "", liveUrl: "", githubUrl: "", startDate: "", endDate: "", highlights: "" })}
                                                        defaultOpen={false}
                                                        isLocked={computedIsLocked}
                                                    >
                                                        {field.state.value.length === 0 ? (
                                                            <EmptyState label="Projects" />
                                                        ) : (
                                                            field.state.value.map((_: any, i: number) => (
                                                                <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <form.Field name={`projects[${i}].projectName`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Project Name" placeholder="E-commerce Platform" />}
                                                                        </form.Field>
                                                                        <form.Field name={`projects[${i}].role`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Role" placeholder="Lead Developer" />}
                                                                        </form.Field>
                                                                        <div className="sm:col-span-2">
                                                                            <form.Field name={`projects[${i}].description`}>
                                                                                {(sf) => <TextareaField field={sf as any} label="Description" placeholder="What the project does and your contribution…" serverErrors={se} />}
                                                                            </form.Field>
                                                                        </div>
                                                                        <div className="sm:col-span-2">
                                                                            <form.Field name={`projects[${i}].technologiesUsed`}>
                                                                                {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Technologies Used" placeholder="React, Node.js, …  (comma-separated)" />}
                                                                            </form.Field>
                                                                        </div>
                                                                        <form.Field name={`projects[${i}].liveUrl`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Live URL" placeholder="https://…" />}
                                                                        </form.Field>
                                                                        <form.Field name={`projects[${i}].githubUrl`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="GitHub URL" placeholder="https://github.com/…" />}
                                                                        </form.Field>
                                                                        <form.Field name={`projects[${i}].startDate`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Start Date" type="date" />}
                                                                        </form.Field>
                                                                        <form.Field name={`projects[${i}].endDate`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="End Date" type="date" />}
                                                                        </form.Field>
                                                                        <div className="sm:col-span-2">
                                                                            <form.Field name={`projects[${i}].highlights`}>
                                                                                {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Key Highlights" placeholder="Increased performance by 50%, …  (comma-separated)" />}
                                                                            </form.Field>
                                                                        </div>
                                                                    </div>
                                                                </ItemCard>
                                                            ))
                                                        )}
                                                    </FormSection>
                                                )}
                                            </form.Field>

                                            <hr className="border-border/60" />

                                            {/* ── LANGUAGES ── */}
                                            <form.Field name="languages" mode="array">
                                                {(field) => (
                                                    <FormSection
                                                        icon={Languages}
                                                        title="Languages"
                                                        count={field.state.value.length}
                                                        onAdd={() => field.pushValue({ language: "", proficiencyLevel: "" })}
                                                        defaultOpen={false}
                                                        isLocked={computedIsLocked}
                                                    >
                                                        {field.state.value.length === 0 ? (
                                                            <EmptyState label="Languages" />
                                                        ) : (
                                                            field.state.value.map((_: any, i: number) => (
                                                                <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <form.Field name={`languages[${i}].language`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Language" placeholder="English" />}
                                                                        </form.Field>
                                                                        <form.Field name={`languages[${i}].proficiencyLevel`}>
                                                                            {(sf) => (
                                                                                <SelectField field={sf as any} label="Proficiency" placeholder="Select level" serverErrors={se} options={[
                                                                                    { value: "Native", label: "Native" },
                                                                                    { value: "Fluent", label: "Fluent" },
                                                                                    { value: "Intermediate", label: "Intermediate" },
                                                                                    { value: "Beginner", label: "Beginner" },
                                                                                ]} />
                                                                            )}
                                                                        </form.Field>
                                                                    </div>
                                                                </ItemCard>
                                                            ))
                                                        )}
                                                    </FormSection>
                                                )}
                                            </form.Field>

                                            <hr className="border-border/60" />

                                            {/* ── AWARDS ── */}
                                            <form.Field name="awards" mode="array">
                                                {(field) => (
                                                    <FormSection
                                                        icon={Award}
                                                        title="Awards & Achievements"
                                                        count={field.state.value.length}
                                                        onAdd={() => field.pushValue({ title: "", issuer: "", date: "", description: "" })}
                                                        defaultOpen={false}
                                                        isLocked={computedIsLocked}
                                                    >
                                                        {field.state.value.length === 0 ? (
                                                            <EmptyState label="Awards" />
                                                        ) : (
                                                            field.state.value.map((_: any, i: number) => (
                                                                <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <form.Field name={`awards[${i}].title`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Title" placeholder="Employee of the Month" />}
                                                                        </form.Field>
                                                                        <form.Field name={`awards[${i}].issuer`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Issuer" placeholder="Google" />}
                                                                        </form.Field>
                                                                        <form.Field name={`awards[${i}].date`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Date" type="date" />}
                                                                        </form.Field>
                                                                        <div className="sm:col-span-2">
                                                                            <form.Field name={`awards[${i}].description`}>
                                                                                {(sf) => <TextareaField field={sf as any} label="Description" serverErrors={se} />}
                                                                            </form.Field>
                                                                        </div>
                                                                    </div>
                                                                </ItemCard>
                                                            ))
                                                        )}
                                                    </FormSection>
                                                )}
                                            </form.Field>

                                            <hr className="border-border/60" />

                                            {/* ── REFERENCES ── */}
                                            <form.Field name="references" mode="array">
                                                {(field) => (
                                                    <FormSection
                                                        icon={Users}
                                                        title="References"
                                                        count={field.state.value.length}
                                                        onAdd={() => field.pushValue({ name: "", designation: "", company: "", email: "", phone: "", relationship: "" })}
                                                        defaultOpen={false}
                                                        isLocked={computedIsLocked}
                                                    >
                                                        {field.state.value.length === 0 ? (
                                                            <EmptyState label="References" />
                                                        ) : (
                                                            field.state.value.map((_: any, i: number) => (
                                                                <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <form.Field name={`references[${i}].name`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Name" placeholder="Jane Doe" />}
                                                                        </form.Field>
                                                                        <form.Field name={`references[${i}].designation`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Designation" placeholder="Engineering Manager" />}
                                                                        </form.Field>
                                                                        <form.Field name={`references[${i}].company`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Company" placeholder="Google" />}
                                                                        </form.Field>
                                                                        <form.Field name={`references[${i}].relationship`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Relationship" placeholder="Direct Manager" />}
                                                                        </form.Field>
                                                                        <form.Field name={`references[${i}].email`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Email" type="email" placeholder="jane@example.com" />}
                                                                        </form.Field>
                                                                        <form.Field name={`references[${i}].phone`}>
                                                                            {(sf) => <AppField field={sf as any} serverError={se[sf.name]} label="Phone" placeholder="+1…" />}
                                                                        </form.Field>
                                                                    </div>
                                                                </ItemCard>
                                                            ))
                                                        )}
                                                    </FormSection>
                                                )}
                                            </form.Field>

                                            <hr className="border-border/60" />

                                            {/* ── INTERESTS ── */}
                                            <form.Field name="interests">
                                                {(field) => (
                                                    <FormSection
                                                        icon={Lightbulb}
                                                        title="Interests"
                                                        count={field.state.value?.length || 0}
                                                        defaultOpen={false}
                                                    >
                                                        <div className="space-y-3">
                                                            <AppField
                                                                field={field as any}
                                                                serverError={se[field.name]}
                                                                label="Your Interests"
                                                                placeholder="Machine Learning, Open Source, Cloud Computing… (comma-separated)"
                                                            />
                                                            {field.state.value && field.state.value.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 pt-2">
                                                                    {(typeof field.state.value === 'string'
                                                                        ? field.state.value.split(',').map((item: string) => item.trim()).filter(Boolean)
                                                                        : field.state.value
                                                                    ).map((interest: string, idx: number) => (
                                                                        <Badge key={idx} variant="outline" className="text-xs">
                                                                            {interest}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </FormSection>
                                                )}
                                            </form.Field>

                                            {/* ── Submit ── */}
                                            <div className="pt-2 sticky bottom-0 bg-card pb-2">
                                                <AppSubmitButton isPending={isPending} disabled={computedIsLocked} pendingLabel="Saving…">
                                                    {computedIsLocked ? (
                                                        <><Lock className="w-4 h-4 mr-2" /> Profile Locked</>
                                                    ) : "Save Resume"}
                                                </AppSubmitButton>
                                                {computedIsLocked && (
                                                    <p className="text-xs text-center text-muted-foreground mt-2">
                                                        <Link href="/dashboard/subscriptions" className="underline font-medium">Upgrade to Career Boost</Link> to continue editing.
                                                    </p>
                                                )}
                                            </div>
                                        </form>
                                    );
                                }}
                            </form.Subscribe>
                        </CardContent>
                    </Card>
                </div>

                {/* ─── RIGHT: Live Preview ─── */}
                <div className="hidden xl:block">
                    <div className="sticky top-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" /> Live Preview
                            </h3>
                            <Badge variant="outline" className="text-xs">Auto-updates</Badge>
                        </div>
                        <div className="max-h-[calc(100vh-140px)] overflow-y-auto rounded-lg border border-gray-200 shadow-sm bg-white px-6 pt-8 pb-6">
                            <form.Subscribe selector={(s) => s.values}>
                                {(values) => <ResumeTwoPageLayout values={values} />}
                            </form.Subscribe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const ResumeSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
            </div>
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-150 w-full rounded-xl" />
    </div>
);

// ─── Root component ───────────────────────────────────────────────────────────

const MyResumeContent = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
    });

    if (isLoading) return <ResumeSkeleton />;

    return (
        <MyResumeForm
            resume={data?.data}
            isPremium={data?.data?.isPremium || false}
        />
    );
};

export default MyResumeContent;
