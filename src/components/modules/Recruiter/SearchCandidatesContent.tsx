/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { downloadCvForRecruiter, getUserDirectory } from "@/services/application.services";
import { searchCandidates } from "@/services/resume.services";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    LayoutGrid,
    List,
    Lock,
    Search,
    X,
    Zap
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CandidateCard } from "./CandidateCard";
import { CandidateListRow } from "./CandidateListRow";
import {
    CandidateListItem,
    USERS_PER_PAGE,
    extractDataArray,
    toPdfBlob,
} from "./searchCandidatesUtils";

// ── Main Search Component ───────────────────────────────────────────────────
const SearchCandidatesContent = () => {
    const [viewMode, setViewMode] = useState<"premium" | "directory">("directory");
    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [skills, setSkills] = useState("");
    const [education, setEducation] = useState("");
    const [searchParams, setSearchParams] = useState<Record<string, unknown>>({});
    const [downloadingUserId, setDownloadingUserId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Premium candidate search
    const { data: premiumData, isLoading: premiumLoading } = useQuery({
        queryKey: ["search-candidates", searchParams],
        queryFn: () => searchCandidates(searchParams),
        enabled: Object.keys(searchParams).length > 0 && viewMode === "premium",
    });

    // User directory (free view, premium download)
    const { data: directoryData, isLoading: directoryLoading } = useQuery({
        queryKey: ["user-directory", searchParams],
        queryFn: () => getUserDirectory(searchParams),
        enabled: viewMode === "directory",
    });

    const { mutateAsync: downloadCv } = useMutation({
        mutationFn: (candidateId: string) => downloadCvForRecruiter(candidateId),
        onSuccess: (response, candidateId) => {
            const rawPayload = (response as any)?.data ?? response;
            const pdfBlob = toPdfBlob(rawPayload);
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `candidate-cv-${candidateId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success("CV downloaded successfully");
        },
        onError: (err: any) => {
            toast.error(getRequestErrorMessage(err, "Failed to download CV"));
        },
        onSettled: () => {
            setDownloadingUserId(null);
        },
    });

    const handleSearch = () => {
        const params: Record<string, unknown> = {};
        if (searchTerm) params.search = searchTerm;
        if (skills) params.skills = skills;
        if (education) params.education = education;
        setSearchParams(params);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSkills("");
        setEducation("");
        setSearchParams({});
        setCurrentPage(1);
    };

    const handleDownloadCv = async (candidateId: string) => {
        setDownloadingUserId(candidateId);
        await downloadCv(candidateId);
    };

    const handleViewModeChange = (mode: "premium" | "directory") => {
        setViewMode(mode);
        setSearchParams({});
        setCurrentPage(1);
    };

    const isLoading = viewMode === "premium" ? premiumLoading : directoryLoading;
    const candidates = extractDataArray<CandidateListItem>(premiumData);
    const directoryDataArray = extractDataArray<CandidateListItem>(directoryData);
    const candidatesList: CandidateListItem[] = viewMode === "premium" ? candidates : directoryDataArray;
    const isPremium = viewMode === "directory"
        ? Boolean(
            (directoryData as any)?.isPremiumRecruiter
            ?? (directoryData as any)?.meta?.isPremiumRecruiter
            ?? (directoryData as any)?.data?.isPremiumRecruiter
        )
        : false;
    const hasActiveFilters = Object.keys(searchParams).length > 0;
    const totalPages = Math.max(1, Math.ceil(candidatesList.length / USERS_PER_PAGE));
    const paginatedCandidates = candidatesList.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages) {
            return;
        }
        setCurrentPage(nextPage);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header Section */}
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                        Find Your Perfect Candidate
                    </h1>
                    <p className="text-muted-foreground text-base md:text-lg">
                        {viewMode === "premium"
                            ? "Access our premium candidate database with advanced search filters"
                            : "Browse our complete user directory to discover top talent"}
                    </p>
                </div>

                {/* Search Stats and Info */}
                {hasActiveFilters && candidatesList.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span className="font-medium text-blue-900 dark:text-blue-200">
                                Found {candidatesList.length} {candidatesList.length === 1 ? "candidate" : "candidates"}
                            </span>
                        </div>
                        <div className="hidden sm:block text-blue-300 dark:text-blue-700">•</div>
                        <span className="text-sm text-blue-800 dark:text-blue-300">Showing results for your search criteria</span>
                    </div>
                )}
            </div>


            {/* Search Filters - Enhanced */}
            <Card className="border-0 shadow-sm bg-linear-to-br from-card to-card/50">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Search by Name/Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Name or Email</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder="e.g., John Doe"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="pl-10 h-10"
                                />
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Skills</label>
                            <div className="relative">
                                <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder="e.g., React, Node.js"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="pl-10 h-10"
                                />
                            </div>
                        </div>

                        {/* Education */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Education</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder="e.g., Bachelor's"
                                    value={education}
                                    onChange={(e) => setEducation(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="pl-10 h-10"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-transparent">Action</label>
                            <div className="flex gap-2 h-10">
                                <Button onClick={handleSearch} className="flex-1 gap-2 font-medium">
                                    <Search className="w-4 h-4" />
                                    <span className="hidden sm:inline">Search</span>
                                </Button>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={handleClearFilters}
                                        className="gap-2 font-medium"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Info Banner */}
            {viewMode === "directory" && !isPremium && (
                <Card className="border-amber-200/50 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                    <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                        <Lock className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">Premium Feature</p>
                            <p className="text-xs text-amber-800 dark:text-amber-300">
                                To download CVs and access advanced search, upgrade to Career Boost premium subscription
                            </p>
                        </div>
                        <Button size="sm" className="gap-2 shrink-0">
                            <Zap className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Upgrade</span>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Results Controls */}
            {!isLoading && candidatesList.length > 0 && (
                <Card className="border-0 shadow-sm">
                    <CardContent className="py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    {(currentPage - 1) * USERS_PER_PAGE + 1}-{Math.min(currentPage * USERS_PER_PAGE, candidatesList.length)} of{" "}
                                    {candidatesList.length}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {candidatesList.length} {candidatesList.length === 1 ? "candidate" : "candidates"} available
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setLayoutMode("grid")}
                                        className={`p-2 rounded-md transition-all ${layoutMode === "grid"
                                            ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        title="Grid view"
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLayoutMode("list")}
                                        className={`p-2 rounded-md transition-all ${layoutMode === "list"
                                            ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        title="List view"
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className={layoutMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className={layoutMode === "grid" ? "h-64 rounded-lg" : "h-24 rounded-lg"} />
                    ))}
                </div>
            ) : Object.keys(searchParams).length === 0 && viewMode === "premium" ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="py-16 text-center">
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Search className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Start Your Search</h3>
                                <p className="text-muted-foreground">Enter search criteria above to find premium candidates</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : candidatesList.length === 0 ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="py-16 text-center">
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="bg-muted p-4 rounded-full">
                                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">No Results Found</h3>
                                <p className="text-muted-foreground">
                                    {viewMode === "directory"
                                        ? "Try adjusting your search criteria"
                                        : "Try different search parameters"}
                                </p>
                            </div>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={handleClearFilters} className="gap-2">
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Candidates Grid/List */}
                    {layoutMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {paginatedCandidates.map((candidate) => (
                                <CandidateCard
                                    key={candidate.id}
                                    candidate={candidate}
                                    viewMode={viewMode}
                                    isPremium={isPremium}
                                    isDownloading={downloadingUserId === candidate.id}
                                    onDownload={() => handleDownloadCv(candidate.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {paginatedCandidates.map((candidate, idx) => (
                                <CandidateListRow
                                    key={candidate.id}
                                    candidate={candidate}
                                    index={idx + 1}
                                    viewMode={viewMode}
                                    isPremium={isPremium}
                                    isDownloading={downloadingUserId === candidate.id}
                                    onDownload={() => handleDownloadCv(candidate.id)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-4 pt-4">
                            <div className="text-sm text-muted-foreground">
                                Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
                                <span className="font-semibold text-foreground">{totalPages}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="gap-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Previous</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="gap-1"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchCandidatesContent;
