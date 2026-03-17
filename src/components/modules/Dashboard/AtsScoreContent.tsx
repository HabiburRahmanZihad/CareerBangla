"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAtsScore } from "@/services/resume.services";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle } from "lucide-react";

const AtsScoreContent = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["ats-score"],
        queryFn: () => getAtsScore(),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    const atsData = data?.data;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">ATS Score</h1>

            {atsData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your ATS Score</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <div className="relative w-32 h-32 mb-4">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#e5e7eb"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke={atsData.atsScore >= 80 ? "#22c55e" : atsData.atsScore >= 50 ? "#eab308" : "#ef4444"}
                                        strokeWidth="3"
                                        strokeDasharray={`${atsData.atsScore}, 100`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold">{atsData.atsScore}%</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">Profile Completion: {atsData.profileCompletion}%</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {atsData.suggestions.length > 0 ? (
                                <ul className="space-y-2">
                                    {atsData.suggestions.map((suggestion, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                                            <span>{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Your profile looks great! No suggestions at this time.</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Create your resume first to check your ATS score.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AtsScoreContent;
