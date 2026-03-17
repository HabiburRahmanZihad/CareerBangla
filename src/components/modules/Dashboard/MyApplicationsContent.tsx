"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyApplications } from "@/services/application.services";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REVIEWED: "bg-blue-100 text-blue-800",
    SHORTLISTED: "bg-indigo-100 text-indigo-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    WITHDRAWN: "bg-gray-100 text-gray-800",
};

const MyApplicationsContent = () => {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ["my-applications", page],
        queryFn: () => getMyApplications({ page: String(page), limit: "10" }),
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

    const applications = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Applications</h1>

            {applications.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">You haven&apos;t applied to any jobs yet.</p>
                        <Button asChild>
                            <Link href="/jobs">Browse Jobs</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <Card key={app.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">
                                                <Link href={`/jobs/${app.jobId}`} className="hover:text-primary">
                                                    {app.job?.title || "Unknown Job"}
                                                </Link>
                                            </CardTitle>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="h-3.5 w-3.5" />
                                                    {app.job?.company}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {app.job?.location}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge className={statusColors[app.status] || ""}>
                                            {app.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-xs text-muted-foreground">
                                        Applied {app.createdAt && formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {meta && meta.totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground flex items-center">
                                Page {page} of {meta.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= meta.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyApplicationsContent;
