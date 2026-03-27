"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllJobsAdmin } from "@/services/admin.services";
import { deleteJob, updateJob } from "@/services/job.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, Grid3X3, List, RefreshCw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
    LIVE: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CLOSED: "bg-red-100 text-red-800",
    INACTIVE: "bg-gray-200 text-gray-800",
};

const PER_PAGE = 20;

const jobTypeOptions = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"];

const formatLabel = (value: string) => value.split("_").join(" ");

const JobsManagementContent = () => {
    const queryClient = useQueryClient();

    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("list");
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [jobTypeFilter, setJobTypeFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const queryParams = useMemo(
        () => ({
            page: String(currentPage),
            limit: String(PER_PAGE),
            searchTerm: searchTerm || undefined,
            status: statusFilter !== "ALL" ? statusFilter : undefined,
            jobType: jobTypeFilter !== "ALL" ? jobTypeFilter : undefined,
        }),
        [currentPage, searchTerm, statusFilter, jobTypeFilter]
    );

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-all-jobs", queryParams],
        queryFn: () => getAllJobsAdmin(queryParams),
    });

    const { mutateAsync: deleteMutate, isPending: deleting } = useMutation({
        mutationFn: (id: string) => deleteJob(id),
        onSuccess: () => {
            toast.success("Job deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
            queryClient.invalidateQueries({ queryKey: ["pending-jobs"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete job"),
    });

    const { mutateAsync: updateStatusMutate, isPending: updatingStatus } = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => updateJob(id, { status }),
        onSuccess: () => {
            toast.success("Job status updated");
            queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
            queryClient.invalidateQueries({ queryKey: ["pending-jobs"] });
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
    const meta = data?.meta;
    const total = Number(meta?.total || 0);
    const totalPages = Math.max(1, Number(meta?.totalPages || 1));

    const handleSearch = () => {
        setCurrentPage(1);
        setSearchTerm(searchInput.trim());
    };

    const handleStatusFilterChange = (value: string) => {
        setCurrentPage(1);
        setStatusFilter(value);
    };

    const handleJobTypeFilterChange = (value: string) => {
        setCurrentPage(1);
        setJobTypeFilter(value);
    };

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages) return;
        setCurrentPage(nextPage);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Jobs Management</h1>
                    <p className="text-sm text-muted-foreground">Manage all jobs including live and pending posts</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{total} jobs</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6 space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                            placeholder="Search by title, company, or location"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} disabled={isFetching}>
                            <Search className="mr-2 h-4 w-4" /> Search
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="LIVE">Live</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={jobTypeFilter} onValueChange={handleJobTypeFilterChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by job type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Job Types</SelectItem>
                                {jobTypeOptions.map((jobType) => (
                                    <SelectItem key={jobType} value={jobType}>
                                        {formatLabel(jobType)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                        No jobs found.
                    </CardContent>
                </Card>
            ) : (
                <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
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
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="LIVE">Live</SelectItem>
                                        <SelectItem value="CLOSED">Closed</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive h-8 w-8"
                                    disabled={deleting || updatingStatus || isFetching}
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

export default JobsManagementContent;
