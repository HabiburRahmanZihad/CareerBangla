"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getAllRecruiters } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    ArrowRight,
    CheckCircle,
    Clock,
    FileText,
    RefreshCw,
    TrendingUp,
    Users,
    XCircle,
} from "lucide-react";
import Link from "next/link";

// ── Stat Card Component ────────────────────────────────────────────────────
interface StatCardProps {
    label: string;
    value: number;
    icon: React.ElementType;
    accent: string;
    trend?: { value: number; direction: "up" | "down" };
    loading?: boolean;
}

const StatCard = ({ label, value, icon: Icon, accent, trend, loading }: StatCardProps) => (
    <Card className={cn("relative overflow-hidden border-border/40 hover:border-border/80 transition-all group", loading && "opacity-60")}>
        <div className={cn("absolute left-0 inset-y-0 w-1 bg-linear-to-b", accent)} />
        <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                    {loading ? (
                        <Skeleton className="h-9 w-20" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-black">{value}</p>
                            {trend && (
                                <div className={cn("text-xs font-bold flex items-center gap-0.5", trend.direction === "up" ? "text-primary" : "text-destructive")}>
                                    <TrendingUp className="h-3 w-3" />
                                    {trend.value}%
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className={cn("p-2.5 rounded-xl text-white hidden sm:flex items-center justify-center shrink-0", accent.split(" ").slice(0, 2).join(" "))}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const RecruitersManagementDashboard = () => {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["all-recruiters"],
        queryFn: () => getAllRecruiters({ limit: "100" }),
    });

    const recruiters = (data?.data || []) as IRecruiterProfile[];
    const pendingCount = recruiters.filter((r: IRecruiterProfile) => r.status === "PENDING").length;
    const confirmedCount = recruiters.filter((r: IRecruiterProfile) => r.status === "APPROVED").length;
    const rejectedCount = recruiters.filter((r: IRecruiterProfile) => r.status === "REJECTED").length;
    const totalCount = recruiters.length;

    // Calculate trends (mock data - in production, compare with previous period)
    const pendingTrend = pendingCount > 0 ? Math.min(pendingCount * 5, 100) : 0;
    const confirmedTrend = confirmedCount > 0 ? Math.min(confirmedCount * 2, 100) : 0;

    return (
        <div className="space-y-7">
            {/* ── Premium Header ────────────────────────────────────────────── */}
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                        <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                            Recruiters Management
                        </h1>
                        <p className="text-sm text-muted-foreground">Manage recruiter applications and verified accounts</p>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="rounded-xl"
                        title="Refresh data"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* ── Stats Grid ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Recruiters"
                    value={totalCount}
                    icon={Users}
                    accent="from-primary to-orange-600"
                    loading={isLoading}
                />
                <StatCard
                    label="Pending Applications"
                    value={pendingCount}
                    icon={Clock}
                    accent="from-orange-500 to-orange-600"
                    trend={pendingCount > 0 ? { value: pendingTrend, direction: "up" } : undefined}
                    loading={isLoading}
                />
                <StatCard
                    label="Confirmed Recruiters"
                    value={confirmedCount}
                    icon={CheckCircle}
                    accent="from-blue-600 to-blue-700"
                    trend={confirmedCount > 0 ? { value: confirmedTrend, direction: "up" } : undefined}
                    loading={isLoading}
                />
                <StatCard
                    label="Rejected Recruiters"
                    value={rejectedCount}
                    icon={XCircle}
                    accent="from-destructive to-red-700"
                    loading={isLoading}
                />
            </div>

            {/* ── Premium Navigation Cards ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recruiter Applications Card */}
                <Link href="/admin/dashboard/recruiters-management/applications" className="group">
                    <Card className={cn(
                        "h-full relative overflow-hidden border-border/40 hover:border-primary/50",
                        "hover:shadow-xl hover:shadow-primary/10 transition-all duration-300",
                        "after:content-[''] after:absolute after:inset-0 after:bg-linear-to-br after:from-primary/5 after:to-transparent after:opacity-0 after:group-hover:opacity-100 after:transition-opacity"
                    )}>
                        <CardHeader className="pb-3 space-y-3 relative z-10">
                            <div className="flex items-start justify-between gap-2">
                                <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <Badge className="bg-primary/20 text-primary border-primary/30 dark:border-primary/40 dark:text-primary font-bold">
                                    {pendingCount} Pending
                                </Badge>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">Recruiter Applications</h3>
                                <p className="text-xs text-muted-foreground mt-1">Review and manage pending applications</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                                    <span>Approve or reject applications</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                                    <span>Edit application details</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                                    <span>View profiles instantly</span>
                                </li>
                            </ul>
                            <Button className="w-full bg-primary hover:bg-orange-700 group-hover:gap-2 transition-all text-primary-foreground">
                                View All
                                <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Confirmed Recruiters Card */}
                <Link href="/admin/dashboard/recruiters-management/confirmed" className="group">
                    <Card className={cn(
                        "h-full relative overflow-hidden border-border/40 hover:border-blue-400/50",
                        "hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300",
                        "after:content-[''] after:absolute after:inset-0 after:bg-linear-to-br after:from-blue-500/5 after:to-transparent after:opacity-0 after:group-hover:opacity-100 after:transition-opacity"
                    )}>
                        <CardHeader className="pb-3 space-y-3 relative z-10">
                            <div className="flex items-start justify-between gap-2">
                                <div className="p-2.5 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                </div>
                                <Badge className="bg-blue-500/20 text-blue-700 border-blue-200 dark:border-blue-800 dark:text-blue-300 font-bold">
                                    {confirmedCount} Verified
                                </Badge>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">Confirmed Recruiters</h3>
                                <p className="text-xs text-muted-foreground mt-1">Manage verified recruiter accounts</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-blue-500 shrink-0" />
                                    <span>Manage account status</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-blue-500 shrink-0" />
                                    <span>Edit recruiter info</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-blue-500 shrink-0" />
                                    <span>View analytics</span>
                                </li>
                            </ul>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:gap-2 transition-all text-white">
                                Manage All
                                <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Rejected Recruiters Card */}
                <Link href="/admin/dashboard/recruiters-management/rejected" className="group">
                    <Card className={cn(
                        "h-full relative overflow-hidden border-border/40 hover:border-destructive/50",
                        "hover:shadow-xl hover:shadow-destructive/10 transition-all duration-300",
                        "after:content-[''] after:absolute after:inset-0 after:bg-linear-to-br after:from-destructive/5 after:to-transparent after:opacity-0 after:group-hover:opacity-100 after:transition-opacity"
                    )}>
                        <CardHeader className="pb-3 space-y-3 relative z-10">
                            <div className="flex items-start justify-between gap-2">
                                <div className="p-2.5 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <Badge className="bg-red-500/20 text-red-700 border-red-200 dark:border-red-800 dark:text-red-300 font-bold">
                                    {rejectedCount} Rejected
                                </Badge>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">Rejected Recruiters</h3>
                                <p className="text-xs text-muted-foreground mt-1">Manage rejected applications</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-red-500 shrink-0" />
                                    <span>Re-approve recruiters</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-red-500 shrink-0" />
                                    <span>Delete permanently</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-red-500 shrink-0" />
                                    <span>Search & filter</span>
                                </li>
                            </ul>
                            <Button className="w-full bg-red-600 hover:bg-red-700 group-hover:gap-2 transition-all text-white">
                                Review All
                                <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* ── Insights Section ────────────────────────────────────────────── */}
            <Card className="border-border/40 bg-linear-to-br from-muted/30 to-transparent">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Recruiter Overview
                            </CardTitle>
                            <CardDescription>Key metrics and insights</CardDescription>
                        </div>
                        <Badge variant="outline" className="shrink-0">Real-time</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase">Pending Rate</p>
                            <p className="text-2xl font-bold">{totalCount > 0 ? ((pendingCount / totalCount) * 100).toFixed(0) : 0}%</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase">Approval Rate</p>
                            <p className="text-2xl font-bold">{totalCount > 0 ? ((confirmedCount / totalCount) * 100).toFixed(0) : 0}%</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase">Rejection Rate</p>
                            <p className="text-2xl font-bold">{totalCount > 0 ? ((rejectedCount / totalCount) * 100).toFixed(0) : 0}%</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase">Total in System</p>
                            <p className="text-2xl font-bold">{totalCount}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecruitersManagementDashboard;
