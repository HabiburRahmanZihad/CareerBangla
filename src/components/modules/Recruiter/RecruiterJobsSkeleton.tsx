"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RecruiterJobsSkeletonProps {
    bgClass: string;
}

export default function RecruiterJobsSkeleton({ bgClass }: RecruiterJobsSkeletonProps) {
    return (
        <div className="space-y-6 pb-10">
            <Skeleton className={`h-40 w-full rounded-3xl ${bgClass} opacity-50`} />
            <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-14 flex-1 rounded-2xl" />
                <Skeleton className="h-14 w-full md:w-32 rounded-2xl" />
            </div>
            <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-20 rounded-lg" />
                    <Skeleton className="h-10 w-20 rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="rounded-2xl border-border/50 overflow-hidden bg-card/60 backdrop-blur-xl">
                        <CardContent className="p-0 flex flex-col h-full">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex gap-4 items-center">
                                        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <Skeleton className="h-8 w-24 rounded-lg" />
                                    <Skeleton className="h-8 w-20 rounded-lg" />
                                    <Skeleton className="h-8 w-28 rounded-lg" />
                                </div>
                            </div>
                            <div className="p-6 bg-muted/10 mt-auto border-t border-border/50">
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <Skeleton className="h-16 w-full rounded-xl" />
                                    <Skeleton className="h-16 w-full rounded-xl" />
                                </div>
                                <div className="flex gap-3">
                                    <Skeleton className="h-11 w-full rounded-xl" />
                                    <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}