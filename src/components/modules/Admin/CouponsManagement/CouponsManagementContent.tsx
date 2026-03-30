"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { swalDanger } from "@/lib/swal";
import { createCoupon, deleteCoupon, getAllCoupons } from "@/services/coupon.services";
import { CouponTargetRole, CouponType, ICoupon } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    AlertCircle,
    Banknote,
    Calendar,
    CalendarDays,
    CheckCircle2,
    Clock,
    Copy,
    Gift,
    Layers,
    Loader2,
    Percent,
    Plus,
    RefreshCw,
    Share2,
    Star,
    Ticket,
    Trash2,
    Users,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ── Config ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<CouponType, { label: string; cls: string; strip: string; icon: React.ElementType }> = {
    FREE_DAYS: { label: "Free Days", cls: "bg-blue-500/10 text-blue-700 dark:text-blue-400", strip: "bg-blue-500", icon: Gift },
    LIFETIME_FREE: { label: "Lifetime Free", cls: "bg-purple-500/10 text-purple-700 dark:text-purple-400", strip: "bg-purple-500", icon: Star },
    PERCENT_DISCOUNT: { label: "% Discount", cls: "bg-orange-500/10 text-orange-700 dark:text-orange-400", strip: "bg-orange-500", icon: Percent },
    AMOUNT_DISCOUNT: { label: "Amount Off", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400", strip: "bg-amber-500", icon: Banknote },
    RECRUITER_DAYS: { label: "Recruiter Days", cls: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400", strip: "bg-cyan-500", icon: CalendarDays },
    RECRUITER_MONTHS: { label: "Recruiter Months", cls: "bg-teal-500/10 text-teal-700 dark:text-teal-400", strip: "bg-teal-500", icon: Calendar },
    REFERRAL: { label: "Referral", cls: "bg-rose-500/10 text-rose-700 dark:text-rose-400", strip: "bg-rose-500", icon: Share2 },
};

type StatusKey = "ACTIVE" | "USED" | "EXPIRED";
const STATUS_CONFIG: Record<StatusKey, { label: string; badge: string; dot: string }> = {
    ACTIVE: { label: "Active", badge: "bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
    USED: { label: "Used Up", badge: "bg-slate-500/10 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400", dot: "bg-slate-400" },
    EXPIRED: { label: "Expired", badge: "bg-rose-500/10 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400", dot: "bg-rose-500" },
};

const STATUS_FILTER = ["ALL", "ACTIVE", "USED", "EXPIRED"] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function couponSummary(c: ICoupon): string {
    switch (c.type) {
        case "FREE_DAYS": return `${c.freeDays} free days for users`;
        case "LIFETIME_FREE": return "Lifetime premium for users";
        case "PERCENT_DISCOUNT": return `${c.discountPercent}% off subscription`;
        case "AMOUNT_DISCOUNT": return `${c.discountAmount} BDT off subscription`;
        case "RECRUITER_DAYS": return `${c.freeDays} free days for recruiters`;
        case "RECRUITER_MONTHS": return `${c.freeMonths} free months for recruiters`;
        case "REFERRAL": return `User saves ${c.discountAmount} BDT · Recruiter earns ${c.commissionAmount} BDT/use`;
        default: return "";
    }
}

const DEFAULT_FORM = {
    code: "", type: "" as CouponType | "",
    targetRole: "USER" as CouponTargetRole,
    description: "", discountPercent: "", discountAmount: "",
    freeDays: "", freeMonths: "", commissionAmount: "",
    linkedRecruiterId: "", maxUsage: "1", expiresAt: "",
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

const CouponsSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-20 rounded-full" />)}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden">
                    <Skeleton className="h-1 w-full rounded-none" />
                    <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <div className="flex gap-1.5">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                </div>
                            </div>
                            <Skeleton className="h-7 w-7 rounded" />
                        </div>
                        <Skeleton className="h-3 w-3/4" />
                        <div className="space-y-1.5">
                            <div className="flex justify-between">
                                <Skeleton className="h-3 w-12" />
                                <Skeleton className="h-3 w-8" />
                            </div>
                            <Skeleton className="h-1.5 w-full rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, accentCls }: {
    label: string; value: number; icon: React.ElementType; accentCls: string;
}) => (
    <div className={`flex items-center gap-3 rounded-xl border p-3 ${accentCls}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background border border-border/60 shadow-sm">
            <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
            <p className="text-xl font-bold leading-none">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const CouponsManagementContent = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(DEFAULT_FORM);
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    const setField = (key: keyof typeof DEFAULT_FORM, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-coupons"],
        queryFn: () => getAllCoupons(),
    });

    const { mutateAsync: doCreate, isPending: creating } = useMutation({
        mutationFn: (payload: Record<string, unknown>) => createCoupon(payload),
        onSuccess: () => {
            toast.success("Coupon created successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
            setShowForm(false);
            setForm(DEFAULT_FORM);
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to create coupon"),
    });

    const { mutateAsync: doDelete } = useMutation({
        mutationFn: (id: string) => deleteCoupon(id),
        onSuccess: () => {
            toast.success("Coupon deleted");
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete coupon"),
    });

    const allCoupons: ICoupon[] = useMemo(() => data?.data || [], [data]);

    const counts = useMemo(() => ({
        total: allCoupons.length,
        active: allCoupons.filter((c) => c.status === "ACTIVE").length,
        used: allCoupons.filter((c) => c.status === "USED").length,
        expired: allCoupons.filter((c) => c.status === "EXPIRED").length,
    }), [allCoupons]);

    const coupons = useMemo(() => allCoupons.filter((c) => {
        if (filterType !== "all" && c.type !== filterType) return false;
        if (filterStatus !== "ALL" && c.status !== filterStatus) return false;
        return true;
    }), [allCoupons, filterType, filterStatus]);

    if (isLoading) return <CouponsSkeleton />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.type) return toast.error("Please select a coupon type");
        if (!form.code.trim()) return toast.error("Code is required");

        const payload: Record<string, unknown> = {
            code: form.code.trim(), type: form.type,
            targetRole: form.targetRole,
            maxUsage: Number(form.maxUsage) || 1,
        };
        if (form.description) payload.description = form.description;
        if (form.expiresAt) payload.expiresAt = form.expiresAt;
        if (form.type === "FREE_DAYS" || form.type === "RECRUITER_DAYS") payload.freeDays = Number(form.freeDays);
        if (form.type === "RECRUITER_MONTHS") payload.freeMonths = Number(form.freeMonths);
        if (form.type === "PERCENT_DISCOUNT") payload.discountPercent = Number(form.discountPercent);
        if (form.type === "AMOUNT_DISCOUNT") payload.discountAmount = Number(form.discountAmount);
        if (form.type === "REFERRAL") {
            payload.discountAmount = Number(form.discountAmount);
            payload.commissionAmount = Number(form.commissionAmount);
            if (form.linkedRecruiterId) payload.linkedRecruiterId = form.linkedRecruiterId;
        }
        if (form.type === "LIFETIME_FREE") payload.isLifetime = true;
        await doCreate(payload);
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success(`"${code}" copied!`);
    };

    return (
        <div className="space-y-6">
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-orange-500/10 via-amber-500/5 to-transparent p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/5" />
                <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-amber-500/5" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-500/10 shadow-sm">
                            <Ticket className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Coupons Management</h1>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Create and manage discount, subscription & referral coupons
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm font-medium">
                            <Layers className="h-3.5 w-3.5" />
                            {counts.total} coupons
                        </Badge>
                        <Button variant="outline" size="icon" className="h-9 w-9 border-border/60" onClick={() => refetch()} disabled={isFetching}>
                            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        </Button>
                        <Button
                            onClick={() => { setShowForm((s) => !s); setForm(DEFAULT_FORM); }}
                            className="gap-2"
                            variant={showForm ? "outline" : "default"}
                        >
                            {showForm ? <><X className="h-4 w-4" />Cancel</> : <><Plus className="h-4 w-4" />New Coupon</>}
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Total" value={counts.total} icon={Layers} accentCls="border-border/60" />
                <StatCard label="Active" value={counts.active} icon={CheckCircle2} accentCls="border-emerald-200 dark:border-emerald-800/50" />
                <StatCard label="Used Up" value={counts.used} icon={Clock} accentCls="border-slate-200 dark:border-slate-700/50" />
                <StatCard label="Expired" value={counts.expired} icon={AlertCircle} accentCls="border-rose-200 dark:border-rose-800/50" />
            </div>

            {/* ── Create Form ───────────────────────────────────────────── */}
            {showForm && (
                <Card className="overflow-hidden border-border/60 shadow-sm">
                    <div className="h-0.5 w-full bg-orange-500" />
                    <CardHeader className="pb-3 pt-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                                <Ticket className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <CardTitle className="text-base font-semibold">Create New Coupon</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-5">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Row 1: Code + Type */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label>Coupon Code <span className="text-destructive">*</span></Label>
                                    <Input
                                        placeholder="e.g. LAUNCH2026"
                                        value={form.code}
                                        onChange={(e) => setField("code", e.target.value.toUpperCase())}
                                        maxLength={20}
                                        className="font-mono tracking-wide"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Coupon Type <span className="text-destructive">*</span></Label>
                                    <Select value={form.type} onValueChange={(v) => setField("type", v)}>
                                        <SelectTrigger><SelectValue placeholder="Select type…" /></SelectTrigger>
                                        <SelectContent>
                                            {(Object.entries(TYPE_CONFIG) as [CouponType, typeof TYPE_CONFIG[CouponType]][]).map(([val, cfg]) => (
                                                <SelectItem key={val} value={val}>{cfg.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Row 2: Target + Max Usage */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label>Target Role</Label>
                                    <Select value={form.targetRole} onValueChange={(v) => setField("targetRole", v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USER">Users only</SelectItem>
                                            <SelectItem value="RECRUITER">Recruiters only</SelectItem>
                                            <SelectItem value="BOTH">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Max Usage (total uses allowed)</Label>
                                    <Input type="number" min={1} value={form.maxUsage} onChange={(e) => setField("maxUsage", e.target.value)} />
                                </div>
                            </div>

                            {/* Type-specific fields */}
                            {(form.type === "FREE_DAYS" || form.type === "RECRUITER_DAYS") && (
                                <div className="space-y-1.5">
                                    <Label>Free Days <span className="text-destructive">*</span></Label>
                                    <Input type="number" min={1} placeholder="e.g. 30" value={form.freeDays} onChange={(e) => setField("freeDays", e.target.value)} />
                                </div>
                            )}
                            {form.type === "RECRUITER_MONTHS" && (
                                <div className="space-y-1.5">
                                    <Label>Free Months <span className="text-destructive">*</span></Label>
                                    <Input type="number" min={1} placeholder="e.g. 3" value={form.freeMonths} onChange={(e) => setField("freeMonths", e.target.value)} />
                                </div>
                            )}
                            {form.type === "PERCENT_DISCOUNT" && (
                                <div className="space-y-1.5">
                                    <Label>Discount Percentage (%) <span className="text-destructive">*</span></Label>
                                    <Input type="number" min={1} max={100} placeholder="e.g. 30" value={form.discountPercent} onChange={(e) => setField("discountPercent", e.target.value)} />
                                </div>
                            )}
                            {form.type === "AMOUNT_DISCOUNT" && (
                                <div className="space-y-1.5">
                                    <Label>Discount Amount (BDT) <span className="text-destructive">*</span></Label>
                                    <Input type="number" min={1} placeholder="e.g. 200" value={form.discountAmount} onChange={(e) => setField("discountAmount", e.target.value)} />
                                </div>
                            )}
                            {form.type === "REFERRAL" && (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label>User Discount (BDT) <span className="text-destructive">*</span></Label>
                                        <Input type="number" min={1} placeholder="e.g. 200" value={form.discountAmount} onChange={(e) => setField("discountAmount", e.target.value)} />
                                        <p className="text-xs text-muted-foreground">Deducted from user&apos;s subscription price</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Recruiter Commission (BDT) <span className="text-destructive">*</span></Label>
                                        <Input type="number" min={1} placeholder="e.g. 100" value={form.commissionAmount} onChange={(e) => setField("commissionAmount", e.target.value)} />
                                        <p className="text-xs text-muted-foreground">Commission earned per user redemption</p>
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <Label>Linked Recruiter ID (optional)</Label>
                                        <Input placeholder="Recruiter profile ID" value={form.linkedRecruiterId} onChange={(e) => setField("linkedRecruiterId", e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* Description + Expiry */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label>Description (optional)</Label>
                                    <Textarea
                                        placeholder="Internal note about this coupon…"
                                        value={form.description}
                                        onChange={(e) => setField("description", e.target.value)}
                                        rows={2}
                                        className="resize-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Expiry Date (optional)</Label>
                                    <div className="relative">
                                        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input type="date" value={form.expiresAt} onChange={(e) => setField("expiresAt", e.target.value)} className="pl-9" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Leave blank for no expiry</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <Button type="submit" disabled={creating} className="gap-2">
                                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                    {creating ? "Creating…" : "Create Coupon"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(DEFAULT_FORM); }}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* ── Filters ───────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Status quick-pills */}
                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTER.map((s) => {
                        const count = s === "ALL" ? counts.total : allCoupons.filter((c) => c.status === s).length;
                        return (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setFilterStatus(s)}
                                className={`rounded-full border px-3.5 py-1 text-xs font-medium transition-all duration-150 ${filterStatus === s
                                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                    }`}
                            >
                                {s === "ALL" ? "All" : STATUS_CONFIG[s as StatusKey]?.label || s}
                                <span className="ml-1.5 opacity-70">({count})</span>
                            </button>
                        );
                    })}
                </div>

                {/* Type dropdown */}
                <div className="flex items-center gap-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="h-8 w-44 text-xs">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {(Object.entries(TYPE_CONFIG) as [CouponType, typeof TYPE_CONFIG[CouponType]][]).map(([val, cfg]) => (
                                <SelectItem key={val} value={val}>{cfg.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground shrink-0">
                        {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
                        {isFetching && <span className="ml-1 text-primary/70">(refreshing…)</span>}
                    </p>
                </div>
            </div>

            {/* ── Coupons Grid ──────────────────────────────────────────── */}
            {coupons.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-20 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
                            <Ticket className="h-7 w-7 text-muted-foreground/50" />
                        </div>
                        <p className="font-medium text-muted-foreground">
                            {allCoupons.length === 0 ? "No coupons yet" : "No coupons match your filters"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                            {allCoupons.length === 0 ? "Create one to get started" : "Try adjusting your filter criteria"}
                        </p>
                        {(filterType !== "all" || filterStatus !== "ALL") && (
                            <Button variant="outline" size="sm" className="mt-4" onClick={() => { setFilterType("all"); setFilterStatus("ALL"); }}>
                                Clear filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {coupons.map((coupon) => {
                        const typeCfg = TYPE_CONFIG[coupon.type];
                        const statusCfg = STATUS_CONFIG[coupon.status as StatusKey] ?? STATUS_CONFIG.ACTIVE;
                        const TypeIcon = typeCfg?.icon ?? Ticket;
                        const usagePct = coupon.maxUsage > 0 ? Math.min(100, (coupon.usageCount / coupon.maxUsage) * 100) : 0;

                        return (
                            <Card key={coupon.id} className="group overflow-hidden border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                <div className={`h-1 w-full ${typeCfg?.strip ?? "bg-primary"}`} />
                                <CardContent className="p-4 space-y-3">
                                    {/* Top row: code + actions */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${typeCfg?.cls.split(" ")[0] ?? "bg-primary/10"}`}>
                                                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-base tracking-wide">{coupon.code}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyCode(coupon.code)}
                                                        className="text-muted-foreground/50 hover:text-primary transition-colors"
                                                        title="Copy code"
                                                    >
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeCfg?.cls}`}>
                                                        {typeCfg?.label}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.badge}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                                                        {statusCfg.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 shrink-0 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                                            onClick={async () => {
                                                const r = await swalDanger({
                                                    title: "Delete Coupon?",
                                                    text: `Permanently delete "${coupon.code}"? Anyone with this code will no longer be able to use it.`,
                                                    confirmText: "Delete",
                                                });
                                                if (r.isConfirmed) doDelete(coupon.id);
                                            }}
                                            title="Delete coupon"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>

                                    {/* Summary */}
                                    <p className="text-sm text-muted-foreground">{couponSummary(coupon)}</p>
                                    {coupon.description && (
                                        <p className="text-xs text-muted-foreground/70 italic">{coupon.description}</p>
                                    )}

                                    {/* Meta row */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            Target: {coupon.targetRole}
                                        </span>
                                        {coupon.expiresAt && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Expires {formatDistanceToNow(new Date(coupon.expiresAt), { addSuffix: true })}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 text-muted-foreground/60">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(coupon.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>

                                    {/* Usage meter */}
                                    <div className="space-y-1.5 border-t border-border/50 pt-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                Usage: <span className="font-medium text-foreground">{coupon.usageCount}</span>
                                                <span className="text-muted-foreground/60"> / {coupon.maxUsage}</span>
                                            </span>
                                            <span className={`font-semibold ${usagePct >= 100 ? "text-rose-600" : usagePct >= 75 ? "text-amber-600" : "text-emerald-600"}`}>
                                                {Math.round(usagePct)}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className={`h-full rounded-full transition-all ${usagePct >= 100 ? "bg-rose-500" : usagePct >= 75 ? "bg-amber-500" : "bg-emerald-500"}`}
                                                style={{ width: `${usagePct}%` }}
                                            />
                                        </div>
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

export default CouponsManagementContent;
