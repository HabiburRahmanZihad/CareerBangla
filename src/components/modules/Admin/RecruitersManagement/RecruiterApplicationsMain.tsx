
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllRecruiters } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { Eye, Grid3x3, List, RefreshCw } from "lucide-react";
import { useState } from "react";
import RecruiterApplicationsDetailsPage from "./RecruiterApplicationsDetailsPage";

const RECRUITERS_PER_PAGE = 16;

const RecruiterApplicationsMain = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRecruiter, setSelectedRecruiter] = useState<IRecruiterProfile | null>(null);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["all-recruiters"],
        queryFn: () => getAllRecruiters({ limit: "1000" }),
    });



    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
            </div>
        );
    }

    // Filter pending recruiters
    let recruiters: IRecruiterProfile[] = data?.data || [];
    recruiters = recruiters.filter((r: IRecruiterProfile) => r.status === "PENDING");

    // Apply search filter
    recruiters = recruiters.filter((recruiter: IRecruiterProfile) => {
        const matchesSearch = recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(recruiters.length / RECRUITERS_PER_PAGE);
    const startIdx = (currentPage - 1) * RECRUITERS_PER_PAGE;
    const endIdx = startIdx + RECRUITERS_PER_PAGE;
    const paginatedRecruiters = recruiters.slice(startIdx, endIdx);

    // If recruiter detail page is open
    if (selectedRecruiter) {
        return <RecruiterApplicationsDetailsPage recruiter={selectedRecruiter} onBack={() => setSelectedRecruiter(null)} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-bold">Recruiter Applications</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{recruiters.length} pending</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="icon"
                        onClick={() => {
                            setViewMode("list");
                            setCurrentPage(1);
                        }}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="icon"
                        onClick={() => {
                            setViewMode("grid");
                            setCurrentPage(1);
                        }}
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Search */}
            <Input
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                className="w-full"
            />

            {/* Recruiters Display */}
            {paginatedRecruiters.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        {recruiters.length === 0 ? "No pending recruiter applications." : "No applications found matching your search."}
                    </CardContent>
                </Card>
            ) : viewMode === "list" ? (
                <div className="space-y-3">
                    {paginatedRecruiters.map((recruiter) => (
                        <Card key={recruiter.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="py-4">
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                                    {/* Recruiter Info */}
                                    <div>
                                        <p className="font-semibold text-sm">{recruiter.name}</p>
                                        <p className="text-xs text-muted-foreground">{recruiter.email}</p>
                                        {recruiter.companyName && <p className="text-xs text-muted-foreground">{recruiter.companyName}</p>}
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex flex-wrap gap-1">
                                        <Badge variant="secondary">Pending</Badge>
                                        {recruiter.isVerified && <Badge variant="default">Verified</Badge>}
                                    </div>

                                    {/* Company Info */}
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">Industry</p>
                                        <p className="font-medium">{recruiter.industry || "N/A"}</p>
                                    </div>

                                    {/* Applied Date */}
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">Applied</p>
                                        <p className="font-medium">{recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : "N/A"}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-1 flex-wrap justify-end">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedRecruiter(recruiter)}
                                        >
                                            <Eye className="h-3.5 w-3.5 mr-1" />
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paginatedRecruiters.map((recruiter) => (
                        <Card key={recruiter.id} className="hover:shadow-lg transition-shadow hover:scale-105 cursor-pointer">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between mb-2">
                                    {recruiter.profilePhoto ? (
                                        <img
                                            src={recruiter.profilePhoto}
                                            alt={recruiter.name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                            {recruiter.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <Badge variant="secondary" className="text-xs">Pending</Badge>
                                </div>
                                <CardTitle className="text-sm line-clamp-1">{recruiter.name}</CardTitle>
                                <p className="text-xs text-muted-foreground truncate">{recruiter.email}</p>
                                {recruiter.companyName && <p className="text-xs text-muted-foreground">{recruiter.companyName}</p>}
                            </CardHeader>
                            <CardContent className="pb-3">
                                <div className="space-y-2 mb-3">
                                    <div className="flex flex-wrap gap-1">
                                        {recruiter.isVerified && <Badge className="bg-green-600 text-xs">Verified</Badge>}
                                        {recruiter.industry && <Badge variant="outline" className="text-xs">{recruiter.industry}</Badge>}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Applied: {recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : "N/A"}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setSelectedRecruiter(recruiter)}
                                    >
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {startIdx + 1} to {Math.min(endIdx, recruiters.length)} of {recruiters.length}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Button
                                    key={i + 1}
                                    size="sm"
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default RecruiterApplicationsMain;
