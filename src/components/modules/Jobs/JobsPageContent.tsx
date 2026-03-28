"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PaginationMeta } from "@/types/api.types";
import { IJob, IJobCategory } from "@/types/user.types";
import { differenceInDays } from "date-fns";
import {
    Bookmark,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Grid3X3,
    LayoutList,
    MapPin,
    Search,
    SlidersHorizontal,
    Star,
    X,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const JOB_TYPE_LABELS: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
};

const AVATAR_COLORS = [
    "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-orange-500",
    "bg-pink-500", "bg-cyan-500", "bg-red-500", "bg-indigo-500",
    "bg-teal-500", "bg-amber-500",
];

const getAvatarColor = (str: string) => {
    let hash = 0;
    for (const c of str) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ── Company Avatar ───────────────────────────────────────────────────────────
const CompanyAvatar = ({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) => {
    const color = getAvatarColor(name);
    const sizeClass = size === "lg" ? "h-14 w-14 text-xl" : size === "sm" ? "h-9 w-9 text-sm" : "h-12 w-12 text-base";
    return (
        <div className={`${color} ${sizeClass} rounded-xl flex items-center justify-center text-white font-bold shrink-0`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
};

// ── Salary formatter ─────────────────────────────────────────────────────────
const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const fmt = (n: number) => n >= 1000 ? `৳${(n / 1000).toFixed(0)}k` : `৳${n}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return `Up to ${fmt(max!)}`;
};

// ── Job Card – List View ─────────────────────────────────────────────────────
const JobListCard = ({ job }: { job: IJob }) => {
    const salary = formatSalary(job.salaryMin, job.salaryMax);
    const deadline = job.deadline || job.applicationDeadline;
    const daysLeft = deadline ? differenceInDays(new Date(deadline), new Date()) : null;
    const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

    return (
        <Link href={`/jobs/${job.id}`} className="block group">
            <div className={`flex items-start gap-4 p-5 rounded-xl border bg-card hover:shadow-md transition-all hover:-translate-y-0.5 ${job.featuredJob ? "border-amber-300 dark:border-amber-600" : ""}`}>
                <CompanyAvatar name={job.recruiter?.companyName || job.company || "?"} />

                <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-center flex-wrap gap-1.5 mb-1">
                        <span className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                            {job.title}
                        </span>
                        {job.featuredJob && (
                            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-current" /> Featured
                            </span>
                        )}
                        {job.urgentHiring && (
                            <span className="text-xs font-semibold text-red-500 dark:text-red-400 flex items-center gap-0.5">
                                <Zap className="h-3 w-3 fill-current" /> Urgent
                            </span>
                        )}
                        {isExpiringSoon && (
                            <span className="text-xs font-semibold text-orange-500">
                                · {daysLeft === 0 ? "Expires today" : `${daysLeft}d left`}
                            </span>
                        )}
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mb-2.5">
                        {job.category?.title && (
                            <span className="flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5" />
                                {job.category.title}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                        </span>
                        {salary && (
                            <span className="font-medium text-foreground">{salary}</span>
                        )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium">
                            {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                        </span>
                        {job.urgentHiring && (
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-medium">
                                Urgent Hiring
                            </span>
                        )}
                        {job.locationType && (
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                {job.locationType.charAt(0) + job.locationType.slice(1).toLowerCase()}
                            </span>
                        )}
                    </div>
                </div>

                <Bookmark className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </Link>
    );
};

// ── Job Card – Grid View ─────────────────────────────────────────────────────
const JobGridCard = ({ job }: { job: IJob }) => {
    const salary = formatSalary(job.salaryMin, job.salaryMax);
    const deadline = job.deadline || job.applicationDeadline;
    const daysLeft = deadline ? differenceInDays(new Date(deadline), new Date()) : null;
    const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

    return (
        <Link href={`/jobs/${job.id}`} className="block group">
            <div className={`p-5 rounded-xl border bg-card hover:shadow-md transition-all hover:-translate-y-0.5 h-full flex flex-col ${job.featuredJob ? "border-amber-300 dark:border-amber-600" : ""}`}>
                <div className="flex items-start justify-between mb-3">
                    <CompanyAvatar name={job.recruiter?.companyName || job.company || "?"} />
                    <Bookmark className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Badges */}
                {(job.featuredJob || job.urgentHiring || isExpiringSoon) && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {job.featuredJob && (
                            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-current" /> Featured
                            </span>
                        )}
                        {job.urgentHiring && (
                            <span className="text-xs font-semibold text-red-500 flex items-center gap-0.5 ml-1">
                                <Zap className="h-3 w-3 fill-current" /> Urgent
                            </span>
                        )}
                        {isExpiringSoon && (
                            <span className="text-xs font-semibold text-orange-500">
                                {daysLeft === 0 ? "Expires today" : `${daysLeft}d left`}
                            </span>
                        )}
                    </div>
                )}

                <p className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2 mb-1">
                    {job.title}
                </p>
                <p className="text-sm text-muted-foreground mb-3">{job.recruiter?.companyName || job.company}</p>

                <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-3 mt-auto">
                    {job.category?.title && (
                        <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{job.category.title}</span>
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{job.location}</span>
                    </span>
                    {salary && <p className="font-medium text-foreground">{salary}</p>}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium">
                        {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                    </span>
                    {job.urgentHiring && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-medium">
                            Urgent
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

// ── Filter chip ──────────────────────────────────────────────────────────────
const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <span className="inline-flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-muted text-sm font-medium">
        {label}
        <button type="button" title={`Remove ${label} filter`} onClick={onRemove} className="hover:text-destructive transition-colors">
            <X className="h-3.5 w-3.5" />
        </button>
    </span>
);

// ── Sidebar section ──────────────────────────────────────────────────────────
const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <p className="text-sm font-semibold mb-3">{title}</p>
        {children}
    </div>
);

// ── Main component ────────────────────────────────────────────────────────────
interface JobsPageContentProps {
    jobs: IJob[];
    meta?: PaginationMeta;
    categories: IJobCategory[];
    currentParams: Record<string, string | undefined>;
}

const JobsPageContent = ({ jobs, meta, categories, currentParams }: JobsPageContentProps) => {
    const router = useRouter();

    // Local state for filter inputs
    const [searchTerm, setSearchTerm] = useState(currentParams.searchTerm || "");
    const [location, setLocation] = useState(currentParams.location || "");
    const [jobType, setJobType] = useState(currentParams.jobType || "all");
    const [categoryId, setCategoryId] = useState(currentParams.categoryId || "all");
    const [view, setView] = useState<"list" | "grid">("list");
    const [limit, setLimit] = useState(currentParams.limit || "12");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Build URL from filter state
    const buildParams = (overrides: Record<string, string> = {}) => {
        const p = new URLSearchParams();
        if (searchTerm && searchTerm !== overrides.searchTerm) p.set("searchTerm", searchTerm);
        if (location && location !== overrides.location) p.set("location", location);
        if (jobType && jobType !== "all" && jobType !== overrides.jobType) p.set("jobType", jobType);
        if (categoryId && categoryId !== "all" && categoryId !== overrides.categoryId) p.set("categoryId", categoryId);
        if (limit !== "12") p.set("limit", limit);
        Object.entries(overrides).forEach(([k, v]) => {
            if (v && v !== "all") p.set(k, v);
            else p.delete(k);
        });
        return p.toString();
    };

    const applyFilters = () => {
        const p = new URLSearchParams();
        if (searchTerm) p.set("searchTerm", searchTerm);
        if (location) p.set("location", location);
        if (jobType && jobType !== "all") p.set("jobType", jobType);
        if (categoryId && categoryId !== "all") p.set("categoryId", categoryId);
        if (limit !== "12") p.set("limit", limit);
        router.push(`/jobs?${p.toString()}`);
        setMobileFiltersOpen(false);
    };

    const removeFilter = (key: string) => {
        const p = new URLSearchParams();
        if (key !== "searchTerm" && searchTerm) p.set("searchTerm", searchTerm);
        if (key !== "location" && location) p.set("location", location);
        if (key !== "jobType" && jobType && jobType !== "all") p.set("jobType", jobType);
        if (key !== "categoryId" && categoryId && categoryId !== "all") p.set("categoryId", categoryId);
        if (limit !== "12") p.set("limit", limit);

        if (key === "searchTerm") setSearchTerm("");
        if (key === "location") setLocation("");
        if (key === "jobType") setJobType("all");
        if (key === "categoryId") setCategoryId("all");

        router.push(`/jobs?${p.toString()}`);
    };

    const clearAll = () => {
        setSearchTerm("");
        setLocation("");
        setJobType("all");
        setCategoryId("all");
        router.push("/jobs");
    };

    const handlePageChange = (page: number) => {
        const p = new URLSearchParams();
        if (currentParams.searchTerm) p.set("searchTerm", currentParams.searchTerm);
        if (currentParams.location) p.set("location", currentParams.location);
        if (currentParams.jobType) p.set("jobType", currentParams.jobType);
        if (currentParams.categoryId) p.set("categoryId", currentParams.categoryId);
        if (limit !== "12") p.set("limit", limit);
        p.set("page", page.toString());
        router.push(`/jobs?${p.toString()}`);
    };

    const handleLimitChange = (val: string) => {
        setLimit(val);
        const p = new URLSearchParams();
        if (currentParams.searchTerm) p.set("searchTerm", currentParams.searchTerm);
        if (currentParams.location) p.set("location", currentParams.location);
        if (currentParams.jobType) p.set("jobType", currentParams.jobType);
        if (currentParams.categoryId) p.set("categoryId", currentParams.categoryId);
        p.set("limit", val);
        router.push(`/jobs?${p.toString()}`);
    };

    // Active chips
    const activeFilters: { key: string; label: string }[] = [];
    if (currentParams.searchTerm) activeFilters.push({ key: "searchTerm", label: currentParams.searchTerm });
    if (currentParams.location) activeFilters.push({ key: "location", label: `📍 ${currentParams.location}` });
    if (currentParams.jobType) activeFilters.push({ key: "jobType", label: JOB_TYPE_LABELS[currentParams.jobType] || currentParams.jobType });
    if (currentParams.categoryId) {
        const cat = categories.find((c) => c.id === currentParams.categoryId);
        if (cat) activeFilters.push({ key: "categoryId", label: cat.title });
    }

    // Pagination
    const totalPages = meta?.totalPages || 1;
    const currentPage = meta?.page || 1;
    const total = meta?.total || 0;
    const pageSize = Number(limit);
    const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, total);

    const pageNumbers = (() => {
        const pages: (number | "…")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("…");
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("…");
            pages.push(totalPages);
        }
        return pages;
    })();

    // Sidebar content (reused for desktop + mobile)
    const SidebarContent = () => (
        <div className="space-y-6">
            <SidebarSection title="Search by Keywords">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Job title, keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                        className="pl-9"
                    />
                </div>
            </SidebarSection>

            <Separator />

            <SidebarSection title="Location">
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="City or area..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                        className="pl-9"
                    />
                </div>
            </SidebarSection>

            <Separator />

            <SidebarSection title="Category">
                <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a category..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </SidebarSection>

            <Separator />

            <SidebarSection title="Job Type">
                <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Job type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                        <SelectItem value="FREELANCE">Freelance</SelectItem>
                    </SelectContent>
                </Select>
            </SidebarSection>

            <Button type="button" onClick={applyFilters} className="w-full">
                Find Jobs
            </Button>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-4">
                <Button type="button" variant="outline" className="gap-2" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
                    <SlidersHorizontal className="h-4 w-4" />
                    {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
                </Button>
            </div>

            <div className="flex gap-6 items-start">
                {/* ── Sidebar ── */}
                <aside className={`w-72 shrink-0 ${mobileFiltersOpen ? "block w-full mb-6" : "hidden"} lg:block`}>
                    <div className="bg-card border rounded-xl p-6 sticky top-24">
                        <SidebarContent />
                    </div>
                </aside>

                {/* ── Main content ── */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Active filter chips */}
                    {activeFilters.length > 0 && (
                        <div className="bg-card border rounded-xl px-4 py-3 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground font-medium mr-1">Your Selected</span>
                            {activeFilters.map((f) => (
                                <FilterChip key={f.key} label={f.label} onRemove={() => removeFilter(f.key)} />
                            ))}
                            <button
                                type="button"
                                onClick={clearAll}
                                className="ml-auto text-sm text-destructive hover:underline font-medium"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Results header */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-muted-foreground">
                            {total === 0
                                ? "No results found"
                                : <>Showing <span className="font-semibold text-foreground">{from}–{to}</span> of <span className="font-semibold text-foreground">{total}</span> results</>
                            }
                        </p>

                        <div className="flex items-center gap-2">
                            <Select value={limit} onValueChange={handleLimitChange}>
                                <SelectTrigger className="w-[120px] h-9 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="12">12 Per Page</SelectItem>
                                    <SelectItem value="24">24 Per Page</SelectItem>
                                    <SelectItem value="48">48 Per Page</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* View toggle */}
                            <div className="flex rounded-lg border overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setView("list")}
                                    className={`p-2 transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                                    title="List view"
                                >
                                    <LayoutList className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView("grid")}
                                    className={`p-2 transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                                    title="Grid view"
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Job cards */}
                    {jobs.length === 0 ? (
                        <div className="bg-card border rounded-xl py-20 flex flex-col items-center gap-4 text-muted-foreground">
                            <Briefcase className="h-12 w-12 opacity-20" />
                            <p className="text-lg font-medium">No jobs found</p>
                            <p className="text-sm">Try adjusting your filters or search terms.</p>
                            <Button type="button" variant="outline" onClick={clearAll}>Clear Filters</Button>
                        </div>
                    ) : view === "list" ? (
                        <div className="space-y-3">
                            {jobs.map((job) => <JobListCard key={job.id} job={job} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {jobs.map((job) => <JobGridCard key={job.id} job={job} />)}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1.5 pt-4">
                            <button
                                type="button"
                                title="Previous page"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            {pageNumbers.map((p, i) =>
                                p === "…" ? (
                                    <span key={`dots-${i}`} className="px-2 text-muted-foreground">…</span>
                                ) : (
                                    <button
                                        type="button"
                                        key={p}
                                        onClick={() => handlePageChange(p as number)}
                                        className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                                            p === currentPage
                                                ? "bg-primary text-primary-foreground"
                                                : "border hover:bg-muted"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}

                            <button
                                type="button"
                                title="Next page"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobsPageContent;
