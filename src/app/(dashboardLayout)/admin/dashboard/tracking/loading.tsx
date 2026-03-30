import { Skeleton } from "@/components/ui/skeleton";

export default function TrackingLoading() {
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

            {/* Tabs */}
            <Skeleton className="h-10 w-64 rounded-lg" />

            {/* Table card */}
            <div className="rounded-xl border border-border overflow-hidden">
                {/* Table header */}
                <div className="flex items-center gap-4 border-b border-border px-4 h-11 bg-muted/30">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-3 flex-1" />
                    ))}
                </div>
                {/* Table rows */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 border-b border-border/40 px-4 py-3"
                    >
                        {/* Date col */}
                        <div className="flex-1 space-y-1">
                            <Skeleton className="h-3.5 w-20" />
                            <Skeleton className="h-2.5 w-10" />
                        </div>
                        {/* Code col */}
                        <Skeleton className="flex-1 h-5 rounded-md max-w-24" />
                        {/* User col with avatar */}
                        <div className="flex flex-1 items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                            <div className="space-y-1">
                                <Skeleton className="h-3.5 w-24" />
                                <Skeleton className="h-2.5 w-32" />
                            </div>
                        </div>
                        {/* Second user col with avatar */}
                        <div className="flex flex-1 items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                            <div className="space-y-1">
                                <Skeleton className="h-3.5 w-24" />
                                <Skeleton className="h-2.5 w-32" />
                            </div>
                        </div>
                        {/* Badge col */}
                        <Skeleton className="h-6 w-16 rounded-full shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}
