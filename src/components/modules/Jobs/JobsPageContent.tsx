"use client";

import JobCard from "@/components/shared/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginationMeta } from "@/types/api.types";
import { IJob, IJobCategory } from "@/types/user.types";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface JobsPageContentProps {
    jobs: IJob[];
    meta?: PaginationMeta;
    categories: IJobCategory[];
    currentParams: Record<string, string | undefined>;
}

const JobsPageContent = ({ jobs, meta, categories, currentParams }: JobsPageContentProps) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(currentParams.searchTerm || "");

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams();
        Object.entries(currentParams).forEach(([k, v]) => {
            if (v && k !== "page") params.set(k, v);
        });
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`/jobs?${params.toString()}`);
    };

    const handleSearch = () => {
        updateParams("searchTerm", searchTerm);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams();
        Object.entries(currentParams).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        params.set("page", page.toString());
        router.push(`/jobs?${params.toString()}`);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-64 space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-9"
                    />
                </div>

                {/* Job Type */}
                <Select
                    value={currentParams.jobType || "all"}
                    onValueChange={(v) => updateParams("jobType", v)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                        <SelectItem value="FREELANCE">Freelance</SelectItem>
                    </SelectContent>
                </Select>

                {/* Experience Level */}
                <Select
                    value={currentParams.experienceLevel || "all"}
                    onValueChange={(v) => updateParams("experienceLevel", v)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Experience Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="ENTRY">Entry Level</SelectItem>
                        <SelectItem value="MID">Mid Level</SelectItem>
                        <SelectItem value="SENIOR">Senior Level</SelectItem>
                        <SelectItem value="LEAD">Lead</SelectItem>
                        <SelectItem value="EXECUTIVE">Executive</SelectItem>
                    </SelectContent>
                </Select>

                {/* Location Type */}
                <Select
                    value={currentParams.locationType || "all"}
                    onValueChange={(v) => updateParams("locationType", v)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Location Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="REMOTE">Remote</SelectItem>
                        <SelectItem value="ONSITE">On-site</SelectItem>
                        <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                </Select>

                {/* Category */}
                {categories.length > 0 && (
                    <Select
                        value={currentParams.categoryId || "all"}
                        onValueChange={(v) => updateParams("categoryId", v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <Button onClick={handleSearch} className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                </Button>
            </div>

            {/* Jobs Grid */}
            <div className="flex-1">
                {jobs.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-lg text-muted-foreground">No jobs found matching your criteria.</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => router.push("/jobs")}
                        >
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {jobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {meta && meta.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={meta.page <= 1}
                                    onClick={() => handlePageChange(meta.page - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {meta.page} of {meta.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={meta.page >= meta.totalPages}
                                    onClick={() => handlePageChange(meta.page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default JobsPageContent;
