"use client";

import { Textarea } from "@/components/ui/textarea";
import { applyToJob, checkIfApplied } from "@/services/application.services";
import { getJobs } from "@/services/job.services";
import { getMyResume } from "@/services/resume.services";
import { IJob } from "@/types/user.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
    AlertTriangle, ArrowLeft, ArrowRight, Award, BadgeCheck,
    Bookmark, Briefcase, Building2, Calendar, CheckCircle2,
    ChevronRight, Clock, Crown, DollarSign,
    ExternalLink, Globe, Loader2, Lock,
    MapPin, Send, Sparkles, TrendingUp,
    Users, Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface JobDetailsContentProps {
    job: IJob;
    userRole?: string;
    isPremium?: boolean;
}

// ── Label maps ─────────────────────────────────────────────────────────────────
const JOB_TYPE_LABEL: Record<string, string> = {
    FULL_TIME: "Full Time", PART_TIME: "Part Time",
    CONTRACT: "Contract", INTERNSHIP: "Internship", FREELANCE: "Freelance",
};
const EXP_LABEL: Record<string, string> = {
    ENTRY: "Entry Level", MID: "Mid Level", SENIOR: "Senior Level",
    LEAD: "Lead", EXECUTIVE: "Executive",
};

// ── Badge color maps ───────────────────────────────────────────────────────────
const LOCATION_TYPE_COLOR: Record<string, string> = {
    REMOTE: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    ONSITE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    HYBRID: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800",
};
const JOB_TYPE_COLOR: Record<string, string> = {
    FULL_TIME: "bg-primary/10 text-primary border-primary/25",
    PART_TIME: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    CONTRACT: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    INTERNSHIP: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    FREELANCE: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
};
const EXP_COLOR: Record<string, string> = {
    ENTRY: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    MID: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    SENIOR: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800",
    LEAD: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    EXECUTIVE: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
};

// Avatar color by first letter
const AVATAR_COLORS = [
    "from-blue-500 to-blue-700",
    "from-violet-500 to-violet-700",
    "from-emerald-500 to-emerald-700",
    "from-orange-500 to-orange-700",
    "from-rose-500 to-rose-700",
    "from-cyan-500 to-cyan-700",
    "from-amber-500 to-amber-700",
    "from-teal-500 to-teal-700",
];
const avatarGradient = (name: string) =>
    AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// ── Sub-components ─────────────────────────────────────────────────────────────
const Pill = ({ label, colorCls }: { label: string; colorCls: string }) => (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${colorCls}`}>
        {label}
    </span>
);

const SectionCard = ({ icon: Icon, title, children, accent = "primary" }: {
    icon: React.ElementType; title: string; children: React.ReactNode; accent?: string;
}) => {
    const accentCls = accent === "primary"
        ? "bg-linear-to-b from-primary to-primary/10"
        : "bg-linear-to-b from-emerald-500 to-emerald-500/10";
    return (
        <div className="relative rounded-2xl border border-border/40 bg-card overflow-hidden group hover:border-border/70 transition-colors duration-200">
            <div className={`absolute left-0 inset-y-0 w-0.75 ${accentCls}`} />
            <div className="px-5 py-3.5 border-b border-border/30 flex items-center gap-2.5 bg-muted/10">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <h3 className="text-sm font-bold tracking-tight">{title}</h3>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
};

const BulletItem = ({ text, check }: { text: string; check?: boolean }) => (
    <li className="flex items-start gap-3 py-2 border-b border-border/10 last:border-0">
        <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${check ? "bg-emerald-500/15" : "bg-primary/10"}`}>
            {check
                ? <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                : <ChevronRight className="h-3 w-3 text-primary" />}
        </div>
        <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
    </li>
);

const MetaStat = ({ icon: Icon, label, value, highlight }: {
    icon: React.ElementType; label: string; value: React.ReactNode; highlight?: boolean;
}) => (
    <div className={`flex flex-col items-center justify-center py-5 px-3 text-center gap-1 ${highlight ? "bg-primary/3" : ""}`}>
        <div className={`h-8 w-8 rounded-xl flex items-center justify-center mb-1 ${highlight ? "bg-primary/10" : "bg-muted/40"}`}>
            <Icon className={`h-4 w-4 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">{label}</p>
        <p className={`text-sm font-black leading-tight ${highlight ? "text-primary" : ""}`}>{value}</p>
    </div>
);

// Related job mini-card
const RelatedJobCard = ({ job }: { job: IJob }) => {
    const salary = job.salaryMin && job.salaryMax
        ? `৳${job.salaryMin.toLocaleString()} – ৳${job.salaryMax.toLocaleString()}`
        : null;
    const grad = avatarGradient(job.company ?? "C");

    return (
        <Link href={`/jobs/${job.id}`}
            className="group relative rounded-2xl border border-border/40 bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 flex flex-col">
            {/* Subtle top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary/60 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="p-4 flex-1 flex flex-col gap-3">
                {/* Company row */}
                <div className="flex items-center gap-2.5">
                    <div className={`h-9 w-9 rounded-xl bg-linear-to-br ${grad} flex items-center justify-center font-black text-sm text-white shrink-0 shadow-sm`}>
                        {job.company?.[0]?.toUpperCase() ?? "C"}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{job.company}</p>
                        {job.location && (
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                                <MapPin className="h-2.5 w-2.5 shrink-0" />{job.location}
                            </p>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h4 className="text-sm font-black leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {job.title}
                </h4>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                    {job.locationType && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${LOCATION_TYPE_COLOR[job.locationType] ?? "bg-muted text-muted-foreground border-border/40"}`}>
                            {job.locationType}
                        </span>
                    )}
                    {job.jobType && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${JOB_TYPE_COLOR[job.jobType] ?? "bg-muted text-muted-foreground border-border/40"}`}>
                            {JOB_TYPE_LABEL[job.jobType] ?? job.jobType}
                        </span>
                    )}
                </div>

                {/* Salary + arrow */}
                {salary && (
                    <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-1">
                        <span className="text-xs font-bold text-primary">{salary}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                )}
            </div>
        </Link>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const JobDetailsContent = ({ job, userRole, isPremium }: JobDetailsContentProps) => {
    const [coverLetter, setCoverLetter] = useState("");
    const [showApplyForm, setShowApplyForm] = useState(false);

    const cannotApply = ["ADMIN", "SUPER_ADMIN", "RECRUITER"].includes(userRole || "");

    const { data: resumeData } = useQuery({
        queryKey: ["my-resume"],
        queryFn: getMyResume,
        enabled: !cannotApply,
    });

    const { data: appliedData, refetch: refetchApplied } = useQuery({
        queryKey: ["check-applied", job.id],
        queryFn: () => checkIfApplied(job.id),
        enabled: !cannotApply,
    });

    const { data: relatedData } = useQuery({
        queryKey: ["related-jobs", job.categoryId],
        queryFn: () => getJobs({ categoryId: job.categoryId, status: "LIVE", limit: 5 }),
        enabled: !!job.categoryId,
    });

    const relatedJobs = (relatedData?.data ?? [])
        .filter((j: IJob) => j.id !== job.id)
        .slice(0, 4);

    const hasApplied = appliedData?.data?.hasApplied ?? false;
    const profileCompletion = resumeData?.data?.profileCompletion ?? 0;
    const isProfileComplete = profileCompletion >= 60;
    const canApply = isProfileComplete && !cannotApply && !hasApplied;

    const { mutateAsync: apply, isPending } = useMutation({
        mutationFn: () => applyToJob({ jobId: job.id, coverLetter: coverLetter || undefined }),
        onSuccess: () => {
            toast.success("Application submitted successfully!");
            setShowApplyForm(false);
            setCoverLetter("");
            refetchApplied();
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || error.message || "Failed to apply");
        },
    });

    const isLive = job.status === "LIVE";
    const salary = job.salaryMin && job.salaryMax
        ? `৳${job.salaryMin.toLocaleString()} – ৳${job.salaryMax.toLocaleString()}`
        : null;
    const postedAgo = job.createdAt
        ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
        : "N/A";
    const deadlineText = job.applicationDeadline
        ? format(new Date(job.applicationDeadline), "MMM d, yyyy")
        : null;

    const companyInitial = job.company?.[0]?.toUpperCase() ?? "C";
    const grad = avatarGradient(job.company ?? "C");

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 pb-28 lg:pb-10">

            {/* Back link */}
            <Link href="/jobs"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-semibold group">
                <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                </div>
                Back to Jobs
            </Link>

            {/* ── HERO CARD ─────────────────────────────────────────────────────── */}
            <div className="rounded-3xl border border-border/40 bg-card overflow-hidden shadow-xl shadow-black/5">

                {/* Cover */}
                <div className="relative h-32 sm:h-40 overflow-hidden">
                    {/* Gradient bg */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary via-orange-500 to-orange-700" />
                    {/* Dot grid */}
                    <div className="absolute inset-0 opacity-[0.08]"
                        style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
                    {/* Ambient blobs */}
                    <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute top-1/2 left-1/3 h-32 w-32 rounded-full bg-orange-300/20 blur-2xl -translate-y-1/2" />

                    {/* Badges row */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        {job.urgentHiring && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500/30 text-white border border-white/20 backdrop-blur-md">
                                <Zap className="h-2.5 w-2.5" /> Urgent
                            </span>
                        )}
                        {job.featuredJob && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/30 text-white border border-white/20 backdrop-blur-md">
                                <Sparkles className="h-2.5 w-2.5" /> Featured
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black border backdrop-blur-md ${isLive ? "bg-green-500/20 text-white border-white/30" : "bg-red-500/20 text-white border-white/30"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-green-300 animate-pulse" : "bg-red-300"}`} />
                            {isLive ? "Actively Hiring" : job.status}
                        </span>
                    </div>
                </div>

                {/* Company + title */}
                <div className="px-6 sm:px-8 pt-4">
                    <div className="flex items-end gap-4 mb-5">
                        {/* Company avatar — gradient ring */}
                        <div className={`p-[3px] rounded-2xl bg-linear-to-br ${grad} shadow-xl shrink-0`}>
                            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-[14px] border-2 border-card bg-card flex items-center justify-center font-black text-2xl sm:text-3xl text-primary">
                                {companyInitial}
                            </div>
                        </div>
                        <div className="pb-1 min-w-0 flex-1">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">{job.title}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                                <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5 shrink-0 text-primary/60" />{job.company}
                                </span>
                                {job.location && (
                                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />{job.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pb-5">
                        {job.locationType && <Pill label={job.locationType} colorCls={LOCATION_TYPE_COLOR[job.locationType] ?? "bg-muted text-muted-foreground border-border/40"} />}
                        {job.jobType && <Pill label={JOB_TYPE_LABEL[job.jobType] ?? job.jobType} colorCls={JOB_TYPE_COLOR[job.jobType] ?? "bg-muted text-muted-foreground border-border/40"} />}
                        {job.experienceLevel && <Pill label={EXP_LABEL[job.experienceLevel] ?? job.experienceLevel} colorCls={EXP_COLOR[job.experienceLevel] ?? "bg-muted text-muted-foreground border-border/40"} />}
                        {job.category && <Pill label={job.category.title} colorCls="bg-muted/60 text-muted-foreground border-border/40" />}
                    </div>
                </div>

                {/* Meta strip */}
                <div className={`grid border-t border-border/30 divide-x divide-border/30 ${salary ? (deadlineText ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3") : (deadlineText ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2")}`}>
                    {salary && <MetaStat icon={DollarSign} label="Salary" value={salary} highlight />}
                    <MetaStat icon={Users} label="Vacancies" value={`${job.vacancies ?? 1} open`} />
                    <MetaStat icon={Clock} label="Posted" value={postedAgo} />
                    {deadlineText && <MetaStat icon={Calendar} label="Deadline" value={deadlineText} />}
                </div>
            </div>

            {/* ── MAIN GRID ──────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── LEFT ──────────────────────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Description */}
                    <SectionCard icon={Briefcase} title="Job Description">
                        <div className="text-sm text-muted-foreground leading-7 whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </SectionCard>

                    {/* Responsibilities */}
                    {(job.responsibilities?.length ?? 0) > 0 && (
                        <SectionCard icon={TrendingUp} title="Responsibilities">
                            <ul className="space-y-0">
                                {job.responsibilities!.map((r, i) => <BulletItem key={i} text={r} />)}
                            </ul>
                        </SectionCard>
                    )}

                    {/* Requirements */}
                    {(job.requirements?.length ?? 0) > 0 && (
                        <SectionCard icon={Bookmark} title="Requirements">
                            <ul className="space-y-0">
                                {job.requirements!.map((r, i) => <BulletItem key={i} text={r} />)}
                            </ul>
                        </SectionCard>
                    )}

                    {/* Skills */}
                    {(job.skills?.length ?? 0) > 0 && (
                        <SectionCard icon={Zap} title="Required Skills">
                            <div className="flex flex-wrap gap-2">
                                {job.skills!.map((skill) => (
                                    <span key={skill}
                                        className="px-3 py-1.5 rounded-xl bg-primary/8 text-primary text-xs font-bold border border-primary/15 hover:bg-primary/15 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {/* Benefits */}
                    {(job.benefits?.length ?? 0) > 0 && (
                        <SectionCard icon={Award} title="Benefits & Perks" accent="green">
                            <ul className="space-y-0">
                                {job.benefits!.map((b, i) => <BulletItem key={i} text={b} check />)}
                            </ul>
                        </SectionCard>
                    )}

                    {/* ── Related Jobs ─────────────────────────────────────────── */}
                    {relatedJobs.length > 0 && (
                        <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black tracking-tight">Related Jobs</h3>
                                        {job.category && (
                                            <p className="text-[11px] text-muted-foreground">More in {job.category.title}</p>
                                        )}
                                    </div>
                                </div>
                                <Link href={`/jobs${job.categoryId ? `?categoryId=${job.categoryId}` : ""}`}
                                    className="text-[11px] font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1">
                                    View all <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>

                            {/* 2-col grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {relatedJobs.map((j: IJob) => (
                                    <RelatedJobCard key={j.id} job={j} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT — sticky sidebar ─────────────────────────────────── */}
                <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">

                    {/* Apply card */}
                    {!cannotApply && (
                        <div className="relative rounded-2xl border border-border/40 bg-card overflow-hidden shadow-lg shadow-black/5">
                            <div className="absolute left-0 inset-y-0 w-0.75 bg-linear-to-b from-primary to-primary/10" />

                            {/* Card header */}
                            <div className="px-5 py-4 border-b border-border/30 bg-linear-to-r from-primary/8 to-transparent flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-black text-sm tracking-tight">Apply for this Position</h3>
                                    {job._count?.applications !== undefined && (
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            {job._count.applications} applicant{job._count.applications !== 1 ? "s" : ""} so far
                                        </p>
                                    )}
                                </div>
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${hasApplied ? "bg-emerald-500/10" : "bg-primary/10"}`}>
                                    {hasApplied
                                        ? <BadgeCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        : <Send className="h-4 w-4 text-primary" />}
                                </div>
                            </div>

                            <div className="p-5">
                                {isLive ? (
                                    <>
                                        {!showApplyForm ? (
                                            <div className="space-y-3">
                                                {/* Already applied */}
                                                {hasApplied && (
                                                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-3.5 flex items-start gap-3">
                                                        <div className="h-7 w-7 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-emerald-900 dark:text-emerald-100">Application submitted</p>
                                                            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                                                                You&apos;ve already applied for this position.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Profile incomplete */}
                                                {!hasApplied && !isProfileComplete && (
                                                    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3.5 flex items-start gap-3">
                                                        <div className="h-7 w-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-black text-amber-900 dark:text-amber-100">Profile incomplete</p>
                                                            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                                                                {profileCompletion}% done — need 60% to apply.
                                                            </p>
                                                            <div className="h-1 rounded-full bg-amber-200 dark:bg-amber-900 mt-2 overflow-hidden">
                                                                <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${profileCompletion}%` }} />
                                                            </div>
                                                            <Link href="/dashboard/my-resume"
                                                                className="text-[11px] font-bold text-amber-700 dark:text-amber-400 underline mt-1.5 inline-flex items-center gap-1 hover:text-amber-800">
                                                                Complete profile <ChevronRight className="h-3 w-3" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => setShowApplyForm(true)}
                                                    disabled={!canApply}
                                                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-black shadow-lg transition-all duration-150 ${hasApplied
                                                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-not-allowed"
                                                            : "bg-primary text-primary-foreground shadow-primary/25 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                                        }`}
                                                >
                                                    {hasApplied
                                                        ? <><BadgeCheck className="h-4 w-4" /> Already Applied</>
                                                        : <><Send className="h-4 w-4" /> Apply Now</>}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                        Cover Letter <span className="normal-case font-medium">(optional)</span>
                                                    </label>
                                                    <Textarea
                                                        placeholder="Tell us why you're the perfect fit for this role…"
                                                        value={coverLetter}
                                                        onChange={(e) => setCoverLetter(e.target.value)}
                                                        rows={5}
                                                        className="resize-none text-sm rounded-xl border-border/60 focus-visible:ring-primary/30"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => apply()}
                                                        disabled={isPending}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 disabled:opacity-60 transition-all"
                                                    >
                                                        {isPending
                                                            ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting…</>
                                                            : <><Send className="h-3.5 w-3.5" /> Submit</>}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowApplyForm(false); setCoverLetter(""); }}
                                                        className="px-4 py-2.5 rounded-xl border border-border/60 bg-transparent hover:bg-muted/40 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/40">
                                        <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            This position is no longer accepting applications.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recruiter / Admin notice */}
                    {cannotApply && (
                        <div className="relative rounded-2xl border border-border/40 bg-card overflow-hidden">
                            <div className="absolute left-0 inset-y-0 w-0.75 bg-linear-to-b from-muted-foreground/40 to-transparent" />
                            <div className="p-5 flex items-start gap-3">
                                <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Viewing Only</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {userRole === "RECRUITER" ? "Recruiters cannot apply to jobs." : "Admins cannot apply to jobs."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Company Info */}
                    {job.recruiter && (
                        <div className="relative rounded-2xl border border-border/40 bg-card overflow-hidden">
                            <div className="absolute left-0 inset-y-0 w-0.75 bg-linear-to-b from-primary to-primary/10" />
                            <div className="px-5 py-3.5 border-b border-border/30 flex items-center gap-2.5 bg-muted/10">
                                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Building2 className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <h3 className="text-sm font-bold tracking-tight">Company Info</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`h-11 w-11 rounded-xl bg-linear-to-br ${avatarGradient(job.recruiter.companyName ?? job.company ?? "C")} flex items-center justify-center font-black text-lg text-white shrink-0 shadow-sm`}>
                                        {(job.recruiter.companyName ?? job.company)?.[0]?.toUpperCase() ?? "C"}
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">{job.recruiter.companyName ?? job.company}</p>
                                        {job.recruiter.industry && (
                                            <p className="text-xs text-muted-foreground">{job.recruiter.industry}</p>
                                        )}
                                    </div>
                                </div>

                                {job.recruiter.companyAddress && (
                                    <div className="flex items-start gap-2.5">
                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
                                        <span className="text-xs text-muted-foreground leading-relaxed">{job.recruiter.companyAddress}</span>
                                    </div>
                                )}

                                {job.recruiter.companyWebsite && (
                                    <a href={job.recruiter.companyWebsite} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity group">
                                        <Globe className="h-3.5 w-3.5 shrink-0" />
                                        <span className="text-xs font-semibold truncate">{job.recruiter.companyWebsite}</span>
                                        <ExternalLink className="h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100" />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Contact Recruiter */}
                    {job.recruiter && (
                        <div className="relative rounded-2xl border border-border/40 bg-card overflow-hidden">
                            <div className="absolute left-0 inset-y-0 w-0.75 bg-linear-to-b from-primary to-primary/10" />
                            <div className="px-5 py-3.5 border-b border-border/30 flex items-center gap-2.5 bg-muted/10">
                                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Users className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <h3 className="text-sm font-bold tracking-tight">Contact Recruiter</h3>
                            </div>
                            <div className="p-5">
                                {isPremium ? (
                                    job.recruiter.email ? (
                                        <a href={`mailto:${job.recruiter.email}`}
                                            className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <Send className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Email</p>
                                                <p className="text-sm font-semibold text-primary truncate">{job.recruiter.email}</p>
                                            </div>
                                        </a>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No contact email available.</p>
                                    )
                                ) : (
                                    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4 flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                                            <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                                <p className="text-xs font-black text-amber-900 dark:text-amber-100">Premium Feature</p>
                                            </div>
                                            <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                                                Upgrade to contact the recruiter directly via email.
                                            </p>
                                            <Link href="/dashboard/subscriptions"
                                                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[11px] font-black hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/30">
                                                <Sparkles className="h-3 w-3" /> Upgrade Now
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── MOBILE STICKY APPLY BAR ──────────────────────────────────────── */}
            {!cannotApply && isLive && !showApplyForm && (
                <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 py-3 bg-background/85 backdrop-blur-xl border-t border-border/40">
                    <button
                        type="button"
                        onClick={() => {
                            if (hasApplied) return;
                            setShowApplyForm(true);
                            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
                        }}
                        disabled={!canApply}
                        className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-black shadow-xl transition-all ${hasApplied
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-not-allowed"
                                : "bg-primary text-primary-foreground shadow-primary/30 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}
                    >
                        {hasApplied
                            ? <><BadgeCheck className="h-4 w-4" /> Already Applied</>
                            : <><Send className="h-4 w-4" /> Apply Now — {job.title}</>}
                    </button>
                </div>
            )}
        </div>
    );
};

export default JobDetailsContent;
