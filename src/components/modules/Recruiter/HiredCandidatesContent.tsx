"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getHiredCandidates } from "@/services/application.services";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    Award,
    Briefcase,
    Building2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Download,
    Mail,
    Phone,
    Search,
    TrendingUp,
    User,
    Users,
    X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface HiredCandidate {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
        resume?: {
            professionalTitle?: string;
            profilePhoto?: string;
            contactNumber?: string;
        };
    };
    job: {
        id: string;
        title: string;
        recruiter?: {
            id: string;
            companyName: string;
        };
    };
    hiredDate?: string;
    hiredCompany?: string;
    hiredDesignation?: string;
    createdAt?: string;
}

interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function HiredCandidatesSkeleton() {
    return (
        <div className="space-y-5 pb-8 animate-pulse container mx-auto">
            {/* Header */}
            <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600" />
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-40 rounded-md" />
                            <Skeleton className="h-3.5 w-64 rounded-md" />
                        </div>
                    </div>
                    <Skeleton className="h-7 w-24 rounded-xl" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border border-border/50 bg-card p-5 flex items-center gap-4">
                        <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-12 rounded-md" />
                            <Skeleton className="h-3 w-24 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <Skeleton className="h-11 w-full rounded-xl" />

            {/* Cards */}
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                    <div className="p-5 flex flex-col sm:flex-row gap-4">
                        <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-36 rounded-md" />
                                <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                            <Skeleton className="h-3.5 w-48 rounded-md" />
                            <div className="flex gap-4">
                                <Skeleton className="h-3.5 w-40 rounded-md" />
                                <Skeleton className="h-3.5 w-28 rounded-md" />
                            </div>
                            <Skeleton className="h-3.5 w-56 rounded-md mt-1" />
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
                            <Skeleton className="h-8 w-20 rounded-xl" />
                        </div>
                    </div>
                    <div className="border-t border-border/30 bg-muted/30 px-5 py-3 flex flex-wrap gap-6">
                        <Skeleton className="h-8 w-28 rounded-md" />
                        <Skeleton className="h-8 w-32 rounded-md" />
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border/60 bg-card text-center container mx-auto">
            <div className="relative mb-5">
                <div className="h-20 w-20 rounded-3xl bg-muted/50 border border-border/40 flex items-center justify-center">
                    <Users className="h-9 w-9 text-muted-foreground/40" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-muted border border-border/50 flex items-center justify-center">
                    <span className="text-[10px] font-black text-muted-foreground">0</span>
                </div>
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
                {isFiltered ? "No results found" : "No hired candidates yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                {isFiltered
                    ? "Try adjusting your search to find what you're looking for."
                    : "Candidates you hire will appear here with their company and designation details."}
            </p>
        </div>
    );
}

// ─── Candidate Card ───────────────────────────────────────────────────────────

function CandidateCard({
    candidate,
    onDownloadCV,
}: {
    candidate: HiredCandidate;
    onDownloadCV: (id: string, name: string) => void;
}) {
    const photo = candidate.user?.resume?.profilePhoto || candidate.user?.image;
    const name = candidate.user?.name || "Unknown";
    const title = candidate.user?.resume?.professionalTitle;
    const email = candidate.user?.email;
    const phone = candidate.user?.resume?.contactNumber;
    const hasHiredInfo = candidate.hiredCompany || candidate.hiredDesignation || candidate.hiredDate;

    return (
        <div className="group rounded-2xl border border-border/40 bg-card overflow-hidden hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800/40 transition-all duration-300 container mx-auto">

            {/* Main row */}
            <div className="p-5 flex flex-col sm:flex-row gap-4">

                {/* Avatar */}
                <div className="relative shrink-0 self-start">
                    <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-emerald-500/10 ring-2 ring-emerald-500/20">
                        {photo ? (
                            <Image
                                src={photo}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center">
                                <User className="h-6 w-6 text-emerald-500/60" />
                            </div>
                        )}
                    </div>
                    {/* Hired indicator dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-card" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-foreground truncate">{name}</h3>
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black px-2 py-0.5 rounded-full">
                            HIRED
                        </Badge>
                    </div>

                    {title && (
                        <p className="text-xs text-muted-foreground mb-2 font-medium">{title}</p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {email && (
                            <span className="flex items-center gap-1.5 min-w-0">
                                <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                                <span className="truncate">{email}</span>
                            </span>
                        )}
                        {phone && (
                            <span className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                                {phone}
                            </span>
                        )}
                    </div>

                    {/* Job applied for */}
                    {candidate.job?.title && (
                        <div className="mt-3 inline-flex items-center gap-1.5 bg-muted/50 border border-border/50 rounded-lg px-2.5 py-1.5 text-xs">
                            <Briefcase className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                            <span className="font-semibold text-foreground truncate">{candidate.job.title}</span>
                            {candidate.job?.recruiter?.companyName && (
                                <span className="text-muted-foreground">
                                    @ {candidate.job.recruiter.companyName}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions column */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
                    {candidate.createdAt && (
                        <div className="text-right">
                            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground/40">
                                Applied
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(candidate.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-border/60 hover:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all text-xs font-semibold gap-1.5 h-8 px-3"
                        onClick={() => onDownloadCV(candidate.user?.id || "", name)}
                    >
                        <Download className="h-3.5 w-3.5" />
                        CV
                    </Button>
                </div>
            </div>

            {/* Bottom strip: hired details */}
            {hasHiredInfo && (
                <div className="border-t border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-900/10 px-5 py-3 flex flex-wrap gap-x-6 gap-y-2.5">
                    {candidate.hiredCompany && (
                        <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <div>
                                <p className="text-[9px] font-black tracking-[0.18em] uppercase text-emerald-600/50 dark:text-emerald-400/40 leading-none mb-0.5">
                                    Hired at
                                </p>
                                <p className="text-xs font-semibold text-foreground leading-none">
                                    {candidate.hiredCompany}
                                </p>
                            </div>
                        </div>
                    )}
                    {candidate.hiredDesignation && (
                        <div className="flex items-center gap-2">
                            <Award className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <div>
                                <p className="text-[9px] font-black tracking-[0.18em] uppercase text-emerald-600/50 dark:text-emerald-400/40 leading-none mb-0.5">
                                    Designation
                                </p>
                                <p className="text-xs font-semibold text-foreground leading-none">
                                    {candidate.hiredDesignation}
                                </p>
                            </div>
                        </div>
                    )}
                    {candidate.hiredDate && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <div>
                                <p className="text-[9px] font-black tracking-[0.18em] uppercase text-emerald-600/50 dark:text-emerald-400/40 leading-none mb-0.5">
                                    Hired on
                                </p>
                                <p className="text-xs font-semibold text-foreground leading-none">
                                    {new Date(candidate.hiredDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const HiredCandidatesContent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const { data: candidatesData, isLoading } = useQuery({
        queryKey: ["hired-candidates", page, searchTerm],
        queryFn: () =>
            getHiredCandidates({
                page,
                limit: 10,
                search: searchTerm || undefined,
            }),
    });

    const candidates = (candidatesData?.data || []) as HiredCandidate[];
    const meta = (candidatesData?.meta as PaginationMeta) || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    };

    // Computed stats from current page data
    const uniqueCompanies = new Set(
        candidates.map((c) => c.hiredCompany).filter(Boolean)
    ).size;

    const latestHireDate = candidates
        .filter((c) => c.hiredDate)
        .map((c) => new Date(c.hiredDate!))
        .sort((a, b) => b.getTime() - a.getTime())[0];

    const handleDownloadCV = (candidateId: string, candidateName: string) => {
        toast.info(`CV download for ${candidateName} coming soon`);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setPage(1);
    };

    if (isLoading) return <HiredCandidatesSkeleton />;

    return (
        <div className="container mx-auto space-y-5 py-8">

            {/* ── Page Header ── */}
            <div className="rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm">
                {/* Accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600" />
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-500/20 shrink-0">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground leading-tight">
                                Hired Candidates
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Candidates you&apos;ve hired with their company and role details
                            </p>
                        </div>
                    </div>
                    {meta.total > 0 && (
                        <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 shrink-0">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                {meta.total} Total
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Hired */}
                <div className="rounded-2xl border border-border/50 bg-card p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
                    <div className="h-11 w-11 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-500/20 shrink-0">
                        <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground leading-none mb-0.5">
                            {meta.total}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">Total Hired</p>
                    </div>
                </div>

                {/* Unique Companies (from current page) */}
                <div className="rounded-2xl border border-border/50 bg-card p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
                    <div className="h-11 w-11 rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground leading-none mb-0.5">
                            {uniqueCompanies || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">Companies (this page)</p>
                    </div>
                </div>

                {/* Latest Hire */}
                <div className="rounded-2xl border border-border/50 bg-card p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
                    <div className="h-11 w-11 rounded-xl bg-linear-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm shadow-violet-500/20 shrink-0">
                        <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground leading-none mb-0.5">
                            {latestHireDate
                                ? latestHireDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                : "—"}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">Latest hire date</p>
                    </div>
                </div>
            </div>

            {/* ── Search ── */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
                <Input
                    placeholder="Search by candidate name or email..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                    className="pl-10 pr-10 h-11 rounded-xl border-border/60 bg-card focus:border-emerald-500/50 focus:ring-emerald-500/20 text-sm"
                />
                {searchTerm && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={clearSearch}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                    >
                        <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                )}
            </div>

            {/* ── Results summary ── */}
            {!isLoading && candidates.length > 0 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground px-0.5">
                    <span>
                        Showing{" "}
                        <span className="font-semibold text-foreground">
                            {(meta.page - 1) * meta.limit + 1}–
                            {Math.min(meta.page * meta.limit, meta.total)}
                        </span>{" "}
                        of <span className="font-semibold text-foreground">{meta.total}</span> candidates
                    </span>
                    {searchTerm && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Filtered by &quot;{searchTerm}&quot;
                        </span>
                    )}
                </div>
            )}

            {/* ── Content ── */}
            {candidates.length === 0 ? (
                <EmptyState isFiltered={!!searchTerm} />
            ) : (
                <div className="space-y-3">
                    {candidates.map((candidate) => (
                        <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            onDownloadCV={handleDownloadCV}
                        />
                    ))}
                </div>
            )}

            {/* ── Pagination ── */}
            {meta.totalPages > 1 && (
                <div className="flex items-center justify-between gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="rounded-xl border-border/60 gap-1.5 h-9 px-4 text-xs font-semibold disabled:opacity-40"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous
                    </Button>

                    {/* Page pills */}
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                            .filter((p) =>
                                p === 1 ||
                                p === meta.totalPages ||
                                Math.abs(p - page) <= 1
                            )
                            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                                if (idx > 0 && (arr[idx - 1] as number) < p - 1) {
                                    acc.push("...");
                                }
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, idx) =>
                                p === "..." ? (
                                    <span key={`dots-${idx}`} className="text-xs text-muted-foreground/50 px-1">
                                        ···
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        key={p}
                                        aria-label={`Go to page ${p}`}
                                        onClick={() => setPage(p as number)}
                                        className={`h-8 min-w-8 px-2.5 rounded-lg text-xs font-bold transition-all ${page === p
                                                ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
                                                : "bg-card border border-border/60 text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                        disabled={page === meta.totalPages}
                        className="rounded-xl border-border/60 gap-1.5 h-9 px-4 text-xs font-semibold disabled:opacity-40"
                    >
                        Next
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default HiredCandidatesContent;
