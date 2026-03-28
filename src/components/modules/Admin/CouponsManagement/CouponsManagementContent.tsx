"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { createCoupon, deleteCoupon, getAllCoupons } from "@/services/coupon.services";
import { CouponTargetRole, CouponType, ICoupon } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Copy, Plus, RefreshCw, Ticket, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── helpers ─────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<CouponType, string> = {
    FREE_DAYS: "Free Days (User)",
    LIFETIME_FREE: "Lifetime Free (User)",
    PERCENT_DISCOUNT: "% Discount (User)",
    AMOUNT_DISCOUNT: "Amount Discount (User)",
    RECRUITER_DAYS: "Free Days (Recruiter)",
    RECRUITER_MONTHS: "Free Months (Recruiter)",
    REFERRAL: "Referral (Affiliate)",
};

const TYPE_COLORS: Record<CouponType, string> = {
    FREE_DAYS: "bg-blue-100 text-blue-800",
    LIFETIME_FREE: "bg-purple-100 text-purple-800",
    PERCENT_DISCOUNT: "bg-orange-100 text-orange-800",
    AMOUNT_DISCOUNT: "bg-amber-100 text-amber-800",
    RECRUITER_DAYS: "bg-cyan-100 text-cyan-800",
    RECRUITER_MONTHS: "bg-teal-100 text-teal-800",
    REFERRAL: "bg-rose-100 text-rose-800",
};

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    USED: "bg-gray-100 text-gray-800",
    EXPIRED: "bg-red-100 text-red-800",
};

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

// ── default form state ───────────────────────────────────────────────────────

const DEFAULT_FORM = {
    code: "",
    type: "" as CouponType | "",
    targetRole: "USER" as CouponTargetRole,
    description: "",
    discountPercent: "",
    discountAmount: "",
    freeDays: "",
    freeMonths: "",
    commissionAmount: "",
    linkedRecruiterId: "",
    maxUsage: "1",
    expiresAt: "",
};

// ── component ────────────────────────────────────────────────────────────────

const CouponsManagementContent = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [form, setForm] = useState(DEFAULT_FORM);
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

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
            setDeleteId(null);
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete coupon"),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.type) return toast.error("Please select a coupon type");
        if (!form.code.trim()) return toast.error("Code is required");

        const payload: Record<string, unknown> = {
            code: form.code.trim(),
            type: form.type,
            targetRole: form.targetRole,
            maxUsage: Number(form.maxUsage) || 1,
        };

        if (form.description) payload.description = form.description;
        if (form.expiresAt) payload.expiresAt = form.expiresAt;

        if (form.type === "FREE_DAYS" || form.type === "RECRUITER_DAYS") {
            payload.freeDays = Number(form.freeDays);
        }
        if (form.type === "RECRUITER_MONTHS") {
            payload.freeMonths = Number(form.freeMonths);
        }
        if (form.type === "PERCENT_DISCOUNT") {
            payload.discountPercent = Number(form.discountPercent);
        }
        if (form.type === "AMOUNT_DISCOUNT") {
            payload.discountAmount = Number(form.discountAmount);
        }
        if (form.type === "REFERRAL") {
            payload.discountAmount = Number(form.discountAmount);
            payload.commissionAmount = Number(form.commissionAmount);
            if (form.linkedRecruiterId) payload.linkedRecruiterId = form.linkedRecruiterId;
        }
        if (form.type === "LIFETIME_FREE") {
            payload.isLifetime = true;
        }

        await doCreate(payload);
    };

    const setField = (key: keyof typeof DEFAULT_FORM, value: string) =>
        setForm(f => ({ ...f, [key]: value }));

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Copied!");
    };

    const allCoupons: ICoupon[] = data?.data || [];
    const coupons = allCoupons.filter(c => {
        if (filterType !== "all" && c.type !== filterType) return false;
        if (filterStatus !== "all" && c.status !== filterStatus) return false;
        return true;
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Coupons Management</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Create and manage discount, subscription, and referral coupons</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{allCoupons.length} total</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                    <Button onClick={() => { setShowForm(s => !s); setForm(DEFAULT_FORM); }}>
                        <Plus className="h-4 w-4 mr-1" />
                        {showForm ? "Cancel" : "New Coupon"}
                    </Button>
                </div>
            </div>

            {/* Create Form */}
            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Ticket className="h-4 w-4" /> Create New Coupon
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Row 1: Code + Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Coupon Code *</Label>
                                    <Input
                                        placeholder="e.g. PRAN2026"
                                        value={form.code}
                                        onChange={e => setField("code", e.target.value.toUpperCase())}
                                        maxLength={20}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Coupon Type *</Label>
                                    <Select value={form.type} onValueChange={v => setField("type", v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(Object.entries(TYPE_LABELS) as [CouponType, string][]).map(([val, label]) => (
                                                <SelectItem key={val} value={val}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Row 2: Target Role + Max Usage */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Target Role</Label>
                                    <Select value={form.targetRole} onValueChange={v => setField("targetRole", v)}>
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
                                    <Input type="number" min={1} value={form.maxUsage} onChange={e => setField("maxUsage", e.target.value)} />
                                </div>
                            </div>

                            {/* Type-specific fields */}
                            {(form.type === "FREE_DAYS" || form.type === "RECRUITER_DAYS") && (
                                <div className="space-y-1.5">
                                    <Label>Free Days *</Label>
                                    <Input type="number" min={1} placeholder="e.g. 30" value={form.freeDays} onChange={e => setField("freeDays", e.target.value)} />
                                </div>
                            )}
                            {form.type === "RECRUITER_MONTHS" && (
                                <div className="space-y-1.5">
                                    <Label>Free Months *</Label>
                                    <Input type="number" min={1} placeholder="e.g. 3" value={form.freeMonths} onChange={e => setField("freeMonths", e.target.value)} />
                                </div>
                            )}
                            {form.type === "PERCENT_DISCOUNT" && (
                                <div className="space-y-1.5">
                                    <Label>Discount Percentage (%) *</Label>
                                    <Input type="number" min={1} max={100} placeholder="e.g. 30" value={form.discountPercent} onChange={e => setField("discountPercent", e.target.value)} />
                                </div>
                            )}
                            {form.type === "AMOUNT_DISCOUNT" && (
                                <div className="space-y-1.5">
                                    <Label>Discount Amount (BDT) *</Label>
                                    <Input type="number" min={1} placeholder="e.g. 200" value={form.discountAmount} onChange={e => setField("discountAmount", e.target.value)} />
                                </div>
                            )}
                            {form.type === "REFERRAL" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>User Discount (BDT) *</Label>
                                        <Input type="number" min={1} placeholder="e.g. 200" value={form.discountAmount} onChange={e => setField("discountAmount", e.target.value)} />
                                        <p className="text-xs text-muted-foreground">Amount deducted from user's subscription price</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Recruiter Commission (BDT) *</Label>
                                        <Input type="number" min={1} placeholder="e.g. 100" value={form.commissionAmount} onChange={e => setField("commissionAmount", e.target.value)} />
                                        <p className="text-xs text-muted-foreground">Commission recruiter earns per user redemption</p>
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <Label>Linked Recruiter ID (optional)</Label>
                                        <Input placeholder="Recruiter's profile ID" value={form.linkedRecruiterId} onChange={e => setField("linkedRecruiterId", e.target.value)} />
                                        <p className="text-xs text-muted-foreground">The recruiter who will share this coupon with users</p>
                                    </div>
                                </div>
                            )}

                            {/* Row: Description + Expiry */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Description (optional)</Label>
                                    <Textarea
                                        placeholder="Internal note about this coupon..."
                                        value={form.description}
                                        onChange={e => setField("description", e.target.value)}
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Expiry Date (optional)</Label>
                                    <Input type="date" value={form.expiresAt} onChange={e => setField("expiresAt", e.target.value)} />
                                    <p className="text-xs text-muted-foreground">Leave blank for no expiry</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={creating}>
                                    {creating ? "Creating..." : "Create Coupon"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(DEFAULT_FORM); }}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {(Object.entries(TYPE_LABELS) as [CouponType, string][]).map(([val, label]) => (
                            <SelectItem key={val} value={val}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="USED">Used Up</SelectItem>
                        <SelectItem value="EXPIRED">Expired</SelectItem>
                    </SelectContent>
                </Select>
                {(filterType !== "all" || filterStatus !== "all") && (
                    <Button variant="ghost" size="sm" onClick={() => { setFilterType("all"); setFilterStatus("all"); }}>
                        Clear filters
                    </Button>
                )}
                <span className="text-sm text-muted-foreground ml-auto">{coupons.length} coupon{coupons.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Coupons List */}
            {coupons.length === 0 ? (
                <Card>
                    <CardContent className="py-14 text-center text-muted-foreground">
                        {allCoupons.length === 0 ? "No coupons yet. Create one to get started." : "No coupons match your filters."}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {coupons.map(coupon => (
                        <Card key={coupon.id}>
                            <CardContent className="py-4">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <Ticket className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            {/* Code + badges */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-mono font-bold text-base">{coupon.code}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => copyCode(coupon.code)}
                                                    className="text-muted-foreground hover:text-foreground"
                                                    title="Copy code"
                                                >
                                                    <Copy className="h-3.5 w-3.5" />
                                                </button>
                                                <Badge className={TYPE_COLORS[coupon.type] + " text-xs"}>
                                                    {TYPE_LABELS[coupon.type]}
                                                </Badge>
                                                <Badge className={STATUS_COLORS[coupon.status] + " text-xs"}>
                                                    {coupon.status}
                                                </Badge>
                                            </div>

                                            {/* Summary line */}
                                            <p className="text-sm text-muted-foreground mt-0.5">{couponSummary(coupon)}</p>

                                            {/* Description */}
                                            {coupon.description && (
                                                <p className="text-xs text-muted-foreground mt-0.5 italic">{coupon.description}</p>
                                            )}

                                            {/* Meta row */}
                                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3.5 w-3.5" />
                                                    {coupon.usageCount} / {coupon.maxUsage} used
                                                </span>
                                                <span>Target: {coupon.targetRole}</span>
                                                {coupon.expiresAt && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        Expires {formatDistanceToNow(new Date(coupon.expiresAt), { addSuffix: true })}
                                                    </span>
                                                )}
                                                {coupon.linkedRecruiterId && (
                                                    <span>Recruiter ID: <span className="font-mono">{coupon.linkedRecruiterId.slice(0, 8)}…</span></span>
                                                )}
                                                <span className="text-muted-foreground/60">
                                                    Created {formatDistanceToNow(new Date(coupon.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Usage bar + delete */}
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        {/* Usage progress */}
                                        <div className="w-32">
                                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                <span>Usage</span>
                                                <span>{Math.round((coupon.usageCount / coupon.maxUsage) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all"
                                                    style={{ width: `${Math.min(100, (coupon.usageCount / coupon.maxUsage) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => setDeleteId(coupon.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Coupon?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the coupon. Anyone who has the code will no longer be able to use it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => deleteId && doDelete(deleteId)}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default CouponsManagementContent;
