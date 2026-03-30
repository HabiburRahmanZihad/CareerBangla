"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { swalInput } from "@/lib/swal";
import { approveJob, rejectJob } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    Award,
    Banknote,
    BookOpen,
    Briefcase,
    Building2,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Gift,
    GraduationCap,
    Hourglass,
    Loader2,
    Mail,
    MapPin,
    Tag,
    ThumbsUp,
    Users,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

type PendingJobDetailsContentProps = {
    job: IJob & {
        requirements?: string[];
        responsibilities?: string[];
        benefits?: string[];
        recruiter?: {
            id?: string;
            name?: string;
            email?: string;
            companyName?: string;
            designation?: string;
            contactNumber?: string;
        };
    };
};

// ── Config ────────────────────────────────────────────────────────────────────

const JOB_TYPE_CONFIG: Record<string, { label: string; cls: string }> = {
    FULL_TIME: { label: "Full Time", cls: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    PART_TIME: { label: "Part Time", cls: "bg-violet-500/10 text-violet-700 dark:text-violet-400" },
    CONTRACT: { label: "Contract", cls: "bg-orange-500/10 text-orange-700 dark:text-orange-400" },
    INTERNSHIP: { label: "Internship", cls: "bg-teal-500/10 text-teal-700 dark:text-teal-400" },
    FREELANCE: { label: "Freelance", cls: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" },
};

const LOCATION_TYPE_CONFIG: Record<string, { label: string; cls: string }> = {
    REMOTE: { label: "Remote", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    ONSITE: { label: "On-site", cls: "bg-sky-500/10 text-sky-700 dark:text-sky-400" },
    HYBRID: { label: "Hybrid", cls: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
};

const EXPERIENCE_LABELS: Record<string, string> = {
    ENTRY: "Entry Level", MID: "Mid Level", SENIOR: "Senior",
    LEAD: "Lead", EXECUTIVE: "Executive",
};

const formatSalary = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`);

// ── Sub-components ────────────────────────────────────────────────────────────

const SectionCard = ({
    icon: Icon, title, iconBg, iconColor, strip, children,
}: {
    icon: React.ElementType; title: string;
    iconBg: string; iconColor: string; strip: string;
    children: React.ReactNode;
}) => (
    <Card className="overflow-hidden border-border/60 shadow-sm">
        <div className={`h-0.5 w-full ${strip}`} />
        <CardHeader className="pb-3 pt-5">
            <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="pb-5">{children}</CardContent>
    </Card>
);

const MetaItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background border border-border/60">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium truncate">{value || "—"}</p>
        </div>
    </div>
);

const ListSection = ({ items, emptyText }: { items: string[]; emptyText: string }) => {
    if (!items?.length) return <p className="text-sm text-muted-foreground/60 italic">{emptyText}</p>;
    return (
        <ul className="space-y-2">
            {items.map((item, i) => (
                <li key={`${item}-${i}`} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/50" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

const PendingJobDetailsContent = ({ job }: PendingJobDetailsContentProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutateAsync: approveMutate, isPending: isApproving } = useMutation({
        mutationFn: () => approveJob(job.id),
        onSuccess: async () => {
            toast.success("Job approved and recruiter notified");
            await queryClient.invalidateQueries({ queryKey: ["pending-jobs"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
            router.push("/admin/dashboard/pending-jobs");
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to approve job"),
    });

    const { mutateAsync: rejectMutate, isPending: isRejecting } = useMutation({
        mutationFn: (reason: string) => rejectJob(job.id, reason.trim()),
        onSuccess: async () => {
            toast.success("Job rejected and recruiter notified");
            await queryClient.invalidateQueries({ queryKey: ["pending-jobs"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
            router.push("/admin/dashboard/pending-jobs");
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to reject job"),
    });

    const handleReject = async () => {
        const result = await swalInput({
            title: "Reject Job Post",
            text: "This reason will be sent to the recruiter via notification and email.",
            inputPlaceholder: "Write a clear rejection reason…",
            confirmText: "Reject Job",
            danger: true,
        });
        if (result.isConfirmed && result.value?.trim()) {
            await rejectMutate(result.value);
        }
    };

    const typeCfg = JOB_TYPE_CONFIG[job.jobType as string];
    const locCfg = LOCATION_TYPE_CONFIG[job.locationType as string];
    const isBusy = isApproving || isRejecting;

    const deadline = (job as any).applicationDeadline || (job as any).deadline;

    return (
        <div className="space-y-6 pb-24 sm:pb-8">
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <Link href="/admin/dashboard/pending-jobs">
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-xl border-border/60" title="Back">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Review Job Post</h1>
                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-500/10 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">
                                <Hourglass className="h-3 w-3" />
                                Pending Review
                            </span>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Submitted by{" "}
                            <span className="font-medium text-foreground">
                                {job.recruiter?.name || "Unknown Recruiter"}
                            </span>
                            {job.recruiter?.companyName && (
                                <span className="text-muted-foreground/70"> · {job.recruiter.companyName}</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Desktop action buttons */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <Button
                        variant="outline"
                        onClick={handleReject}
                        disabled={isBusy}
                        className="gap-2 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300"
                    >
                        {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        Reject
                    </Button>
                    <Button
                        onClick={() => approveMutate()}
                        disabled={isBusy}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                        Approve Job
                    </Button>
                </div>
            </div>

            {/* ── Hero card ───────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-amber-500/8 via-amber-500/3 to-transparent p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/5" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                        <h2 className="text-lg font-bold sm:text-xl">{job.title}</h2>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Building2 className="h-4 w-4" /> {job.company}
                            </span>
                            <span className="text-border">·</span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" /> {job.location}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {typeCfg && (
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeCfg.cls}`}>
                                    {typeCfg.label}
                                </span>
                            )}
                            {locCfg && (
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${locCfg.cls}`}>
                                    {locCfg.label}
                                </span>
                            )}
                            {job.experienceLevel && (
                                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-500/10 text-slate-700 dark:text-slate-400">
                                    {EXPERIENCE_LABELS[job.experienceLevel] || job.experienceLevel}
                                </span>
                            )}
                            {job.category?.title && (
                                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                                    {job.category.title}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Salary */}
                    {(job.salaryMin || job.salaryMax) && (
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-500/5 px-4 py-3 shrink-0">
                            <Banknote className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="text-xs text-muted-foreground">Salary Range</p>
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                    {job.salaryMin && formatSalary(job.salaryMin)}
                                    {job.salaryMin && job.salaryMax && " – "}
                                    {job.salaryMax && formatSalary(job.salaryMax)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Key meta grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <MetaItem
                        icon={Users}
                        label="Vacancies"
                        value={(job as any).vacancies ?? "Not specified"}
                    />
                    <MetaItem
                        icon={CalendarDays}
                        label="Deadline"
                        value={deadline
                            ? new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Not set"}
                    />
                    <MetaItem
                        icon={BookOpen}
                        label="Experience"
                        value={(job as any).experience || "Not specified"}
                    />
                    <MetaItem
                        icon={GraduationCap}
                        label="Education"
                        value={(job as any).education || "Not specified"}
                    />
                </div>
            </div>

            {/* ── Recruiter info ──────────────────────────────────────────── */}
            {job.recruiter && (
                <SectionCard
                    icon={Briefcase}
                    title="Recruiter Information"
                    iconBg="bg-blue-500/10"
                    iconColor="text-blue-600 dark:text-blue-400"
                    strip="bg-blue-500"
                >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <MetaItem icon={Users} label="Recruiter Name" value={job.recruiter.name} />
                        <MetaItem icon={Mail} label="Email" value={job.recruiter.email} />
                        <MetaItem icon={Building2} label="Company" value={job.recruiter.companyName} />
                        <MetaItem icon={Briefcase} label="Designation" value={job.recruiter.designation} />
                    </div>
                </SectionCard>
            )}

            {/* ── Description ─────────────────────────────────────────────── */}
            <SectionCard
                icon={ClipboardList}
                title="Job Description"
                iconBg="bg-violet-500/10"
                iconColor="text-violet-600 dark:text-violet-400"
                strip="bg-violet-500"
            >
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {job.description || "No description provided."}
                </p>
            </SectionCard>

            {/* ── Skills ──────────────────────────────────────────────────── */}
            {(job.skills?.length ?? 0) > 0 && (
                <SectionCard
                    icon={Tag}
                    title="Required Skills"
                    iconBg="bg-primary/10"
                    iconColor="text-primary"
                    strip="bg-primary"
                >
                    <div className="flex flex-wrap gap-2">
                        {job.skills!.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="rounded-full px-3 py-1 text-xs font-medium bg-primary/8 text-primary border border-primary/20"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* ── Requirements / Responsibilities / Benefits ──────────────── */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <SectionCard
                    icon={CheckCircle2}
                    title="Requirements"
                    iconBg="bg-emerald-500/10"
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    strip="bg-emerald-500"
                >
                    <ListSection
                        items={(job as any).requirements || []}
                        emptyText="No requirements listed"
                    />
                </SectionCard>

                <SectionCard
                    icon={Award}
                    title="Responsibilities"
                    iconBg="bg-orange-500/10"
                    iconColor="text-orange-600 dark:text-orange-400"
                    strip="bg-orange-500"
                >
                    <ListSection
                        items={(job as any).responsibilities || []}
                        emptyText="No responsibilities listed"
                    />
                </SectionCard>

                <SectionCard
                    icon={Gift}
                    title="Benefits"
                    iconBg="bg-pink-500/10"
                    iconColor="text-pink-600 dark:text-pink-400"
                    strip="bg-pink-500"
                >
                    <ListSection
                        items={(job as any).benefits || []}
                        emptyText="No benefits listed"
                    />
                </SectionCard>
            </div>


            {/* ── Mobile sticky action bar ────────────────────────────────── */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-sm p-3 sm:hidden">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleReject}
                        disabled={isBusy}
                        className="flex-1 gap-2 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                        {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        Reject
                    </Button>
                    <Button
                        onClick={() => approveMutate()}
                        disabled={isBusy}
                        className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                        Approve Job
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PendingJobDetailsContent;
