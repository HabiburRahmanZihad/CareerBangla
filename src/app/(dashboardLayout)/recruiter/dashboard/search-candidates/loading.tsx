import { Skeleton } from "@/components/ui/skeleton";

export default function SearchCandidatesLoading() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
            </div>
        </div>
    );
}
