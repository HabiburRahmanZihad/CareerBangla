"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getAtsScore } from "@/services/resume.services";
import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    AlertCircle,
    Award,
    BookOpen,
    Briefcase,
    CheckCircle2,
    ChevronRight,
    Code,
    FileUser,
    Globe2,
    GraduationCap,
    Info,
    Lightbulb,
    Rocket,
    ShieldCheck,
    Target,
    TrendingUp,
    Trophy,
    UserCircle,
    Users,
    Zap
} from "lucide-react";
import Link from "next/link";
import React from "react";

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    "Contact & Identity": <UserCircle className="w-5 h-5" />,
    "Professional Summary": <BookOpen className="w-5 h-5" />,
    "Skills": <Code className="w-5 h-5" />,
    "Work Experience": <Briefcase className="w-5 h-5" />,
    "Education": <GraduationCap className="w-5 h-5" />,
    "Projects": <Rocket className="w-5 h-5" />,
    "Certifications": <Award className="w-5 h-5" />,
    "Languages": <Globe2 className="w-5 h-5" />,
    "Awards": <Trophy className="w-5 h-5" />,
    "References": <Users className="w-5 h-5" />,
};

// Color classes for score levels
function scoreClass(pct: number) {
    if (pct === 100) return "text-emerald-500";
    if (pct >= 80) return "text-primary";
    if (pct >= 50) return "text-amber-500";
    return "text-rose-500";
}

function scoreLabel(score: number) {
    if (score === 100) return { label: "Perfect Score", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
    if (score >= 80) return { label: "Excellent", color: "bg-primary/10 text-primary border-primary/20" };
    if (score >= 50) return { label: "Needs Improvement", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    return { label: "Critical Action Required", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" };
}

const AtsScorePage = () => {
    const { data: atsRes, isLoading } = useQuery({
        queryKey: ["ats-score"],
        queryFn: () => getAtsScore(),
    });

    if (isLoading) {
        return (
            <div className="w-full container mx-auto space-y-6 lg:space-y-8 pb-10">
                <Skeleton className="h-50 w-full rounded-3xl" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-75 rounded-3xl" />
                    <Skeleton className="h-75 rounded-3xl lg:col-span-2" />
                </div>
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

    // Handle dynamic primary color stroke for the circular progress using standard Tailwind Hex if exact variable isn't accessible
    const strokeHex = atsScore === 100 ? "#10b981" : atsScore >= 80 ? "#3b82f6" : atsScore >= 50 ? "#f59e0b" : "#f43f5e";

    return (
        <div className="w-full container mx-auto space-y-6 lg:space-y-8 pb-10">

            {/* ── Header ── */}
            <div className="relative rounded-3xl border border-border/40 bg-card overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5" />
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Target className="w-48 h-48 -rotate-12" />
                </div>

                <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-2 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-2">
                            <ShieldCheck className="w-4 h-4" /> Smart Analysis
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                            ATS Score Checker
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                            We cross-examine your profile against international ATS standards (like Workday, Taleo, Greenhouse, iCIMS) to help you beat the bots and get hired.
                        </p>
                    </div>
                    <div className="relative z-10 shrink-0 w-full lg:w-auto">
                        <Link href="/dashboard/my-resume" className="w-full">
                            <Button className="w-full lg:w-auto rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform gap-2">
                                <FileUser className="w-5 h-5" /> Edit Profile Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Top Dashboard Metrics ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* Score Ring */}
                <Card className="rounded-3xl border border-border/40 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center p-8 relative">
                    <div className={`absolute top-0 w-full h-1.5 ${atsScore === 100 ? 'bg-emerald-500' : atsScore >= 80 ? 'bg-primary' : atsScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Total ATS Score</h3>

                    <div className="relative w-40 h-40 group hover:scale-105 transition-transform duration-500">
                        <div className={`absolute inset-0 rounded-full blur-xl opacity-20 -z-10 ${atsScore === 100 ? 'bg-emerald-500' : atsScore >= 80 ? 'bg-primary' : atsScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        <svg className="w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted/30"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={strokeHex}
                                strokeWidth="3"
                                strokeDasharray={`${atsScore}, 100`}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-4xl font-black tracking-tight ${scoreClass(atsScore)}`}>{Math.round(atsScore)}%</span>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <Badge variant="outline" className={`px-4 py-1.5 text-xs font-bold rounded-full border ${ratingColor}`}>
                            {rating}
                        </Badge>
                    </div>
                </Card>

                {/* Score Snapshot & Tips */}
                <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
                    {/* Stats Widget */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="rounded-2xl border-border/40 shadow-sm p-5 bg-card hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completed</span>
                            </div>
                            <p className="text-2xl font-black">{categoriesComplete} <span className="text-sm font-medium text-muted-foreground">/ {categories.length}</span></p>
                        </Card>

                        <Card className="rounded-2xl border-border/40 shadow-sm p-5 bg-card hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Earned Pts</span>
                            </div>
                            <p className="text-2xl font-black">{categories.reduce((s, c) => s + c.earned, 0)} <span className="text-sm font-medium text-muted-foreground">/ 100</span></p>
                        </Card>

                        <Card className="rounded-2xl border-border/40 shadow-sm p-5 bg-card hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Missing</span>
                            </div>
                            <p className="text-2xl font-black text-rose-500">{categories.reduce((s, c) => s + (c.max - c.earned), 0)} <span className="text-sm font-medium text-muted-foreground">pts</span></p>
                        </Card>
                    </div>

                    {/* Top Tips Action Box */}
                    <Card className="rounded-3xl border-border/40 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm flex-1">
                        <CardHeader className="pb-3 border-b border-border/40">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span className="flex items-center gap-2 text-foreground">
                                    <Lightbulb className="w-5 h-5 text-amber-500" /> Actionable Insights
                                </span>
                                {atsScore === 100 && <Badge className="bg-emerald-500 hover:bg-emerald-600">Flawless</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {suggestions.length > 0 ? (
                                <ul className="space-y-3">
                                    {suggestions.slice(0, 3).map((s, i) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                                            <div className="p-1 rounded-full bg-amber-500/20 text-amber-600 shrink-0 mt-0.5">
                                                <Zap className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-sm leading-snug">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <h4 className="font-bold text-emerald-600">No suggestions needed!</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Your profile is highly optimized for applicant tracking systems.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ── Category Breakdown Masonry ── */}
            <div className="pt-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <Activity className="w-6 h-6 text-primary" /> Comprehensive Breakdown
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                    {categories.map((cat) => {
                        const pct = Math.round((cat.earned / cat.max) * 100);
                        const done = cat.earned >= cat.max;
                        const icon = CATEGORY_ICONS[cat.label] ?? <CheckCircle2 className="w-5 h-5" />;

                        return (
                            <div
                                key={cat.label}
                                className={`group relative rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg ${done
                                    ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
                                    : "border-border/40 bg-card hover:border-primary/40"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl ${done ? 'bg-emerald-500/20 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                                            {icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight text-foreground">{cat.label}</h4>
                                            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                                                {cat.earned} <span className="font-normal opacity-70">/ {cat.max} pts</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`font-black text-sm tracking-tighter ${done ? "text-emerald-600" : scoreClass(pct)}`}>
                                            {pct}%
                                        </span>
                                        {done ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <Link href="/dashboard/my-resume" className="block p-1 rounded-full hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <Progress
                                    value={pct}
                                    className={`h-2 mb-3 [&>div]:transition-all [&>div]:duration-1000 ${done ? '[&>div]:bg-emerald-500 bg-emerald-500/20' : '[&>div]:bg-primary bg-primary/20'}`}
                                />

                                {!done && cat.suggestions.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border/50">
                                        <ul className="space-y-2">
                                            {cat.suggestions.map((s, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                                                    <span className="leading-tight">{s}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Info Banner Bottom ── */}
            <Card className="rounded-3xl border border-primary/20 bg-linear-to-br from-primary/5 to-transparent backdrop-blur-sm pb-2 pt-1 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Info className="w-24 h-24" />
                </div>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-foreground font-black">
                        ATS Parsing Logic
                    </CardTitle>
                    <CardDescription className="text-base text-foreground/80 mt-2 max-w-3xl">
                        Systems use algorithmic keyword parsing. Aim for <strong>5+ Technical Skills</strong>, a <strong>Comprehensive Summary</strong>, and <strong>Clear Job Titles</strong> to bypass automated filters and reach human recruiters.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard/my-resume">
                        <Button className="rounded-xl px-6 h-11 font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform gap-2">
                            <TrendingUp className="w-4 h-4" /> Go to Resume Builder
                        </Button>
                    </Link>
                </CardContent>
            </Card>

        </div>
    );
};

export default AtsScorePage;
