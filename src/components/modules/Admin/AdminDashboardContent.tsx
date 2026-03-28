"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/services/stats.services";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Activity,
    Bell,
    Briefcase,
    Building2,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    RefreshCw,
    Shield,
    Tag,
    Ticket,
    TrendingUp,
    Users,
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

// ── Tooltip type definitions ────────────────────────────────────────────────
interface AreaTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        name?: string;
        dataKey?: string;
        fill?: string;
    }>;
    label?: string | number;
}

interface PieTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        name?: string;
        dataKey?: string;
        fill?: string;
        payload?: {
            fill?: string;
        };
    }>;
    label?: string | number;
}

// ── Colour palette for application status ──────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
    PENDING: "#f59e0b",
    SHORTLISTED: "#3b82f6",
    INTERVIEW: "#8b5cf6",
    HIRED: "#10b981",
    REJECTED: "#ef4444",
};
const FALLBACK_COLORS = ["#6366f1", "#ec4899", "#14b8a6", "#f97316", "#84cc16"];

// ── Quick-access management routes ─────────────────────────────────────────
const QUICK_LINKS = [
    { title: "Users", href: "/admin/dashboard/users-management", icon: Users, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
    { title: "Recruiters", href: "/admin/dashboard/recruiters-management", icon: Building2, color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400" },
    { title: "Admins", href: "/admin/dashboard/admins-management", icon: Shield, color: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400" },
    { title: "Jobs", href: "/admin/dashboard/jobs-management", icon: Briefcase, color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400" },
    { title: "Pending Approvals", href: "/admin/dashboard/pending-jobs", icon: Clock, color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400" },
    { title: "Applications", href: "/admin/dashboard/applications-management", icon: FileText, color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400" },
    { title: "Job Categories", href: "/admin/dashboard/categories-management", icon: Tag, color: "bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400" },
    { title: "Subscriptions", href: "/admin/dashboard/subscriptions-management", icon: CreditCard, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400" },
    { title: "Payment Subscriptions", href: "/admin/dashboard/payment-subscriptions", icon: DollarSign, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
    { title: "Coupons", href: "/admin/dashboard/coupons-management", icon: Ticket, color: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400" },
    { title: "Tracking & Analytics", href: "/admin/dashboard/tracking", icon: Activity, color: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400" },
    { title: "Notifications", href: "/admin/dashboard/notifications", icon: Bell, color: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400" },
];

// ── Stat card ───────────────────────────────────────────────────────────────
interface StatCardProps {
    title: string;
    value?: number;
    sub?: string;
    icon: React.ElementType;
    iconClass: string;
    href: string;
    loading: boolean;
    badge?: { label: string; variant: "default" | "secondary" | "destructive" | "outline" };
}

const StatCard = ({ title, value, sub, icon: Icon, iconClass, href, loading, badge }: StatCardProps) => (
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
                        {badge && <Badge variant={badge.variant} className="text-xs mt-1">{badge.label}</Badge>}
                    </div>
                    <div className={`p-2.5 rounded-xl ${iconClass}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>
);

// ── Custom tooltip for area chart ───────────────────────────────────────────
const AreaTooltip = ({ active, payload, label }: AreaTooltipProps) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background border rounded-lg shadow-lg px-3 py-2 text-sm">
            <p className="font-medium mb-1">{label}</p>
            <p className="text-primary">{payload[0].value} applications</p>
        </div>
    );
};

// ── Custom tooltip for pie chart ────────────────────────────────────────────
const PieTooltip = ({ active, payload }: PieTooltipProps) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background border rounded-lg shadow-lg px-3 py-2 text-sm">
            <p className="font-medium">{payload[0].name}</p>
            <p style={{ color: payload[0].payload?.fill ?? payload[0].fill }}>{payload[0].value} applications</p>
        </div>
    );
};

// ── Main component ──────────────────────────────────────────────────────────
const AdminDashboardContent = () => {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => getDashboardStats(),
    });

    const stats = data?.data;

    // Format bar chart data
    const barData = (stats?.barChartData ?? []).map((d) => ({
        month: d.month ? format(new Date(d.month), "MMM yy") : "",
        applications: Number(d.count),
    }));

    // Format pie chart data
    const pieData = (stats?.pieChartData ?? []).map((d, i) => ({
        name: d.status,
        value: d.count,
        fill: STATUS_COLORS[d.status] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
    }));

    const totalApplications = pieData.reduce((s, d) => s + d.value, 0);

    return (
        <div className="space-y-7">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Platform overview and analytics</p>
                </div>
                <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching} title="Refresh">
                    <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard
                    title="Total Users"
                    value={stats?.userCount}
                    href="/admin/dashboard/users-management"
                    icon={Users}
                    iconClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    loading={isLoading}
                />
                <StatCard
                    title="Recruiters"
                    value={stats?.recruiterCount}
                    href="/admin/dashboard/recruiters-management"
                    icon={Building2}
                    iconClass="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
                    loading={isLoading}
                    badge={stats?.pendingRecruiters ? { label: `${stats.pendingRecruiters} pending`, variant: "secondary" } : undefined}
                />
                <StatCard
                    title="Total Jobs"
                    value={stats?.jobCount}
                    sub={stats?.activeJobCount !== undefined ? `${stats.activeJobCount} active` : undefined}
                    href="/admin/dashboard/jobs-management"
                    icon={Briefcase}
                    iconClass="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                    loading={isLoading}
                />
                <StatCard
                    title="Applications"
                    value={stats?.applicationCount}
                    href="/admin/dashboard/applications-management"
                    icon={FileText}
                    iconClass="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400"
                    loading={isLoading}
                />
                <StatCard
                    title="Admins"
                    value={stats?.adminCount}
                    href="/admin/dashboard/admins-management"
                    icon={Shield}
                    iconClass="bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400"
                    loading={isLoading}
                />
            </div>

            {/* ── Revenue banner ── */}
            <Card className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="py-5 px-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Platform Revenue</p>
                            {isLoading ? (
                                <Skeleton className="h-10 w-40" />
                            ) : (
                                <p className="text-4xl font-bold text-primary">
                                    &#2547;{(stats?.totalRevenue ?? 0).toLocaleString()}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-primary opacity-60">
                            <TrendingUp className="h-10 w-10" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Area chart – applications by month */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Applications Over Time</CardTitle>
                        <p className="text-xs text-muted-foreground">Monthly application volume</p>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-56 w-full" />
                        ) : barData.length === 0 ? (
                            <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip content={<AreaTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="applications"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        fill="url(#appGrad)"
                                        dot={{ r: 3, fill: "hsl(var(--primary))" }}
                                        activeDot={{ r: 5 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Pie chart – application status */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Application Status</CardTitle>
                        <p className="text-xs text-muted-foreground">{totalApplications} total applications</p>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-56 w-full" />
                        ) : pieData.length === 0 ? (
                            <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
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
                                    <Tooltip content={<PieTooltip />} />
                                    <Legend
                                        iconType="circle"
                                        iconSize={8}
                                        formatter={(value) => <span className="text-xs capitalize">{value.toLowerCase()}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Quick access ── */}
            <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Access</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
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

export default AdminDashboardContent;
