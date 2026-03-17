"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllApplications } from "@/services/application.services";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { FileText } from "lucide-react";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REVIEWED: "bg-blue-100 text-blue-800",
    SHORTLISTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    ACCEPTED: "bg-emerald-100 text-emerald-800",
    WITHDRAWN: "bg-gray-100 text-gray-800",
};

const ApplicationsManagementContent = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["admin-all-applications"],
        queryFn: () => getAllApplications({ limit: "50" }),
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
                <Badge variant="secondary">{applications.length} applications</Badge>
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
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationsManagementContent;
