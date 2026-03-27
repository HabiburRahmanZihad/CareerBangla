"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getHiredCandidates } from "@/services/application.services";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { FileText, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface HiredCandidate {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
        resume?: {
            professionalTitle?: string;
            profilePhoto?: string;
            contactNumber?: string;
        };
    };
    job: {
        id: string;
        title: string;
        recruiter?: {
            id: string;
            companyName: string;
        };
    };
    hiredDate?: string;
    hiredCompany?: string;
    hiredDesignation?: string;
    createdAt?: string;
}

interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const HiredCandidatesContent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const { data: candidatesData, isLoading } = useQuery({
        queryKey: ["hired-candidates", page, searchTerm],
        queryFn: () => getHiredCandidates({
            page,
            limit: 10,
            search: searchTerm || undefined,
        }),
    });

    const candidates = (candidatesData?.data || []) as HiredCandidate[];
    const meta = (candidatesData?.meta as PaginationMeta) || { page: 1, limit: 10, total: 0, totalPages: 0 };

    const handleDownloadCV = (candidateId: string, candidateName: string) => {
        toast.info(`CV download for ${candidateName} coming soon`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">Hired Candidates</h1>
                <p className="text-muted-foreground">View all candidates you&apos;ve hired with their company and designation details</p>
            </div>

            {/* Filters */}
            <Card className="bg-muted/50">
                <CardContent className="pt-6">
                    <Input
                        placeholder="Search candidate name or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="text-xs"
                    />
                </CardContent>
            </Card>

            {/* Hired Candidates List */}
            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                </div>
            ) : candidates.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        {searchTerm ? "No hired candidates match your search" : "No hired candidates yet"}
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="space-y-4">
                        {candidates.map((candidate: HiredCandidate) => (
                            <Card key={candidate.id} className="border-green-200 dark:border-green-900">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            {/* Avatar */}
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                                                {candidate.user?.resume?.profilePhoto || candidate.user?.image ? (
                                                    <Image
                                                        src={candidate.user.resume?.profilePhoto || candidate.user.image || ""}
                                                        alt={candidate.user?.name || ""}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-base">{candidate.user?.name || "Unknown"}</CardTitle>
                                                    <Badge className="bg-green-100 text-green-800">Hired</Badge>
                                                </div>
                                                {candidate.user?.resume?.professionalTitle && (
                                                    <p className="text-xs text-muted-foreground">{candidate.user.resume.professionalTitle}</p>
                                                )}
                                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                                                    {candidate.user?.email && (
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="w-3.5 h-3.5" /> {candidate.user.email}
                                                        </span>
                                                    )}
                                                    {candidate.user?.resume?.contactNumber && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3.5 h-3.5" /> {candidate.user.resume.contactNumber}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {/* Job Details */}
                                    <div className="text-sm">
                                        <p className="font-semibold text-foreground">{candidate.job?.title}</p>
                                        {candidate.job?.recruiter?.companyName && (
                                            <p className="text-muted-foreground">@ {candidate.job.recruiter.companyName}</p>
                                        )}
                                    </div>

                                    {/* Hired Details */}
                                    <div className="grid grid-cols-2 gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md p-3">
                                        {candidate.hiredCompany && (
                                            <div>
                                                <p className="text-xs text-muted-foreground font-semibold">Hired at</p>
                                                <p className="text-sm font-medium text-foreground">{candidate.hiredCompany}</p>
                                            </div>
                                        )}
                                        {candidate.hiredDesignation && (
                                            <div>
                                                <p className="text-xs text-muted-foreground font-semibold">Designation</p>
                                                <p className="text-sm font-medium text-foreground">{candidate.hiredDesignation}</p>
                                            </div>
                                        )}
                                        {candidate.hiredDate && (
                                            <div className="col-span-2">
                                                <p className="text-xs text-muted-foreground font-semibold">Hired Date</p>
                                                <p className="text-sm font-medium text-foreground">
                                                    {new Date(candidate.hiredDate).toLocaleDateString("en-US", {
                                                        year: "numeric", month: "short", day: "numeric"
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Applied Date */}
                                    <p className="text-xs text-muted-foreground">
                                        Applied {candidate.createdAt && formatDistanceToNow(new Date(candidate.createdAt), { addSuffix: true })}
                                    </p>

                                    {/* Download CV */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs"
                                        onClick={() => handleDownloadCV(candidate.user?.id || "", candidate.user?.name || "")}
                                    >
                                        <FileText className="w-3.5 h-3.5 mr-2" /> Download CV
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta.totalPages && meta.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {meta.page} of {meta.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                                disabled={page === meta.totalPages}
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

export default HiredCandidatesContent;
