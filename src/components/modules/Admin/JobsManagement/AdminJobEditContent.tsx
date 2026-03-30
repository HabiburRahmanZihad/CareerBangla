"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { updateJob } from "@/services/admin.services";
import { getJobById } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowLeft,
    Award,
    Banknote,
    BookOpen,
    Briefcase,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    GraduationCap,
    Hash,
    Loader2,
    MapPin,
    Save,
    Tag,
    Users,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AdminJobEditContentProps {
    jobId: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

type StatusCfg = { label: string; strip: string; badge: string; dot: string };
const STATUS_CONFIG: Record<string, StatusCfg> = {
    LIVE: {
        label: "Live",
        strip: "bg-emerald-500",
        badge: "bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
    PENDING: {
        label: "Pending",
        strip: "bg-amber-500",
        badge: "bg-amber-500/10 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400",
        dot: "bg-amber-500",
    },
    DRAFT: {
        label: "Draft",
        strip: "bg-amber-400",
        badge: "bg-amber-500/10 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400",
        dot: "bg-amber-400",
    },
    CLOSED: {
        label: "Closed",
        strip: "bg-rose-500",
        badge: "bg-rose-500/10 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400",
        dot: "bg-rose-500",
    },
    INACTIVE: {
        label: "Inactive",
        strip: "bg-slate-400",
        badge: "bg-slate-500/10 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400",
        dot: "bg-slate-400",
    },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Show parsed tags below a comma-separated textarea */
const TagsPreview = ({ value }: { value: string }) => {
    const tags = value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    if (tags.length === 0) return null;
    return (
        <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
                <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                    <Hash className="h-2.5 w-2.5" />
                    {tag}
                </span>
            ))}
        </div>
    );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

const EditJobSkeleton = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-7 w-44" />
                <Skeleton className="h-4 w-64" />
            </div>
        </div>
        {/* Cards */}
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
                <Skeleton className="h-1 w-full rounded-none" />
                <div className="p-5 space-y-4">
                    <Skeleton className="h-5 w-36" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-10 rounded-md" />
                        <Skeleton className="h-10 rounded-md" />
                        <Skeleton className="h-10 rounded-md" />
                        <Skeleton className="h-10 rounded-md" />
                    </div>
                    <Skeleton className="h-28 rounded-md" />
                </div>
            </div>
        ))}
        {/* Actions */}
        <div className="flex gap-3">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="h-11 flex-1 rounded-lg" />
        </div>
    </div>
);

// ── Section Card ──────────────────────────────────────────────────────────────

const SectionCard = ({
    icon: Icon,
    title,
    iconBg,
    iconColor,
    strip,
    children,
}: {
    icon: React.ElementType;
    title: string;
    iconBg: string;
    iconColor: string;
    strip: string;
    children: React.ReactNode;
}) => (
    <Card className="overflow-hidden border-border/60 shadow-sm">
        <div className={`h-0.5 w-full ${strip}`} />
        <CardHeader className="pb-4 pt-5">
            <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="pb-5 space-y-4">{children}</CardContent>
    </Card>
);

// ── Field helpers ─────────────────────────────────────────────────────────────

const FieldGroup = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
);

const Field = ({
    label,
    required,
    children,
    hint,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    hint?: string;
}) => (
    <div className="space-y-1.5">
        <Label className="text-sm font-medium">
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        {children}
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const AdminJobEditContent = ({ jobId }: AdminJobEditContentProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [draftForm, setDraftForm] = useState<Partial<IJob> | null>(null);

    const { data: jobData, isLoading } = useQuery({
        queryKey: ["job-details", jobId],
        queryFn: () => getJobById(jobId),
    });

    const { mutateAsync: editMutate, isPending: isEditing } = useMutation({
        mutationFn: (formData: Partial<IJob>) =>
            updateJob(jobId, {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                locationType: formData.locationType,
                jobType: formData.jobType,
                experienceLevel: formData.experienceLevel,
                skills: formData.skills,
                salaryMin: formData.salaryMin,
                salaryMax: formData.salaryMax,
                requirements: formData.requirements,
                responsibilities: formData.responsibilities,
                benefits: formData.benefits,
                vacancies: formData.vacancies,
                experience: formData.experience,
                education: formData.education,
                applicationDeadline: formData.applicationDeadline,
            }),
        onSuccess: () => {
            toast.success("Job updated successfully");
            queryClient.invalidateQueries({ queryKey: ["job-details", jobId] });
            queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
            router.push("/admin/dashboard/jobs-management");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update job");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await editMutate(draftForm ?? jobData?.data ?? {});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDraftForm((prev) => {
            const base = prev ?? jobData?.data ?? {};
            return {
                ...base,
                [name]:
                    name.includes("salary") || name === "vacancies"
                        ? Number(value) || value
                        : value,
            };
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setDraftForm((prev) => ({
            ...(prev ?? jobData?.data ?? {}),
            [name]: value,
        }));
    };

    const handleArrayChange = (name: string, value: string) => {
        setDraftForm((prev) => ({
            ...(prev ?? jobData?.data ?? {}),
            [name]: value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
        }));
    };

    if (isLoading) return <EditJobSkeleton />;

    const job = jobData?.data;

    if (!job) {
        return (
            <Card className="border-border/60">
                <CardContent className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
                        <AlertCircle className="h-7 w-7 text-muted-foreground/50" />
                    </div>
                    <p className="font-medium text-muted-foreground">Job not found</p>
                    <Link href="/admin/dashboard/jobs-management">
                        <Button variant="outline" size="sm" className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Jobs
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    const formData = draftForm ?? job;
    const isChanged = draftForm !== null && JSON.stringify(formData) !== JSON.stringify(job);
    const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.INACTIVE;

    return (
        <div className="space-y-6">
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <Link href="/admin/dashboard/jobs-management">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 shrink-0 rounded-xl border-border/60"
                            title="Back to Jobs"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Edit Job</h1>
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.badge}`}
                            >
                                <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                                {statusCfg.label}
                            </span>
                            {isChanged && (
                                <Badge
                                    variant="secondary"
                                    className="gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                >
                                    <Zap className="h-3 w-3" />
                                    Unsaved changes
                                </Badge>
                            )}
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {job.title}
                            {job.company && (
                                <span className="text-muted-foreground/60"> at {job.company}</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Quick save – visible on larger screens */}
                <div className="hidden sm:flex items-center gap-2">
                    <Link href="/admin/dashboard/jobs-management">
                        <Button variant="outline" className="h-9 border-border/60">
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        form="edit-job-form"
                        type="submit"
                        disabled={isEditing || !isChanged}
                        className="h-9 gap-2"
                    >
                        {isEditing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* ── Form ──────────────────────────────────────────────────── */}
            <form id="edit-job-form" onSubmit={handleSubmit} className="space-y-5">

                {/* Section 1 – Position Overview */}
                <SectionCard
                    icon={Briefcase}
                    title="Position Overview"
                    iconBg="bg-blue-500/10"
                    iconColor="text-blue-600 dark:text-blue-400"
                    strip="bg-blue-500"
                >
                    <FieldGroup>
                        <Field label="Job Title" required>
                            <Input
                                name="title"
                                value={formData.title || ""}
                                onChange={handleInputChange}
                                placeholder="e.g. Senior React Developer"
                                required
                            />
                        </Field>
                        <Field label="Location" required>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    name="location"
                                    value={formData.location || ""}
                                    onChange={handleInputChange}
                                    className="pl-9"
                                    placeholder="e.g. New York, NY"
                                    required
                                />
                            </div>
                        </Field>
                    </FieldGroup>

                    <Field label="Job Description" required>
                        <Textarea
                            name="description"
                            value={formData.description || ""}
                            onChange={handleInputChange}
                            rows={6}
                            placeholder="Describe the role, team, and what makes this position exciting…"
                            required
                            className="resize-y"
                        />
                    </Field>
                </SectionCard>

                {/* Section 2 – Employment Details */}
                <SectionCard
                    icon={ClipboardList}
                    title="Employment Details"
                    iconBg="bg-violet-500/10"
                    iconColor="text-violet-600 dark:text-violet-400"
                    strip="bg-violet-500"
                >
                    <FieldGroup>
                        <Field label="Job Type" required>
                            <Select
                                value={formData.jobType || ""}
                                onValueChange={(v) => handleSelectChange("jobType", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                                    <SelectItem value="CONTRACT">Contract</SelectItem>
                                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                    <SelectItem value="FREELANCE">Freelance</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Location Type" required>
                            <Select
                                value={formData.locationType || ""}
                                onValueChange={(v) => handleSelectChange("locationType", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="REMOTE">Remote</SelectItem>
                                    <SelectItem value="ONSITE">On-site</SelectItem>
                                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Experience Level" required>
                            <Select
                                value={formData.experienceLevel || ""}
                                onValueChange={(v) => handleSelectChange("experienceLevel", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ENTRY">Entry Level</SelectItem>
                                    <SelectItem value="MID">Mid Level</SelectItem>
                                    <SelectItem value="SENIOR">Senior</SelectItem>
                                    <SelectItem value="LEAD">Lead</SelectItem>
                                    <SelectItem value="EXECUTIVE">Executive</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Number of Vacancies">
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    name="vacancies"
                                    type="number"
                                    value={formData.vacancies || ""}
                                    onChange={handleInputChange}
                                    className="pl-9"
                                    placeholder="e.g. 3"
                                    min="1"
                                />
                            </div>
                        </Field>
                    </FieldGroup>
                </SectionCard>

                {/* Section 3 – Compensation & Requirements */}
                <SectionCard
                    icon={Banknote}
                    title="Compensation & Requirements"
                    iconBg="bg-emerald-500/10"
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    strip="bg-emerald-500"
                >
                    <FieldGroup>
                        <Field label="Minimum Salary">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    $
                                </span>
                                <Input
                                    name="salaryMin"
                                    type="number"
                                    value={formData.salaryMin || ""}
                                    onChange={handleInputChange}
                                    className="pl-7"
                                    placeholder="50000"
                                />
                            </div>
                        </Field>

                        <Field label="Maximum Salary">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    $
                                </span>
                                <Input
                                    name="salaryMax"
                                    type="number"
                                    value={formData.salaryMax || ""}
                                    onChange={handleInputChange}
                                    className="pl-7"
                                    placeholder="80000"
                                />
                            </div>
                        </Field>

                        <Field label="Experience Required">
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    name="experience"
                                    value={formData.experience || ""}
                                    onChange={handleInputChange}
                                    className="pl-9"
                                    placeholder="e.g. 3+ years"
                                />
                            </div>
                        </Field>

                        <Field label="Education Required">
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    name="education"
                                    value={formData.education || ""}
                                    onChange={handleInputChange}
                                    className="pl-9"
                                    placeholder="e.g. Bachelor's Degree"
                                />
                            </div>
                        </Field>
                    </FieldGroup>

                    <Field label="Application Deadline">
                        <div className="relative w-full sm:w-64">
                            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                name="applicationDeadline"
                                type="date"
                                value={
                                    formData.applicationDeadline
                                        ? formData.applicationDeadline.split("T")[0]
                                        : ""
                                }
                                onChange={handleInputChange}
                                className="pl-9"
                            />
                        </div>
                    </Field>
                </SectionCard>

                {/* Section 4 – Skills & Requirements */}
                <SectionCard
                    icon={Award}
                    title="Skills & Requirements"
                    iconBg="bg-orange-500/10"
                    iconColor="text-orange-600 dark:text-orange-400"
                    strip="bg-orange-500"
                >
                    <Field
                        label="Required Skills"
                        hint="Separate each skill with a comma"
                    >
                        <div className="relative">
                            <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                                rows={3}
                                value={formData.skills?.join(", ") || ""}
                                onChange={(e) => handleArrayChange("skills", e.target.value)}
                                className="pl-9 resize-none"
                                placeholder="React, TypeScript, Node.js, PostgreSQL"
                            />
                        </div>
                        <TagsPreview value={formData.skills?.join(", ") || ""} />
                    </Field>

                    <Field
                        label="Requirements"
                        hint="Separate each requirement with a comma"
                    >
                        <div className="relative">
                            <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                                rows={3}
                                value={formData.requirements?.join(", ") || ""}
                                onChange={(e) => handleArrayChange("requirements", e.target.value)}
                                className="pl-9 resize-none"
                                placeholder="Strong communication skills, Team player, Attention to detail"
                            />
                        </div>
                        <TagsPreview value={formData.requirements?.join(", ") || ""} />
                    </Field>

                    <Field
                        label="Responsibilities"
                        hint="Separate each responsibility with a comma"
                    >
                        <div className="relative">
                            <ClipboardList className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                                rows={3}
                                value={formData.responsibilities?.join(", ") || ""}
                                onChange={(e) => handleArrayChange("responsibilities", e.target.value)}
                                className="pl-9 resize-none"
                                placeholder="Lead frontend architecture, Mentor junior devs, Conduct code reviews"
                            />
                        </div>
                        <TagsPreview value={formData.responsibilities?.join(", ") || ""} />
                    </Field>

                    <Field
                        label="Benefits"
                        hint="Separate each benefit with a comma"
                    >
                        <div className="relative">
                            <Zap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                                rows={3}
                                value={formData.benefits?.join(", ") || ""}
                                onChange={(e) => handleArrayChange("benefits", e.target.value)}
                                className="pl-9 resize-none"
                                placeholder="Health insurance, 401k, Remote work, Flexible hours"
                            />
                        </div>
                        <TagsPreview value={formData.benefits?.join(", ") || ""} />
                    </Field>
                </SectionCard>

                {/* ── Action bar (mobile) ─────────────────────────────── */}
                <div className="flex gap-3 sm:hidden">
                    <Link href="/admin/dashboard/jobs-management" className="flex-1">
                        <Button variant="outline" className="w-full h-11 border-border/60">
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={isEditing || !isChanged}
                        className="flex-1 h-11 gap-2"
                    >
                        {isEditing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>

                {/* ── Change indicator banner ─────────────────────────── */}
                {isChanged && (
                    <div className="flex items-center justify-between rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-500/5 px-4 py-3 text-sm">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                            <Zap className="h-4 w-4" />
                            <span>You have unsaved changes</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <Link href="/admin/dashboard/jobs-management">
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                    Discard
                                </Button>
                            </Link>
                            <Button
                                form="edit-job-form"
                                type="submit"
                                size="sm"
                                disabled={isEditing}
                                className="h-7 gap-1.5 text-xs"
                            >
                                {isEditing ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Save className="h-3 w-3" />
                                )}
                                Save now
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AdminJobEditContent;
