import { Skeleton } from "@/components/ui/skeleton";

export default function JobsManagementLoading() {
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
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-7 w-20 rounded-full" />
                    ))}
                </div>
                <Skeleton className="h-10 w-52 rounded-md" />
            </div>

            {/* Results bar */}
            <div className="flex items-center justify-between px-0.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-8 w-28 rounded-lg" />
            </div>

            {/* 4-column grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border overflow-hidden bg-card">
                        <Skeleton className="h-1 w-full rounded-none" />
                        <div className="p-4 space-y-3">
                            {/* badges */}
                            <div className="flex gap-1.5">
                                <Skeleton className="h-5 w-14 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                            {/* title */}
                            <Skeleton className="h-4 w-3/4" />
                            {/* company / location */}
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
                            {/* salary */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-3.5 w-3.5 rounded" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            {/* meta */}
                            <div className="flex gap-3">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            {/* actions */}
                            <div className="flex items-center gap-1.5 border-t border-border pt-3 mt-1">
                                <Skeleton className="h-7 flex-1 rounded-md" />
                                <Skeleton className="h-7 w-7 rounded-md" />
                                <Skeleton className="h-7 w-7 rounded-md" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
