import { Skeleton } from "@/components/ui/skeleton";

// Mirrors HiredCandidatesContent skeleton exactly for a seamless transition.

export default function HiredCandidatesLoading() {
    return (
        <div className="space-y-5 pb-8 animate-pulse">

            {/* ── Header ── */}
            <div className="rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm">
                <div className="h-1 w-full bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600" />
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

            {/* ── Stats ── */}
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

            {/* ── Search ── */}
            <Skeleton className="h-11 w-full rounded-xl" />

            {/* ── Candidate Cards ── */}
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                    <div className="p-5 flex flex-col sm:flex-row gap-4">
                        {/* Avatar */}
                        <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />

                        {/* Info */}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-36 rounded-md" />
                                <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                            <Skeleton className="h-3.5 w-48 rounded-md" />
                            <div className="flex flex-wrap gap-4">
                                <Skeleton className="h-3.5 w-44 rounded-md" />
                                <Skeleton className="h-3.5 w-28 rounded-md" />
                            </div>
                            <Skeleton className="h-7 w-56 rounded-lg mt-1" />
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                            <div className="space-y-1.5 text-right hidden sm:block">
                                <Skeleton className="h-3 w-12 rounded ml-auto" />
                                <Skeleton className="h-3.5 w-20 rounded ml-auto" />
                            </div>
                            <Skeleton className="h-8 w-16 rounded-xl" />
                        </div>
                    </div>

                    {/* Hired strip */}
                    <div className="border-t border-border/30 bg-muted/20 px-5 py-3 flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3.5 w-3.5 rounded" />
                            <div className="space-y-1">
                                <Skeleton className="h-2.5 w-10 rounded" />
                                <Skeleton className="h-3.5 w-28 rounded-md" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3.5 w-3.5 rounded" />
                            <div className="space-y-1">
                                <Skeleton className="h-2.5 w-16 rounded" />
                                <Skeleton className="h-3.5 w-24 rounded-md" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3.5 w-3.5 rounded" />
                            <div className="space-y-1">
                                <Skeleton className="h-2.5 w-12 rounded" />
                                <Skeleton className="h-3.5 w-20 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* ── Pagination ── */}
            <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-9 w-28 rounded-xl" />
                <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-8 w-8 rounded-lg" />
                    ))}
                </div>
                <Skeleton className="h-9 w-20 rounded-xl" />
            </div>
        </div>
    );
}
