"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    FileUser,
    Monitor,
    RefreshCw,
    Search,
    Sparkles,
    Star,
    TrendingUp,
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

// ── Status config ─────────────────────────────────────────────────────────────
const APP_STATUS_COLORS: Record<string, string> = {
    PENDING: "#f59e0b",
    SHORTLISTED: "#3b82f6",
    INTERVIEW: "#8b5cf6",
    HIRED: "#10b981",
    REJECTED: "#ef4444",
};
const FALLBACK = ["#6366f1", "#ec4899", "#14b8a6", "#f97316"];

const statusStyle: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    HIRED:      { bg: "bg-green-100 dark:bg-green-900/30",   text: "text-green-700 dark:text-green-400",   icon: CheckCircle },
    REJECTED:   { bg: "bg-red-100 dark:bg-red-900/30",      text: "text-red-700 dark:text-red-400",       icon: XCircle },
    SHORTLISTED:{ bg: "bg-blue-100 dark:bg-blue-900/30",    text: "text-blue-700 dark:text-blue-400",     icon: Star },
    INTERVIEW:  { bg: "bg-purple-100 dark:bg-purple-900/30",text: "text-purple-700 dark:text-purple-400", icon: Users },
    PENDING:    { bg: "bg-amber-100 dark:bg-amber-900/30",  text: "text-amber-700 dark:text-amber-400",   icon: Clock },
};

// ── Quick-access links ────────────────────────────────────────────────────────
const QUICK_LINKS = [
    { title: "Browse Jobs",      href: "/jobs",                          icon: Search,    gradient: "from-primary/20 to-primary/10",      iconColor: "text-primary" },
    { title: "Applications",     href: "/dashboard/my-applications",     icon: FileText,  gradient: "from-blue-500/20 to-blue-500/10",     iconColor: "text-blue-600 dark:text-blue-400" },
    { title: "My Resume",        href: "/dashboard/my-resume",           icon: FileUser,  gradient: "from-green-500/20 to-green-500/10",   iconColor: "text-green-600 dark:text-green-400" },
    { title: "ATS Score",        href: "/dashboard/ats-score",           icon: BarChart3, gradient: "from-purple-500/20 to-purple-500/10", iconColor: "text-purple-600 dark:text-purple-400" },
    { title: "Subscriptions",    href: "/dashboard/subscriptions",       icon: CreditCard,gradient: "from-indigo-500/20 to-indigo-500/10", iconColor: "text-indigo-600 dark:text-indigo-400" },
    { title: "Referrals",        href: "/dashboard/referrals",           icon: Users,     gradient: "from-cyan-500/20 to-cyan-500/10",     iconColor: "text-cyan-600 dark:text-cyan-400" },
    { title: "Notifications",    href: "/dashboard/notifications",       icon: Bell,      gradient: "from-violet-500/20 to-violet-500/10", iconColor: "text-violet-600 dark:text-violet-400" },
    { title: "Devices",          href: "/dashboard/devices",             icon: Monitor,   gradient: "from-slate-500/20 to-slate-500/10",   iconColor: "text-slate-600 dark:text-slate-400" },
];

// ── Stat card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
    title: string;
    value?: number | string;
    sub?: string;
    icon: React.ElementType;
    gradient: string;
    iconColor: string;
    href: string;
    loading: boolean;
    accent?: string;
}

const StatCard = ({ title, value, sub, icon: Icon, gradient, iconColor, href, loading, accent }: StatCardProps) => (
    <Link href={href} className="block group">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-border hover:shadow-lg transition-all duration-300 h-full p-5">
            {/* Subtle accent glow */}
            {accent && <div className={`absolute top-0 right-0 h-20 w-20 rounded-full blur-2xl opacity-30 ${accent}`} />}
            <div className="relative flex items-start justify-between">
                <div className="space-y-2 flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{title}</p>
                    {loading ? (
                        <div className="h-9 w-20 rounded-lg bg-muted animate-pulse" />
                    ) : (
                        <p className="text-3xl font-extrabold tracking-tight">
                            {typeof value === "number" ? value.toLocaleString() : (value ?? "—")}
                        </p>
                    )}
                    {sub && <p className="text-xs text-muted-foreground leading-tight">{sub}</p>}
                </div>
                <div className={`h-11 w-11 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
            </div>
        </div>
    </Link>
);

// ── Custom tooltips ───────────────────────────────────────────────────────────
const AreaTip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background/95 backdrop-blur border border-border/60 rounded-xl shadow-xl px-4 py-3 text-sm">
            <p className="font-semibold text-muted-foreground text-xs mb-1">{label}</p>
            <p className="font-bold text-primary text-base">{payload[0].value} <span className="text-xs font-normal text-muted-foreground">applications</span></p>
        </div>
    );
};

const PieTip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background/95 backdrop-blur border border-border/60 rounded-xl shadow-xl px-4 py-3 text-sm">
            <p className="font-semibold text-xs mb-1" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
            <p className="font-bold text-base">{payload[0].value} <span className="text-xs font-normal text-muted-foreground">applications</span></p>
        </div>
    );
};

// ── Profile completion colour ─────────────────────────────────────────────────
const completionGradient = (n: number) => {
    if (n >= 80) return "from-green-500 to-emerald-400";
    if (n >= 60) return "from-blue-500 to-cyan-400";
    if (n >= 40) return "from-yellow-500 to-amber-400";
    return "from-orange-500 to-red-400";
};

const MILESTONES = [
    { pct: 20, label: "Basic" },
    { pct: 40, label: "Personal" },
    { pct: 60, label: "Apply" },
    { pct: 80, label: "Strong" },
    { pct: 100, label: "Complete" },
];

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

    const areaData = (stats?.applicationsByMonth ?? []).map((d) => ({
        month: d.month ? format(new Date(d.month), "MMM yy") : "",
        applications: Number(d.count),
    }));

    const pieData = (stats?.applicationStatusDistribution ?? []).map((d, i) => ({
        name: d.status,
        value: d.count,
        fill: APP_STATUS_COLORS[d.status] ?? FALLBACK[i % FALLBACK.length],
    }));

    const totalApplications = pieData.reduce((s, d) => s + d.value, 0);
    const hiredCount = pieData.find((d) => d.name === "HIRED")?.value ?? 0;
    const activeCount = pieData
        .filter((d) => ["PENDING", "SHORTLISTED", "INTERVIEW"].includes(d.name))
        .reduce((s, d) => s + d.value, 0);

    const firstName = userInfo.name?.split(" ")[0] ?? "there";

    return (
        <div className="space-y-6 pb-8">

            {/* ── Hero welcome banner ── */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/75 p-6 sm:p-8 text-white">
                {/* Dot grid */}
                <div className="pointer-events-none absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
                {/* Blobs */}
                <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Welcome back, {firstName}! 👋
                            </h1>
                            {isPremium && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-200 text-xs font-semibold">
                                    <Sparkles className="h-3 w-3" /> Premium
                                </span>
                            )}
                        </div>
                        <p className="text-white/70 text-sm">
                            {profileCompletion >= 60
                                ? "Your profile is ready — keep applying and track your progress below."
                                : `Complete your profile to ${60 - profileCompletion}% more and unlock job applications.`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Mini stats */}
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                                <p className="text-xl font-bold">{statsLoading ? "…" : stats?.applicationCount ?? 0}</p>
                                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wide">Applied</p>
                            </div>
                            <div className="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                                <p className="text-xl font-bold">{statsLoading ? "…" : hiredCount}</p>
                                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wide">Hired</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white h-9 w-9 rounded-xl"
                            title="Refresh"
                        >
                            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Profile completion ── */}
            <div className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6">
                {resumeLoading ? (
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <div className="h-4 w-36 rounded-lg bg-muted animate-pulse" />
                            <div className="h-7 w-16 rounded-lg bg-muted animate-pulse" />
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-muted animate-pulse" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold">Profile Completion</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {profileCompletion >= 60 ? (
                                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Ready to apply!
                                        </span>
                                    ) : (
                                        `${60 - profileCompletion}% more to unlock job applications`
                                    )}
                                </p>
                            </div>
                            <Link href="/dashboard/my-resume">
                                <span className={`text-3xl font-extrabold bg-linear-to-r ${completionGradient(profileCompletion)} bg-clip-text text-transparent`}>
                                    {profileCompletion}%
                                </span>
                            </Link>
                        </div>

                        {/* Custom gradient progress bar */}
                        <div className="relative h-2.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                                className={`h-full rounded-full bg-linear-to-r ${completionGradient(profileCompletion)} transition-all duration-700`}
                                style={{ width: `${profileCompletion}%` }}
                            />
                            {/* 60% unlock marker */}
                            <div className="absolute top-0 bottom-0 flex items-center" style={{ left: "60%" }}>
                                <div className="w-0.5 h-full bg-background/80" />
                            </div>
                        </div>

                        {/* Milestones */}
                        <div className="flex justify-between mt-1">
                            {MILESTONES.map((m) => (
                                <div key={m.pct} className="flex flex-col items-center gap-0.5">
                                    <div className={`h-1.5 w-1.5 rounded-full ${profileCompletion >= m.pct ? `bg-linear-to-r ${completionGradient(profileCompletion)}` : "bg-muted-foreground/30"}`} />
                                    <span className={`text-[10px] font-medium hidden sm:block ${profileCompletion >= m.pct ? "text-foreground/70" : "text-muted-foreground/50"}`}>{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    title="Total Applied"
                    value={stats?.applicationCount}
                    href="/dashboard/my-applications"
                    icon={FileText}
                    gradient="from-blue-500/25 to-blue-500/10"
                    iconColor="text-blue-600 dark:text-blue-400"
                    accent="bg-blue-400"
                    loading={statsLoading}
                />
                <StatCard
                    title="Active"
                    value={activeCount}
                    sub="Pending · Shortlisted · Interview"
                    href="/dashboard/my-applications"
                    icon={Zap}
                    gradient="from-amber-500/25 to-amber-500/10"
                    iconColor="text-amber-600 dark:text-amber-400"
                    accent="bg-amber-400"
                    loading={statsLoading}
                />
                <StatCard
                    title="Hired"
                    value={hiredCount}
                    href="/dashboard/my-applications"
                    icon={CheckCircle}
                    gradient="from-green-500/25 to-green-500/10"
                    iconColor="text-green-600 dark:text-green-400"
                    accent="bg-green-400"
                    loading={statsLoading}
                />
                <StatCard
                    title="Profile"
                    value={`${profileCompletion}%`}
                    sub={profileCompletion >= 60 ? "Ready to apply" : "Needs more work"}
                    href="/dashboard/my-resume"
                    icon={FileUser}
                    gradient="from-purple-500/25 to-purple-500/10"
                    iconColor="text-purple-600 dark:text-purple-400"
                    accent="bg-purple-400"
                    loading={resumeLoading}
                />
            </div>

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Applications over time */}
                <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card overflow-hidden">
                    <div className="px-5 pt-5 pb-3 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold">Applications Over Time</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Monthly submissions trend</p>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                    <div className="px-2 pb-4">
                        {statsLoading ? (
                            <div className="h-56 w-full rounded-xl bg-muted animate-pulse mx-3" />
                        ) : areaData.length === 0 ? (
                            <div className="h-56 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                                    <Briefcase className="h-6 w-6 opacity-40" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">No applications yet</p>
                                    <p className="text-xs text-muted-foreground/60 mt-0.5">Start applying to see your trend</p>
                                </div>
                                <Link href="/jobs">
                                    <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8 rounded-lg">
                                        <Search className="h-3.5 w-3.5" /> Browse Jobs
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={areaData} margin={{ top: 5, right: 16, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="userAppGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/60" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip content={<AreaTip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="applications"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2.5}
                                        fill="url(#userAppGrad)"
                                        dot={{ r: 3.5, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                                        activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Application status donut */}
                <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                    <div className="px-5 pt-5 pb-3 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold">Status Breakdown</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{totalApplications} total</p>
                        </div>
                        <Badge variant="secondary" className="text-xs font-semibold">{totalApplications}</Badge>
                    </div>
                    <div className="pb-2">
                        {statsLoading ? (
                            <div className="h-56 flex items-center justify-center">
                                <div className="h-32 w-32 rounded-full border-8 border-muted animate-pulse" />
                            </div>
                        ) : pieData.length === 0 ? (
                            <div className="h-56 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                                    <BarChart3 className="h-5 w-5 opacity-40" />
                                </div>
                                <p className="text-sm">No data yet</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="42%"
                                        innerRadius={52}
                                        outerRadius={78}
                                        paddingAngle={3}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<PieTip />} />
                                    <Legend
                                        iconType="circle"
                                        iconSize={7}
                                        wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }}
                                        formatter={(v) => <span className="text-foreground/70 capitalize">{String(v).toLowerCase()}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Recent applications ── */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-border/40">
                    <div>
                        <p className="text-sm font-semibold">Recent Applications</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Your latest 5 submissions</p>
                    </div>
                    <Link href="/dashboard/my-applications">
                        <Button variant="ghost" size="sm" className="text-xs h-7 px-3 gap-1 text-primary hover:text-primary rounded-lg">
                            View all →
                        </Button>
                    </Link>
                </div>
                <div className="p-3">
                    {appsLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                                    <div className="h-9 w-9 rounded-xl bg-muted animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3.5 w-40 rounded-md bg-muted animate-pulse" />
                                        <div className="h-3 w-24 rounded-md bg-muted animate-pulse" />
                                    </div>
                                    <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : applicationsData?.data && applicationsData.data.length > 0 ? (
                        <div className="space-y-1">
                            {applicationsData.data.map((app) => {
                                const cfg = statusStyle[app.status] ?? { bg: "bg-muted", text: "text-muted-foreground", icon: Clock };
                                const StatusIcon = cfg.icon;
                                return (
                                    <div
                                        key={app.id}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer"
                                    >
                                        {/* Company avatar */}
                                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary text-sm group-hover:bg-primary/15 transition-colors">
                                            {(app.job?.company ?? "?")[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{app.job?.title ?? "Unknown Job"}</p>
                                            <p className="text-xs text-muted-foreground truncate">{app.job?.company}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${cfg.bg} ${cfg.text}`}>
                                            <StatusIcon className="h-3 w-3" />
                                            {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-10 flex flex-col items-center gap-3 text-muted-foreground">
                            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
                                <Briefcase className="h-7 w-7 opacity-40" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">No applications yet</p>
                                <p className="text-xs text-muted-foreground/60 mt-0.5">Your submitted applications will appear here</p>
                            </div>
                            <Link href="/jobs">
                                <Button size="sm" className="gap-1.5 text-xs h-8 rounded-lg">
                                    <Search className="h-3.5 w-3.5" /> Browse Jobs
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Quick access ── */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-1 w-4 rounded-full bg-primary" />
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Quick Access</h2>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {QUICK_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} className="block group">
                            <div className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border border-border/50 bg-card hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer">
                                <div className={`h-10 w-10 rounded-xl bg-linear-to-br ${link.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <link.icon className={`h-5 w-5 ${link.iconColor}`} />
                                </div>
                                <span className="text-[11px] font-semibold text-center leading-tight text-foreground/80">{link.title}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardContent;
