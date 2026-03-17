import { Skeleton } from "@/components/ui/skeleton";

export default function JobsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72 mb-8" />

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-64 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}
