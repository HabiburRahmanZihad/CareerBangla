"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { approveJob, getPendingJobs, rejectJob } from "@/services/job.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Check, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
    const queryClient = useQueryClient();
    const [rejectingJobId, setRejectingJobId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["pending-jobs"],
        queryFn: () => getPendingJobs({ limit: "50" }),
    });

    const { mutateAsync: approveMutate, isPending: isApproving } = useMutation({
        mutationFn: (jobId: string) => approveJob(jobId),
        onSuccess: () => {
            toast.success("Job approved successfully");
            queryClient.invalidateQueries({ queryKey: ["pending-jobs"] });
            queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
        },
        onError: (err: unknown) => {
            toast.error(getErrorMessage(err) || "Failed to approve job");
        },
    });

    const { mutateAsync: rejectMutate, isPending: isRejecting } = useMutation({
        mutationFn: ({ jobId, reason }: { jobId: string; reason: string }) =>
            rejectJob(jobId, reason),
        onSuccess: () => {
            toast.success("Job rejected successfully");
            setRejectingJobId(null);
            setRejectionReason("");
            queryClient.invalidateQueries({ queryKey: ["pending-jobs"] });
            queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
        },
        onError: (err: unknown) => {
            toast.error(getErrorMessage(err) || "Failed to reject job");
        },
    });

    const handleApprovе = async (jobId: string) => {
        await approveMutate(jobId);
    };

    const handleRejectSubmit = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }
        if (rejectingJobId) {
            await rejectMutate({ jobId: rejectingJobId, reason: rejectionReason });
        }
    };

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
                                    <Button
                                        size="sm"
                                        variant="default"
                                        disabled={isApproving}
                                        onClick={() => handleApprovе(job.id)}
                                    >
                                        <Check className="h-4 w-4 mr-1" />
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        disabled={isRejecting}
                                        onClick={() => setRejectingJobId(job.id)}
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Rejection Dialog */}
            <Dialog open={!!rejectingJobId} onOpenChange={(open) => !open && setRejectingJobId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Job Post</DialogTitle>
                        <DialogDescription>
                            Provide a reason for rejecting this job post. The recruiter will be notified.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="Enter rejection reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="min-h-24"
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRejectingJobId(null);
                                setRejectionReason("");
                            }}
                            disabled={isRejecting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectSubmit}
                            disabled={isRejecting || !rejectionReason.trim()}
                        >
                            Reject Job Post
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PendingJobsContent;
