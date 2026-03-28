"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyApplications } from "@/services/application.services";
import { getMyResume } from "@/services/resume.services";
import { getDashboardStats } from "@/services/stats.services";
import { IUserDashboardData } from "@/types/dashboard.types";
import { IUserWithDetails } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    BarChart3,
    Bell,
    Briefcase,
    CheckCircle,
    Clock,
    CreditCard,
    FileText,
    FileUser,
    Monitor,
    RefreshCw,
    Search,
    Star,
    Users,
    XCircle,
    Zap,
} from "lucide-react";
import Link from "next/link";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// ── Colours ─────────────────────────────────────────────────────────────────
const APP_STATUS_COLORS: Record<string, string> = {
    PENDING: "#f59e0b",
    SHORTLISTED: "#3b82f6",
    INTERVIEW: "#8b5cf6",
    HIRED: "#10b981",
    REJECTED: "#ef4444",
};
const FALLBACK = ["#6366f1", "#ec4899", "#14b8a6", "#f97316"];

// ── Quick-access links ───────────────────────────────────────────────────────
const QUICK_LINKS = [
    { title: "Browse Jobs", href: "/jobs", icon: Search, color: "bg-primary/10 text-primary" },
    { title: "My Applications", href: "/dashboard/my-applications", icon: FileText, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
    { title: "My Resume", href: "/dashboard/my-resume", icon: FileUser, color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400" },
    { title: "ATS Score", href: "/dashboard/ats-score", icon: BarChart3, color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400" },
    { title: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400" },
    { title: "Referrals", href: "/dashboard/referrals", icon: Users, color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400" },
    { title: "Notifications", href: "/dashboard/notifications", icon: Bell, color: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400" },
    { title: "Devices", href: "/dashboard/devices", icon: Monitor, color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
];

// ── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
    title: string;
    value?: number | string;
    sub?: string;
    icon: React.ElementType;
    iconClass: string;
    href: string;
    loading: boolean;
}

const StatCard = ({ title, value, sub, icon: Icon, iconClass, href, loading }: StatCardProps) => (
    <Link href={href}>
        <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
            <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
                        {loading ? (
                            <Skeleton className="h-8 w-16 mt-1" />
                        ) : (
                            <p className="text-3xl font-bold">
                                {typeof value === "number" ? value.toLocaleString() : (value ?? "—")}
                            </p>
                        )}
                        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
                    </div>
                    <div className={`p-2.5 rounded-xl ${iconClass}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>
);

// ── Custom tooltips ──────────────────────────────────────────────────────────
const AreaTip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background border rounded-lg shadow-lg px-3 py-2 text-sm">
            <p className="font-medium mb-0.5">{label}</p>
            <p className="text-primary">{payload[0].value} applications</p>
        </div>
    );
};

const PieTip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background border rounded-lg shadow-lg px-3 py-2 text-sm">
            <p className="font-medium">{payload[0].name}</p>
            <p style={{ color: payload[0].payload.fill }}>{payload[0].value} applications</p>
        </div>
    );
};

// ── Status badge helper ──────────────────────────────────────────────────────
const statusStyle: Record<string, string> = {
    HIRED: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    SHORTLISTED: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    INTERVIEW: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
};

const statusIcon: Record<string, React.ElementType> = {
    HIRED: CheckCircle,
    REJECTED: XCircle,
    SHORTLISTED: Star,
    INTERVIEW: Users,
    PENDING: Clock,
};

// ── Profile completion colour ────────────────────────────────────────────────
const completionColor = (n: number) => {
    if (n >= 80) return "text-green-600";
    if (n >= 60) return "text-blue-600";
    if (n >= 40) return "text-yellow-600";
    return "text-orange-600";
};

// ── Main component ────────────────────────────────────────────────────────────
interface UserDashboardContentProps {
    userInfo: IUserWithDetails;
}

const UserDashboardContent = ({ userInfo }: UserDashboardContentProps) => {
    const isPremium = userInfo.isPremium;

    const { data: statsData, isLoading: statsLoading, isFetching, refetch } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => getDashboardStats(),
    });

    const { data: resumeData, isLoading: resumeLoading } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
    });

    const { data: applicationsData, isLoading: appsLoading } = useQuery({
        queryKey: ["my-applications-recent"],
        queryFn: () => getMyApplications({ limit: "5" }),
    });

    const stats = statsData?.data as unknown as IUserDashboardData | undefined;
    const profileCompletion = resumeData?.data?.profileCompletion ?? 0;

    // Applications over time
    const areaData = (stats?.applicationsByMonth ?? []).map((d) => ({
        month: d.month ? format(new Date(d.month), "MMM yy") : "",
        applications: Number(d.count),
    }));

    // Application status pie
    const pieData = (stats?.applicationStatusDistribution ?? []).map((d, i) => ({
        name: d.status,
        value: d.count,
        fill: APP_STATUS_COLORS[d.status] ?? FALLBACK[i % FALLBACK.length],
    }));

    const totalApplications = pieData.reduce((s, d) => s + d.value, 0);

    // Derived counts
    const hiredCount = pieData.find((d) => d.name === "HIRED")?.value ?? 0;
    const activeCount = pieData
        .filter((d) => ["PENDING", "SHORTLISTED", "INTERVIEW"].includes(d.name))
        .reduce((s, d) => s + d.value, 0);

    return (
        <div className="space-y-7">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold">My Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Welcome back, {userInfo.name}
                        {isPremium && (
                            <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs">
                                Premium
                            </Badge>
                        )}
                    </p>
                </div>
                <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching} title="Refresh">
                    <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {/* ── Profile completion ── */}
            <Card>
                <CardContent className="pt-5 pb-5 px-5">
                    {resumeLoading ? (
                        <Skeleton className="h-16 w-full" />
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold">Profile Completion</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {profileCompletion >= 60
                                            ? "You can apply for jobs!"
                                            : `Reach 60% to unlock job applications`}
                                    </p>
                                </div>
                                <Link href="/dashboard/my-resume">
                                    <span className={`text-3xl font-bold ${completionColor(profileCompletion)}`}>
                                        {profileCompletion}%
                                    </span>
                                </Link>
                            </div>
                            <Progress value={profileCompletion} className="h-2" />
                            <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                                {["Personal", "Summary", "Skills", "Experience", "Education"].map((s) => (
                                    <span key={s} className="font-medium">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Applied"
                    value={stats?.applicationCount}
                    href="/dashboard/my-applications"
                    icon={FileText}
                    iconClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    loading={statsLoading}
                />
                <StatCard
                    title="Active"
                    value={activeCount}
                    sub="pending · shortlisted · interview"
                    href="/dashboard/my-applications"
                    icon={Zap}
                    iconClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400"
                    loading={statsLoading}
                />
                <StatCard
                    title="Hired"
                    value={hiredCount}
                    href="/dashboard/my-applications"
                    icon={CheckCircle}
                    iconClass="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
                    loading={statsLoading}
                />
                <StatCard
                    title="Profile"
                    value={`${profileCompletion}%`}
                    sub={profileCompletion >= 60 ? "Can apply" : "Needs work"}
                    href="/dashboard/my-resume"
                    icon={FileUser}
                    iconClass="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                    loading={resumeLoading}
                />
            </div>

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Applications over time */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Applications Over Time</CardTitle>
                        <p className="text-xs text-muted-foreground">Monthly applications submitted</p>
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-56 w-full" />
                        ) : areaData.length === 0 ? (
                            <div className="h-56 flex flex-col items-center justify-center gap-3 text-muted-foreground text-sm">
                                <Briefcase className="h-8 w-8 opacity-30" />
                                <span>No applications yet</span>
                                <Link href="/jobs" className="text-primary text-xs hover:underline">Browse jobs →</Link>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="userAppGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip content={<AreaTip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="applications"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        fill="url(#userAppGrad)"
                                        dot={{ r: 3, fill: "hsl(var(--primary))" }}
                                        activeDot={{ r: 5 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Application status donut */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Application Status</CardTitle>
                        <p className="text-xs text-muted-foreground">{totalApplications} total</p>
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-56 w-full" />
                        ) : pieData.length === 0 ? (
                            <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">No applications yet</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<PieTip />} />
                                    <Legend
                                        iconType="circle"
                                        iconSize={8}
                                        formatter={(v) => <span className="text-xs capitalize">{String(v).toLowerCase()}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Recent applications ── */}
            <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">Your latest 5 applications</p>
                    </div>
                    <Link href="/dashboard/my-applications" className="text-xs text-primary hover:underline">
                        View all →
                    </Link>
                </CardHeader>
                <CardContent>
                    {appsLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-14 w-full" />
                            ))}
                        </div>
                    ) : applicationsData?.data && applicationsData.data.length > 0 ? (
                        <div className="space-y-2">
                            {applicationsData.data.map((app) => {
                                const StatusIcon = statusIcon[app.status] ?? Clock;
                                return (
                                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition-colors">
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm truncate">{app.job?.title ?? "Unknown Job"}</p>
                                            <p className="text-xs text-muted-foreground truncate">{app.job?.company}</p>
                                        </div>
                                        <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-3 ${statusStyle[app.status] ?? "bg-muted text-muted-foreground"}`}>
                                            <StatusIcon className="h-3 w-3" />
                                            {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-10 flex flex-col items-center gap-3 text-muted-foreground">
                            <Briefcase className="h-8 w-8 opacity-30" />
                            <p className="text-sm">No applications yet.</p>
                            <Link href="/jobs" className="text-primary text-xs hover:underline">Browse jobs →</Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Quick access ── */}
            <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Access</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {QUICK_LINKS.map((link) => (
                        <Link key={link.href} href={link.href}>
                            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                                <CardContent className="flex flex-col items-center justify-center gap-2.5 py-5 px-3 text-center">
                                    <div className={`p-2.5 rounded-xl ${link.color}`}>
                                        <link.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-medium leading-tight">{link.title}</span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardContent;
