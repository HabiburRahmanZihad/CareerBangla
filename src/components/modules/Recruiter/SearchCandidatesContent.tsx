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
import { Download, Loader2, Lock, Mail, Phone, Search, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

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

const SearchCandidatesContent = () => {
    const [viewMode, setViewMode] = useState<"premium" | "directory">("directory");
    const [searchTerm, setSearchTerm] = useState("");
    const [skills, setSkills] = useState("");
    const [education, setEducation] = useState("");
    const [searchParams, setSearchParams] = useState<Record<string, unknown>>({});
    const [downloadingUserId, setDownloadingUserId] = useState<string | null>(null);

    // Premium candidate search
    const { data: premiumData, isLoading: premiumLoading } = useQuery({
        queryKey: ["search-candidates", searchParams],
        queryFn: () => searchCandidates({ ...searchParams, limit: "20" }),
        enabled: Object.keys(searchParams).length > 0 && viewMode === "premium",
    });

    // User directory (free view, premium download)
    const { data: directoryData, isLoading: directoryLoading } = useQuery({
        queryKey: ["user-directory", searchParams],
        queryFn: () => getUserDirectory({ ...searchParams, limit: "20" }),
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
                    }}
                >
                    User Directory
                </Button>
                <Button
                    variant={viewMode === "premium" ? "default" : "outline"}
                    onClick={() => {
                        setViewMode("premium");
                        setSearchParams({});
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidatesList.map((candidate) => {
                        const profileImage = candidate.resume?.profilePhoto || candidate.image;

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
                                        <p className="text-sm text-muted-foreground">{candidate.resume?.professionalTitle || "No title"}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-3">
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
                                {candidate.resume?.skills && candidate.resume.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {candidate.resume.skills.slice(0, 5).map((skill) => (
                                            <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                                        ))}
                                    </div>
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
            )}
        </div>
    );
};

export default SearchCandidatesContent;
