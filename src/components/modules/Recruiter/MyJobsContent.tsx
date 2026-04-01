"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { deleteJob, getMyJobs } from "@/services/job.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock3, Edit, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
    LIVE: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CLOSED: "bg-red-100 text-red-800",
    INACTIVE: "bg-gray-100 text-gray-800",
};

const MyJobsContent = () => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["my-jobs"],
        queryFn: () => getMyJobs({ limit: "50" }),
    });

    const { data: pendingSummary } = useQuery({
        queryKey: ["my-jobs-summary", "pending"],
        queryFn: () => getMyJobs({ status: "PENDING", page: "1", limit: "1" }),
    });

    const { data: approvedSummary } = useQuery({
        queryKey: ["my-jobs-summary", "approved"],
        queryFn: () => getMyJobs({ status: "LIVE", page: "1", limit: "1" }),
    });

    const { mutateAsync: removeJob } = useMutation({
        mutationFn: (id: string) => deleteJob(id),
        onSuccess: () => {
            toast.success("Job deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
        },
        onError: (err: any) => {
            toast.error(getRequestErrorMessage(err, "Failed to delete job"));
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
            </div>
        );
    }

    const jobs = data?.data || [];
    const pendingCount = Number((pendingSummary as any)?.meta?.total || 0);
    const approvedCount = Number((approvedSummary as any)?.meta?.total || 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Jobs</h1>
                <Button asChild>
                    <Link href="/recruiter/dashboard/post-job">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post New Job
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="py-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Pending / Not Approved</p>
                            <p className="text-3xl font-bold mt-1">{pendingCount}</p>
                            <p className="text-xs text-muted-foreground mt-1">Jobs waiting for admin approval</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Clock3 className="h-5 w-5 text-muted-foreground" />
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/recruiter/dashboard/my-jobs/pending">Manage Pending</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="py-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Approved Jobs</p>
                            <p className="text-3xl font-bold mt-1">{approvedCount}</p>
                            <p className="text-xs text-muted-foreground mt-1">Live jobs approved by admin</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/recruiter/dashboard/my-jobs/approved">Manage Approved</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {jobs.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">You haven&apos;t posted any jobs yet.</p>
                        <Button asChild>
                            <Link href="/recruiter/dashboard/post-job">Post Your First Job</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Card key={job.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{job.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {job.company} &middot; {job.location} &middot;{" "}
                                            {job.createdAt && formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={statusColors[job.status] || ""}>{job.status}</Badge>
                                        {job._count && (
                                            <Badge variant="outline">{job._count.applications} apps</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 flex items-center gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/jobs/${job.id}`}>
                                        View
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Edit className="mr-1 h-3.5 w-3.5" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive"
                                    onClick={() => {
                                        if (confirm("Are you sure you want to delete this job?")) {
                                            removeJob(job.id);
                                        }
                                    }}
                                >
                                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyJobsContent;
