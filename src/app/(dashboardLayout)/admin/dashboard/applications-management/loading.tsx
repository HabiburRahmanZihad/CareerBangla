import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationsManagementLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Skeleton className="h-24 w-full rounded-2xl" />

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
            </div>

            {/* Filter card */}
            <div className="rounded-xl border border-border p-5 space-y-4">
                <Skeleton className="h-10 w-full rounded-md" />
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-7 w-20 rounded-full" />
                    ))}
                </div>
            </div>

            {/* Results text */}
            <Skeleton className="h-4 w-32" />

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border overflow-hidden bg-card">
                        <Skeleton className="h-1 w-full rounded-none" />
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                            </div>
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-14 w-full rounded-lg" />
                            <Skeleton className="h-3 w-2/5" />
                            <div className="border-t border-border pt-3">
                                <Skeleton className="h-8 w-full rounded-md" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
