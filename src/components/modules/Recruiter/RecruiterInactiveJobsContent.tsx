"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { deleteInactiveJob, getInactiveJobs } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Clock,
    Grid3X3,
    List,
    PlusCircle,
    Search,
    Sparkles,
    X
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { RecruiterInactiveJobCard } from "./RecruiterInactiveJobCard";
import { RecruiterInactiveJobsSkeleton } from "./RecruiterInactiveJobsSkeleton";

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
            toast.error(getRequestErrorMessage(err, "Failed to delete job"));
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
        return <RecruiterInactiveJobsSkeleton bgClass={currentConfig.bg} />;
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
                        <RecruiterInactiveJobCard
                            key={job.id}
                            job={job}
                            layoutMode={layoutMode}
                            statusConfig={statusConfig}
                            deleting={deleting}
                            isFetching={isFetching}
                            onDelete={removeJob}
                        />
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
