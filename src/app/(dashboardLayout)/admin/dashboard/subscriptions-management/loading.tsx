import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionsManagementLoading() {
    return (
        <div className="space-y-8 py-2">
            {/* Premium Header Skeleton */}
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-muted/40 to-muted/20 p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-80" />
                            <Skeleton className="h-5 w-96" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                </div>
            </div>

            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border/60 p-4 space-y-4">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
                {/* Section Banner */}
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-linear-to-r from-muted/30 to-muted/10 p-5">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-6 w-40" />
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                {/* Plan Cards Grid */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border/60 overflow-hidden bg-card"
                        >
                            {/* Color strip */}
                            <Skeleton className="h-1.5 w-full rounded-none" />

                            {/* Card content */}
                            <div className="p-6 space-y-5">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                        <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                                        <div className="space-y-2 min-w-0 flex-1">
                                            <Skeleton className="h-6 w-40" />
                                            <div className="flex gap-2">
                                                <Skeleton className="h-6 w-24 rounded-full" />
                                                <Skeleton className="h-6 w-28 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                    <Skeleton className="h-9 w-20 rounded-md shrink-0" />
                                </div>

                                {/* Divider */}
                                <Skeleton className="h-px w-full" />

                                {/* Price section */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl p-4 bg-muted/40">
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-10 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-20 w-24 rounded-lg" />
                                </div>

                                {/* Description */}
                                <Skeleton className="h-12 w-full rounded-lg" />

                                {/* Features */}
                                <div className="border-t border-border/50 pt-4 space-y-3">
                                    <Skeleton className="h-4 w-32" />
                                    <div className="space-y-2.5">
                                        {Array.from({ length: 3 }).map((_, j) => (
                                            <div key={j} className="flex items-center gap-2.5">
                                                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                                                <Skeleton className="h-4 flex-1" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
                {/* Section Banner */}
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-linear-to-r from-muted/30 to-muted/10 p-5">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                {/* Plan Cards Grid */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border/60 overflow-hidden bg-card"
                        >
                            {/* Color strip */}
                            <Skeleton className="h-1.5 w-full rounded-none" />

                            {/* Card content */}
                            <div className="p-6 space-y-5">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                        <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                                        <div className="space-y-2 min-w-0 flex-1">
                                            <Skeleton className="h-6 w-40" />
                                            <div className="flex gap-2">
                                                <Skeleton className="h-6 w-24 rounded-full" />
                                                <Skeleton className="h-6 w-28 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                    <Skeleton className="h-9 w-20 rounded-md shrink-0" />
                                </div>

                                {/* Divider */}
                                <Skeleton className="h-px w-full" />

                                {/* Price section */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl p-4 bg-muted/40">
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-10 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-20 w-24 rounded-lg" />
                                </div>

                                {/* Description */}
                                <Skeleton className="h-12 w-full rounded-lg" />

                                {/* Features */}
                                <div className="border-t border-border/50 pt-4 space-y-3">
                                    <Skeleton className="h-4 w-32" />
                                    <div className="space-y-2.5">
                                        {Array.from({ length: 3 }).map((_, j) => (
                                            <div key={j} className="flex items-center gap-2.5">
                                                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                                                <Skeleton className="h-4 flex-1" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
