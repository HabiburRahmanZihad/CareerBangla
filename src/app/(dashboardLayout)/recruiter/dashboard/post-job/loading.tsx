import { Skeleton } from "@/components/ui/skeleton";

export default function PostJobLoading() {
    return (
        <div className="space-y-4 max-w-3xl">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-[400px] rounded-lg" />
        </div>
    );
}
