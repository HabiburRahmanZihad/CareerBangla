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
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Download,
    Mail,
    Phone,
    Search,
    ShieldCheck,
    TrendingUp,
    User,
    Users,
    X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

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

function HiredCandidatesSkeleton() {
    return (
        <div className="container mx-auto space-y-5 py-8">
            <div className="rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-28 rounded-full" />
                        <Skeleton className="h-10 w-80 rounded-xl" />
                        <Skeleton className="h-4 w-full max-w-2xl rounded-xl" />
                        <Skeleton className="h-4 w-3/4 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 xs:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-2xl border border-border/50 bg-background p-4">
                                <Skeleton className="h-8 w-16 rounded-lg" />
                                <Skeleton className="mt-2 h-3 w-24 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-[1.6rem] border border-border/60 bg-card p-4 shadow-sm">
                <Skeleton className="h-11 w-full rounded-xl" />
            </div>

            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-[1.6rem] border border-border/60 bg-card p-5 shadow-sm"
                    >
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-48 rounded-lg" />
                                <Skeleton className="h-4 w-40 rounded-lg" />
                                <Skeleton className="h-4 w-64 rounded-lg" />
                                <Skeleton className="h-9 w-56 rounded-xl" />
                            </div>
                            <Skeleton className="h-9 w-24 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
    return (
        <div className="container mx-auto rounded-[1.8rem] border border-dashed border-border/60 bg-card px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-3xl bg-muted/50">
                <Users className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="mt-5 text-lg font-black text-foreground">
                {isFiltered ? "No matching candidates found" : "No hired candidates yet"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                {isFiltered
                    ? "Try a different candidate name or email to narrow the results."
                    : "Candidates who have been hired will appear here with their hiring details and contact information."}
            </p>
        </div>
    );
}

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
    const appliedAgo = candidate.createdAt
        ? formatDistanceToNow(new Date(candidate.createdAt), { addSuffix: true })
        : null;

    return (
        <article className="rounded-[1.6rem] border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-lg sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-4">
                    <div className="relative shrink-0">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
                            {photo ? (
                                <Image
                                    src={photo}
                                    alt={name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <User className="h-6 w-6 text-muted-foreground/50" />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-emerald-500">
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-lg font-black tracking-tight text-foreground">
                                {name}
                            </h3>
                            <Badge className="border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                                HIRED
                            </Badge>
                        </div>

                        {title && (
                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                                {title}
                            </p>
                        )}

                        <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                            {email && (
                                <span className="flex min-w-0 items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                                    <span className="truncate">{email}</span>
                                </span>
                            )}
                            {phone && (
                                <span className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                                    <span>{phone}</span>
                                </span>
                            )}
                        </div>

                        {candidate.job?.title && (
                            <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-xs font-semibold text-foreground/85">
                                <Briefcase className="h-3.5 w-3.5 shrink-0 text-primary" />
                                <span className="truncate">{candidate.job.title}</span>
                                {candidate.job?.recruiter?.companyName && (
                                    <span className="truncate text-muted-foreground">
                                        @ {candidate.job.recruiter.companyName}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                    {appliedAgo && (
                        <div className="rounded-xl border border-border/60 bg-background px-3 py-2 text-left lg:text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/60">
                                Applied
                            </p>
                            <p className="mt-1 text-xs font-semibold text-foreground/80">
                                {appliedAgo}
                            </p>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-xl border-border/60 px-4 text-xs font-semibold"
                        onClick={() => onDownloadCV(candidate.user?.id || "", name)}
                    >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Download CV
                    </Button>
                </div>
            </div>

            <div className="mt-5 grid gap-3 border-t border-border/50 pt-5 sm:grid-cols-2 xl:grid-cols-3">
                {candidate.hiredCompany && (
                    <div className="rounded-2xl border border-border/60 bg-background px-4 py-3">
                        <div className="flex items-start gap-3">
                            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/60">
                                    Hired at
                                </p>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    {candidate.hiredCompany}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {candidate.hiredDesignation && (
                    <div className="rounded-2xl border border-border/60 bg-background px-4 py-3">
                        <div className="flex items-start gap-3">
                            <Award className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/60">
                                    Designation
                                </p>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    {candidate.hiredDesignation}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {candidate.hiredDate && (
                    <div className="rounded-2xl border border-border/60 bg-background px-4 py-3">
                        <div className="flex items-start gap-3">
                            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/60">
                                    Hired on
                                </p>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    {new Date(candidate.hiredDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}

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

    const uniqueCompanies = new Set(
        candidates.map((candidate) => candidate.hiredCompany).filter(Boolean)
    ).size;

    const latestHireDate = candidates
        .filter((candidate) => candidate.hiredDate)
        .map((candidate) => new Date(candidate.hiredDate!))
        .sort((a, b) => b.getTime() - a.getTime())[0];

    const handleDownloadCV = (_candidateId: string, candidateName: string) => {
        toast.info(`CV download for ${candidateName} coming soon`);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setPage(1);
    };

    if (isLoading) {
        return <HiredCandidatesSkeleton />;
    }

    return (
        <div className="container! mx-auto space-y-5 py-8">
            <section className="rounded-[2rem] border border-border/60 bg-card/85 p-5 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                    <div>
                        <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                            Hiring Outcomes
                        </span>
                        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                            Hired candidates at a glance
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                            Review the candidates you have hired, track who joined which company,
                            and keep a clean overview of hiring outcomes without digging through
                            scattered records.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 xs:grid-cols-3">
                        <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black tracking-tight text-foreground">
                                        {meta.total}
                                    </p>
                                    <p className="text-xs font-semibold text-muted-foreground">
                                        Total hired
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black tracking-tight text-foreground">
                                        {uniqueCompanies || "0"}
                                    </p>
                                    <p className="text-xs font-semibold text-muted-foreground">
                                        Companies
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-black tracking-tight text-foreground">
                                        {latestHireDate
                                            ? latestHireDate.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "N/A"}
                                    </p>
                                    <p className="text-xs font-semibold text-muted-foreground">
                                        Latest hire
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-[1.6rem] border border-border/60 bg-card p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-xl">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                            Candidate Search
                        </p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Search by candidate name or email to quickly locate a hiring record.
                        </p>
                    </div>

                    <div className="relative w-full lg:max-w-md">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                        <Input
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="h-11 rounded-xl border-border/60 bg-background pl-10 pr-10 text-sm"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={clearSearch}
                                className="absolute right-3.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted-foreground/20"
                            >
                                <X className="h-3 w-3 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {!isLoading && candidates.length > 0 && (
                <div className="flex flex-col gap-2 px-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <span>
                        Showing{" "}
                        <span className="font-semibold text-foreground">
                            {(meta.page - 1) * meta.limit + 1}-
                            {Math.min(meta.page * meta.limit, meta.total)}
                        </span>{" "}
                        of <span className="font-semibold text-foreground">{meta.total}</span>{" "}
                        hired candidates
                    </span>
                    {searchTerm && (
                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Filtered by &quot;{searchTerm}&quot;
                        </span>
                    )}
                </div>
            )}

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

            {meta.totalPages > 1 && (
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="h-10 rounded-xl border-border/60 px-4 text-xs font-semibold"
                    >
                        <ChevronLeft className="mr-1.5 h-3.5 w-3.5" />
                        Previous
                    </Button>

                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {Array.from({ length: meta.totalPages }, (_, index) => index + 1)
                            .filter(
                                (candidatePage) =>
                                    candidatePage === 1 ||
                                    candidatePage === meta.totalPages ||
                                    Math.abs(candidatePage - page) <= 1
                            )
                            .reduce<(number | "...")[]>((acc, candidatePage, index, arr) => {
                                if (index > 0 && (arr[index - 1] as number) < candidatePage - 1) {
                                    acc.push("...");
                                }
                                acc.push(candidatePage);
                                return acc;
                            }, [])
                            .map((candidatePage, index) =>
                                candidatePage === "..." ? (
                                    <span
                                        key={`dots-${index}`}
                                        className="px-1 text-xs text-muted-foreground/50"
                                    >
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        key={candidatePage}
                                        aria-label={`Go to page ${candidatePage}`}
                                        onClick={() => setPage(candidatePage as number)}
                                        className={`h-9 min-w-9 rounded-lg px-3 text-xs font-bold transition-all ${page === candidatePage
                                            ? "bg-primary text-primary-foreground"
                                            : "border border-border/60 bg-card text-muted-foreground hover:border-primary/25 hover:text-primary"
                                            }`}
                                    >
                                        {candidatePage}
                                    </button>
                                )
                            )}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                        disabled={page === meta.totalPages}
                        className="h-10 rounded-xl border-border/60 px-4 text-xs font-semibold"
                    >
                        Next
                        <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default HiredCandidatesContent;
