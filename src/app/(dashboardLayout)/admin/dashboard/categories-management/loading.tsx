import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Skeleton className="h-24 w-full rounded-2xl" />

            {/* Add category card */}
            <div className="rounded-xl border border-border p-5 space-y-3">
                <Skeleton className="h-4 w-36" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-md" />
                    <Skeleton className="h-10 w-20 rounded-md" />
                </div>
                <Skeleton className="h-3 w-48" />
            </div>

            {/* Search + count row */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-64 rounded-md" />
                <Skeleton className="h-4 w-36" />
            </div>

            {/* Category grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-3.5 space-y-2.5">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ))}
            </div>
        </div>
    );
}
