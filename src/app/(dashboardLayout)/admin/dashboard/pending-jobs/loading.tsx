import { Skeleton } from "@/components/ui/skeleton";

export default function PendingJobsLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Skeleton className="h-24 w-full rounded-2xl" />

            {/* Filter card */}
            <div className="rounded-xl border border-border p-5 space-y-4">
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-md" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <Skeleton className="h-10 rounded-md" />
                    <Skeleton className="h-10 rounded-md" />
                    <Skeleton className="h-10 rounded-md" />
                </div>
            </div>

            {/* Results text */}
            <Skeleton className="h-4 w-40" />

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border overflow-hidden bg-card">
                        <Skeleton className="h-1 w-full rounded-none" />
                        <div className="p-4 space-y-3">
                            {/* Badges */}
                            <div className="flex gap-1.5">
                                <Skeleton className="h-5 w-24 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            {/* Title */}
                            <Skeleton className="h-4 w-3/4" />
                            {/* Company / location */}
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-3.5 w-3.5 rounded" />
                                    <Skeleton className="h-3 w-28" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-3.5 w-3.5 rounded" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            {/* Recruiter pill */}
                            <Skeleton className="h-8 w-full rounded-lg" />
                            {/* Meta */}
                            <div className="flex gap-3">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            {/* Action */}
                            <div className="border-t border-border pt-2">
                                <Skeleton className="h-8 w-full rounded-lg" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
