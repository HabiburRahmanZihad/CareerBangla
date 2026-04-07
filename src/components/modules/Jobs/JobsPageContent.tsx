"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PaginationMeta } from "@/types/api.types";
import { IJob, IJobCategory } from "@/types/user.types";
import {
    ArrowRight,
    Briefcase,
    Building2,
    ChevronLeft,
    ChevronRight,
    Grid3X3,
    LayoutList,
    MapPin,
    RotateCcw,
    Search,
    SlidersHorizontal,
    Sparkles,
    TrendingUp,
    Users,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { JOB_TYPE_LABELS, JobGridCard, JobListCard } from "./JobCard";
import { DATE_POSTED_OPTIONS, FilterChip, JobsFilterPanel } from "./JobsFilterPanel";

// ── Constants ─────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
    { value: "default", label: "Best Match" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "salary_desc", label: "Salary: High → Low" },
    { value: "salary_asc", label: "Salary: Low → High" },
    { value: "most_applied", label: "Most Applied" },
];

const TRENDING = ["React Developer", "Python", "UI/UX", "Remote", "Internship", "Full Stack"];

const DOT_GRID_STYLE = {
    backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
    backgroundSize: "28px 28px",
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────
interface JobsPageContentProps {
    jobs: IJob[];
    meta?: PaginationMeta;
    categories: IJobCategory[];
    currentParams: Record<string, string | undefined>;
}

// ── Component ─────────────────────────────────────────────────────────────────
const JobsPageContent = ({ jobs, meta, categories, currentParams }: JobsPageContentProps) => {
    const router = useRouter();

    // ── Filter state ──────────────────────────────────────────────────────────
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

    // ── AI search suggestions ─────────────────────────────────────────────────
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionLoading, setSuggestionLoading] = useState(false);
    const suggestionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── AI suggestions fetcher ────────────────────────────────────────────────
    const fetchSuggestions = useCallback((query: string) => {
        if (suggestionTimer.current) clearTimeout(suggestionTimer.current);
        if (query.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
        suggestionTimer.current = setTimeout(async () => {
            setSuggestionLoading(true);
            try {
                const res = await fetch(`/api/job-suggestions?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setSuggestions(data.suggestions || []);
                setShowSuggestions(true);
            } catch {
                setSuggestions([]);
            } finally {
                setSuggestionLoading(false);
            }
        }, 350);
    }, []);

    const handleSearchTermChange = (val: string) => {
        setSearchTerm(val);
        fetchSuggestions(val);
    };

    const applySuggestion = (suggestion: string) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        buildAndNavigate({ searchTerm: suggestion });
    };

    // ── URL navigation ────────────────────────────────────────────────────────
    const buildAndNavigate = (overrides: Record<string, string | undefined> = {}) => {
        const merged = {
            searchTerm, location, jobType, categoryId,
            salaryMin, salaryMax, datePosted, sortBy, limit,
            ...overrides,
        };
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
        const resets: Record<string, string> = {
            searchTerm: "", location: "", jobType: "all",
            categoryId: "all", salaryMin: "", salaryMax: "", datePosted: "all",
        };
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

    // ── Active filter chips ───────────────────────────────────────────────────
    const activeFilters: { key: string; label: string }[] = [];
    if (currentParams.searchTerm) activeFilters.push({ key: "searchTerm", label: `"${currentParams.searchTerm}"` });
    if (currentParams.location) activeFilters.push({ key: "location", label: currentParams.location });
    if (currentParams.jobType && currentParams.jobType !== "all")
        activeFilters.push({ key: "jobType", label: JOB_TYPE_LABELS[currentParams.jobType] || currentParams.jobType });
    if (currentParams.categoryId && currentParams.categoryId !== "all") {
        const cat = categories.find((c) => c.id === currentParams.categoryId);
        if (cat) activeFilters.push({ key: "categoryId", label: cat.title });
    }
    if (currentParams.salaryMin)
        activeFilters.push({ key: "salaryMin", label: `Min ৳${Number(currentParams.salaryMin).toLocaleString()}` });
    if (currentParams.salaryMax)
        activeFilters.push({ key: "salaryMax", label: `Max ৳${Number(currentParams.salaryMax).toLocaleString()}` });
    if (currentParams.datePosted && currentParams.datePosted !== "all") {
        const dp = DATE_POSTED_OPTIONS.find((d) => d.value === currentParams.datePosted);
        if (dp) activeFilters.push({ key: "datePosted", label: dp.label });
    }

    // ── Pagination ────────────────────────────────────────────────────────────
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

    // ── Shared filter props ───────────────────────────────────────────────────
    const filterPanelProps = {
        searchTerm, setSearchTerm,
        location, setLocation,
        jobType, setJobType,
        categoryId, setCategoryId,
        salaryMin, setSalaryMin,
        salaryMax, setSalaryMax,
        datePosted, setDatePosted,
        categories,
        activeFiltersCount: activeFilters.length,
        applyFilters,
        clearAll,
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-background">

            {/* ── Hero Banner ─────────────────────────────────────────────── */}
            <div className="relative overflow-hidden border-b bg-linear-to-br from-primary/8 via-primary/4 to-background">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/8 blur-2xl" />
                {/* Dot grid */}
                { }
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={DOT_GRID_STYLE}
                />

                <div className="relative container mx-auto px-3 sm:px-4 py-10 sm:py-14 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 backdrop-blur-md bg-white/30 dark:bg-white/10 text-primary text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-5 border border-white/40 dark:border-white/15 shadow-sm ring-1 ring-primary/10">
                        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                        <span className="truncate">
                            {total > 0 ? `${total.toLocaleString()} Open Positions Available` : "Explore Opportunities"}
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 sm:mb-3 leading-tight">
                        Find Your{" "}
                        <span className="relative inline-block text-primary">
                            Dream Job
                            <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
                                <path d="M0 4 Q50 0 100 4 Q150 8 200 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
                            </svg>
                        </span>{" "}
                        Today
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl mx-auto mb-6 sm:mb-8 px-2">
                        Browse curated opportunities from top companies across Bangladesh.
                    </p>

                    {/* Search bar */}
                    <div className="max-w-2xl mx-auto mb-7">
                        <div className="backdrop-blur-xl bg-white/60 dark:bg-white/8 border border-white/50 dark:border-white/15 rounded-2xl shadow-xl shadow-primary/5 p-2">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Job title, skill, or company..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearchTermChange(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") { setSuggestions([]); setShowSuggestions(false); applyFilters(); } if (e.key === "Escape") { setSuggestions([]); setShowSuggestions(false); } }}
                                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                        className="w-full pl-9 pr-3 py-2.5 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                        autoComplete="off"
                                    />
                                    {/* AI Suggestions Dropdown */}
                                    {showSuggestions && (suggestions.length > 0 || suggestionLoading) && (
                                        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-border/60 bg-background shadow-xl overflow-hidden">
                                            {suggestionLoading && (
                                                <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                                                    <Sparkles className="h-3 w-3 animate-pulse text-primary" /> AI is thinking...
                                                </div>
                                            )}
                                            {suggestions.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onMouseDown={() => applySuggestion(s)}
                                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors"
                                                >
                                                    <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                    {s}
                                                </button>
                                            ))}
                                            <div className="border-t border-border/40 px-3 py-1.5 flex items-center gap-1 text-[10px] text-muted-foreground/60">
                                                <Sparkles className="h-2.5 w-2.5 text-primary/60" /> AI-powered suggestions
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="hidden sm:block w-px bg-border/50 self-stretch" />
                                <div className="relative sm:w-44">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Location..."
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                                        className="w-full pl-9 pr-3 py-2.5 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={applyFilters}
                                    className="rounded-xl px-5 shrink-0 gap-1.5 shadow-md w-full sm:w-auto"
                                >
                                    <Search className="h-4 w-4" /> Search
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Trending chips */}
                    <div className="flex items-center justify-center flex-wrap gap-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                            <TrendingUp className="h-3.5 w-3.5 text-primary" /> Trending:
                        </span>
                        {TRENDING.map((term) => (
                            <button
                                key={term}
                                type="button"
                                onClick={() => { setSearchTerm(term); buildAndNavigate({ searchTerm: term }); }}
                                className="text-xs px-3 py-1 rounded-full backdrop-blur-md bg-white/40 dark:bg-white/10 border border-white/50 dark:border-white/15 hover:border-primary/50 hover:text-primary hover:bg-primary/10 transition-all font-medium shadow-sm"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats strip */}
                <div className="relative border-t border-white/30 dark:border-white/10 backdrop-blur-md bg-white/40 dark:bg-white/5">
                    <div className="container mx-auto px-3 sm:px-4 py-3 flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                        {[
                            { icon: <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />, label: "Open Jobs", value: total.toLocaleString() },
                            { icon: <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />, label: "Companies", value: "50+" },
                            { icon: <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />, label: "Cities", value: "10+" },
                            { icon: <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-500" />, label: "Applicants", value: "1K+" },
                        ].map((stat, i) => (
                            <div key={stat.label} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                {i > 0 && <span className="w-px h-3.5 bg-border/40 hidden xs:block" />}
                                {stat.icon}
                                <span className="font-bold text-foreground">{stat.value}</span>
                                <span className="text-muted-foreground hidden xs:inline">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Body ────────────────────────────────────────────────────── */}
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">

                {/* Mobile filter toggle */}
                <div className="lg:hidden mb-3 sm:mb-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="gap-2 w-full"
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
                        {activeFilters.length > 0 && (
                            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                                {activeFilters.length} active
                            </span>
                        )}
                    </Button>
                </div>

                {/* Mobile filters drawer */}
                {mobileFiltersOpen && (
                    <div className="lg:hidden mb-5 backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl p-5 shadow-xl">
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
                        <JobsFilterPanel {...filterPanelProps} />
                    </div>
                )}

                <div className="flex gap-6 items-start">

                    {/* ── Jobs column ── */}
                    <div className="flex-1 min-w-0 space-y-4">

                        {/* Active filter chips */}
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 backdrop-blur-sm bg-primary/5 border border-primary/15 rounded-xl px-4 py-2.5 shadow-sm">
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
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                            <p className="text-xs sm:text-sm text-muted-foreground shrink-0">
                                {total === 0 ? "No results" : `Showing ${from}–${to} of ${total.toLocaleString()}`}
                            </p>
                            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                                {/* Sort */}
                                <Select value={sortBy} onValueChange={handleSortChange}>
                                    <SelectTrigger className="h-8 text-xs shrink-0 w-32 sm:w-36">
                                        <SelectValue>
                                            {SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Best Match"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SORT_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Per page */}
                                <Select value={limit} onValueChange={handleLimitChange}>
                                    <SelectTrigger className="h-8 text-xs shrink-0 w-20 sm:w-24 hidden sm:flex">
                                        <SelectValue>{limit} / page</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="12">12 / page</SelectItem>
                                        <SelectItem value="24">24 / page</SelectItem>
                                        <SelectItem value="48">48 / page</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* View toggle + Refresh */}
                                <div className="flex rounded-lg border overflow-hidden bg-card shrink-0">
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
                                    <div className="w-px bg-border self-stretch" />
                                    <button
                                        type="button"
                                        title="Refresh results"
                                        onClick={() => router.refresh()}
                                        className="p-1.5 hover:bg-muted hover:text-primary transition-colors"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Job cards */}
                        {jobs.length === 0 ? (
                            <div className="backdrop-blur-sm bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl py-28 flex flex-col items-center gap-4 text-center shadow-sm">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
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

                                {/* Mobile: compact counter */}
                                <span className="sm:hidden text-xs font-semibold text-muted-foreground px-2">
                                    {currentPage} / {totalPages}
                                </span>

                                {/* Desktop: full page list */}
                                <div className="hidden sm:flex items-center gap-1.5">
                                    {pageNumbers.map((p, i) =>
                                        p === "…" ? (
                                            <span key={`dots-${i}`} className="px-1 text-muted-foreground text-sm select-none">…</span>
                                        ) : (
                                            <button
                                                type="button"
                                                key={p}
                                                onClick={() => handlePageChange(p as number)}
                                                className={`h-8 w-8 rounded-lg text-sm font-semibold transition-all ${p === currentPage
                                                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                                                    : "border bg-card hover:bg-muted"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}
                                </div>

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

                        {/* Next page nudge */}
                        {jobs.length > 0 && currentPage < totalPages && (
                            <p className="text-center text-xs pt-2 flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="text-primary font-semibold flex items-center gap-0.5 hover:underline"
                                >
                                    Load more <ArrowRight className="h-3 w-3" />
                                </button>
                            </p>
                        )}
                    </div>

                    {/* ── Right Filter Sidebar ── */}
                    <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
                        <div className="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-black/5 sticky top-24">
                            <div className="bg-linear-to-r from-primary/15 to-primary/5 px-5 py-4 border-b border-white/40 dark:border-white/10 flex items-center justify-between">
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
                                <JobsFilterPanel {...filterPanelProps} />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default JobsPageContent;
