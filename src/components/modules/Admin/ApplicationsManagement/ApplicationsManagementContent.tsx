"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllApplications, updateApplicationStatus } from "@/services/application.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    AlertCircle,
    Briefcase,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock,
    FileText,
    Layers,
    Mail,
    RefreshCw,
    Search,
    Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ── Status Config ──────────────────────────────────────────────────────────────

type StatusCfg = { label: string; strip: string; badge: string; dot: string };

const STATUS_CONFIG: Record<string, StatusCfg> = {
    PENDING: {
        label: "Pending",
        strip: "bg-amber-500",
        badge: "bg-amber-500/10 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400",
        dot: "bg-amber-500",
    },
    SHORTLISTED: {
        label: "Shortlisted",
        strip: "bg-blue-500",
        badge: "bg-blue-500/10 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400",
        dot: "bg-blue-500",
    },
    INTERVIEW: {
        label: "Interview",
        strip: "bg-violet-500",
        badge: "bg-violet-500/10 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400",
        dot: "bg-violet-500",
    },
    HIRED: {
        label: "Hired",
        strip: "bg-emerald-500",
        badge: "bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
    REJECTED: {
        label: "Rejected",
        strip: "bg-rose-500",
        badge: "bg-rose-500/10 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400",
        dot: "bg-rose-500",
    },
    REVIEWED: {
        label: "Reviewed",
        strip: "bg-sky-500",
        badge: "bg-sky-500/10 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400",
        dot: "bg-sky-500",
    },
    ACCEPTED: {
        label: "Accepted",
        strip: "bg-emerald-500",
        badge: "bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
    WITHDRAWN: {
        label: "Withdrawn",
        strip: "bg-slate-400",
        badge: "bg-slate-500/10 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400",
        dot: "bg-slate-400",
    },
};

const STATUS_FILTER_OPTIONS = ["ALL", "PENDING", "SHORTLISTED", "INTERVIEW", "HIRED", "REJECTED"];

// ── Avatar helpers ─────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-orange-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500",
];
const getInitials = (name: string) =>
    (name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const getAvatarColor = (name: string) =>
    AVATAR_COLORS[(name || "A").charCodeAt(0) % AVATAR_COLORS.length];

// ── Skeleton ───────────────────────────────────────────────────────────────────

const ApplicationsSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden bg-card">
                    <Skeleton className="h-1 w-full rounded-none" />
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                        </div>
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-14 w-full rounded-lg" />
                        <Skeleton className="h-3 w-2/5" />
                        <div className="border-t border-border pt-3">
                            <Skeleton className="h-8 w-full rounded-md" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ── Stat Card ──────────────────────────────────────────────────────────────────

const StatCard = ({
    label, value, icon: Icon, accentCls,
}: {
    label: string; value: number;
    icon: React.ElementType; accentCls: string;
}) => (
    <div className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${accentCls}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background border border-border/60 shadow-sm">
            <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
            <p className="text-xl font-bold leading-none">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
        </div>
    </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────

const ApplicationsManagementContent = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm]     = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-all-applications"],
        queryFn: () => getAllApplications({ limit: "50" }),
    });

    const { mutateAsync: updateStatus } = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            updateApplicationStatus(id, { status }),
        onSuccess: () => {
            toast.success("Application status updated");
            queryClient.invalidateQueries({ queryKey: ["admin-all-applications"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update status"),
    });

    const applications = useMemo(() => (data?.data || []) as any[], [data]);

    // Counts — computed from full list regardless of active filter
    const counts = useMemo(
        () => ({
            total:       applications.length,
            pending:     applications.filter((a) => a.status === "PENDING").length,
            inProgress:  applications.filter((a) => ["SHORTLISTED", "INTERVIEW"].includes(a.status)).length,
            hired:       applications.filter((a) => a.status === "HIRED").length,
            rejected:    applications.filter((a) => a.status === "REJECTED").length,
        }),
        [applications]
    );

    // Client-side filter
    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();
        return applications.filter((app) => {
            const matchStatus = statusFilter === "ALL" || app.status === statusFilter;
            const matchSearch =
                !q ||
                (app.user?.name  || "").toLowerCase().includes(q) ||
                (app.user?.email || "").toLowerCase().includes(q) ||
                (app.job?.title  || "").toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [applications, searchTerm, statusFilter]);

    if (isLoading) return <ApplicationsSkeleton />;

    return (
        <div className="space-y-6">
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/8 via-primary/4 to-transparent p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Job Applications</h1>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Track and manage all job applications
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm font-medium">
                            <Layers className="h-3.5 w-3.5" />
                            {counts.total} total
                        </Badge>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-border/60"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            title="Refresh"
                        >
                            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Total"       value={counts.total}      icon={Layers}       accentCls="border-border/60" />
                <StatCard label="Pending"     value={counts.pending}    icon={Clock}        accentCls="border-amber-200 dark:border-amber-800/50" />
                <StatCard label="In Progress" value={counts.inProgress} icon={CheckCircle2} accentCls="border-blue-200 dark:border-blue-800/50" />
                <StatCard label="Hired"       value={counts.hired}      icon={Users}        accentCls="border-emerald-200 dark:border-emerald-800/50" />
            </div>

            {/* ── Filters ───────────────────────────────────────────────── */}
            <Card className="border-border/60 shadow-sm">
                <CardContent className="space-y-4 pb-5 pt-5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by applicant name, email, or job title…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {STATUS_FILTER_OPTIONS.map((s) => {
                            const count = s === "ALL"
                                ? counts.total
                                : applications.filter((a) => a.status === s).length;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatusFilter(s)}
                                    className={`rounded-full border px-3.5 py-1 text-xs font-medium transition-all duration-150 ${
                                        statusFilter === s
                                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                            : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                    }`}
                                >
                                    {s === "ALL" ? "All" : STATUS_CONFIG[s]?.label || s}
                                    <span className="ml-1.5 opacity-70">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* ── Results info ──────────────────────────────────────────── */}
            <p className="px-0.5 text-sm text-muted-foreground">
                {filtered.length > 0
                    ? `${filtered.length} application${filtered.length !== 1 ? "s" : ""}`
                    : "No results"}
                {isFetching && <span className="ml-2 text-xs text-primary/70">(refreshing…)</span>}
            </p>

            {/* ── Cards ─────────────────────────────────────────────────── */}
            {filtered.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-20 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
                            <AlertCircle className="h-7 w-7 text-muted-foreground/50" />
                        </div>
                        <p className="font-medium text-muted-foreground">No applications found</p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                            Try adjusting your search or filter
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => { setSearchTerm(""); setStatusFilter("ALL"); }}
                        >
                            Clear filters
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {filtered.map((app) => {
                        const cfg  = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.PENDING;
                        const name = app.user?.name || "Unknown Applicant";

                        return (
                            <Card
                                key={app.id}
                                className="group overflow-hidden border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                {/* status strip */}
                                <div className={`h-1 w-full ${cfg.strip}`} />

                                <CardContent className="p-4 space-y-3">
                                    {/* Applicant row */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold shadow-sm ${getAvatarColor(name)}`}
                                        >
                                            {getInitials(name)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold leading-tight">{name}</p>
                                            {app.user?.resume?.professionalTitle && (
                                                <p className="truncate text-xs text-muted-foreground/70 mt-0.5">
                                                    {app.user.resume.professionalTitle}
                                                </p>
                                            )}
                                        </div>
                                        <span
                                            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.badge}`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                            {cfg.label}
                                        </span>
                                    </div>

                                    {/* Email */}
                                    {app.user?.email && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5 shrink-0" />
                                            <span className="truncate">{app.user.email}</span>
                                        </div>
                                    )}

                                    {/* Job details */}
                                    <div className="rounded-lg bg-muted/40 px-3 py-2.5 space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <Briefcase className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                            <span className="truncate font-medium text-foreground/80">
                                                {app.job?.title || "Unknown Job"}
                                            </span>
                                        </div>
                                        {app.job?.company && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Building2 className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">{app.job.company}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Applied date */}
                                    {app.createdAt && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                            <span>
                                                Applied{" "}
                                                {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    )}

                                    {/* Status changer */}
                                    <div className="border-t border-border/50 pt-3">
                                        <Select
                                            defaultValue={app.status}
                                            onValueChange={(status) => updateStatus({ id: app.id, status })}
                                        >
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                                                <SelectItem value="INTERVIEW">Interview</SelectItem>
                                                <SelectItem value="HIRED">Hired</SelectItem>
                                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ApplicationsManagementContent;
