/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadCvForRecruiter, getUserDirectory } from "@/services/application.services";
import { searchCandidates } from "@/services/resume.services";
import { IResume } from "@/types/user.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Download, GraduationCap, LayoutGrid, List, Loader2, Lock, Mail, Phone, Search, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const USERS_PER_PAGE = 20;

type CandidateListItem = {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    resume?: IResume | null;
};

const extractDataArray = <T,>(value: unknown): T[] => {
    if (Array.isArray(value)) {
        return value as T[];
    }

    if (value && typeof value === "object" && "data" in value) {
        const maybeData = (value as { data?: unknown }).data;
        if (Array.isArray(maybeData)) {
            return maybeData as T[];
        }
    }

    return [];
};

const getSkills = (resume?: IResume | null): string[] => {
    if (!resume) {
        return [];
    }

    if (Array.isArray(resume.skills) && resume.skills.length > 0) {
        return resume.skills;
    }

    const technicalSkills = Array.isArray(resume.technicalSkills) ? resume.technicalSkills : [];
    const tools = Array.isArray(resume.toolsAndTechnologies) ? resume.toolsAndTechnologies : [];
    const softSkills = Array.isArray(resume.softSkills) ? resume.softSkills : [];

    return [...technicalSkills, ...tools, ...softSkills];
};

const getEducationSummary = (resume?: IResume | null): string => {
    const educationList = Array.isArray(resume?.education) ? resume.education : [];
    if (educationList.length === 0) {
        return "Education not provided";
    }

    const topEducation = educationList[0];
    const degree = topEducation?.degree || "";
    const fieldOfStudy = topEducation?.fieldOfStudy || "";
    const institutionName = topEducation?.institutionName || "";

    const degreeLabel = [degree, fieldOfStudy].filter(Boolean).join(" in ");

    if (degreeLabel && institutionName) {
        return `${degreeLabel} - ${institutionName}`;
    }

    return degreeLabel || institutionName || "Education not provided";
};

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
            const url = URL.createObjectURL(response.data);
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
            toast.error(err?.response?.data?.message || "Failed to download CV");
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

    const handleDownloadCv = async (candidateId: string) => {
        setDownloadingUserId(candidateId);
        await downloadCv(candidateId);
    };

    const isLoading = viewMode === "premium" ? premiumLoading : directoryLoading;
    const candidates = extractDataArray<CandidateListItem>(premiumData);
    const directoryDataArray = extractDataArray<CandidateListItem>(directoryData);
    const candidatesList: CandidateListItem[] = viewMode === "premium" ? candidates : directoryDataArray;
    const isPremium = viewMode === "directory" ? (directoryData as any)?.isPremiumRecruiter : false;
    const totalPages = Math.max(1, Math.ceil(candidatesList.length / USERS_PER_PAGE));
    const paginatedCandidates = candidatesList.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages) {
            return;
        }
        setCurrentPage(nextPage);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">Search Candidates</h1>
                <p className="text-muted-foreground">Find and connect with potential candidates</p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
                <Button
                    variant={viewMode === "directory" ? "default" : "outline"}
                    onClick={() => {
                        setViewMode("directory");
                        setSearchParams({});
                        setCurrentPage(1);
                    }}
                >
                    User Directory
                </Button>
                <Button
                    variant={viewMode === "premium" ? "default" : "outline"}
                    onClick={() => {
                        setViewMode("premium");
                        setSearchParams({});
                        setCurrentPage(1);
                    }}
                >
                    Premium Search
                </Button>
            </div>

            {/* Search Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1"
                        />
                        <Input
                            placeholder="Skills (comma separated)"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1"
                        />
                        <Input
                            placeholder="Education (e.g. Bachelor's)"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch}>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Info Banner */}
            {viewMode === "directory" && !isPremium && (
                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
                    <CardContent className="pt-6 flex items-center gap-3 text-sm text-yellow-800 dark:text-yellow-200">
                        <Lock className="w-4 h-4 shrink-0" />
                        <p>CV download requires Career Boost premium subscription</p>
                    </CardContent>
                </Card>
            )}

            {/* Layout and pagination controls */}
            {!isLoading && candidatesList.length > 0 && (
                <Card>
                    <CardContent className="py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * USERS_PER_PAGE + 1}-{Math.min(currentPage * USERS_PER_PAGE, candidatesList.length)} of {candidatesList.length} users
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant={layoutMode === "grid" ? "default" : "outline"}
                                onClick={() => setLayoutMode("grid")}
                            >
                                <LayoutGrid className="w-4 h-4 mr-1" /> Grid
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
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-lg" />
                    ))}
                </div>
            ) : Object.keys(searchParams).length === 0 && viewMode === "premium" ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Enter search criteria to find premium candidates
                    </CardContent>
                </Card>
            ) : candidatesList.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        {viewMode === "directory" ? "No users found matching your criteria" : "No candidates found matching your criteria"}
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                        {paginatedCandidates.map((candidate) => {
                            const profileImage = candidate.resume?.profilePhoto || candidate.image;
                            const candidateSkills = getSkills(candidate.resume);
                            const educationSummary = getEducationSummary(candidate.resume);

                            return <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                                            {profileImage ? (
                                                <Image
                                                    src={profileImage}
                                                    alt={candidate.name || "Candidate"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{candidate.name || "Candidate"}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{candidate.resume?.professionalTitle || "Designation not provided"}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-3">
                                    <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                                        <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                                        <span>{educationSummary}</span>
                                    </div>

                                    {/* Email and Phone - visible for premium users in directory or always in premium search */}
                                    {(viewMode === "premium" || isPremium) && (
                                        <div className="text-xs space-y-1">
                                            {candidate.email && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="w-3 h-3" /> {candidate.email}
                                                </div>
                                            )}
                                            {candidate.resume?.contactNumber && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="w-3 h-3" /> {candidate.resume.contactNumber}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {candidateSkills.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {candidateSkills.slice(0, 6).map((skill) => (
                                                <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">Skills not provided</p>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        {(viewMode === "premium" || isPremium) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-xs"
                                                disabled={downloadingUserId === candidate.id}
                                                onClick={() => handleDownloadCv(candidate.id)}
                                            >
                                                {downloadingUserId === candidate.id ? (
                                                    <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Downloading...</>
                                                ) : (
                                                    <><Download className="w-3.5 h-3.5 mr-1" /> Download CV</>
                                                )}
                                            </Button>
                                        )}
                                        {viewMode === "directory" && !isPremium && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-xs opacity-50 cursor-not-allowed"
                                                disabled
                                            >
                                                <Lock className="w-3.5 h-3.5 mr-1" /> View CV
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>;
                        })}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
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
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchCandidatesContent;
