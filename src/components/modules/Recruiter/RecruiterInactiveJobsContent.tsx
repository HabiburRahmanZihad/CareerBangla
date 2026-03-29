"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteInactiveJob, getInactiveJobs } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    AlertCircle,
    Briefcase,
    Building2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    DollarSign,
    Grid3X3,
    List,
    MapPin,
    PlusCircle,
    Search,
    Sparkles,
    Trash2,
    Users,
    X,
    Zap
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

const PER_PAGE = 12;

type RecruiterInactiveJobsContentProps = {
    title: string;
    description: string;
    emptyMessage: string;
};

const statusConfig: Record<string, { bg: string; text: string; badge: string; icon: React.ElementType; accentColor: string }> = {
    PENDING: {
        bg: "bg-amber-50 dark:bg-amber-950/20",
        text: "text-amber-700 dark:text-amber-400",
        badge: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
        icon: Clock,
        accentColor: "from-amber-500 to-amber-500/10",
    },
    LIVE: {
        bg: "bg-primary/5 dark:bg-primary/5",
        text: "text-primary dark:text-primary",
        badge: "bg-primary/10 dark:bg-primary/10 text-primary dark:text-primary border-primary/20 dark:border-primary/30",
        icon: Sparkles,
        accentColor: "from-primary to-primary/80",
    },
    CLOSED: {
        bg: "bg-slate-50 dark:bg-slate-950/20",
        text: "text-slate-700 dark:text-slate-400",
        badge: "bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/30",
        icon: AlertCircle,
        accentColor: "from-slate-500 to-slate-500/10",
    },
    INACTIVE: {
        bg: "bg-red-50 dark:bg-red-950/20",
        text: "text-red-700 dark:text-red-400",
        badge: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30",
        icon: AlertCircle,
        accentColor: "from-red-500 to-red-500/10",
    },
};

const RecruiterInactiveJobsContent = ({ title, description, emptyMessage }: RecruiterInactiveJobsContentProps) => {
    const queryClient = useQueryClient();
    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isPending, startTransition] = useTransition();

    const queryParams = useMemo(
        () => ({
            page: String(currentPage),
            limit: String(PER_PAGE),
            searchTerm: searchTerm || undefined,
        }),
        [currentPage, searchTerm]
    );

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["recruiter-inactive-jobs", currentPage, searchTerm],
        queryFn: () => getInactiveJobs(queryParams),
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    const { mutateAsync: removeJob, isPending: deleting } = useMutation({
        mutationFn: (id: string) => deleteInactiveJob(id),
        onSuccess: (_result, deletedId) => {
            queryClient.setQueriesData({ queryKey: ["recruiter-inactive-jobs"] }, (oldData: any) => {
                if (!oldData || typeof oldData !== "object") return oldData;
                const oldJobs = Array.isArray(oldData.data) ? oldData.data : [];
                const nextJobs = oldJobs.filter((job: IJob) => job.id !== deletedId);
                if (!oldData.meta) {
                    return { ...oldData, data: nextJobs };
                }
                const prevTotal = Number(oldData.meta.total || oldJobs.length);
                const nextTotal = Math.max(0, prevTotal - (oldJobs.length === nextJobs.length ? 0 : 1));
                const limit = Number(oldData.meta.limit || PER_PAGE);
                return {
                    ...oldData,
                    data: nextJobs,
                    meta: {
                        ...oldData.meta,
                        total: nextTotal,
                        totalPages: Math.max(1, Math.ceil(nextTotal / Math.max(limit, 1))),
                    },
                };
            });
            toast.success("Job deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["recruiter-inactive-jobs"] });
            queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
            queryClient.refetchQueries({ queryKey: ["recruiter-inactive-jobs"], type: "active" });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to delete job");
        },
    });

    const jobs: IJob[] = (data as any)?.data || [];
    const meta = (data as any)?.meta;
    const total = Number(meta?.total || 0);
    const totalPages = Math.max(1, Number(meta?.totalPages || 1));

    const handleSearch = useCallback(() => {
        setCurrentPage(1);
        startTransition(() => {
            setSearchTerm(searchInput.trim());
        });
    }, [searchInput]);

    const clearSearch = useCallback(() => {
        setSearchInput("");
        setSearchTerm("");
        setCurrentPage(1);
    }, []);

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages) return;
        setCurrentPage(nextPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const currentConfig = statusConfig.INACTIVE;
    const StatusIcon = currentConfig.icon;

    if (isLoading) {
        return (
            <div className="space-y-6 pb-10">
                <Skeleton className={`h-40 w-full rounded-3xl ${currentConfig.bg} opacity-50`} />
                <div className="flex flex-col md:flex-row gap-4">
                    <Skeleton className="h-14 flex-1 rounded-2xl" />
                    <Skeleton className="h-14 w-full md:w-32 rounded-2xl" />
                </div>
                <div className="flex justify-between items-center mt-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-20 rounded-lg" />
                        <Skeleton className="h-10 w-20 rounded-lg" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="rounded-2xl border-border/50 overflow-hidden bg-card/60 backdrop-blur-xl">
                            <CardContent className="p-0 flex flex-col h-full">
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex gap-4 items-center">
                                            <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-32" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Skeleton className="h-8 w-24 rounded-lg" />
                                        <Skeleton className="h-8 w-20 rounded-lg" />
                                        <Skeleton className="h-8 w-28 rounded-lg" />
                                    </div>
                                </div>
                                <div className="p-6 bg-muted/10 mt-auto border-t border-border/50">
                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <Skeleton className="h-16 w-full rounded-xl" />
                                        <Skeleton className="h-16 w-full rounded-xl" />
                                    </div>
                                    <Skeleton className="h-11 w-full rounded-xl" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Hero Section */}
            <div className={`relative overflow-hidden rounded-3xl ${currentConfig.bg} p-8 md:p-10 border border-border/50`}>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-current/5 blur-3xl opacity-40" />
                <div className="relative z-10 flex items-start justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-3 rounded-xl bg-linear-to-br ${currentConfig.accentColor}`}>
                                <StatusIcon className={`w-6 h-6 ${currentConfig.text}`} />
                            </div>
                            <Badge className={`${currentConfig.badge} border font-semibold uppercase tracking-wide`}>INACTIVE & CLOSED</Badge>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-foreground">{title}</h1>
                        <p className="text-muted-foreground text-base md:text-lg">{description}</p>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="text-4xl font-black text-foreground">{total}</div>
                        <div className="text-sm text-muted-foreground font-medium">Total Jobs</div>
                    </div>
                </div>
            </div>

            {/* Search & Controls */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search by job title, location, or company..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="pl-11 h-11 bg-card border-border/50 focus-visible:ring-1 transition-all placeholder:text-muted-foreground/60"
                        />
                        {searchInput && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
                                title="Clear search"
                            >
                                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>
                    <Button onClick={handleSearch} disabled={isPending} className="h-11 px-6 shadow-sm">
                        <Search className="w-4 h-4 mr-2" /> Search
                    </Button>
                    <Button asChild className="h-11 px-6 shadow-sm bg-primary text-white">
                        <Link href="/recruiter/dashboard/post-job">
                            <PlusCircle className="w-4 h-4 mr-2" /> Post Job
                        </Link>
                    </Button>
                </div>

                {/* Stats & Layout Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-card border border-border/50">
                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Showing Results</p>
                            <p className="text-sm font-bold text-foreground mt-1">
                                {jobs.length > 0 ? `${(currentPage - 1) * PER_PAGE + 1}-${Math.min(currentPage * PER_PAGE, total)}` : 0} of {total}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
                        <Button
                            type="button"
                            size="sm"
                            variant={layoutMode === "grid" ? "default" : "ghost"}
                            onClick={() => setLayoutMode("grid")}
                            className="h-8 px-3"
                        >
                            <Grid3X3 className="w-4 h-4 mr-1.5" /> Grid
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={layoutMode === "list" ? "default" : "ghost"}
                            onClick={() => setLayoutMode("list")}
                            className="h-8 px-3"
                        >
                            <List className="w-4 h-4 mr-1.5" /> List
                        </Button>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {jobs.length === 0 ? (
                <Card className="border-border/50 bg-muted/30">
                    <CardContent className="py-16 px-6 text-center">
                        <div className="flex justify-center mb-6">
                            <div className={`p-4 rounded-2xl ${currentConfig.bg}`}>
                                <Briefcase className={`w-12 h-12 ${currentConfig.text}`} />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{emptyMessage}</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                            {status === "PENDING"
                                ? "Jobs you post will appear here while waiting for admin approval."
                                : "No jobs found in this category."}
                        </p>
                        <Button asChild>
                            <Link href="/recruiter/dashboard/post-job">
                                <PlusCircle className="w-4 h-4 mr-2" /> Post Your First Job
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className={layoutMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-5"}>
                    {jobs.map((job) => (
                        <Card
                            key={job.id}
                            className={`group relative overflow-hidden bg-card/60 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/40 border border-border/50
                                ${layoutMode === "list" ? "flex flex-col md:flex-row h-auto items-stretch rounded-2xl md:rounded-[2rem]" : "flex flex-col h-full rounded-[2rem]"}
                            `}
                        >
                            {/* Decorative Background Blob */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                            <div className={`p-6 flex-1 flex flex-col gap-5 ${layoutMode === "list" ? "md:w-3/4 md:pr-4 md:border-r border-border/50" : ""}`}>
                                {/* Header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                                            <Briefcase className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-xl leading-tight text-foreground line-clamp-2 md:line-clamp-1 group-hover:text-primary transition-colors">
                                                {job.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1.5 text-sm font-medium text-muted-foreground bg-muted/30 w-fit px-2 py-0.5 rounded-md">
                                                <Building2 className="w-3.5 h-3.5" />
                                                <span className="line-clamp-1">{job.company || job.recruiter?.companyName || "Unknown Company"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className={`${(statusConfig[job.status] || statusConfig.INACTIVE).badge} border px-3 py-1 font-bold shrink-0 whitespace-nowrap uppercase tracking-wider text-xs hidden sm:flex`}>                                          {job.status}                                    </Badge>
                                </div>

                                {/* Meta details */}
                                <div className="flex flex-wrap items-center gap-3 text-sm mt-1">
                                    <div className="flex items-center gap-1.5 text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border/60 shadow-sm">
                                        <MapPin className="w-4 h-4 text-primary/70" />
                                        <span className="font-medium line-clamp-1">{job.location}</span>
                                    </div>
                                    {job.jobType && (
                                        <div className="flex items-center gap-1.5 text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border/60 shadow-sm">
                                            <Zap className="w-4 h-4 text-primary/70" />
                                            <span className="font-medium capitalize">{job.jobType.replace("_", " ").toLowerCase()}</span>
                                        </div>
                                    )}
                                    {(job.salaryMin || job.salaryMax) && (
                                        <div className="flex items-center gap-1.5 text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border/60 shadow-sm">
                                            <DollarSign className="w-4 h-4 text-green-500/80" />
                                            <span className="font-medium text-green-600 dark:text-green-400">
                                                {job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : ""}{job.salaryMin && job.salaryMax ? " - " : ""}{job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : ""}
                                            </span>
                                        </div>
                                    )}
                                    {job.createdAt && (
                                        <div className="flex items-center gap-1.5 text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border/60 shadow-sm">
                                            <Calendar className="w-4 h-4 text-primary/70" />
                                            <span className="font-medium">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Skills / Description */}
                                {job.skills && job.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                                        {job.skills.slice(0, layoutMode === "list" ? 6 : 3).map((skill, idx) => (
                                            <Badge key={idx} variant="secondary" className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 font-semibold px-2.5 py-1 rounded-md">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {job.skills.length > (layoutMode === "list" ? 6 : 3) && (
                                            <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-transparent font-semibold px-2 py-1 rounded-md">
                                                +{job.skills.length - (layoutMode === "list" ? 6 : 3)} more
                                            </Badge>
                                        )}
                                    </div>
                                ) : (
                                    job.description && (
                                        <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-80 mt-auto pt-2">
                                            {job.description}
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Sidebar / Bottom area */}
                            <div className={`flex ${layoutMode === "list" ? "md:w-1/4 flex-col justify-center p-6 bg-muted/10" : "flex-col p-6 pt-0 mt-auto"}`}>
                                <div className={`grid grid-cols-2 gap-3 mb-5 ${layoutMode === "list" ? "mb-6" : ""}`}>
                                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-background border border-border/60 shadow-sm relative overflow-hidden group/stat">
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                        <span className="text-2xl font-black text-foreground">{job._count?.applications || 0}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Apps</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-background border border-border/60 shadow-sm relative overflow-hidden group/stat">
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                        <Users className="w-6 h-6 text-primary mb-1 mt-0.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">View</span>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-auto w-full">
                                    <Button
                                        variant="outline"
                                        className="h-11 w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 bg-destructive/5 transition-all shadow-sm font-bold"
                                        disabled={deleting || isFetching}
                                        onClick={() => {
                                            if (confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
                                                removeJob(job.id);
                                            }
                                        }}
                                        title="Delete job"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete Forever
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && jobs.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl bg-card border border-border/50">
                    <p className="text-sm text-muted-foreground font-medium">
                        Page <span className="font-bold text-foreground">{currentPage}</span> of <span className="font-bold text-foreground">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1 || isFetching}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="h-9 px-3"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1.5" /> Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                const pageNum = currentPage > 2 ? currentPage - 2 + i : i + 1;
                                if (pageNum > totalPages) return null;
                                return (
                                    <Button
                                        key={pageNum}
                                        type="button"
                                        variant={pageNum === currentPage ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNum)}
                                        className="h-9 w-9 p-0"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages || isFetching}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="h-9 px-3"
                        >
                            Next <ChevronRight className="w-4 h-4 ml-1.5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterInactiveJobsContent;


