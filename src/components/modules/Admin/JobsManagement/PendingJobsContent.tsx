"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getJobCategories, getPendingJobs } from "@/services/job.services";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, ChevronLeft, ChevronRight, Eye, Grid3X3, List, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const PER_PAGE = 20;

const jobTypeOptions = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"];
const locationTypeOptions = ["REMOTE", "ONSITE", "HYBRID"];

const formatLabel = (value: string) => value.split("_").join(" ");

type CategoryOption = {
    id: string;
    title?: string | null;
    name?: string | null;
};

const PendingJobsContent = () => {
    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("list");
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [jobTypeFilter, setJobTypeFilter] = useState("ALL");
    const [locationTypeFilter, setLocationTypeFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const queryParams = useMemo(
        () => ({
            page: String(currentPage),
            limit: String(PER_PAGE),
            searchTerm: searchTerm || undefined,
            jobType: jobTypeFilter !== "ALL" ? jobTypeFilter : undefined,
            locationType: locationTypeFilter !== "ALL" ? locationTypeFilter : undefined,
            categoryId: categoryFilter !== "ALL" ? categoryFilter : undefined,
        }),
        [currentPage, searchTerm, jobTypeFilter, locationTypeFilter, categoryFilter]
    );

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["pending-jobs", queryParams],
        queryFn: () => getPendingJobs(queryParams),
    });

    const { data: categoriesData } = useQuery({
        queryKey: ["job-categories"],
        queryFn: () => getJobCategories(),
    });

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
    const meta = data?.meta;
    const total = Number(meta?.total || 0);
    const totalPages = Math.max(1, Number(meta?.totalPages || 1));
    const categories: CategoryOption[] = (categoriesData?.data || []) as CategoryOption[];

    const handleSearch = () => {
        setCurrentPage(1);
        setSearchTerm(searchInput.trim());
    };

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages) return;
        setCurrentPage(nextPage);
    };

    const handleJobTypeFilterChange = (value: string) => {
        setCurrentPage(1);
        setJobTypeFilter(value);
    };

    const handleLocationTypeFilterChange = (value: string) => {
        setCurrentPage(1);
        setLocationTypeFilter(value);
    };

    const handleCategoryFilterChange = (value: string) => {
        setCurrentPage(1);
        setCategoryFilter(value);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Pending Job Approvals</h1>
                    <p className="text-muted-foreground text-sm">Review and approve or reject pending job posts</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{total} pending</Badge>
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
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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

                        <Select value={locationTypeFilter} onValueChange={handleLocationTypeFilterChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by location type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Location Types</SelectItem>
                                {locationTypeOptions.map((locationType) => (
                                    <SelectItem key={locationType} value={locationType}>
                                        {formatLabel(locationType)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.title || category.name || "Untitled"}
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
                        Showing {(currentPage - 1) * PER_PAGE + (jobs.length > 0 ? 1 : 0)}-{Math.min(currentPage * PER_PAGE, total)} of {total} pending jobs
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
                    <CardContent className="py-12 text-center">
                        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No pending jobs to review</p>
                    </CardContent>
                </Card>
            ) : (
                <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
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
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/admin/dashboard/pending-jobs/${job.id}`}>
                                            <Eye className="h-4 w-4 mr-1" /> Details
                                        </Link>
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

export default PendingJobsContent;
