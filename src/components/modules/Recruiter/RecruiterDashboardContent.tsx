"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/services/stats.services";
import { IRecruiterDashboardData } from "@/types/dashboard.types";
import { IUserWithDetails } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    AlertCircle,
    Bell,
    Briefcase,
    CheckCircle,
    Clock,
    CreditCard,
    FileText,
    PlusCircle,
    RefreshCw,
    Search,
    Users,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
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

const JOB_STATUS_COLORS: Record<string, string> = {
    PENDING: "#f59e0b",
    LIVE: "#10b981",
    INACTIVE: "#94a3b8",
    CLOSED: "#ef4444",
};

const FALLBACK = ["#6366f1", "#ec4899", "#14b8a6", "#f97316"];

// ── Quick-access links ───────────────────────────────────────────────────────
const QUICK_LINKS = [
    { title: "Post a Job", href: "/recruiter/dashboard/post-job", icon: PlusCircle, color: "bg-primary/10 text-primary" },
    { title: "Pending Jobs", href: "/recruiter/dashboard/my-jobs/pending", icon: Clock, color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400" },
    { title: "Approved Jobs", href: "/recruiter/dashboard/my-jobs/approved", icon: CheckCircle, color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400" },
    { title: "Inactive Jobs", href: "/recruiter/dashboard/my-jobs/inactive", icon: XCircle, color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
    { title: "Applications", href: "/recruiter/dashboard/applications", icon: FileText, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
    { title: "Search Candidates", href: "/recruiter/dashboard/search-candidates", icon: Search, color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400" },
    { title: "Subscriptions", href: "/recruiter/dashboard/subscriptions", icon: CreditCard, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400" },
    { title: "Notifications", href: "/recruiter/dashboard/notifications", icon: Bell, color: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400" },
];

// ── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
    title: string;
    value?: number;
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
                            <p className="text-3xl font-bold">{(value ?? 0).toLocaleString()}</p>
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
interface AreaTipProps {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string | number;
}

const AreaTip = ({ active, payload, label }: AreaTipProps) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background border rounded-lg shadow-lg px-3 py-2 text-sm">
            <p className="font-medium mb-0.5">{label}</p>
            <p className="text-primary">{payload[0].value} applications</p>
        </div>
    );
};

interface PieTipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: { fill: string } }>;
}

const PieTip = ({ active, payload }: PieTipProps) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background border rounded-lg shadow-lg px-3 py-2 text-sm">
            <p className="font-medium">{payload[0].name}</p>
            <p style={{ color: payload[0].payload.fill }}>{payload[0].value}</p>
        </div>
    );
};

interface BarTipProps {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string | number;
}

const BarTip = ({ active, payload, label }: BarTipProps) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background border rounded-lg shadow-lg px-3 py-2 text-sm">
            <p className="font-medium capitalize mb-0.5">{String(label).toLowerCase()}</p>
            <p className="text-primary">{payload[0].value} jobs</p>
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────
interface RecruiterDashboardContentProps {
    userInfo: IUserWithDetails;
}

const RecruiterDashboardContent = ({ userInfo }: RecruiterDashboardContentProps) => {
    const isVerified = userInfo.recruiter?.status === "APPROVED";
    const isPremium = userInfo.isPremium;

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => getDashboardStats(),
    });

    const stats = data?.data as unknown as IRecruiterDashboardData | undefined;

    // Applications over time
    const areaData = (stats?.applicationsByMonth ?? []).map((d) => ({
        month: d.month ? format(new Date(d.month), "MMM yy") : "",
        applications: Number(d.count),
    }));

    // Application status pie
    const appPieData = (stats?.applicationStatusDistribution ?? []).map((d, i) => ({
        name: d.status,
        value: d.count,
        fill: APP_STATUS_COLORS[d.status] ?? FALLBACK[i % FALLBACK.length],
    }));

    // Jobs by status bar
    const jobBarData = (stats?.jobsByStatus ?? []).map((d) => ({
        status: d.status,
        count: d.count,
        fill: JOB_STATUS_COLORS[d.status] ?? "#6366f1",
    }));

    const totalApplications = appPieData.reduce((s, d) => s + d.value, 0);

    return (
        <div className="space-y-7">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
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

            {/* Not-verified banner */}
            {!isVerified && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Your account is not verified yet. You cannot post jobs until an admin verifies your profile.
                        Complete your profile to speed up the verification process.
                    </AlertDescription>
                </Alert>
            )}

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Jobs"
                    value={stats?.jobCount}
                    sub={stats?.activeJobCount !== undefined ? `${stats.activeJobCount} live` : undefined}
                    href="/recruiter/dashboard/my-jobs/approved"
                    icon={Briefcase}
                    iconClass="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                    loading={isLoading}
                />
                <StatCard
                    title="Active Jobs"
                    value={stats?.activeJobCount}
                    href="/recruiter/dashboard/my-jobs/approved"
                    icon={CheckCircle}
                    iconClass="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
                    loading={isLoading}
                />
                <StatCard
                    title="Applications"
                    value={stats?.applicationCount}
                    href="/recruiter/dashboard/applications"
                    icon={FileText}
                    iconClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    loading={isLoading}
                />
                <StatCard
                    title="Unique Applicants"
                    value={stats?.uniqueApplicants}
                    href="/recruiter/dashboard/search-candidates"
                    icon={Users}
                    iconClass="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400"
                    loading={isLoading}
                />
            </div>

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Applications over time */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Applications Over Time</CardTitle>
                        <p className="text-xs text-muted-foreground">Monthly applications received</p>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-56 w-full" />
                        ) : areaData.length === 0 ? (
                            <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">No applications yet</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="recAppGrad" x1="0" y1="0" x2="0" y2="1">
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
                                        fill="url(#recAppGrad)"
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
                        {isLoading ? (
                            <Skeleton className="h-56 w-full" />
                        ) : appPieData.length === 0 ? (
                            <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">No applications yet</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={appPieData}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {appPieData.map((entry, i) => (
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

            {/* ── Jobs by status bar chart ── */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Jobs by Status</CardTitle>
                    <p className="text-xs text-muted-foreground">Breakdown of your job postings</p>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-44 w-full" />
                    ) : jobBarData.length === 0 ? (
                        <div className="h-44 flex items-center justify-center text-muted-foreground text-sm">No jobs posted yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={jobBarData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                                <XAxis dataKey="status" tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
                                    tickFormatter={(v) => v.charAt(0) + v.slice(1).toLowerCase()} />
                                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip content={<BarTip />} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {jobBarData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
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

export default RecruiterDashboardContent;
