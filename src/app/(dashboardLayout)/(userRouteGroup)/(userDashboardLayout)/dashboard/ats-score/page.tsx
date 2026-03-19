"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getAtsScore } from "@/services/resume.services";
import { getMyResume } from "@/services/resume.services";
import { useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    FileUser,
    Info,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";

// Mirrors the backend profileCompletion.ts weighted fields
const ALL_SECTIONS = [
    { key: "personalDetails",    label: "Personal Details",         desc: "Full Name, Email & Contact Number",               weight: 5  },
    { key: "professionalTitle",  label: "Professional Title",       desc: "Your primary job title/role",                     weight: 3  },
    { key: "urlsPortfolio",      label: "URLs / Portfolio",         desc: "At least one of LinkedIn, GitHub, or Website",    weight: 4  },
    { key: "additionalInfo",     label: "Additional Personal Info", desc: "Date of Birth, Gender & Address",                 weight: 3  },
    { key: "nationality",        label: "Nationality",              desc: "Your nationality",                                weight: 2  },
    { key: "summary",            label: "Professional Summary",     desc: "A written summary (any length)",                  weight: 12 },
    { key: "technicalSkills",    label: "Technical Skills",         desc: "At least one technical skill",                    weight: 6  },
    { key: "softSkills",         label: "Soft Skills",              desc: "At least one soft skill",                         weight: 6  },
    { key: "tools",              label: "Tools & Technologies",     desc: "At least one tool or technology",                 weight: 6  },
    { key: "workExperience",     label: "Work Experience",          desc: "At least one work experience entry",              weight: 15 },
    { key: "education",          label: "Education",                desc: "At least one education entry",                    weight: 12 },
    { key: "certifications",     label: "Certifications",           desc: "At least one certification",                     weight: 8  },
    { key: "projects",           label: "Projects",                 desc: "At least one project",                            weight: 8  },
    { key: "languages",          label: "Languages",                desc: "At least one language",                           weight: 3  },
    { key: "awards",             label: "Awards",                   desc: "At least one award",                              weight: 2  },
    { key: "interests",          label: "Interests",                desc: "At least one interest",                           weight: 1  },
    { key: "references",         label: "References",               desc: "At least one reference",                          weight: 1  },
];
const TOTAL_WEIGHT = ALL_SECTIONS.reduce((s, f) => s + f.weight, 0); // 100

// Evaluate which sections a resume has completed (mirrors backend logic)
function evaluateSections(resume: any) {
    if (!resume) return {};
    return {
        personalDetails:   !!(resume.fullName && resume.email && resume.contactNumber),
        professionalTitle: !!resume.professionalTitle,
        urlsPortfolio:     !!(resume.linkedinUrl || resume.githubUrl || resume.portfolioUrl || resume.websiteUrl),
        additionalInfo:    !!(resume.dateOfBirth && resume.gender && resume.address),
        nationality:       !!resume.nationality,
        summary:           !!(resume.professionalSummary?.trim()),
        technicalSkills:   (resume.technicalSkills?.length ?? 0) > 0,
        softSkills:        (resume.softSkills?.length ?? 0) > 0,
        tools:             (resume.toolsAndTechnologies?.length ?? 0) > 0,
        workExperience:    (resume.workExperience?.length ?? 0) > 0,
        education:         (resume.education?.length ?? 0) > 0,
        certifications:    (resume.certifications?.length ?? 0) > 0,
        projects:          (resume.projects?.length ?? 0) > 0,
        languages:         (resume.languages?.length ?? 0) > 0,
        awards:            (resume.awards?.length ?? 0) > 0,
        interests:         (resume.interests?.length ?? 0) > 0,
        references:        (resume.references?.length ?? 0) > 0,
    };
}

const AtsScorePage = () => {
    const { data: resumeRes, isLoading: resumeLoading } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
    });

    const { data: atsRes, isLoading: atsLoading } = useQuery({
        queryKey: ["ats-score"],
        queryFn: () => getAtsScore(),
    });

    const isLoading = resumeLoading || atsLoading;
    const resume = resumeRes?.data;
    const atsData = atsRes?.data;

    const completed = evaluateSections(resume);
    const earnedWeight = ALL_SECTIONS.reduce(
        (sum, s) => sum + (completed[s.key as keyof typeof completed] ? s.weight : 0),
        0
    );
    const localScore = Math.round((earnedWeight / TOTAL_WEIGHT) * 100);
    const atsScore = atsData?.atsScore ?? localScore;
    const suggestions = atsData?.suggestions ?? [];

    const scoreColor =
        atsScore >= 80 ? "text-green-600" :
        atsScore >= 50 ? "text-yellow-600" : "text-red-600";

    const strokeColor =
        atsScore >= 80 ? "#22c55e" :
        atsScore >= 50 ? "#eab308" : "#ef4444";

    if (isLoading) {
        return (
            <div className="space-y-4 max-w-4xl mx-auto">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">ATS Score</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Your resume&apos;s readiness for Applicant Tracking Systems
                    </p>
                </div>
                <Link href="/dashboard/my-resume">
                    <Button variant="outline" size="sm" className="gap-2">
                        <FileUser className="w-4 h-4" /> Edit Resume
                    </Button>
                </Link>
            </div>

            {/* Score + Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score Ring */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Your ATS Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="relative w-36 h-36">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="#e5e7eb" strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth="3"
                                    strokeDasharray={`${atsScore}, 100`}
                                    strokeLinecap="round"
                                    style={{ transition: "stroke-dasharray 0.6s ease" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-3xl font-bold ${scoreColor}`}>{atsScore}%</span>
                            </div>
                        </div>
                        <Progress value={atsScore} className="w-full h-2" />
                        <p className="text-sm text-muted-foreground text-center">
                            {atsScore === 100
                                ? "🎉 Perfect score! Your profile is fully optimized."
                                : atsScore >= 80
                                ? "Great profile! A few tweaks will push you to 100%."
                                : atsScore >= 50
                                ? "Good start. Complete the missing sections below."
                                : "Fill more sections to boost your ATS visibility."}
                        </p>
                    </CardContent>
                </Card>

                {/* Suggestions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-yellow-500" />
                            Improvement Suggestions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {suggestions.length > 0 ? (
                            <ul className="space-y-3">
                                {suggestions.map((s: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                                        <span>{s}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center gap-3 text-green-600">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <span className="text-sm">No suggestions — your profile looks great!</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Section Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Section-by-Section Breakdown</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Each section contributes a fixed percentage to your total score.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {ALL_SECTIONS.map((section) => {
                            const done = completed[section.key as keyof typeof completed];
                            return (
                                <div
                                    key={section.key}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                        done
                                            ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800"
                                            : "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800"
                                    }`}
                                >
                                    <div className="flex items-start gap-3 min-w-0">
                                        {done ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm">{section.label}</p>
                                            <p className="text-xs text-muted-foreground truncate">{section.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 ml-3">
                                        <span
                                            className={`text-lg font-bold ${
                                                done ? "text-green-600" : "text-muted-foreground"
                                            }`}
                                        >
                                            +{section.weight}%
                                        </span>
                                        {!done && (
                                            <Link href="/dashboard/my-resume">
                                                <ChevronRight className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary bar */}
                    <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Total Earned</span>
                            <span className={`font-bold text-lg ${scoreColor}`}>{atsScore}%</span>
                        </div>
                        <Progress value={atsScore} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                            {ALL_SECTIONS.filter((s) => completed[s.key as keyof typeof completed]).length} of {ALL_SECTIONS.length} sections complete
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AtsScorePage;
