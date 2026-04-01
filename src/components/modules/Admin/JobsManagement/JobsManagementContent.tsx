"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import DeleteJobConfirmation from "@/components/shared/DeleteJobConfirmation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { getAllJobsAdmin } from "@/services/admin.services";
import { deleteJob, updateJob } from "@/services/job.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    AlertCircle,
    Banknote,
    Briefcase,
    Building2,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit3,
    Grid3X3,
    Layers,
    List,
    MapPin,
    RefreshCw,
    Search,
    Trash2,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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

const STATUS_FILTER_OPTIONS = [
    { value: "ALL", label: "All" },
    { value: "LIVE", label: "Live" },
    { value: "PENDING", label: "Pending" },
    { value: "CLOSED", label: "Closed" },
    { value: "INACTIVE", label: "Inactive" },
];

const JOB_TYPE_OPTIONS = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"];
const PER_PAGE = 20;

const formatLabel = (v: string) =>
    v.split("_").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");

const formatSalary = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

// ── Skeleton ──────────────────────────────────────────────────────────────────

const JobsManagementSkeleton = () => (
    <div className="space-y-6">
        {/* Header skeleton */}
        <Skeleton className="h-24 w-full rounded-2xl" />
        {/* Filter skeleton */}
        <Skeleton className="h-32 w-full rounded-xl" />
        {/* Results bar */}
        <div className="flex items-center justify-between px-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden bg-card">
                    <Skeleton className="h-1 w-full rounded-none" />
                    <div className="p-4 space-y-3">
                        <div className="flex gap-1.5">
                            <Skeleton className="h-5 w-14 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-3 w-1/2" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                        <Skeleton className="h-3 w-1/3" />
                        <div className="flex gap-1.5 pt-3 mt-1 border-t border-border">
                            <Skeleton className="h-7 flex-1 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const JobsManagementContent = () => {
    const queryClient = useQueryClient();

    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [jobTypeFilter, setJobTypeFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const queryParams = useMemo(
        () => ({
            page: String(currentPage),
            limit: String(PER_PAGE),
            searchTerm: searchTerm || undefined,
            status: statusFilter !== "ALL" ? statusFilter : undefined,
            jobType: jobTypeFilter !== "ALL" ? jobTypeFilter : undefined,
        }),
        [currentPage, searchTerm, statusFilter, jobTypeFilter]
    );

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-all-jobs", queryParams],
        queryFn: () => getAllJobsAdmin(queryParams),
    });

    const { mutateAsync: deleteMutate, isPending: deleting } = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => deleteJob(id, reason),
        onSuccess: () => {
            toast.success("Job deleted successfully and recruiter notified");
            queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
            queryClient.invalidateQueries({ queryKey: ["pending-jobs"] });
        },
        onError: (err: any) => toast.error(getRequestErrorMessage(err, "Failed to delete job")),
    });

    const { mutateAsync: updateStatusMutate, isPending: updatingStatus } = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => updateJob(id, { status }),
        onSuccess: () => {
            toast.success("Job status updated");
            queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
            queryClient.invalidateQueries({ queryKey: ["pending-jobs"] });
        },
        onError: (err: any) => toast.error(getRequestErrorMessage(err, "Failed to update job status")),
    });

    if (isLoading) return <JobsManagementSkeleton />;

    const jobs = data?.data || [];
    const meta = data?.meta;
    const total = Number(meta?.total || 0);
    const totalPages = Math.max(1, Number(meta?.totalPages || 1));

    const handleSearch = () => {
        setCurrentPage(1);
        setSearchTerm(searchInput.trim());
    };

    const handleStatusFilterChange = (v: string) => { setCurrentPage(1); setStatusFilter(v); };
    const handleJobTypeFilterChange = (v: string) => { setCurrentPage(1); setJobTypeFilter(v); };
    const handlePageChange = (p: number) => { if (p < 1 || p > totalPages) return; setCurrentPage(p); };

    // build page number range around current page
    const pageRange = (() => {
        const half = 2;
        let start = Math.max(1, currentPage - half);
        const end = Math.min(totalPages, start + 4);
        start = Math.max(1, end - 4);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    })();

    return (
        <div className="space-y-6">
            {/* ── Page Header ───────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/8 via-primary/4 to-transparent p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5" />
                <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-primary/5" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
                            <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Jobs Management</h1>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Manage all job postings across the platform
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm font-medium">
                            <Layers className="h-3.5 w-3.5" />
                            {total} jobs
                        </Badge>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-border/60"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            title="Refresh"
                        >
                            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Filters ───────────────────────────────────────────────── */}
            <Card className="border-border/60 shadow-sm">
                <CardContent className="space-y-4 pb-5 pt-5">
                    {/* Search row */}
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by title, company, or location…"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="pl-9"
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={isFetching} className="shrink-0">
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>

                    {/* Status quick-filter pills */}
                    <div className="flex flex-wrap gap-2">
                        {STATUS_FILTER_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => handleStatusFilterChange(value)}
                                className={`rounded-full border px-3.5 py-1 text-xs font-medium transition-all duration-150 ${statusFilter === value
                                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Job type filter */}
                    <Select value={jobTypeFilter} onValueChange={handleJobTypeFilterChange}>
                        <SelectTrigger className="w-full sm:w-52">
                            <SelectValue placeholder="Filter by job type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Job Types</SelectItem>
                            {JOB_TYPE_OPTIONS.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {formatLabel(t)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* ── Results bar ───────────────────────────────────────────── */}
            <div className="flex flex-col gap-2 px-0.5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    {jobs.length > 0
                        ? `Showing ${(currentPage - 1) * PER_PAGE + 1}–${Math.min(currentPage * PER_PAGE, total)} of ${total} job${total !== 1 ? "s" : ""}`
                        : "No results found"}
                    {isFetching && (
                        <span className="ml-2 text-xs text-primary/70">(refreshing…)</span>
                    )}
                </p>
                <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
                    <Button
                        type="button"
                        size="sm"
                        variant={layoutMode === "grid" ? "default" : "ghost"}
                        onClick={() => setLayoutMode("grid")}
                        className="h-7 gap-1.5 px-3 text-xs"
                    >
                        <Grid3X3 className="h-3.5 w-3.5" />
                        Grid
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={layoutMode === "list" ? "default" : "ghost"}
                        onClick={() => setLayoutMode("list")}
                        className="h-7 gap-1.5 px-3 text-xs"
                    >
                        <List className="h-3.5 w-3.5" />
                        List
                    </Button>
                </div>
            </div>

            {/* ── Jobs Grid / List ──────────────────────────────────────── */}
            {jobs.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-20 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
                            <AlertCircle className="h-7 w-7 text-muted-foreground/50" />
                        </div>
                        <p className="font-medium text-muted-foreground">No jobs found</p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                            Try adjusting your search or filter criteria
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                                setSearchInput("");
                                setSearchTerm("");
                                setStatusFilter("ALL");
                                setJobTypeFilter("ALL");
                                setCurrentPage(1);
                            }}
                        >
                            Clear filters
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div
                    className={
                        layoutMode === "grid"
                            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            : "space-y-3"
                    }
                >
                    {jobs.map((job: any) => {
                        const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.INACTIVE;
                        const typeCfg = JOB_TYPE_CONFIG[job.jobType];
                        const locCfg = LOCATION_TYPE_CONFIG[job.locationType];
                        const isGrid = layoutMode === "grid";

                        return (
                            <Card
                                key={job.id}
                                className="group overflow-hidden border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                {/* status color strip */}
                                <div className={`h-1 w-full ${statusCfg.strip}`} />

                                <CardContent className={`p-4 ${isGrid ? "space-y-3" : "flex items-start gap-5"}`}>
                                    {/* Main content */}
                                    <div className={isGrid ? "space-y-2.5" : "flex-1 space-y-2"}>
                                        {/* Badge row */}
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.badge}`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                                                {statusCfg.label}
                                            </span>
                                            {typeCfg && (
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeCfg.cls}`}>
                                                    {typeCfg.label}
                                                </span>
                                            )}
                                            {locCfg && (
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${locCfg.cls}`}>
                                                    {locCfg.label}
                                                </span>
                                            )}
                                        </div>

                                        {/* Job title */}
                                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                                            {job.title}
                                        </h3>

                                        {/* Company & location */}
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Building2 className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate font-medium">{job.company}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">{job.location}</span>
                                            </div>
                                        </div>

                                        {/* Salary */}
                                        {(job.salaryMin || job.salaryMax) && (
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Banknote className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                                <span className="font-medium text-foreground/80">
                                                    {job.salaryMin && formatSalary(job.salaryMin)}
                                                    {job.salaryMin && job.salaryMax && " – "}
                                                    {job.salaryMax && formatSalary(job.salaryMax)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Deadline */}
                                        {job.applicationDeadline && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                                <span>
                                                    Deadline:{" "}
                                                    {new Date(job.applicationDeadline).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        )}

                                        {/* Meta row */}
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            {job._count?.applications !== undefined && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Users className="h-3 w-3" />
                                                    <span>{job._count.applications} applied</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    {job.createdAt
                                                        ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
                                                        : "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div
                                        className={`flex items-center gap-1.5 ${isGrid
                                            ? "mt-1 border-t border-border/50 pt-3"
                                            : "shrink-0 flex-col sm:flex-row"
                                            }`}
                                    >
                                        <Select
                                            defaultValue={job.status}
                                            onValueChange={(status) =>
                                                updateStatusMutate({ id: job.id, status })
                                            }
                                            disabled={updatingStatus || deleting || isFetching}
                                        >
                                            <SelectTrigger className={`h-7 text-xs ${isGrid ? "flex-1" : "w-28"}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="LIVE">Live</SelectItem>
                                                <SelectItem value="CLOSED">Closed</SelectItem>
                                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Link href={`/admin/dashboard/jobs-management/${job.id}/edit`}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40"
                                                disabled={deleting || updatingStatus}
                                                title="Edit job"
                                            >
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </Button>
                                        </Link>

                                        <DeleteJobConfirmation
                                            jobTitle={job.title}
                                            onConfirm={(reason) => deleteMutate({ id: job.id, reason })}
                                            trigger={(open) => (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                    disabled={deleting || updatingStatus}
                                                    onClick={open}
                                                    title="Delete job"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* ── Pagination ────────────────────────────────────────────── */}
            {totalPages > 1 && (
                <div className="flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-5 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={currentPage === 1 || isFetching}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {pageRange.map((p) => (
                            <Button
                                key={p}
                                type="button"
                                size="icon"
                                variant={currentPage === p ? "default" : "outline"}
                                className="h-8 w-8 text-xs"
                                onClick={() => handlePageChange(p)}
                                disabled={isFetching}
                            >
                                {p}
                            </Button>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={currentPage === totalPages || isFetching}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsManagementContent;
