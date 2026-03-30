"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getJobCategories, getPendingJobs } from "@/services/job.services";
import { useQuery } from "@tanstack/react-query";
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
    Eye,
    Hourglass,
    Layers,
    MapPin,
    RefreshCw,
    Search,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// ── Config ────────────────────────────────────────────────────────────────────

const JOB_TYPE_CONFIG: Record<string, { label: string; cls: string }> = {
    FULL_TIME:  { label: "Full Time",  cls: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    PART_TIME:  { label: "Part Time",  cls: "bg-violet-500/10 text-violet-700 dark:text-violet-400" },
    CONTRACT:   { label: "Contract",   cls: "bg-orange-500/10 text-orange-700 dark:text-orange-400" },
    INTERNSHIP: { label: "Internship", cls: "bg-teal-500/10 text-teal-700 dark:text-teal-400" },
    FREELANCE:  { label: "Freelance",  cls: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" },
};

const LOCATION_TYPE_CONFIG: Record<string, { label: string; cls: string }> = {
    REMOTE: { label: "Remote",  cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    ONSITE: { label: "On-site", cls: "bg-sky-500/10 text-sky-700 dark:text-sky-400" },
    HYBRID: { label: "Hybrid",  cls: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
};

const JOB_TYPE_OPTIONS  = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"];
const LOCATION_OPTIONS  = ["REMOTE", "ONSITE", "HYBRID"];
const PER_PAGE = 20;

const formatLabel  = (v: string) => v.split("_").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
const formatSalary = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`);

type CategoryOption = { id: string; title?: string | null };

// ── Skeleton ──────────────────────────────────────────────────────────────────

const PendingJobsSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="rounded-xl border border-border p-5 space-y-4">
            <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
            </div>
            <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-10 rounded-md" />
                <Skeleton className="h-10 rounded-md" />
                <Skeleton className="h-10 rounded-md" />
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden bg-card">
                    <Skeleton className="h-1 w-full rounded-none" />
                    <div className="p-4 space-y-3">
                        <div className="flex gap-1.5">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-14 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-3 w-1/2" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                        <div className="pt-2 border-t border-border flex items-center justify-between">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-8 w-20 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const PendingJobsContent = () => {
    const [searchInput,       setSearchInput]       = useState("");
    const [searchTerm,        setSearchTerm]        = useState("");
    const [jobTypeFilter,     setJobTypeFilter]     = useState("ALL");
    const [locationTypeFilter,setLocationTypeFilter]= useState("ALL");
    const [categoryFilter,    setCategoryFilter]    = useState("ALL");
    const [currentPage,       setCurrentPage]       = useState(1);

    const queryParams = useMemo(
        () => ({
            page:         String(currentPage),
            limit:        String(PER_PAGE),
            searchTerm:   searchTerm || undefined,
            jobType:      jobTypeFilter      !== "ALL" ? jobTypeFilter      : undefined,
            locationType: locationTypeFilter !== "ALL" ? locationTypeFilter : undefined,
            categoryId:   categoryFilter     !== "ALL" ? categoryFilter     : undefined,
        }),
        [currentPage, searchTerm, jobTypeFilter, locationTypeFilter, categoryFilter]
    );

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["pending-jobs", queryParams],
        queryFn:  () => getPendingJobs(queryParams),
    });

    const { data: categoriesData } = useQuery({
        queryKey: ["job-categories"],
        queryFn:  () => getJobCategories(),
    });

    if (isLoading) return <PendingJobsSkeleton />;

    const jobs       = data?.data || [];
    const meta       = data?.meta;
    const total      = Number(meta?.total      || 0);
    const totalPages = Math.max(1, Number(meta?.totalPages || 1));
    const categories = (categoriesData?.data || []) as CategoryOption[];

    const handleSearch = () => { setCurrentPage(1); setSearchTerm(searchInput.trim()); };

    const handlePageChange = (p: number) => { if (p < 1 || p > totalPages) return; setCurrentPage(p); };

    const pageRange = (() => {
        const half  = 2;
        let   start = Math.max(1, currentPage - half);
        const end   = Math.min(totalPages, start + 4);
        start = Math.max(1, end - 4);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    })();

    return (
        <div className="space-y-6">
            {/* ── Page Header ────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/5" />
                <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-amber-500/5" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-500/10 shadow-sm">
                            <Hourglass className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Pending Approvals</h1>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Review and approve or reject pending job posts
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className="gap-1.5 px-3 py-1.5 text-sm font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Layers className="h-3.5 w-3.5" />
                            {total} pending
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

            {/* ── Filters ────────────────────────────────────────────────── */}
            <Card className="border-border/60 shadow-sm">
                <CardContent className="space-y-4 pb-5 pt-5">
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

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <Select value={jobTypeFilter} onValueChange={(v) => { setCurrentPage(1); setJobTypeFilter(v); }}>
                            <SelectTrigger><SelectValue placeholder="All Job Types" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Job Types</SelectItem>
                                {JOB_TYPE_OPTIONS.map((t) => (
                                    <SelectItem key={t} value={t}>{formatLabel(t)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={locationTypeFilter} onValueChange={(v) => { setCurrentPage(1); setLocationTypeFilter(v); }}>
                            <SelectTrigger><SelectValue placeholder="All Locations" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Location Types</SelectItem>
                                {LOCATION_OPTIONS.map((l) => (
                                    <SelectItem key={l} value={l}>{formatLabel(l)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={categoryFilter} onValueChange={(v) => { setCurrentPage(1); setCategoryFilter(v); }}>
                            <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Categories</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.title || "Untitled"}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* ── Results bar ────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-0.5">
                <p className="text-sm text-muted-foreground">
                    {jobs.length > 0
                        ? `Showing ${(currentPage - 1) * PER_PAGE + 1}–${Math.min(currentPage * PER_PAGE, total)} of ${total} job${total !== 1 ? "s" : ""}`
                        : "No results found"}
                    {isFetching && <span className="ml-2 text-xs text-primary/70">(refreshing…)</span>}
                </p>
            </div>

            {/* ── Cards ──────────────────────────────────────────────────── */}
            {jobs.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-20 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
                            <AlertCircle className="h-7 w-7 text-muted-foreground/50" />
                        </div>
                        <p className="font-medium text-muted-foreground">No pending jobs to review</p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                            All caught up! Check back later for new submissions.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                                setSearchInput(""); setSearchTerm("");
                                setJobTypeFilter("ALL"); setLocationTypeFilter("ALL");
                                setCategoryFilter("ALL"); setCurrentPage(1);
                            }}
                        >
                            Clear filters
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {jobs.map((job: any) => {
                        const typeCfg = JOB_TYPE_CONFIG[job.jobType];
                        const locCfg  = LOCATION_TYPE_CONFIG[job.locationType];

                        return (
                            <Card
                                key={job.id}
                                className="group overflow-hidden border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                {/* Amber strip — all are pending */}
                                <div className="h-1 w-full bg-amber-500" />

                                <CardContent className="p-4 space-y-3">
                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/10 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                            Pending Review
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

                                    {/* Title */}
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

                                    {/* Recruiter */}
                                    {job.recruiter && (
                                        <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground">
                                            <Briefcase className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                                            <span className="truncate">
                                                {job.recruiter.name || "Unknown"}
                                                {job.recruiter.email && (
                                                    <span className="text-muted-foreground/60"> · {job.recruiter.email}</span>
                                                )}
                                            </span>
                                        </div>
                                    )}

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
                                    {(job.applicationDeadline || job.deadline) && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                            <span>
                                                Deadline:{" "}
                                                {new Date(job.applicationDeadline || job.deadline).toLocaleDateString("en-US", {
                                                    month: "short", day: "numeric", year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    )}

                                    {/* Meta */}
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

                                    {/* Action */}
                                    <div className="pt-1 border-t border-border/50">
                                        <Link href={`/admin/dashboard/pending-jobs/${job.id}`} className="block">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full h-8 text-xs gap-1.5 border-border/60 hover:border-primary/50 hover:text-primary"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Review Details
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* ── Pagination ─────────────────────────────────────────────── */}
            {totalPages > 1 && (
                <div className="flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-5 sm:flex-row">
                    <p className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</p>
                    <div className="flex items-center gap-1">
                        <Button
                            type="button" variant="outline" size="icon" className="h-8 w-8"
                            disabled={currentPage === 1 || isFetching}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {pageRange.map((p) => (
                            <Button
                                key={p} type="button" size="icon"
                                variant={currentPage === p ? "default" : "outline"}
                                className="h-8 w-8 text-xs"
                                onClick={() => handlePageChange(p)}
                                disabled={isFetching}
                            >
                                {p}
                            </Button>
                        ))}
                        <Button
                            type="button" variant="outline" size="icon" className="h-8 w-8"
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

export default PendingJobsContent;
