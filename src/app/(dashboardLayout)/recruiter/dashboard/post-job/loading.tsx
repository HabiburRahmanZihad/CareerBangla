import { Skeleton } from "@/components/ui/skeleton";

export default function PostJobLoading() {
    return (
        <div className="space-y-5">
            {/* Hero header skeleton */}
            <Skeleton className="h-20 w-full rounded-2xl" />

            {/* Step indicator skeleton */}
            <div className="rounded-2xl border border-border/40 bg-card px-5 pt-4 pb-3">
                <div className="flex items-center">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start flex-1 last:flex-none">
                            <div className="flex flex-col items-center gap-1.5">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-3 w-16 hidden sm:block" />
                            </div>
                            {i < 3 && <Skeleton className="flex-1 h-0.5 mt-5 mx-1.5" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form card skeleton */}
            <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                {/* Step header */}
                <div className="px-6 py-3.5 border-b border-border/40 bg-muted/20 flex items-center justify-between">
                    <div className="space-y-1.5">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-1.5 w-5 rounded-full" />
                        ))}
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Section card 1 */}
                    <div className="rounded-2xl border border-border/40 p-5 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-4 w-36" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-10 rounded-lg" />
                            <Skeleton className="h-10 rounded-lg" />
                        </div>
                    </div>

                    {/* Section card 2 */}
                    <div className="rounded-2xl border border-border/40 p-5 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-4 w-44" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-20 w-full rounded-lg" />
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-1">
                        <Skeleton className="h-10 w-28 rounded-xl" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-28 rounded-xl" />
                            <Skeleton className="h-10 w-32 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
