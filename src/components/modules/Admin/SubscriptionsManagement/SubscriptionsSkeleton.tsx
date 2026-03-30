import { Skeleton } from "@/components/ui/skeleton";

/* ── Skeleton ──────────────────────────────────────────────────────────────── */

export const SubsSkeleton = () => (
    <div className="space-y-6 animate-in fade-in-50">
        {/* Premium Header Skeleton */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-muted/40 to-muted/20 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-64" />
                        <Skeleton className="h-4 w-80" />
                    </div>
                </div>
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            </div>
        </div>

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border/60 p-4 space-y-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="h-3 w-24" />
                </div>
            ))}
        </div>

        {/* Section Banners and Plan Cards Skeleton */}
        {[0, 1].map((section) => (
            <div key={section} className="space-y-4">
                {/* Section Banner */}
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-linear-to-r from-muted/30 to-muted/10 p-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Plan Cards Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-border/60 overflow-hidden bg-card"
                        >
                            {/* Color strip */}
                            <Skeleton className="h-1 w-full rounded-none" />

                            {/* Card content */}
                            <div className="p-5 space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                                        <div className="space-y-2 min-w-0 flex-1">
                                            <Skeleton className="h-5 w-32" />
                                            <div className="flex gap-1.5">
                                                <Skeleton className="h-5 w-20 rounded-full" />
                                                <Skeleton className="h-5 w-24 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                    <Skeleton className="h-8 w-16 rounded-md shrink-0" />
                                </div>

                                {/* Price section */}
                                <div className="rounded-xl p-3.5 bg-muted/40 space-y-3">
                                    <div>
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-3 w-32 mt-2" />
                                    </div>
                                </div>

                                {/* Description */}
                                <Skeleton className="h-12 w-full rounded-lg" />

                                {/* Divider */}
                                <div className="border-t border-border/50 pt-3" />

                                {/* Features */}
                                <Skeleton className="h-3 w-16" />
                                <div className="space-y-2.5">
                                    {Array.from({ length: 3 }).map((_, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
                                            <Skeleton className="h-3 flex-1" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);
