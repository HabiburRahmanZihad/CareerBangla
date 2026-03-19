"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAtsScore } from "@/services/resume.services";
import { useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    FileUser,
    Info,
    Lightbulb,
    ShieldCheck,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
    "Contact & Identity": "👤",
    "Professional Summary": "📝",
    "Skills": "🛠️",
    "Work Experience": "💼",
    "Education": "🎓",
    "Projects": "🚀",
    "Certifications": "🏅",
    "Languages": "🌐",
    "Awards": "🏆",
    "References": "🤝",
};

// Color classes for score levels
function scoreClass(pct: number) {
    if (pct === 100) return "text-green-600";
    if (pct >= 60) return "text-yellow-600";
    return "text-red-500";
}

function strokeColor(pct: number) {
    if (pct >= 80) return "#22c55e";
    if (pct >= 50) return "#eab308";
    return "#ef4444";
}

function scoreLabel(score: number) {
    if (score === 100) return { label: "Excellent", color: "bg-green-100 text-green-800" };
    if (score >= 80) return { label: "Good", color: "bg-blue-100 text-blue-800" };
    if (score >= 50) return { label: "Average", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Needs Work", color: "bg-red-100 text-red-800" };
}

const AtsScorePage = () => {
    const { data: atsRes, isLoading } = useQuery({
        queryKey: ["ats-score"],
        queryFn: () => getAtsScore(),
    });

    if (isLoading) {
        return (
            <div className="space-y-4 max-w-5xl mx-auto">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-56" />
                    <Skeleton className="h-56" />
                    <Skeleton className="h-56" />
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    const atsData = atsRes?.data;
    const atsScore: number = atsData?.atsScore ?? 0;
    const suggestions: string[] = atsData?.suggestions ?? [];
    const categories: { label: string; earned: number; max: number; suggestions: string[] }[] =
        atsData?.categories ?? [];

    const { label: rating, color: ratingColor } = scoreLabel(atsScore);
    const categoriesComplete = categories.filter(c => c.earned >= c.max).length;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        ATS Score Analysis
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Based on international ATS standards (Workday, Taleo, Greenhouse, iCIMS)
                    </p>
                </div>
                <Link href="/dashboard/my-resume">
                    <Button variant="outline" size="sm" className="gap-2">
                        <FileUser className="w-4 h-4" /> Edit Resume
                    </Button>
                </Link>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Score Ring */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" /> Your ATS Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-3">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="#e5e7eb" strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={strokeColor(atsScore)}
                                    strokeWidth="3"
                                    strokeDasharray={`${atsScore}, 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-2xl font-bold ${scoreClass(atsScore)}`}>{atsScore}%</span>
                            </div>
                        </div>
                        <Badge className={ratingColor}>{rating}</Badge>
                        <Progress value={atsScore} className="w-full h-1.5" />
                    </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" /> Score Snapshot
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm text-muted-foreground">Categories Complete</span>
                            <span className="font-semibold">{categoriesComplete} / {categories.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm text-muted-foreground">Points Earned</span>
                            <span className="font-semibold">
                                {categories.reduce((s, c) => s + c.earned, 0)} / 100
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-muted-foreground">Points Missing</span>
                            <span className="font-semibold text-red-500">
                                {categories.reduce((s, c) => s + (c.max - c.earned), 0)} pts
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {atsScore === 100
                                ? "🎉 Perfect! Your resume is fully ATS-optimized."
                                : `Complete ${categories.length - categoriesComplete} more section${categories.length - categoriesComplete !== 1 ? "s" : ""} to maximize visibility.`}
                        </p>
                    </CardContent>
                </Card>

                {/* Top Suggestions */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" /> Top Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        {suggestions.length > 0 ? (
                            <ul className="space-y-2">
                                {suggestions.slice(0, 4).map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <AlertCircle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                                        <span>{s}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center gap-2 text-green-600 text-sm">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>No suggestions — your profile is fully optimized!</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Category Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        📊 Category Breakdown
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Each category contributes a fixed number of points based on international ATS standards.
                    </p>
                </CardHeader>
                <CardContent className="space-y-3">
                    {categories.map((cat) => {
                        const pct = Math.round((cat.earned / cat.max) * 100);
                        const done = cat.earned >= cat.max;
                        const icon = CATEGORY_ICONS[cat.label] ?? "📋";
                        return (
                            <div
                                key={cat.label}
                                className={`rounded-lg border p-4 transition-colors ${
                                    done
                                        ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800"
                                        : "border-muted bg-muted/20"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-lg">{icon}</span>
                                        <div>
                                            <p className="font-medium text-sm">{cat.label}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {cat.earned} / {cat.max} pts
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`font-bold text-sm ${done ? "text-green-600" : scoreClass(pct)}`}>
                                            {pct}%
                                        </span>
                                        {done ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Link href="/dashboard/my-resume">
                                                <ChevronRight className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <Progress value={pct} className="h-1.5 mb-2" />
                                {!done && cat.suggestions.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {cat.suggestions.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5 shrink-0" />
                                                <span>{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}

                    {/* Total bar */}
                    <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">Total ATS Score</span>
                            <span className={`font-bold text-lg ${scoreClass(atsScore)}`}>{atsScore}%</span>
                        </div>
                        <Progress value={atsScore} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>{categories.filter(c => c.earned >= c.max).length} of {categories.length} categories complete</span>
                            <span>{categories.reduce((s, c) => s + c.earned, 0)} / 100 pts earned</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* How ATS works */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        How ATS Scoring Works
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3 text-muted-foreground">
                    <p>
                        Applicant Tracking Systems (ATS) like <strong>Workday</strong>, <strong>Taleo</strong>, and <strong>Greenhouse</strong> automatically scan resumes before a human ever sees them. Your score reflects how well your resume satisfies their standard parsing criteria.
                    </p>
                    <ul className="space-y-2 list-none">
                        <li>✅ <strong>Contact & Identity (10 pts)</strong> — Recruiters and ATS need structured contact info to reach you.</li>
                        <li>✅ <strong>Professional Summary (15 pts)</strong> — ATS extracts keywords from your summary first. Longer = more keywords.</li>
                        <li>✅ <strong>Skills (20 pts)</strong> — Most ATS systems rank candidates by skill keyword matches. Aim for 5+ technical skills.</li>
                        <li>✅ <strong>Work Experience (20 pts)</strong> — Strong experience with listed responsibilities boosts relevance scoring.</li>
                        <li>✅ <strong>Education (10 pts)</strong> — Required by most ATS for degree-filtered searches.</li>
                        <li>✅ <strong>Projects (10 pts)</strong> — Validates claimed technical skills with real-world proof.</li>
                        <li>✅ <strong>Certifications (8 pts)</strong> — Industry certifications are high-value ATS keywords.</li>
                    </ul>
                    <Link href="/dashboard/my-resume">
                        <Button size="sm" className="mt-2 gap-2">
                            <FileUser className="w-4 h-4" /> Improve My Resume Now
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default AtsScorePage;
