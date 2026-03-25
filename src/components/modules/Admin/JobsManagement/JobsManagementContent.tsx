"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllJobsAdmin } from "@/services/admin.services";
import { deleteJob, updateJob } from "@/services/job.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    OPEN: "bg-green-100 text-green-800",
    CLOSED: "bg-red-100 text-red-800",
    DRAFT: "bg-gray-100 text-gray-800",
    PAUSED: "bg-yellow-100 text-yellow-800",
};

const JobsManagementContent = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-all-jobs"],
        queryFn: () => getAllJobsAdmin({ limit: "50" }),
    });

    const { mutateAsync: deleteMutate } = useMutation({
        mutationFn: (id: string) => deleteJob(id),
        onSuccess: () => {
            toast.success("Job deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete job"),
    });

    const { mutateAsync: updateStatusMutate } = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => updateJob(id, { status }),
        onSuccess: () => {
            toast.success("Job status updated");
            queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update job status"),
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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Jobs Management</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{jobs.length} jobs</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

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
                            <CardContent className="pt-0 flex items-center gap-2">
                                <Select
                                    defaultValue={job.status}
                                    onValueChange={(status) => updateStatusMutate({ id: job.id, status })}
                                >
                                    <SelectTrigger className="w-28 h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="CLOSED">Closed</SelectItem>
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive h-8 w-8"
                                    onClick={() => {
                                        if (confirm("Delete this job? This action cannot be undone."))
                                            deleteMutate(job.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobsManagementContent;
