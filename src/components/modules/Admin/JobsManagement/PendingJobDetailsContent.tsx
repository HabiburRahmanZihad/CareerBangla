"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { swalInput } from "@/lib/swal";
import { approveJob, rejectJob } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type PendingJobDetailsContentProps = {
    job: IJob & {
        requirements?: string[];
        responsibilities?: string[];
        benefits?: string[];
        recruiter?: {
            id?: string;
            name?: string;
            email?: string;
            companyName?: string;
        };
    };
};

const PendingJobDetailsContent = ({ job }: PendingJobDetailsContentProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutateAsync: approveMutate, isPending: isApproving } = useMutation({
        mutationFn: () => approveJob(job.id),
        onSuccess: async () => {
            toast.success("Job approved successfully");
            await queryClient.invalidateQueries({ queryKey: ["pending-jobs"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
            router.push("/admin/dashboard/pending-jobs");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to approve job");
        },
    });

    const { mutateAsync: rejectMutate, isPending: isRejecting } = useMutation({
        mutationFn: (reason: string) => rejectJob(job.id, reason.trim()),
        onSuccess: async () => {
            toast.success("Job rejected successfully");
            await queryClient.invalidateQueries({ queryKey: ["pending-jobs"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
            router.push("/admin/dashboard/pending-jobs");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to reject job");
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Pending Job Details</h1>
                    <p className="text-sm text-muted-foreground">Review full job information before approving or rejecting.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/admin/dashboard/pending-jobs">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <CardTitle>{job.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{job.company} · {job.location}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Recruiter</p>
                            <p>{job.recruiter?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Recruiter Email</p>
                            <p>{job.recruiter?.email || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Job Type</p>
                            <p>{job.jobType}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Category</p>
                            <p>{job.category?.title || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Vacancies</p>
                            <p>{(job as any).vacancies ?? "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Deadline</p>
                            <p>{(job as any).deadline ? new Date((job as any).deadline).toLocaleDateString() : "N/A"}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Description</p>
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Skills</p>
                        <div className="flex flex-wrap gap-2">
                            {(job.skills || []).map((skill) => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Requirements</p>
                        <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                            {((job as any).requirements || []).map((item: string, index: number) => (
                                <li key={`${item}-${index}`}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Responsibilities</p>
                        <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                            {((job as any).responsibilities || []).map((item: string, index: number) => (
                                <li key={`${item}-${index}`}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Benefits</p>
                        <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                            {((job as any).benefits || []).map((item: string, index: number) => (
                                <li key={`${item}-${index}`}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button onClick={() => approveMutate()} disabled={isApproving || isRejecting}>
                            {isApproving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Approving...</> : <><Check className="h-4 w-4 mr-2" /> Approve</>}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                const result = await swalInput({
                                    title: "Reject Job Post",
                                    text: "This reason will be sent to the recruiter via notification and email.",
                                    placeholder: "Write rejection reason...",
                                    confirmText: "Reject",
                                    icon: "warning",
                                });
                                if (result.isConfirmed) {
                                    if (result.value?.trim()) {
                                        await rejectMutate(result.value);
                                    } else {
                                        toast.error("Please provide a rejection reason");
                                    }
                                }
                            }}
                            disabled={isApproving || isRejecting}
                        >
                            <X className="h-4 w-4 mr-2" /> Reject
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};;

export default PendingJobDetailsContent;
