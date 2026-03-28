import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IJobCategory } from "@/types/user.types";
import { MapPin, RotateCcw, Search, X } from "lucide-react";
import { JOB_TYPE_LABELS } from "./JobCard";

// ── Constants ─────────────────────────────────────────────────────────────────
export const DATE_POSTED_OPTIONS = [
    { value: "all", label: "Any time" },
    { value: "24h", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "14d", label: "Last 14 days" },
    { value: "30d", label: "Last 30 days" },
];

const JOB_TYPES = Object.entries(JOB_TYPE_LABELS);

// ── Filter chip ───────────────────────────────────────────────────────────────
export const FilterChip = ({
    label,
    onRemove,
}: {
    label: string;
    onRemove: () => void;
}) => (
    <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/25">
        {label}
        <button
            type="button"
            title={`Remove ${label}`}
            onClick={onRemove}
            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
        >
            <X className="h-3 w-3" />
        </button>
    </span>
);

// ── Section label ─────────────────────────────────────────────────────────────
const FilterLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">
        {children}
    </p>
);

// ── Props ─────────────────────────────────────────────────────────────────────
export interface JobsFilterPanelProps {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    location: string;
    setLocation: (v: string) => void;
    jobType: string;
    setJobType: (v: string) => void;
    categoryId: string;
    setCategoryId: (v: string) => void;
    salaryMin: string;
    setSalaryMin: (v: string) => void;
    salaryMax: string;
    setSalaryMax: (v: string) => void;
    datePosted: string;
    setDatePosted: (v: string) => void;
    categories: IJobCategory[];
    activeFiltersCount: number;
    applyFilters: () => void;
    clearAll: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
// Defined at module scope (not inside another component) so its identity is
// stable across renders — inputs never lose focus.
export const JobsFilterPanel = ({
    searchTerm,
    setSearchTerm,
    location,
    setLocation,
    jobType,
    setJobType,
    categoryId,
    setCategoryId,
    salaryMin,
    setSalaryMin,
    salaryMax,
    setSalaryMax,
    datePosted,
    setDatePosted,
    categories,
    activeFiltersCount,
    applyFilters,
    clearAll,
}: JobsFilterPanelProps) => (
    <div className="space-y-6">
        {/* Keywords */}
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
                <SelectTrigger className="h-9 text-sm w-full">
                    <SelectValue>
                        {categoryId === "all"
                            ? "All Categories"
                            : (categories.find((c) => c.id === categoryId)?.title ?? "All Categories")}
                    </SelectValue>
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
                        <span
                            className={`h-2 w-2 rounded-full shrink-0 transition-all ${
                                datePosted === opt.value
                                    ? "bg-primary scale-125"
                                    : "bg-muted-foreground/30"
                            }`}
                        />
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
            {activeFiltersCount > 0 && (
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
