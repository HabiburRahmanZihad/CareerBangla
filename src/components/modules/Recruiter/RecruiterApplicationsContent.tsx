"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getApplicationsByJob, updateApplicationStatus } from "@/services/application.services";
import { getMyJobs } from "@/services/job.services";
import { IApplication } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REVIEWED: "bg-blue-100 text-blue-800",
    SHORTLISTED: "bg-indigo-100 text-indigo-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    WITHDRAWN: "bg-gray-100 text-gray-800",
};

const RecruiterApplicationsContent = () => {
    const queryClient = useQueryClient();
    const [selectedJobId, setSelectedJobId] = useState<string>("");

    const { data: jobsData, isLoading: jobsLoading } = useQuery({
        queryKey: ["my-jobs"],
        queryFn: () => getMyJobs({ limit: "100" }),
    });

    const { data: applicationsData, isLoading: applicationsLoading } = useQuery({
        queryKey: ["job-applications", selectedJobId],
        queryFn: () => getApplicationsByJob(selectedJobId),
        enabled: !!selectedJobId,
    });

    const { mutateAsync: changeStatus } = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            updateApplicationStatus(id, { status }),
        onSuccess: () => {
            toast.success("Application status updated");
            queryClient.invalidateQueries({ queryKey: ["job-applications", selectedJobId] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update status");
        },
    });

    const jobs = jobsData?.data || [];
    const applications: IApplication[] = applicationsData?.data || [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Applications</h1>

            {jobsLoading ? (
                <Skeleton className="h-10 w-64" />
            ) : (
                <div className="max-w-sm">
                    <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a job to view applications" />
                        </SelectTrigger>
                        <SelectContent>
                            {jobs.map((job) => (
                                <SelectItem key={job.id} value={job.id}>
                                    {job.title} ({job._count?.applications || 0} apps)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {!selectedJobId ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Select a job above to view its applications
                    </CardContent>
                </Card>
            ) : applicationsLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                </div>
            ) : applications.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No applications for this job yet.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <Card key={app.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-base">{app.user?.name || "Unknown User"}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{app.user?.email}</p>
                                    </div>
                                    <Badge className={statusColors[app.status] || ""}>{app.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {app.coverLetter && (
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{app.coverLetter}</p>
                                )}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-xs text-muted-foreground">
                                        Applied {app.createdAt && formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                                    </p>
                                    <div className="ml-auto flex items-center gap-2">
                                        <Select
                                            value={app.status}
                                            onValueChange={(status) => changeStatus({ id: app.id, status })}
                                        >
                                            <SelectTrigger className="w-36 h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                                                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                                                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline" size="sm" className="text-xs">
                                            View Resume
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecruiterApplicationsContent;
