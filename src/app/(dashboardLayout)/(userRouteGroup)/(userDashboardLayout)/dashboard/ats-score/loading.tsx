import { Skeleton } from "@/components/ui/skeleton";

export default function AtsScoreLoading() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
        </div>
    );
}
