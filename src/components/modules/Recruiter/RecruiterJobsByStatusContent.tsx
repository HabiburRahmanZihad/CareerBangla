"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteJob, getMyJobs } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    AlertCircle,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Grid3X3,
    List,
    MapPin,
    PlusCircle,
    Search,
    Sparkles,
    Trash2,
    Users,
    X
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

const PER_PAGE = 12;

type RecruiterJobsByStatusContentProps = {
    title: string;
    description: string;
    status: "PENDING" | "LIVE" | "CLOSED" | "INACTIVE";
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
        bg: "bg-green-50 dark:bg-green-950/20",
        text: "text-green-700 dark:text-green-400",
        badge: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30",
        icon: Sparkles,
        accentColor: "from-green-500 to-green-500/10",
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

const RecruiterJobsByStatusContent = ({ title, description, status, emptyMessage }: RecruiterJobsByStatusContentProps) => {
    const queryClient = useQueryClient();
    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isPending, startTransition] = useTransition();

    const queryParams = useMemo(
        () => ({
            status,
            page: String(currentPage),
            limit: String(PER_PAGE),
            searchTerm: searchTerm || undefined,
        }),
        [status, currentPage, searchTerm]
    );

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["recruiter-jobs-by-status", status, currentPage, searchTerm],
        queryFn: () => getMyJobs(queryParams),
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    const { mutateAsync: removeJob, isPending: deleting } = useMutation({
        mutationFn: (id: string) => deleteJob(id),
        onSuccess: (_result, deletedId) => {
            queryClient.setQueriesData({ queryKey: ["recruiter-jobs-by-status"] }, (oldData: any) => {
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
            queryClient.invalidateQueries({ queryKey: ["recruiter-jobs-by-status"] });
            queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
            queryClient.refetchQueries({ queryKey: ["recruiter-jobs-by-status"], type: "active" });
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

    const currentConfig = statusConfig[status] || statusConfig.PENDING;
    const StatusIcon = currentConfig.icon;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-11 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-72 rounded-xl" />
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
                            <Badge className={`${currentConfig.badge} border font-semibold uppercase tracking-wide`}>{status}</Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-foreground">{title}</h1>
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
                <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
                    {jobs.map((job) => (
                        <Card
                            key={job.id}
                            className="border-border/50 hover:shadow-lg hover:border-border transition-all duration-300 group overflow-hidden h-full flex flex-col"
                        >
                            {/* Header with Status */}
                            <CardHeader className="pb-4 pt-5 px-5">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                            {job.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-1">{job.company}</p>
                                    </div>
                                    <Badge className={`${currentConfig.badge} border font-semibold shrink-0 whitespace-nowrap`}>
                                        {status}
                                    </Badge>
                                </div>

                                {/* Location & Time */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/70" />
                                        <span className="line-clamp-1">{job.location}</span>
                                    </div>
                                    <span className="hidden sm:inline text-muted-foreground/50">•</span>
                                    <span className="line-clamp-1">
                                        Posted {job.createdAt && formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </CardHeader>

                            {/* Content */}
                            <CardContent className="flex-1 px-5 pb-4 space-y-4">
                                {/* Job Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-muted/50 p-3 text-center border border-border/50">
                                        <p className="text-2xl font-bold text-foreground">{job._count?.applications || 0}</p>
                                        <p className="text-xs text-muted-foreground font-medium mt-1">Application{(job._count?.applications || 0) !== 1 ? 's' : ''}</p>
                                    </div>
                                    <div className="rounded-lg bg-muted/50 p-3 text-center border border-border/50">
                                        <Users className="w-5 h-5 text-primary mx-auto" />
                                        <p className="text-xs text-muted-foreground font-medium mt-2">Applicants</p>
                                    </div>
                                </div>

                                {/* Description preview */}
                                {job.description && (
                                    <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                        {job.description}
                                    </div>
                                )}
                            </CardContent>

                            {/* Actions Footer */}
                            <div className="px-5 py-4 bg-muted/30 border-t border-border/50 flex items-center gap-2">
                                <Button
                                    variant="default"
                                    size="sm"
                                    asChild
                                    className="flex-1 h-9 rounded-lg"
                                >
                                    <Link href={`/recruiter/dashboard/my-jobs/${job.id}`}>
                                        <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                                    </Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-9 px-3 rounded-lg"
                                    disabled={deleting || isFetching}
                                    onClick={() => {
                                        if (confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
                                            removeJob(job.id);
                                        }
                                    }}
                                    title="Delete job"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
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

export default RecruiterJobsByStatusContent;
