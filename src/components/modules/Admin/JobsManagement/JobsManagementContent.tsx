"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllJobsAdmin } from "@/services/admin.services";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<string, string> = {
    OPEN: "bg-green-100 text-green-800",
    CLOSED: "bg-red-100 text-red-800",
    DRAFT: "bg-gray-100 text-gray-800",
    PAUSED: "bg-yellow-100 text-yellow-800",
};

const JobsManagementContent = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["admin-all-jobs"],
        queryFn: () => getAllJobsAdmin({ limit: "50" }),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
            </div>
        );
    }

    const jobs = data?.data || [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Jobs Management</h1>

            {jobs.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No jobs found.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Card key={job.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-base">{job.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {job.company} &middot; {job.location}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Posted {job.createdAt && formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={statusColors[job.status] || ""}>{job.status}</Badge>
                                        {job._count && (
                                            <Badge variant="outline">{job._count.applications} applications</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobsManagementContent;
