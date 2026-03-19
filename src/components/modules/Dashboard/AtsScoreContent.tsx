"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getAtsScore } from "@/services/resume.services";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

const AtsScoreContent = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["ats-score"],
        queryFn: () => getAtsScore(),
    });

    if (isLoading) {
        return (
            <div className="flex gap-4 items-center">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </div>
        );
    }

    const atsData = data?.data;
    if (!atsData) {
        return (
            <p className="text-muted-foreground text-sm text-center py-4">
                Create your resume first to see your ATS score.
            </p>
        );
    }

    const score: number = atsData.atsScore;
    const strokeColor = score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
    const textColor = score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-500";
    const ratingLabel = score === 100 ? "Excellent" : score >= 80 ? "Good" : score >= 50 ? "Average" : "Needs Work";
    const ratingColor = score === 100 ? "bg-green-100 text-green-800" : score >= 80 ? "bg-blue-100 text-blue-800" : score >= 50 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
    const topSuggestions: string[] = atsData.suggestions?.slice(0, 3) ?? [];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                {/* Mini ring */}
                <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke={strokeColor} strokeWidth="3"
                            strokeDasharray={`${score}, 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-lg font-bold ${textColor}`}>{score}%</span>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">ATS Score</span>
                        <Badge className={`text-xs ${ratingColor}`}>{ratingLabel}</Badge>
                    </div>
                    <Progress value={score} className="h-1.5 mb-2" />
                    {topSuggestions.length > 0 ? (
                        <ul className="space-y-1">
                            {topSuggestions.map((s, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                    <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5 shrink-0" />
                                    <span className="truncate">{s}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center gap-1.5 text-xs text-green-600">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Your resume is fully ATS-optimized!</span>
                        </div>
                    )}
                </div>
            </div>

            <Link href="/dashboard/ats-score">
                <Button variant="outline" size="sm" className="w-full gap-2 text-sm">
                    View Full ATS Report <ChevronRight className="w-4 h-4" />
                </Button>
            </Link>
        </div>
    );
};

export default AtsScoreContent;
