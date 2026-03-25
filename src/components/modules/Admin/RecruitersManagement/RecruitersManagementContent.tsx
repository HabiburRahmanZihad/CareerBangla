"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { changeUserStatus } from "@/services/admin.services";
import { approveRecruiter, deleteRecruiter, getAllRecruiters, rejectRecruiter } from "@/services/recruiter.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, RefreshCw, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";

const RecruitersManagementContent = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["all-recruiters"],
        queryFn: () => getAllRecruiters({ limit: "50" }),
    });

    const { mutateAsync: approve } = useMutation({
        mutationFn: (id: string) => approveRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter approved");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed"),
    });

    const { mutateAsync: reject } = useMutation({
        mutationFn: (id: string) => rejectRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter rejected");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed"),
    });

    const { mutateAsync: updateStatus } = useMutation({
        mutationFn: ({ userId, status }: { userId: string; status: string }) =>
            changeUserStatus({ userId, status }),
        onSuccess: () => {
            toast.success("Status updated");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed"),
    });

    const { mutateAsync: deleteMutate } = useMutation({
        mutationFn: (id: string) => deleteRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter deleted");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed"),
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

    const recruiters = data?.data || [];

    const getStatusBadgeVariant = (status?: string) => {
        switch (status) {
            case "APPROVED": return "default";
            case "PENDING": return "secondary";
            case "REJECTED": return "destructive";
            default: return "secondary";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Recruiters Management</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{recruiters.length} recruiters</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {recruiters.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No recruiters found.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {recruiters.map((recruiter) => {
                        const userStatus = recruiter.user?.status || "ACTIVE";
                        return (
                            <Card key={recruiter.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-base">{recruiter.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{recruiter.email}</p>
                                            {recruiter.companyName && (
                                                <p className="text-sm text-muted-foreground">{recruiter.companyName}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={getStatusBadgeVariant(recruiter.status)}>
                                                {recruiter.status || "PENDING"}
                                            </Badge>
                                            <Badge variant={recruiter.isVerified ? "default" : "destructive"}>
                                                {recruiter.isVerified ? "Verified" : "Unverified"}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 flex items-center gap-2 flex-wrap">
                                    {recruiter.status === "PENDING" && (
                                        <>
                                            <Button size="sm" variant="default" onClick={() => approve(recruiter.id)}>
                                                <CheckCircle className="mr-1 h-3.5 w-3.5" />
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => reject(recruiter.id)}>
                                                <XCircle className="mr-1 h-3.5 w-3.5" />
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    <Select
                                        defaultValue={userStatus}
                                        onValueChange={(status) => updateStatus({ userId: recruiter.userId, status })}
                                    >
                                        <SelectTrigger className="w-32 h-8 text-xs">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="BLOCKED">Blocked</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive h-8 w-8"
                                        onClick={() => {
                                            if (confirm("Delete this recruiter? This action cannot be undone."))
                                                deleteMutate(recruiter.id);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecruitersManagementContent;
