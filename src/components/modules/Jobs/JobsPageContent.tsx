"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginationMeta } from "@/types/api.types";
import { IJob, IJobCategory } from "@/types/user.types";
import { differenceInDays } from "date-fns";
import {
    ArrowRight,
    Banknote,
    Bookmark,
    Briefcase,
    Building2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Grid3X3,
    LayoutList,
    MapPin,
    RotateCcw,
    Search,
    SlidersHorizontal,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    X,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const JOB_TYPE_LABELS: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    REMOTE: "Remote",
};

const JOB_TYPES = Object.entries(JOB_TYPE_LABELS);

const DATE_POSTED_OPTIONS = [
    { value: "all", label: "Any time" },
    { value: "24h", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "14d", label: "Last 14 days" },
    { value: "30d", label: "Last 30 days" },
];

const SORT_OPTIONS = [
    { value: "default", label: "Best Match" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "salary_desc", label: "Salary: High → Low" },
    { value: "salary_asc", label: "Salary: Low → High" },
    { value: "most_applied", label: "Most Applied" },
];

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

const getAvatarGradient = (str: string) => {
    let hash = 0;
    for (const c of str) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const fmt = (n: number) => n >= 1000 ? `৳${(n / 1000).toFixed(0)}k` : `৳${n}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return `Up to ${fmt(max!)}`;
};

const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// ── Company Logo ──────────────────────────────────────────────────────────────
const CompanyLogo = ({ name, logoUrl, size = "md" }: { name: string; logoUrl?: string | null; size?: "sm" | "md" }) => {
    const gradient = getAvatarGradient(name);
    const dim = size === "sm" ? "h-10 w-10 text-sm" : "h-12 w-12 text-base";
    if (logoUrl) {
        return (
            <div className={`${dim} rounded-xl border-2 border-border bg-white shrink-0 overflow-hidden flex items-center justify-center shadow-sm`}>
                <Image src={logoUrl} alt={name} width={48} height={48} className="object-contain w-full h-full p-0.5" />
            </div>
        );
    }
    return (
        <div className={`${dim} rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center text-white font-bold shrink-0 shadow-sm`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
};

// ── List Card ─────────────────────────────────────────────────────────────────
const JobListCard = ({ job }: { job: IJob }) => {
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
            <div className={`
                relative flex gap-4 p-4 rounded-2xl border bg-card
                transition-all duration-200 ease-out
                hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40
                before:absolute before:left-0 before:top-4 before:bottom-4 before:w-0.75
                before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity
                group-hover:before:opacity-100
                ${job.featuredJob ? "border-amber-300/70 dark:border-amber-700/50 bg-amber-50/30 dark:bg-amber-950/10" : ""}
            `}>
                {/* Logo */}
                <CompanyLogo name={companyName} logoUrl={logoUrl} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Badges row */}
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
                                <Clock className="h-2.5 w-2.5" /> {daysLeft === 0 ? "Expires today" : `${daysLeft}d left`}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-[15px] leading-snug group-hover:text-primary transition-colors line-clamp-1 mb-0.5">
                        {job.title}
                    </h3>

                    {/* Company + location */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mb-1.5">
                        <span className="flex items-center gap-1 font-medium text-foreground/70">
                            <Building2 className="h-3 w-3" />{companyName}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{job.location}
                        </span>
                        {job.category?.title && (
                            <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />{job.category.title}
                            </span>
                        )}
                    </div>

                    {/* Description snippet */}
                    {descSnippet && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2 leading-relaxed">
                            {descSnippet}…
                        </p>
                    )}

                    {/* Bottom row */}
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
                                <Banknote className="h-3.5 w-3.5" />{salary}
                            </span>
                        )}
                        {appCount !== undefined && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                                <Users className="h-3 w-3" />{appCount} applied
                            </span>
                        )}
                    </div>
                </div>

                {/* Bookmark */}
                <Bookmark className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-60 transition-all" />
            </div>
        </Link>
    );
};

// ── Grid Card ─────────────────────────────────────────────────────────────────
const JobGridCard = ({ job }: { job: IJob }) => {
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
            <div className={`
                relative h-full flex flex-col rounded-2xl border bg-card overflow-hidden
                transition-all duration-200 ease-out
                hover:shadow-xl hover:-translate-y-1 hover:border-primary/40
                ${job.featuredJob ? "border-amber-300/70 dark:border-amber-700/50" : ""}
            `}>
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-primary/60 via-primary to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                <div className="p-5 flex flex-col flex-1">
                    {/* Header */}
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

                    {/* Urgent / expiring badges */}
                    {(job.urgentHiring || isExpiringSoon) && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {job.urgentHiring && (
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                    <Zap className="h-2.5 w-2.5 fill-current" /> Urgent
                                </span>
                            )}
                            {isExpiringSoon && (
                                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                    <Clock className="h-2.5 w-2.5" /> {daysLeft === 0 ? "Today" : `${daysLeft}d left`}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="font-bold text-[14px] leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {job.title}
                    </h3>

                    {/* Company */}
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">{companyName}</span>
                    </p>

                    {/* Description snippet */}
                    {descSnippet && (
                        <p className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-relaxed mb-3">
                            {descSnippet}…
                        </p>
                    )}

                    {/* Meta */}
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
                                <Banknote className="h-3 w-3 shrink-0" />{salary}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 pb-4 flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                        {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                    </span>
                    {appCount !== undefined && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />{appCount}
                        </span>
                    )}
                </div>

                {/* Hover bottom strip */}
                <div className="h-0.5 w-full bg-linear-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
        </Link>
    );
};

// ── Filter chip ───────────────────────────────────────────────────────────────
const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/25">
        {label}
        <button type="button" title={`Remove ${label}`} onClick={onRemove} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
            <X className="h-3 w-3" />
        </button>
    </span>
);

// ── Filter section label ──────────────────────────────────────────────────────
const FilterLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">{children}</p>
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

    const [searchTerm, setSearchTerm] = useState(currentParams.searchTerm || "");
    const [location, setLocation] = useState(currentParams.location || "");
    const [jobType, setJobType] = useState(currentParams.jobType || "all");
    const [categoryId, setCategoryId] = useState(currentParams.categoryId || "all");
    const [salaryMin, setSalaryMin] = useState(currentParams.salaryMin || "");
    const [salaryMax, setSalaryMax] = useState(currentParams.salaryMax || "");
    const [datePosted, setDatePosted] = useState(currentParams.datePosted || "all");
    const [sortBy, setSortBy] = useState(currentParams.sortBy || "default");
    const [limit, setLimit] = useState(currentParams.limit || "12");
    const [view, setView] = useState<"list" | "grid">("list");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const buildAndNavigate = (overrides: Record<string, string | undefined> = {}) => {
        const merged = { searchTerm, location, jobType, categoryId, salaryMin, salaryMax, datePosted, sortBy, limit, ...overrides };
        const p = new URLSearchParams();
        if (merged.searchTerm) p.set("searchTerm", merged.searchTerm);
        if (merged.location) p.set("location", merged.location);
        if (merged.jobType && merged.jobType !== "all") p.set("jobType", merged.jobType);
        if (merged.categoryId && merged.categoryId !== "all") p.set("categoryId", merged.categoryId);
        if (merged.salaryMin) p.set("salaryMin", merged.salaryMin);
        if (merged.salaryMax) p.set("salaryMax", merged.salaryMax);
        if (merged.datePosted && merged.datePosted !== "all") p.set("datePosted", merged.datePosted);
        if (merged.sortBy && merged.sortBy !== "default") p.set("sortBy", merged.sortBy);
        if (merged.limit && merged.limit !== "12") p.set("limit", merged.limit);
        router.push(`/jobs?${p.toString()}`);
    };

    const applyFilters = () => { buildAndNavigate(); setMobileFiltersOpen(false); };

    const removeFilter = (key: string) => {
        const resets: Record<string, string> = { searchTerm: "", location: "", jobType: "all", categoryId: "all", salaryMin: "", salaryMax: "", datePosted: "all" };
        if (key === "searchTerm") setSearchTerm("");
        if (key === "location") setLocation("");
        if (key === "jobType") setJobType("all");
        if (key === "categoryId") setCategoryId("all");
        if (key === "salaryMin") setSalaryMin("");
        if (key === "salaryMax") setSalaryMax("");
        if (key === "datePosted") setDatePosted("all");
        buildAndNavigate({ [key]: resets[key] });
    };

    const clearAll = () => {
        setSearchTerm(""); setLocation(""); setJobType("all"); setCategoryId("all");
        setSalaryMin(""); setSalaryMax(""); setDatePosted("all"); setSortBy("default");
        router.push("/jobs");
    };

    const handleSortChange = (val: string) => { setSortBy(val); buildAndNavigate({ sortBy: val }); };
    const handleLimitChange = (val: string) => { setLimit(val); buildAndNavigate({ limit: val }); };
    const handlePageChange = (page: number) => buildAndNavigate({ page: page.toString() });

    const activeFilters: { key: string; label: string }[] = [];
    if (currentParams.searchTerm) activeFilters.push({ key: "searchTerm", label: `"${currentParams.searchTerm}"` });
    if (currentParams.location) activeFilters.push({ key: "location", label: currentParams.location });
    if (currentParams.jobType && currentParams.jobType !== "all") activeFilters.push({ key: "jobType", label: JOB_TYPE_LABELS[currentParams.jobType] || currentParams.jobType });
    if (currentParams.categoryId && currentParams.categoryId !== "all") {
        const cat = categories.find((c) => c.id === currentParams.categoryId);
        if (cat) activeFilters.push({ key: "categoryId", label: cat.title });
    }
    if (currentParams.salaryMin) activeFilters.push({ key: "salaryMin", label: `Min ৳${Number(currentParams.salaryMin).toLocaleString()}` });
    if (currentParams.salaryMax) activeFilters.push({ key: "salaryMax", label: `Max ৳${Number(currentParams.salaryMax).toLocaleString()}` });
    if (currentParams.datePosted && currentParams.datePosted !== "all") {
        const dp = DATE_POSTED_OPTIONS.find((d) => d.value === currentParams.datePosted);
        if (dp) activeFilters.push({ key: "datePosted", label: dp.label });
    }

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

    // ── Filter panel JSX (plain variable, not component, to avoid focus loss) ─
    const filterPanel = (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <FilterLabel>Keywords</FilterLabel>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Title, skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                        className="pl-8 h-9 text-sm"
                    />
                </div>
            </div>

            {/* Location */}
            <div>
                <FilterLabel>Location</FilterLabel>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder="City or area..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                        className="pl-8 h-9 text-sm"
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <FilterLabel>Category</FilterLabel>
                <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Job Type – pill toggles */}
            <div>
                <FilterLabel>Job Type</FilterLabel>
                <div className="flex flex-wrap gap-1.5">
                    <button
                        type="button"
                        onClick={() => setJobType("all")}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                            jobType === "all"
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-card text-muted-foreground border-border hover:border-primary/50"
                        }`}
                    >
                        All
                    </button>
                    {JOB_TYPES.map(([val, label]) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => setJobType(val)}
                            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                                jobType === val
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : "bg-card text-muted-foreground border-border hover:border-primary/50"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Salary Range */}
            <div>
                <FilterLabel>Salary Range (৳)</FilterLabel>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Min</p>
                        <Input
                            type="number"
                            placeholder="20,000"
                            value={salaryMin}
                            onChange={(e) => setSalaryMin(e.target.value)}
                            className="h-9 text-sm"
                            min={0}
                        />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Max</p>
                        <Input
                            type="number"
                            placeholder="80,000"
                            value={salaryMax}
                            onChange={(e) => setSalaryMax(e.target.value)}
                            className="h-9 text-sm"
                            min={0}
                        />
                    </div>
                </div>
            </div>

            {/* Date Posted */}
            <div>
                <FilterLabel>Date Posted</FilterLabel>
                <div className="space-y-1">
                    {DATE_POSTED_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setDatePosted(opt.value)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                                datePosted === opt.value
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-muted-foreground hover:bg-muted"
                            }`}
                        >
                            <span className={`h-2 w-2 rounded-full shrink-0 transition-all ${
                                datePosted === opt.value ? "bg-primary scale-125" : "bg-muted-foreground/30"
                            }`} />
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
                <Button type="button" onClick={applyFilters} className="w-full gap-2">
                    <Search className="h-4 w-4" /> Search Jobs
                </Button>
                {activeFilters.length > 0 && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors py-1.5"
                    >
                        <RotateCcw className="h-3 w-3" /> Reset all filters
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* ── Hero Banner ── */}
            <div className="bg-linear-to-br from-primary/5 via-primary/3 to-background border-b">
                <div className="container mx-auto px-4 py-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-primary/20">
                            <Briefcase className="h-3.5 w-3.5" />
                            {total > 0 ? `${total.toLocaleString()} Open Positions` : "Explore Opportunities"}
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                            Find Your{" "}
                            <span className="text-primary relative">
                                Dream Job
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/40 rounded-full" />
                            </span>
                        </h1>
                        <p className="text-muted-foreground text-base">
                            Browse curated opportunities from top companies across Bangladesh.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Mobile filter toggle */}
                <div className="lg:hidden mb-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="gap-2 w-full sm:w-auto"
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
                        {activeFilters.length > 0 && (
                            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {activeFilters.length}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Mobile filters panel */}
                {mobileFiltersOpen && (
                    <div className="lg:hidden mb-5 bg-card border rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-sm flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
                            </h2>
                            {activeFilters.length > 0 && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold border border-primary/20">
                                    {activeFilters.length} active
                                </span>
                            )}
                        </div>
                        {filterPanel}
                    </div>
                )}

                <div className="flex gap-6 items-start">
                    {/* ── Jobs column ── */}
                    <div className="flex-1 min-w-0 space-y-4">
                        {/* Active filter chips */}
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 bg-card border rounded-xl px-4 py-2.5">
                                <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">Filters:</span>
                                {activeFilters.map((f) => (
                                    <FilterChip key={f.key} label={f.label} onRemove={() => removeFilter(f.key)} />
                                ))}
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="ml-auto text-xs text-muted-foreground hover:text-destructive font-semibold transition-colors flex items-center gap-1"
                                >
                                    <X className="h-3 w-3" /> Clear all
                                </button>
                            </div>
                        )}

                        {/* Results bar */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <p className="text-sm text-muted-foreground">
                                {total === 0
                                    ? "No results"
                                    : <><span className="font-bold text-foreground">{from}–{to}</span> of <span className="font-bold text-foreground">{total.toLocaleString()}</span> jobs</>
                                }
                            </p>
                            <div className="flex items-center gap-2">
                                <Select value={sortBy} onValueChange={handleSortChange}>
                                    <SelectTrigger className="w-40 h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SORT_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={limit} onValueChange={handleLimitChange}>
                                    <SelectTrigger className="w-25 h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="12">12 / page</SelectItem>
                                        <SelectItem value="24">24 / page</SelectItem>
                                        <SelectItem value="48">48 / page</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex rounded-lg border overflow-hidden bg-card">
                                    <button
                                        type="button"
                                        title="List view"
                                        onClick={() => setView("list")}
                                        className={`p-1.5 transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                    >
                                        <LayoutList className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        title="Grid view"
                                        onClick={() => setView("grid")}
                                        className={`p-1.5 transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Job cards */}
                        {jobs.length === 0 ? (
                            <div className="bg-card border rounded-2xl py-28 flex flex-col items-center gap-4 text-center">
                                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                    <Briefcase className="h-8 w-8 text-muted-foreground/40" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold mb-1">No jobs found</p>
                                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
                                </div>
                                <Button type="button" variant="outline" onClick={clearAll} className="gap-2">
                                    <RotateCcw className="h-4 w-4" /> Clear All Filters
                                </Button>
                            </div>
                        ) : view === "list" ? (
                            <div className="space-y-2.5">
                                {jobs.map((job) => <JobListCard key={job.id} job={job} />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
                                    className="h-8 w-8 flex items-center justify-center rounded-lg border bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                {pageNumbers.map((p, i) =>
                                    p === "…" ? (
                                        <span key={`dots-${i}`} className="px-1 text-muted-foreground text-sm select-none">…</span>
                                    ) : (
                                        <button
                                            type="button"
                                            key={p}
                                            onClick={() => handlePageChange(p as number)}
                                            className={`h-8 w-8 rounded-lg text-sm font-semibold transition-all ${
                                                p === currentPage
                                                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                                                    : "border bg-card hover:bg-muted"
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
                                    className="h-8 w-8 flex items-center justify-center rounded-lg border bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* "View all" nudge when results exist */}
                        {jobs.length > 0 && (
                            <p className="text-center text-xs text-muted-foreground pt-2 flex items-center justify-center gap-1">
                                Showing {from}–{to} of {total.toLocaleString()} positions
                                {currentPage < totalPages && (
                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="text-primary font-semibold flex items-center gap-0.5 hover:underline"
                                    >
                                        Next <ArrowRight className="h-3 w-3" />
                                    </button>
                                )}
                            </p>
                        )}
                    </div>

                    {/* ── Right Filter Sidebar ── */}
                    <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
                        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm sticky top-24">
                            {/* Sidebar header */}
                            <div className="bg-linear-to-r from-primary/10 to-primary/5 px-5 py-4 border-b flex items-center justify-between">
                                <h2 className="font-bold text-sm flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-primary" /> Refine Results
                                </h2>
                                {activeFilters.length > 0 && (
                                    <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">
                                        {activeFilters.length}
                                    </span>
                                )}
                            </div>
                            <div className="p-5">
                                {filterPanel}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default JobsPageContent;
