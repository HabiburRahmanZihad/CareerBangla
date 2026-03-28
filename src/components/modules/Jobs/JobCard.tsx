import { IJob } from "@/types/user.types";
import { differenceInDays } from "date-fns";
import {
    Banknote,
    Bookmark,
    Briefcase,
    Building2,
    Clock,
    MapPin,
    Star,
    Users,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ── Constants ─────────────────────────────────────────────────────────────────
export const JOB_TYPE_LABELS: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    REMOTE: "Remote",
};

const AVATAR_COLORS = [
    "from-orange-400 to-orange-600",
    "from-violet-400 to-violet-600",
    "from-emerald-400 to-emerald-600",
    "from-blue-400 to-blue-600",
    "from-pink-400 to-pink-600",
    "from-cyan-400 to-cyan-600",
    "from-amber-400 to-amber-600",
    "from-indigo-400 to-indigo-600",
    "from-teal-400 to-teal-600",
    "from-rose-400 to-rose-600",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const getAvatarGradient = (str: string) => {
    let hash = 0;
    for (const c of str) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const fmt = (n: number) => (n >= 1000 ? `৳${(n / 1000).toFixed(0)}k` : `৳${n}`);
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return `Up to ${fmt(max!)}`;
};

export const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// ── Company Logo ──────────────────────────────────────────────────────────────
const CompanyLogo = ({
    name,
    logoUrl,
    size = "md",
}: {
    name: string;
    logoUrl?: string | null;
    size?: "sm" | "md";
}) => {
    const gradient = getAvatarGradient(name);
    const dim =
        size === "sm"
            ? "h-9 w-9 sm:h-10 sm:w-10 text-sm"
            : "h-10 w-10 sm:h-12 sm:w-12 text-sm sm:text-base";
    if (logoUrl) {
        return (
            <div
                className={`${dim} rounded-xl border-2 border-border bg-white shrink-0 overflow-hidden flex items-center justify-center shadow-sm`}
            >
                <Image
                    src={logoUrl}
                    alt={name}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full p-0.5"
                />
            </div>
        );
    }
    return (
        <div
            className={`${dim} rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center text-white font-bold shrink-0 shadow-sm`}
        >
            {name.charAt(0).toUpperCase()}
        </div>
    );
};

// ── List Card ─────────────────────────────────────────────────────────────────
export const JobListCard = ({ job }: { job: IJob }) => {
    const salary = formatSalary(job.salaryMin, job.salaryMax);
    const deadline = job.deadline || job.applicationDeadline;
    const daysLeft = deadline ? differenceInDays(new Date(deadline), new Date()) : null;
    const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
    const appCount = job._count?.applications;
    const logoUrl = job.recruiter?.companyLogo || job.recruiter?.profilePhoto || null;
    const companyName = job.recruiter?.companyName || job.company || "Company";
    const descSnippet = job.description ? stripHtml(job.description).slice(0, 120) : null;

    return (
        <Link href={`/jobs/${job.id}`} className="block group">
            <div
                className={`
                    relative flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border
                    backdrop-blur-sm bg-white/80 dark:bg-white/5
                    border-white/60 dark:border-white/10
                    transition-all duration-200 ease-out
                    hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5
                    hover:bg-white/95 dark:hover:bg-white/10 hover:border-primary/30
                    before:absolute before:left-0 before:top-3 before:bottom-3 before:w-0.75
                    before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity
                    group-hover:before:opacity-100
                    ${job.featuredJob ? "border-amber-300/70 dark:border-amber-700/50 bg-amber-50/40 dark:bg-amber-950/10" : ""}
                `}
            >
                <CompanyLogo name={companyName} logoUrl={logoUrl} />

                <div className="flex-1 min-w-0">
                    {/* Status badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        {job.featuredJob && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                                <Star className="h-2.5 w-2.5 fill-current" /> Featured
                            </span>
                        )}
                        {job.urgentHiring && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">
                                <Zap className="h-2.5 w-2.5 fill-current" /> Urgent
                            </span>
                        )}
                        {isExpiringSoon && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full">
                                <Clock className="h-2.5 w-2.5" />
                                {daysLeft === 0 ? "Expires today" : `${daysLeft}d left`}
                            </span>
                        )}
                    </div>

                    <h3 className="font-semibold text-[15px] leading-snug group-hover:text-primary transition-colors line-clamp-1 mb-0.5">
                        {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mb-1.5">
                        <span className="flex items-center gap-1 font-medium text-foreground/70">
                            <Building2 className="h-3 w-3" />
                            {companyName}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                        </span>
                        {job.category?.title && (
                            <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {job.category.title}
                            </span>
                        )}
                    </div>

                    {descSnippet && (
                        <p className="hidden sm:block text-xs text-muted-foreground line-clamp-1 mb-2 leading-relaxed">
                            {descSnippet}…
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                            {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                        </span>
                        {job.locationType && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                                {job.locationType.charAt(0) + job.locationType.slice(1).toLowerCase()}
                            </span>
                        )}
                        {salary && (
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                <Banknote className="h-3.5 w-3.5" />
                                {salary}
                            </span>
                        )}
                        {appCount !== undefined && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                                <Users className="h-3 w-3" />
                                {appCount} applied
                            </span>
                        )}
                    </div>
                </div>

                <Bookmark className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-60 transition-all" />
            </div>
        </Link>
    );
};

// ── Grid Card ─────────────────────────────────────────────────────────────────
export const JobGridCard = ({ job }: { job: IJob }) => {
    const salary = formatSalary(job.salaryMin, job.salaryMax);
    const deadline = job.deadline || job.applicationDeadline;
    const daysLeft = deadline ? differenceInDays(new Date(deadline), new Date()) : null;
    const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
    const appCount = job._count?.applications;
    const logoUrl = job.recruiter?.companyLogo || job.recruiter?.profilePhoto || null;
    const companyName = job.recruiter?.companyName || job.company || "Company";
    const descSnippet = job.description ? stripHtml(job.description).slice(0, 90) : null;

    return (
        <Link href={`/jobs/${job.id}`} className="block group h-full">
            <div
                className={`
                    relative h-full flex flex-col rounded-2xl border overflow-hidden
                    backdrop-blur-sm bg-white/80 dark:bg-white/5
                    border-white/60 dark:border-white/10
                    transition-all duration-200 ease-out
                    hover:shadow-2xl hover:shadow-primary/8 hover:-translate-y-1
                    hover:bg-white/95 dark:hover:bg-white/10 hover:border-primary/30
                    ${job.featuredJob ? "border-amber-300/60 dark:border-amber-700/40 bg-amber-50/30 dark:bg-amber-950/10" : ""}
                `}
            >
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-primary/60 via-primary to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                        <CompanyLogo name={companyName} logoUrl={logoUrl} />
                        <div className="flex flex-col items-end gap-1">
                            <Bookmark className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-60 transition-all" />
                            {job.featuredJob && (
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                    <Star className="h-2.5 w-2.5 fill-current" /> Featured
                                </span>
                            )}
                        </div>
                    </div>

                    {(job.urgentHiring || isExpiringSoon) && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {job.urgentHiring && (
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                    <Zap className="h-2.5 w-2.5 fill-current" /> Urgent
                                </span>
                            )}
                            {isExpiringSoon && (
                                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                    <Clock className="h-2.5 w-2.5" />
                                    {daysLeft === 0 ? "Today" : `${daysLeft}d left`}
                                </span>
                            )}
                        </div>
                    )}

                    <h3 className="font-bold text-[14px] leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {job.title}
                    </h3>

                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">{companyName}</span>
                    </p>

                    {descSnippet && (
                        <p className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-relaxed mb-3">
                            {descSnippet}…
                        </p>
                    )}

                    <div className="mt-auto space-y-1.5">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0 text-primary/60" />
                            <span className="truncate">{job.location}</span>
                        </div>
                        {job.category?.title && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Briefcase className="h-3 w-3 shrink-0 text-primary/60" />
                                <span className="truncate">{job.category.title}</span>
                            </div>
                        )}
                        {salary && (
                            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                <Banknote className="h-3 w-3 shrink-0" />
                                {salary}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-5 pb-4 flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                        {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                    </span>
                    {appCount !== undefined && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {appCount}
                        </span>
                    )}
                </div>

                {/* Bottom accent bar */}
                <div className="h-0.5 w-full bg-linear-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
        </Link>
    );
};
