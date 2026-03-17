import { Skeleton } from "@/components/ui/skeleton";

export default function JobDetailsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-5 w-1/2 mb-6" />
                <div className="flex gap-2 mb-6">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-48 w-full mb-6" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
}
