"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    getCouponUsageTracking,
    getReferralTracking,
    type ICouponUsage,
    type IReferralHistory,
} from "@/services/tracking.services";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Activity,
    BarChart3,
    CheckCircle2,
    RefreshCw,
    Ticket,
    TrendingUp,
    Users,
} from "lucide-react";
import { useMemo } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────

const getInitials = (name: string) => {
    if (!name) return "?";
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

const AVATAR_COLORS = [
    "bg-blue-500",
    "bg-violet-500",
    "bg-emerald-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-rose-500",
];

const avatarColor = (name: string) => {
    const sum = (name || "").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

// ── Loading skeleton ──────────────────────────────────────────────────────────

const TrackingSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
        </div>
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="rounded-xl border border-border overflow-hidden">
            <Skeleton className="h-11 w-full rounded-none" />
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-none mt-px" />
            ))}
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

export default function TrackingDashboardContent() {
    const {
        data: referralData,
        isLoading: refsLoading,
        isFetching: refsFetching,
        refetch: refetchRefs,
    } = useQuery({
        queryKey: ["tracking-referrals"],
        queryFn: () => getReferralTracking(1, 100),
    });

    const {
        data: couponData,
        isLoading: couponsLoading,
        isFetching: couponsFetching,
        refetch: refetchCoupons,
    } = useQuery({
        queryKey: ["tracking-coupons"],
        queryFn: () => getCouponUsageTracking(1, 100),
    });

    const isRefreshing = refsFetching || couponsFetching;
    const handleRefresh = () => {
        refetchRefs();
        refetchCoupons();
    };

    const referrals: IReferralHistory[] = useMemo(
        () => referralData?.data?.data || [],
        [referralData]
    );
    const coupons: ICouponUsage[] = useMemo(
        () => couponData?.data?.data || [],
        [couponData]
    );

    const paidReferrals = useMemo(
        () => referrals.filter((r) => r.hasPaid).length,
        [referrals]
    );
    const conversionRate = useMemo(
        () =>
            referrals.length > 0
                ? Math.round((paidReferrals / referrals.length) * 100)
                : 0,
        [referrals, paidReferrals]
    );
    const totalCouponUses = useMemo(
        () => coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0),
        [coupons]
    );

    if (refsLoading && couponsLoading) return <TrackingSkeleton />;

    return (
        <div className="space-y-6">
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-indigo-500/10 via-indigo-500/5 to-transparent p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/5" />
                <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-indigo-500/5" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-500/10 shadow-sm">
                            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                                System Tracking
                            </h1>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Monitor referral conversions and coupon usage analytics
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0 self-start border-border/60 sm:self-center"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        title="Refresh"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* ── Stat cards ───────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(
                    [
                        {
                            label: "Total Referrals",
                            value: referrals.length,
                            icon: Users,
                            cls: "text-indigo-600 dark:text-indigo-400",
                            bg: "bg-indigo-500/10",
                            border: "border-indigo-200 dark:border-indigo-800",
                        },
                        {
                            label: "Paid Referrals",
                            value: paidReferrals,
                            icon: CheckCircle2,
                            cls: "text-emerald-600 dark:text-emerald-400",
                            bg: "bg-emerald-500/10",
                            border: "border-emerald-200 dark:border-emerald-800",
                        },
                        {
                            label: "Conversion Rate",
                            value: `${conversionRate}%`,
                            icon: TrendingUp,
                            cls: "text-violet-600 dark:text-violet-400",
                            bg: "bg-violet-500/10",
                            border: "border-violet-200 dark:border-violet-800",
                        },
                        {
                            label: "Coupon Uses",
                            value: totalCouponUses,
                            icon: Ticket,
                            cls: "text-orange-600 dark:text-orange-400",
                            bg: "bg-orange-500/10",
                            border: "border-orange-200 dark:border-orange-800",
                        },
                    ] as const
                ).map(({ label, value, icon: Icon, cls, bg, border }) => (
                    <div
                        key={label}
                        className={`rounded-xl border p-4 space-y-2 ${border}`}
                    >
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}
                        >
                            <Icon className={`h-4 w-4 ${cls}`} />
                        </div>
                        <p className="text-2xl font-bold tabular-nums">{value}</p>
                        <p className="text-xs text-muted-foreground leading-tight">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Tabs ─────────────────────────────────────────────────── */}
            <Tabs defaultValue="referrals" className="w-full">
                <TabsList className="h-10 rounded-lg p-1">
                    <TabsTrigger value="referrals" className="gap-2 rounded-md px-4">
                        <Activity className="h-4 w-4" />
                        Referrals
                        <Badge
                            variant="secondary"
                            className="ml-0.5 h-5 min-w-5 px-1.5 text-[10px]"
                        >
                            {referrals.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="coupons" className="gap-2 rounded-md px-4">
                        <Ticket className="h-4 w-4" />
                        Coupons
                        <Badge
                            variant="secondary"
                            className="ml-0.5 h-5 min-w-5 px-1.5 text-[10px]"
                        >
                            {coupons.length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>

                {/* ── Referrals tab ──────────────────────────────────────── */}
                <TabsContent value="referrals" className="mt-4">
                    <Card className="border-border/60 shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            {refsLoading ? (
                                <div className="space-y-px p-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-14 w-full rounded-md" />
                                    ))}
                                </div>
                            ) : referrals.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
                                        <Users className="h-7 w-7 text-muted-foreground/50" />
                                    </div>
                                    <p className="font-medium text-muted-foreground">
                                        No referrals tracked yet
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground/60">
                                        Paid referral conversions will appear here
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-border/60 hover:bg-transparent">
                                                <TableHead className="h-11 pl-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Date
                                                </TableHead>
                                                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Code
                                                </TableHead>
                                                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Referrer
                                                </TableHead>
                                                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Referred User
                                                </TableHead>
                                                <TableHead className="h-11 pr-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Status
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {referrals.map((ref) => (
                                                <TableRow
                                                    key={ref.id}
                                                    className="border-b border-border/40 transition-colors hover:bg-muted/30"
                                                >
                                                    <TableCell className="pl-4 py-3">
                                                        <div className="text-sm tabular-nums">
                                                            {ref.paidAt
                                                                ? format(new Date(ref.paidAt), "MMM dd, yyyy")
                                                                : "—"}
                                                        </div>
                                                        {ref.paidAt && (
                                                            <div className="text-[11px] text-muted-foreground tabular-nums">
                                                                {format(new Date(ref.paidAt), "HH:mm")}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 font-mono text-xs font-semibold tracking-widest">
                                                            {ref.referrer?.referralCode || "—"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2.5">
                                                            <div
                                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${avatarColor(ref.referrer?.name || "")}`}
                                                            >
                                                                {getInitials(ref.referrer?.name || "")}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-medium leading-tight truncate max-w-36">
                                                                    {ref.referrer?.name || "—"}
                                                                </div>
                                                                <div className="text-[11px] text-muted-foreground truncate max-w-36">
                                                                    {ref.referrer?.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2.5">
                                                            <div
                                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${avatarColor(ref.referredUser?.name || "")}`}
                                                            >
                                                                {getInitials(ref.referredUser?.name || "")}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-medium leading-tight truncate max-w-36">
                                                                    {ref.referredUser?.name || "—"}
                                                                </div>
                                                                <div className="text-[11px] text-muted-foreground truncate max-w-36">
                                                                    {ref.referredUser?.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="pr-4">
                                                        {ref.hasPaid ? (
                                                            <Badge className="gap-1.5 border border-emerald-200 dark:border-emerald-800 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                                PAID
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="secondary"
                                                                className="font-medium"
                                                            >
                                                                UNPAID
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Coupons tab ─────────────────────────────────────────── */}
                <TabsContent value="coupons" className="mt-4">
                    <Card className="border-border/60 shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            {couponsLoading ? (
                                <div className="space-y-px p-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-14 w-full rounded-md" />
                                    ))}
                                </div>
                            ) : coupons.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
                                        <Ticket className="h-7 w-7 text-muted-foreground/50" />
                                    </div>
                                    <p className="font-medium text-muted-foreground">
                                        No coupon usage yet
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground/60">
                                        Coupon redemption history will appear here
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-border/60 hover:bg-transparent">
                                                <TableHead className="h-11 pl-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Last Used
                                                </TableHead>
                                                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Code
                                                </TableHead>
                                                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Usage
                                                </TableHead>
                                                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Progress
                                                </TableHead>
                                                <TableHead className="h-11 pr-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    Status
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {coupons.map((coupon) => {
                                                const pct =
                                                    coupon.maxUsage > 0
                                                        ? Math.min(
                                                              100,
                                                              Math.round(
                                                                  (coupon.usageCount /
                                                                      coupon.maxUsage) *
                                                                      100
                                                              )
                                                          )
                                                        : 0;
                                                const barCls =
                                                    pct >= 100
                                                        ? "bg-rose-500"
                                                        : pct >= 75
                                                          ? "bg-amber-500"
                                                          : "bg-emerald-500";
                                                return (
                                                    <TableRow
                                                        key={coupon.id}
                                                        className="border-b border-border/40 transition-colors hover:bg-muted/30"
                                                    >
                                                        <TableCell className="pl-4 py-3">
                                                            <div className="text-sm tabular-nums">
                                                                {coupon.usedAt
                                                                    ? format(
                                                                          new Date(coupon.usedAt),
                                                                          "MMM dd, yyyy"
                                                                      )
                                                                    : "—"}
                                                            </div>
                                                            {coupon.usedAt && (
                                                                <div className="text-[11px] text-muted-foreground tabular-nums">
                                                                    {format(
                                                                        new Date(coupon.usedAt),
                                                                        "HH:mm"
                                                                    )}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 font-mono text-xs font-bold tracking-widest">
                                                                {coupon.code}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-sm font-semibold tabular-nums">
                                                                {coupon.usageCount}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {" "}
                                                                / {coupon.maxUsage}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex min-w-28 items-center gap-2">
                                                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all ${barCls}`}
                                                                        style={{ width: `${pct}%` }}
                                                                    />
                                                                </div>
                                                                <span className="w-8 text-right text-[11px] font-medium tabular-nums text-muted-foreground">
                                                                    {pct}%
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="pr-4">
                                                            {coupon.status === "ACTIVE" ? (
                                                                <Badge className="gap-1.5 border border-emerald-200 dark:border-emerald-800 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                                    ACTIVE
                                                                </Badge>
                                                            ) : coupon.status === "USED" ? (
                                                                <Badge className="gap-1.5 border border-slate-200 dark:border-slate-700 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-medium">
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                                                                    USED
                                                                </Badge>
                                                            ) : (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="font-medium"
                                                                >
                                                                    {coupon.status}
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
