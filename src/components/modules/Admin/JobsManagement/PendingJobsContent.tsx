"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPendingJobs } from "@/services/job.services";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Eye, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object" && "response" in error) {
        const apiError = error as ApiError;
        return apiError.response?.data?.message || "An error occurred";
    }
    return "An error occurred";
};

const PendingJobsContent = () => {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["pending-jobs"],
        queryFn: () => getPendingJobs({ limit: "50" }),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
            </div>
        );
    }

    const jobs = data?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Pending Job Approvals</h1>
                    <p className="text-muted-foreground text-sm">Review and approve or reject pending job posts</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{jobs.length} pending</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {jobs.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No pending jobs to review</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Card key={job.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-base">{job.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {job.company} &middot; {job.location}
                                        </p>
                                        {job.recruiter && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                By {job.recruiter.name || "Unknown"} ({job.recruiter.email})
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Submitted {job.createdAt
                                                ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
                                                : "date unavailable"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                                        {job._count?.applications && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {job._count.applications} {job._count.applications === 1 ? "application" : "applications"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/admin/dashboard/pending-jobs/${job.id}`}>
                                            <Eye className="h-4 w-4 mr-1" /> Details
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingJobsContent;
