import { Skeleton } from "@/components/ui/skeleton";

export default function ReferralsLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2 text-center">
                <Skeleton className="h-10 w-64 mx-auto" />
                <Skeleton className="h-5 w-96 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
            </div>
        </div>
    );
}
