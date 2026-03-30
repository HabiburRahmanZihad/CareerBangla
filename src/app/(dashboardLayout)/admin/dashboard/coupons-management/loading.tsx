import { Skeleton } from "@/components/ui/skeleton";

export default function CouponsLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Skeleton className="h-24 w-full rounded-2xl" />

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
            </div>

            {/* Create form toggle */}
            <Skeleton className="h-11 w-full rounded-xl" />

            {/* Filter row */}
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
                <Skeleton className="ml-auto h-8 w-36 rounded-md" />
            </div>

            {/* Results text */}
            <Skeleton className="h-4 w-32" />

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-border overflow-hidden bg-card"
                    >
                        {/* Color strip */}
                        <Skeleton className="h-1 w-full rounded-none" />
                        <div className="p-4 space-y-3">
                            {/* Icon + code + badges row */}
                            <div className="flex items-start gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-5 w-40" />
                                    <div className="flex gap-1.5">
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                        <Skeleton className="h-5 w-14 rounded-full" />
                                    </div>
                                </div>
                                <Skeleton className="h-7 w-7 rounded-md shrink-0" />
                            </div>
                            {/* Summary line */}
                            <Skeleton className="h-3 w-3/4" />
                            {/* Progress bar */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                                <Skeleton className="h-1.5 w-full rounded-full" />
                            </div>
                            {/* Meta row */}
                            <div className="flex justify-between border-t border-border pt-3">
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-6 w-6 rounded-md" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
