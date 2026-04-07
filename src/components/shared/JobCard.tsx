import { IJob } from "@/types/user.types";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { Banknote, Bookmark, Briefcase, Building2, Clock, MapPin, Star, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AVATAR_COLORS = [
    "from-orange-400 to-orange-600",
    "from-violet-400 to-violet-600",
    "from-emerald-400 to-emerald-600",
    "from-blue-400 to-blue-600",
    "from-pink-400 to-pink-600",
    "from-cyan-400 to-cyan-600",
    "from-amber-400 to-amber-600",
    "from-indigo-400 to-indigo-600",
];

const JOB_TYPE_LABELS: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
};

const getAvatarGradient = (str: string) => {
    let hash = 0;
    for (const c of str) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const fmt = (n: number) => (n >= 1000 ? `৳${(n / 1000).toFixed(0)}k` : `৳${n}`);
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return `Up to ${fmt(max!)}`;
};

interface JobCardProps {
    job: IJob;
}

const JobCard = ({ job }: JobCardProps) => {
    const salary = formatSalary(job.salaryMin, job.salaryMax);
    const deadline = job.deadline || job.applicationDeadline;
    const daysLeft = deadline ? differenceInDays(new Date(deadline), new Date()) : null;
    const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
    const logoUrl = job.recruiter?.companyLogo || job.recruiter?.profilePhoto || null;
    const companyName = job.recruiter?.companyName || job.company || "Company";
    const gradient = getAvatarGradient(companyName);

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
                {/* Company Logo */}
                {logoUrl ? (
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border-2 border-border bg-white shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                        <Image src={logoUrl} alt={companyName} width={48} height={48} className="object-contain w-full h-full p-1" />
                    </div>
                ) : (
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center text-white font-bold shrink-0 shadow-sm`}>
                        {companyName.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="flex-1 min-w-0">
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
                        {job.createdAt && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                            </span>
                        )}
                    </div>

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
                        {job._count?.applications !== undefined && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                                <Users className="h-3 w-3" />
                                {job._count.applications} applied
                            </span>
                        )}
                    </div>
                </div>

                <Bookmark className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-60 transition-all" />
            </div>
        </Link>
    );
};

export default JobCard;
