"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllApplications, updateApplicationStatus } from "@/services/application.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REVIEWED: "bg-blue-100 text-blue-800",
    SHORTLISTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    ACCEPTED: "bg-emerald-100 text-emerald-800",
    HIRED: "bg-emerald-100 text-emerald-800",
    INTERVIEW: "bg-purple-100 text-purple-800",
    WITHDRAWN: "bg-gray-100 text-gray-800",
};

const ApplicationsManagementContent = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-all-applications"],
        queryFn: () => getAllApplications({ limit: "50" }),
    });

    const { mutateAsync: updateStatus } = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            updateApplicationStatus(id, { status }),
        onSuccess: () => {
            toast.success("Application status updated");
            queryClient.invalidateQueries({ queryKey: ["admin-all-applications"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update status"),
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

    const applications = data?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Applications Management</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{applications.length} applications</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {applications.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No applications found.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <Card key={app.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <CardTitle className="text-base">
                                                {app.job?.title || "Unknown Job"}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                {app.user?.name || "Unknown User"} &middot; {app.user?.email}
                                            </p>
                                            {app.createdAt && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Applied {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Badge className={statusColors[app.status] || ""}>
                                        {app.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <Select
                                    defaultValue={app.status}
                                    onValueChange={(status) => updateStatus({ id: app.id, status })}
                                >
                                    <SelectTrigger className="w-36 h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                                        <SelectItem value="INTERVIEW">Interview</SelectItem>
                                        <SelectItem value="HIRED">Hired</SelectItem>
                                        <SelectItem value="REJECTED">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationsManagementContent;
