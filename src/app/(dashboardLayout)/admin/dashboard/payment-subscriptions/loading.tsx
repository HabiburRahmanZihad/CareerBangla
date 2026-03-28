import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSubscriptionsLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Filters and Controls */}
            <div className="flex gap-4 flex-wrap">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Table/List Skeleton */}
            <div className="space-y-3">
                {Array(5)
                    .fill(null)
                    .map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
                <Skeleton className="h-10 w-8" />
                <Skeleton className="h-10 w-8" />
                <Skeleton className="h-10 w-8" />
            </div>
        </div>
    );
}
