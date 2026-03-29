"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, GraduationCap, Loader2, Lock, Mail, Phone, Star, User } from "lucide-react";
import Image from "next/image";
import { CandidateListItem, getEducationSummary, getSkills } from "./searchCandidatesUtils";

interface CandidateCardProps {
    candidate: CandidateListItem;
    viewMode: "premium" | "directory";
    isPremium: boolean;
    isDownloading: boolean;
    onDownload: () => void;
}

export const CandidateCard = ({
    candidate,
    viewMode,
    isPremium,
    isDownloading,
    onDownload,
}: CandidateCardProps) => {
    const profileImage = candidate.resume?.profilePhoto || candidate.image;
    const candidateSkills = getSkills(candidate.resume);
    const educationSummary = getEducationSummary(candidate.resume);
    const canViewCv = viewMode === "premium" || isPremium;

    return (
        <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            {/* Header with Avatar */}
            <CardHeader className="pb-4 border-b">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-primary/20 to-primary/10 shrink-0 border-2 border-primary/20">
                            {profileImage ? (
                                <Image
                                    src={profileImage}
                                    alt={candidate.name || "Candidate"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm font-semibold truncate">
                                {candidate.name || "Candidate"}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {candidate.resume?.professionalTitle || "Professional title not provided"}
                            </p>
                        </div>
                    </div>
                    {canViewCv && <Star className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />}
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="pt-4 flex-1 flex flex-col space-y-3">
                {/* Education */}
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                        Education
                    </p>
                    <p className="text-sm font-medium text-foreground line-clamp-2">{educationSummary}</p>
                </div>

                {/* Contact Info - Only for Premium/Premium Users */}
                {canViewCv && (
                    <div className="space-y-1.5">
                        {candidate.email && (
                            <div className="flex items-center gap-2 text-xs">
                                <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground truncate">{candidate.email}</span>
                            </div>
                        )}
                        {candidate.resume?.contactNumber && (
                            <div className="flex items-center gap-2 text-xs">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground truncate">{candidate.resume.contactNumber}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Skills */}
                <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Skills</p>
                    {candidateSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {candidateSkills.slice(0, 5).map((skill) => (
                                <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="text-xs font-medium cursor-default hover:bg-secondary/80 transition-colors"
                                >
                                    {skill}
                                </Badge>
                            ))}
                            {candidateSkills.length > 5 && (
                                <Badge variant="outline" className="text-xs font-medium">
                                    +{candidateSkills.length - 5}
                                </Badge>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">No skills provided</p>
                    )}
                </div>
            </CardContent>

            {/* Action Button */}
            <div className="pt-4 border-t">
                {canViewCv ? (
                    <Button
                        onClick={onDownload}
                        disabled={isDownloading}
                        className="w-full gap-2 font-medium h-9"
                    >
                        {isDownloading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="hidden sm:inline">Downloading</span>
                                <span className="sm:hidden">Wait...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Download CV</span>
                                <span className="sm:hidden">CV</span>
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        disabled
                        variant="outline"
                        className="w-full gap-2 font-medium h-9 opacity-50 cursor-not-allowed"
                    >
                        <Lock className="w-4 h-4" />
                        <span className="hidden sm:inline">Premium Only</span>
                        <span className="sm:hidden">Locked</span>
                    </Button>
                )}
            </div>
        </Card>
    );
};
