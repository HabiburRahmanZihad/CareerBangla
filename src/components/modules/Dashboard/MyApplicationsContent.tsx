"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyApplications } from "@/services/application.services";
import { IApplication } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
    Banknote,
    Briefcase,
    Building2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    Folders,
    LineChart,
    MapPin,
    SearchX,
    Sparkles,
    Star,
    Video,
    XCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const statusConfig: Record<string, { label: string; colorClass: string; icon: React.ElementType }> = {
    PENDING: { label: "In Review", colorClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50", icon: Clock },
    SHORTLISTED: { label: "Shortlisted", colorClass: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50", icon: Star },
    INTERVIEW: { label: "Interviewing", colorClass: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-900/50", icon: Video },
    HIRED: { label: "Hired!", colorClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50", icon: Sparkles },
    REJECTED: { label: "Not Selected", colorClass: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50", icon: XCircle },
};

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

const avatarGradient = (name: string) => AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

export const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const fmt = (n: number) => (n >= 1000 ? `৳${(n / 1000).toFixed(0)}k` : `৳${n}`);
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return `Up to ${fmt(max!)}`;
};

const MyApplicationsContent = () => {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ["my-applications", page],
        queryFn: () => getMyApplications({ page: String(page), limit: "10" }),
    });

    const applications: IApplication[] = data?.data || [];
    const meta = data?.meta;

    if (isLoading) {
        return (
            <div className="space-y-6 w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Skeleton className="h-9 w-64 mb-2" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <Skeleton className="h-10 w-40 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-72 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full container mx-auto space-y-6 lg:space-y-8 pb-10">
            {/* Header Area */}
            <div className="relative rounded-3xl border border-border/40 bg-card overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5" />
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Folders className="w-48 h-48 -rotate-12" />
                </div>

                <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-2">
                            <LineChart className="w-4 h-4" /> Activity Log
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                            My Applications
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
                            Track and manage the status of jobs you have applied to.
                        </p>
                    </div>
                    <div className="relative z-10 shrink-0 bg-card/80 backdrop-blur-md rounded-2xl p-4 border border-border/50 text-center shadow-lg shadow-black/5 flex items-center justify-center min-w-35">
                        <div>
                            <p className="text-3xl font-black text-primary">{meta?.total || applications.length}</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Total Applied</p>
                        </div>
                    </div>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border bg-muted/10 py-20 px-6 flex flex-col items-center justify-center text-center">
                    <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6 shadow-inner">
                        <SearchX className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Applications Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                        You haven&apos;t submitted any job applications yet. Browse the latest job openings and take the next step in your career.
                    </p>
                    <Link href="/jobs">
                        <Button className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform gap-2">
                            <Briefcase className="w-4 h-4" /> Browse Jobs Now
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
                        {applications.map((app) => {
                            const job = app.job;
                            const companyName = job?.recruiter?.companyName || job?.company || "Unknown Company";
                            const logoUrl = job?.recruiter?.companyLogo || job?.recruiter?.profilePhoto;
                            const initial = companyName.charAt(0).toUpperCase();
                            const salaryStr = formatSalary(job?.salaryMin, job?.salaryMax);
                            const conf = statusConfig[app.status] || { label: app.status, colorClass: "bg-muted text-muted-foreground border-border", icon: Clock };
                            const StatusIcon = conf.icon;

                            return (
                                <div key={app.id} className="group relative flex flex-col rounded-2xl border border-border/40 bg-card overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                                    {/* Top Accent Gradient */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary/60 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Status Badge (Absolute Top Right) */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] sm:text-xs font-black uppercase tracking-wider ${conf.colorClass} bg-card/80 backdrop-blur-md shadow-sm`}>
                                            <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            {conf.label}
                                        </span>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1 mt-6">
                                        {/* Avatar & Title Section */}
                                        <div className="flex flex-col items-center text-center gap-3 mb-5">
                                            {/* Logo */}
                                            <div className="shrink-0 relative">
                                                {logoUrl ? (
                                                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border border-border/40 bg-white flex items-center justify-center overflow-hidden shadow-sm">
                                                        <Image
                                                            src={logoUrl}
                                                            alt={companyName}
                                                            width={80}
                                                            height={80}
                                                            className="w-full h-full object-contain p-1.5"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-linear-to-br ${avatarGradient(companyName)} flex items-center justify-center font-black text-3xl text-white shadow-sm`}>
                                                        {initial}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Job Info */}
                                            <div className="flex flex-col w-full px-1">
                                                <div className="flex justify-center items-center gap-1.5 mb-1 w-full">
                                                    <Link href={`/jobs/${app.jobId}`} className="text-base font-bold hover:text-primary transition-colors line-clamp-1 truncate w-full text-center" title={job?.title || "Unknown Job Role"}>
                                                        {job?.title || "Unknown Job Role"}
                                                    </Link>
                                                    {job && (
                                                        <Link href={`/jobs/${job.id}`} className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all inline-flex bg-muted/40 rounded-md p-1 mt-0.5" title="View Job Details">
                                                            <FileText className="w-3.5 h-3.5" />
                                                        </Link>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground w-full">
                                                    <Building2 className="w-3.5 h-3.5 opacity-70 shrink-0" />
                                                    <span className="truncate" title={companyName}>{companyName}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Key Details List */}
                                        <div className="flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground font-medium mb-auto w-full">
                                            {job?.location && (
                                                <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-xl border border-border/30">
                                                    <MapPin className="w-4 h-4 opacity-70 shrink-0 text-foreground/70" />
                                                    <span className="truncate" title={job.location}>{job.location}</span>
                                                </div>
                                            )}
                                            {salaryStr && (
                                                <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-2 rounded-xl border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                                                    <Banknote className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="truncate font-semibold">{salaryStr}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bottom Row / Extras */}
                                        <div className="mt-5 pt-5 border-t border-border/30 flex flex-col gap-3">
                                            {job && (
                                                <div className="flex flex-wrap items-center justify-center gap-2">
                                                    {job.jobType && (
                                                        <span className="px-2 py-1 rounded-md text-[11px] bg-muted/60 text-muted-foreground font-semibold border border-border/40 uppercase tracking-wide">
                                                            {job.jobType.replace("_", " ")}
                                                        </span>
                                                    )}
                                                    {job.locationType && (
                                                        <span className="px-2 py-1 rounded-md text-[11px] bg-muted/60 text-muted-foreground font-semibold border border-border/40 uppercase tracking-wide">
                                                            {job.locationType}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between text-[11px] text-muted-foreground w-full mt-2 bg-muted/20 px-3 py-2 rounded-lg border border-border/20">
                                                <div className="flex items-center justify-center gap-1 font-medium">
                                                    <Calendar className="w-3.5 h-3.5 opacity-80" />
                                                    {app.createdAt ? format(new Date(app.createdAt), "MMM d, yyyy") : "N/A"}
                                                </div>
                                                <span className="font-medium opacity-80 hidden sm:inline-block">
                                                    {app.createdAt ? formatDistanceToNow(new Date(app.createdAt), { addSuffix: true }) : null}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-6 border-t border-border/30 mt-8">
                            <p className="text-sm text-muted-foreground hidden sm:block font-medium">
                                Showing page <span className="font-bold text-foreground">{page}</span> of{" "}
                                <span className="font-bold text-foreground">{meta.totalPages}</span>
                            </p>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="flex-1 sm:flex-none rounded-xl gap-1 border-border/60 hover:bg-muted/40 font-semibold"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                                    disabled={page === meta.totalPages}
                                    className="flex-1 sm:flex-none rounded-xl gap-1 border-border/60 hover:bg-muted/40 font-semibold"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyApplicationsContent;
