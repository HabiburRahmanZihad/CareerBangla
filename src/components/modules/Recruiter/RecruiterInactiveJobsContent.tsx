"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteInactiveJob, getInactiveJobs } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, Grid3X3, List, PlusCircle, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const PER_PAGE = 20;

type RecruiterInactiveJobsContentProps = {
    title: string;
    description: string;
    emptyMessage: string;
};

const statusColors: Record<string, string> = {
    INACTIVE: "bg-red-100 text-red-800",
    CLOSED: "bg-gray-100 text-gray-800",
};

const RecruiterInactiveJobsContent = ({ title, description, emptyMessage }: RecruiterInactiveJobsContentProps) => {
    const queryClient = useQueryClient();

    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("list");
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const queryParams = useMemo(
        () => ({
            page: String(currentPage),
            limit: String(PER_PAGE),
            searchTerm: searchTerm || undefined,
        }),
        [currentPage, searchTerm]
    );

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["recruiter-inactive-jobs", currentPage, searchTerm],
        queryFn: () => getInactiveJobs(queryParams),
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    const { mutateAsync: removeJob, isPending: deleting } = useMutation({
        mutationFn: (id: string) => deleteInactiveJob(id),
        onSuccess: (_result, deletedId) => {
            queryClient.setQueriesData({ queryKey: ["recruiter-inactive-jobs"] }, (oldData: any) => {
                if (!oldData || typeof oldData !== "object") return oldData;

                const oldJobs = Array.isArray(oldData.data) ? oldData.data : [];
                const nextJobs = oldJobs.filter((job: IJob) => job.id !== deletedId);

                if (!oldData.meta) {
                    return { ...oldData, data: nextJobs };
                }

                const prevTotal = Number(oldData.meta.total || oldJobs.length);
                const nextTotal = Math.max(0, prevTotal - (oldJobs.length === nextJobs.length ? 0 : 1));
                const limit = Number(oldData.meta.limit || PER_PAGE);

                return {
                    ...oldData,
                    data: nextJobs,
                    meta: {
                        ...oldData.meta,
                        total: nextTotal,
                        totalPages: Math.max(1, Math.ceil(nextTotal / Math.max(limit, 1))),
                    },
                };
            });

            toast.success("Inactive job deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["recruiter-inactive-jobs"] });
            queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
            queryClient.refetchQueries({ queryKey: ["recruiter-inactive-jobs"], type: "active" });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to delete job");
        },
    });

    const jobs: IJob[] = (data as any)?.data || [];
    const meta = (data as any)?.meta;
    const total = Number(meta?.total || 0);
    const totalPages = Math.max(1, Number(meta?.totalPages || 1));

    const handleSearch = () => {
        setCurrentPage(1);
        setSearchTerm(searchInput.trim());
    };

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages) return;
        setCurrentPage(nextPage);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-56" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="/recruiter/dashboard/post-job">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Post New Job
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                            placeholder="Search by title or location"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch}>
                            <Search className="mr-2 h-4 w-4" /> Search
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * PER_PAGE + (jobs.length > 0 ? 1 : 0)}-{Math.min(currentPage * PER_PAGE, total)} of {total} jobs
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant={layoutMode === "grid" ? "default" : "outline"}
                            onClick={() => setLayoutMode("grid")}
                        >
                            <Grid3X3 className="w-4 h-4 mr-1" /> Grid
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={layoutMode === "list" ? "default" : "outline"}
                            onClick={() => setLayoutMode("list")}
                        >
                            <List className="w-4 h-4 mr-1" /> List
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {jobs.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        {emptyMessage}
                    </CardContent>
                </Card>
            ) : (
                <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                    {jobs.map((job) => (
                        <Card key={job.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-base">{job.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {job.company} · {job.location}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {job.createdAt && formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={statusColors[job.status] || "bg-gray-100 text-gray-800"}>
                                            {job.status}
                                        </Badge>
                                        <Badge variant="outline">{job._count?.applications || 0} apps</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/recruiter/dashboard/my-jobs/${job.id}`}>View</Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive"
                                        disabled={deleting || isFetching}
                                        onClick={() => {
                                            if (confirm("Are you sure you want to permanently delete this inactive job? This action cannot be undone.")) {
                                                removeJob(job.id);
                                            }
                                        }}
                                    >
                                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1 || isFetching}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                    </Button>
                    <span className="text-sm text-muted-foreground px-1">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages || isFetching}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default RecruiterInactiveJobsContent;
