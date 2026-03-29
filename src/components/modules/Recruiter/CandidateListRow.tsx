"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Loader2, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import { CandidateListItem, getEducationSummary, getSkills } from "./searchCandidatesUtils";

interface CandidateListRowProps {
    candidate: CandidateListItem;
    index: number;
    viewMode: "premium" | "directory";
    isPremium: boolean;
    isDownloading: boolean;
    onDownload: () => void;
}

export const CandidateListRow = ({
    candidate,
    index,
    viewMode,
    isPremium,
    isDownloading,
    onDownload,
}: CandidateListRowProps) => {
    const profileImage = candidate.resume?.profilePhoto || candidate.image;
    const candidateSkills = getSkills(candidate.resume);
    const educationSummary = getEducationSummary(candidate.resume);
    const canViewCv = viewMode === "premium" || isPremium;

    return (
        <Card className="border-0 shadow-sm hover:shadow-md transition-all hover:bg-muted/50">
            <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Index and Avatar */}
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-semibold text-muted-foreground min-w-fit">{index}.</span>
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-linear-to-br from-primary/20 to-primary/10 border-2 border-primary/20 shrink-0">
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
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{candidate.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                {candidate.resume?.professionalTitle || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Education - Hidden on mobile */}
                    <div className="hidden sm:flex flex-col min-w-0 flex-1">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Education</p>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{educationSummary}</p>
                    </div>

                    {/* Skills - Hidden on mobile */}
                    <div className="hidden md:flex flex-col min-w-0 flex-1">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Skills</p>
                        <div className="flex flex-wrap gap-1">
                            {candidateSkills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs font-medium">
                                    {skill}
                                </Badge>
                            ))}
                            {candidateSkills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{candidateSkills.length - 3}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {canViewCv && candidate.email && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-xs hidden sm:inline-flex"
                                disabled
                            >
                                <Mail className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">{candidate.email}</span>
                            </Button>
                        )}
                        {canViewCv ? (
                            <Button
                                onClick={onDownload}
                                disabled={isDownloading}
                                size="sm"
                                className="gap-1.5 font-medium min-w-fit"
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Downloading
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span className="hidden sm:inline">Download</span>
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                disabled
                                variant="outline"
                                size="sm"
                                className="gap-1.5 font-medium opacity-50 cursor-not-allowed min-w-fit"
                            >
                                <Lock className="w-4 h-4" />
                                <span className="hidden sm:inline">Locked</span>
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
