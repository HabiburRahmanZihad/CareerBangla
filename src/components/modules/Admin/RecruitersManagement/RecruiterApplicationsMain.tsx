
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllRecruiters } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckSquare2, Clock, Eye, Grid3x3, List, RefreshCw, Search, TrendingUp } from "lucide-react";
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
            {/* ── Premium Header ────────────────────────────────────────────── */}
            <div className="space-y-4 py-2">
                <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                    Recruiter Applications
                </h1>
                <p className="text-base text-muted-foreground max-w-2xl">
                    Review, approve, or reject pending recruiter applications. Manage the recruiter onboarding process efficiently.
                </p>
            </div>

            {/* ── Stats Cards ────────────────────────────────────────────────– */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Total Pending */}
                <Card className="border-border/40 bg-linear-to-br from-primary/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Pending</p>
                                <p className="text-3xl font-bold text-primary mt-1">{recruiters.length}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Verified Applications */}
                <Card className="border-border/40 bg-linear-to-br from-green-600/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Verified</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    {recruiters.filter(r => r.isVerified).length}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-green-600/10 flex items-center justify-center">
                                <CheckSquare2 className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Conversion Rate */}
                <Card className="border-border/40 bg-linear-to-br from-blue-600/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">This Week</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">
                                    {recruiters.filter(r => {
                                        const now = new Date();
                                        const created = new Date(r.createdAt || '');
                                        const dayDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
                                        return dayDiff <= 7;
                                    }).length}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Controls Bar ────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search */}
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, or company..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-9 rounded-lg border-border/40 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5 transition-all bg-background/50"
                    />
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="rounded-lg border-border/40 hover:bg-muted/50"
                        title="Refresh"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>

                    <div className="h-8 w-px bg-border/40" />

                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg border border-border/40">
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => {
                                setViewMode("list");
                                setCurrentPage(1);
                            }}
                            className="h-7 w-7 rounded-md"
                            title="List View"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => {
                                setViewMode("grid");
                                setCurrentPage(1);
                            }}
                            className="h-7 w-7 rounded-md"
                            title="Grid View"
                        >
                            <Grid3x3 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Empty State ────────────────────────────────────────────────– */}
            {paginatedRecruiters.length === 0 ? (
                <Card className="border-border/40 bg-linear-to-br from-muted/30 to-transparent">
                    <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-bold text-muted-foreground">
                            {recruiters.length === 0 ? "No pending applications" : "No applications match your search"}
                        </p>
                        <p className="text-sm text-muted-foreground/60 max-w-xs">
                            {recruiters.length === 0
                                ? "All recruiter applications have been processed."
                                : "Try adjusting your search keywords"}
                        </p>
                    </CardContent>
                </Card>
            ) : viewMode === "list" ? (
                /* ── List View ─────────────────────────────────────────────────── */
                <div className="space-y-3">
                    {paginatedRecruiters.map((recruiter) => (
                        <Card
                            key={recruiter.id}
                            className="border-border/40 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden group"
                            onClick={() => setSelectedRecruiter(recruiter)}
                        >
                            <CardContent className="py-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                                    {/* Recruiter Info with Avatar */}
                                    <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1 min-w-0">
                                        {recruiter.profilePhoto ? (
                                            <img
                                                src={recruiter.profilePhoto}
                                                alt={recruiter.name}
                                                className="h-10 w-10 rounded-full object-cover border border-border/40 shrink-0"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                                                {recruiter.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm leading-tight truncate">{recruiter.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{recruiter.email}</p>
                                        </div>
                                    </div>

                                    {/* Company Info */}
                                    <div className="hidden sm:block lg:col-span-1 min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Company</p>
                                        <p className="text-sm font-semibold truncate">{recruiter.companyName || "—"}</p>
                                    </div>

                                    {/* Status & Verified */}
                                    <div className="hidden lg:flex items-center gap-2 flex-wrap">
                                        <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">PENDING</Badge>
                                        {recruiter.isVerified && (
                                            <Badge className="bg-green-600/10 text-green-600 border-green-600/30 text-xs">Verified</Badge>
                                        )}
                                    </div>

                                    {/* Applied Date */}
                                    <div className="hidden sm:block text-sm">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Applied</p>
                                        <p className="font-semibold">{recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : "—"}</p>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex justify-end">
                                        <Button
                                            size="sm"
                                            className="rounded-lg bg-primary hover:bg-orange-700 text-primary-foreground"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedRecruiter(recruiter);
                                            }}
                                        >
                                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                /* ── Grid View ─────────────────────────────────────────────────── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginatedRecruiters.map((recruiter) => (
                        <Card
                            key={recruiter.id}
                            className="border-border/40 hover:border-primary/50 overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer group"
                            onClick={() => setSelectedRecruiter(recruiter)}
                        >
                            {/* Gradient Header */}
                            <div className="h-20 bg-linear-to-br from-primary/20 to-orange-600/20" />

                            <CardHeader className="pb-3 -mt-8 relative z-10">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    {recruiter.profilePhoto ? (
                                        <img
                                            src={recruiter.profilePhoto}
                                            alt={recruiter.name}
                                            className="h-12 w-12 rounded-full object-cover border-2 border-background"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-base border-2 border-background">
                                            {recruiter.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <Badge className="bg-primary/10 text-primary border-primary/30 text-xs ml-auto">PENDING</Badge>
                                </div>
                                <CardTitle className="text-base line-clamp-1">{recruiter.name}</CardTitle>
                                <p className="text-xs text-muted-foreground truncate">{recruiter.email}</p>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {/* Company Info */}
                                {recruiter.companyName && (
                                    <div className="text-sm">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Company</p>
                                        <p className="font-semibold truncate">{recruiter.companyName}</p>
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="flex flex-wrap gap-1.5">
                                    {recruiter.isVerified && (
                                        <Badge className="bg-green-600/10 text-green-600 border-green-600/30 text-xs">Verified</Badge>
                                    )}
                                    {recruiter.industry && (
                                        <Badge variant="outline" className="text-xs">{recruiter.industry}</Badge>
                                    )}
                                </div>

                                {/* Applied Date */}
                                <div className="text-xs text-muted-foreground pt-2 border-t border-border/40">
                                    Applied {recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : "—"}
                                </div>

                                {/* View Button */}
                                <Button
                                    className="w-full rounded-lg bg-primary hover:bg-orange-700 text-primary-foreground mt-2"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedRecruiter(recruiter);
                                    }}
                                >
                                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                                    View Details
                                </Button>
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
