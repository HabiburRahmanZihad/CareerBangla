import { Skeleton } from "@/components/ui/skeleton";

export default function CouponsLoading() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
        </div>
    );
}
