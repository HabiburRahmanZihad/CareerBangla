"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { httpClient } from "@/lib/axios/httpClient";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { getSubscriptionPlans } from "@/services/subscription.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Briefcase,
    CheckCircle2,
    CreditCard,
    Loader2,
    Pencil,
    RefreshCw,
    Rocket,
    TrendingUp,
    Users,
    Zap
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SectionBanner } from "./SectionBanner";
import { PlanCard } from "./SubscriptionPlanCard";
import { SubsSkeleton } from "./SubscriptionsSkeleton";
import { getTimelinePresetFromDays, PlanFormState, STYLES, TimelinePreset } from "./subscriptions.utils";

// ── Main Component ────────────────────────────────────────────────────────────

const SubscriptionsManagementContent = () => {
    const queryClient = useQueryClient();
    const [editingPlan, setEditingPlan] = useState<any | null>(null);
    const [form, setForm] = useState<PlanFormState>({
        amount: "",
        description: "",
        timelinePreset: "LIFETIME",
        customDays: "",
        featuresText: "",
    });

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-subscription-plans"],
        queryFn: () => getSubscriptionPlans(),
    });

    const { mutateAsync: updatePlanMutate, isPending: isUpdating } = useMutation({
        mutationFn: ({
            planKey,
            payload,
        }: {
            planKey: string;
            payload: Record<string, unknown>;
        }) => httpClient.patch(`/admins/subscription-plans/${planKey}`, payload),
        onSuccess: () => {
            toast.success("Subscription plan updated successfully");
            setEditingPlan(null);
            queryClient.invalidateQueries({ queryKey: ["admin-subscription-plans"] });
            queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
        },
        onError: (error: any) => {
            toast.error(getRequestErrorMessage(error, "Failed to update subscription plan"));
        },
    });

    if (isLoading) return <SubsSkeleton />;

    const plans: any[] = (data?.data as any)?.plans || [];
    const userPlans = plans.filter((p) => !p.recruiterOnly);
    const recruiterPlans = plans.filter((p) => p.recruiterOnly);
    const isCustomTimeline = form.timelinePreset === "CUSTOM";

    const openEditDialog = (plan: any) => {
        const preset = getTimelinePresetFromDays(plan.durationDays);
        setEditingPlan(plan);
        setForm({
            amount: String(plan.amount ?? ""),
            description: plan.description ?? "",
            timelinePreset: preset,
            customDays: preset === "CUSTOM" ? String(plan.durationDays ?? "") : "",
            featuresText: Array.isArray(plan.features) ? plan.features.join("\n") : "",
        });
    };

    const handleUpdatePlan = async () => {
        if (!editingPlan) return;
        const parsedAmount = Number(form.amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            toast.error("Amount must be a positive number");
            return;
        }
        let customDays: number | undefined;
        if (isCustomTimeline) {
            const parsed = Number(form.customDays);
            if (!Number.isInteger(parsed) || parsed <= 0) {
                toast.error("Custom timeline must be a positive whole number of days");
                return;
            }
            customDays = parsed;
        }
        const features = form.featuresText
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);
        await updatePlanMutate({
            planKey: editingPlan.planKey,
            payload: {
                amount: parsedAmount,
                description: form.description,
                features,
                timelinePreset: form.timelinePreset,
                ...(customDays ? { customDays } : {}),
            },
        });
    };

    return (
        <div className="space-y-8 py-2">
            {/* ── Premium Header ────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/8 via-primary/4 to-transparent p-6 sm:p-8">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-linear-to-br from-primary/20 to-primary/10 shadow-lg">
                            <CreditCard className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                Subscriptions Management
                            </h1>
                            <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                                Configure pricing plans and manage subscription features
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 border-border/60 hover:bg-muted/80"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        title="Refresh subscriptions"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* ── Stat cards ───────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                    {
                        label: "Total Plans",
                        value: plans.length,
                        icon: CreditCard,
                        cls: "text-primary",
                        bg: "bg-primary/10",
                        border: "border-primary/20",
                        trend: "+0%",
                    },
                    {
                        label: "User Plans",
                        value: userPlans.length,
                        icon: Users,
                        cls: "text-emerald-600 dark:text-emerald-400",
                        bg: "bg-emerald-500/10",
                        border: "border-emerald-200 dark:border-emerald-800",
                        trend: "+0%",
                    },
                    {
                        label: "Recruiter Plans",
                        value: recruiterPlans.length,
                        icon: Briefcase,
                        cls: "text-violet-600 dark:text-violet-400",
                        bg: "bg-violet-500/10",
                        border: "border-violet-200 dark:border-violet-800",
                        trend: "+0%",
                    },
                    {
                        label: "Total Features",
                        value: plans.reduce(
                            (sum, p) => sum + (Array.isArray(p.features) ? p.features.length : 0),
                            0
                        ),
                        icon: Zap,
                        cls: "text-blue-600 dark:text-blue-400",
                        bg: "bg-blue-500/10",
                        border: "border-blue-200 dark:border-blue-800",
                        trend: "+0%",
                    },
                ].map(({ label, value, icon: Icon, cls, bg, border, trend }) => (
                    <div key={label} className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-md hover:border-border/80 ${border}`}>
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-br from-foreground/5 via-transparent to-transparent" />
                        <div className="relative space-y-3">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} transition-transform duration-300 group-hover:scale-110`}>
                                <Icon className={`h-5 w-5 ${cls}`} />
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold tabular-nums">{value}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs leading-tight text-muted-foreground font-medium">{label}</p>
                                    <span className="text-[10px] font-semibold text-emerald-600">{trend}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Plans Section ────────────────────────────────────────────────────────── */}
            {plans.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-20 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-muted to-muted/60">
                            <CreditCard className="h-9 w-9 text-muted-foreground/40" />
                        </div>
                        <p className="text-base font-semibold text-muted-foreground">
                            No subscription plans found
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create your first subscription plan to get started
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    {/* ── User Plans ──────────────────────────────────────────────────── */}
                    <section className="space-y-4">
                        <SectionBanner
                            title="User Subscriptions"
                            count={userPlans.length}
                            icon={Users}
                            grad={STYLES.user.sectionGrad}
                            border={STYLES.user.sectionBorder}
                            iconCls={STYLES.user.sectionIcon}
                        />
                        {userPlans.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                                    No user subscription plans available.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
                                {userPlans.map((plan) => (
                                    <PlanCard
                                        key={plan.planKey || plan.name}
                                        plan={plan}
                                        onEdit={openEditDialog}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── Recruiter Plans ─────────────────────────────────────────────── */}
                    <section className="space-y-4">
                        <SectionBanner
                            title="Recruiter Subscriptions"
                            count={recruiterPlans.length}
                            icon={Briefcase}
                            grad={STYLES.recruiter.sectionGrad}
                            border={STYLES.recruiter.sectionBorder}
                            iconCls={STYLES.recruiter.sectionIcon}
                        />
                        {recruiterPlans.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                                    No recruiter subscription plans available.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
                                {recruiterPlans.map((plan) => (
                                    <PlanCard
                                        key={plan.planKey || plan.name}
                                        plan={plan}
                                        onEdit={openEditDialog}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}

            {/* ── Edit dialog ───────────────────────────────────────────────────────── */}
            <Dialog
                open={Boolean(editingPlan)}
                onOpenChange={(open) => !open && setEditingPlan(null)}
            >
                <DialogContent className="max-w-3xl max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0">
                    {/* ── Premium Header ────────────────────────── */}
                    <div className="relative overflow-hidden bg-linear-to-r from-primary/15 via-primary/10 to-primary/5 px-6 py-5 border-b border-border/60">
                        <div className="pointer-events-none absolute inset-0 opacity-30" />
                        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

                        <div className="relative flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 shadow-lg">
                                    <Pencil className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold">Edit Subscription Plan</DialogTitle>
                                    <p className="text-xs text-muted-foreground mt-1">Update pricing, features, and plan details</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Plan Identity Card ────────────────────────── */}
                    {editingPlan && (
                        <div className="px-6 pt-5 pb-4 border-b border-border/60">
                            <div className="rounded-xl bg-linear-to-br from-muted/60 to-muted/30 p-4 border border-border/40">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${editingPlan.recruiterOnly ? "bg-violet-500/15" : "bg-emerald-500/15"}`}>
                                            {editingPlan.recruiterOnly ? (
                                                <Briefcase className={`h-6 w-6 ${editingPlan.recruiterOnly ? "text-violet-600" : "text-emerald-600"}`} />
                                            ) : (
                                                <Rocket className={`h-6 w-6 ${editingPlan.recruiterOnly ? "text-violet-600" : "text-emerald-600"}`} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-foreground truncate">{editingPlan.name}</p>
                                            <p className="text-[11px] text-muted-foreground">
                                                <span className="font-mono">{editingPlan.planKey}</span> • {editingPlan.recruiterOnly ? "Recruiter" : "User"} Plan
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        className={
                                            editingPlan.recruiterOnly
                                                ? STYLES.recruiter.badge
                                                : STYLES.user.badge
                                        }
                                    >
                                        {editingPlan.recruiterOnly ? "👔 Recruiter" : "🚀 User"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Content Scroll Area ────────────────────────── */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-6 px-6 py-5">
                            {/* ── Section 1: Pricing ────────────────────── */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <CreditCard className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Pricing Information</h3>
                                        <p className="text-xs text-muted-foreground">Set the price and duration for this plan</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Amount Input */}
                                    <div className="space-y-2.5">
                                        <Label htmlFor="amount" className="font-semibold text-sm">
                                            Amount (BDT) <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">&#2547;</span>
                                            <Input
                                                id="amount"
                                                type="number"
                                                min="1"
                                                placeholder="999"
                                                value={form.amount}
                                                onChange={(e) =>
                                                    setForm((prev) => ({ ...prev, amount: e.target.value }))
                                                }
                                                className="pl-8 text-lg font-semibold"
                                            />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">Add a realistic price for your plan</p>
                                    </div>

                                    {/* Duration Select */}
                                    <div className="space-y-2.5">
                                        <Label htmlFor="timeline" className="font-semibold text-sm">
                                            Duration <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={form.timelinePreset}
                                            onValueChange={(value: TimelinePreset) =>
                                                setForm((prev) => ({ ...prev, timelinePreset: value }))
                                            }
                                        >
                                            <SelectTrigger id="timeline" className="text-base">
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LIFETIME">♾️ Lifetime Access</SelectItem>
                                                <SelectItem value="MONTHLY">📅 Monthly (30 days)</SelectItem>
                                                <SelectItem value="THREE_MONTHS">
                                                    📅 3 Months (90 days)
                                                </SelectItem>
                                                <SelectItem value="SIX_MONTHS">
                                                    📅 6 Months (180 days)
                                                </SelectItem>
                                                <SelectItem value="YEARLY">📅 Yearly (365 days)</SelectItem>
                                                <SelectItem value="CUSTOM">⚙️ Custom Duration</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[11px] text-muted-foreground">Choose how long the subscription lasts</p>
                                    </div>
                                </div>

                                {/* Custom Days Input */}
                                {isCustomTimeline && (
                                    <div className="space-y-2.5 rounded-lg bg-primary/5 border border-primary/20 p-4">
                                        <Label htmlFor="customDays" className="font-semibold text-sm">
                                            Custom Days <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="customDays"
                                            type="number"
                                            min="1"
                                            placeholder="e.g. 60"
                                            value={form.customDays}
                                            onChange={(e) =>
                                                setForm((prev) => ({ ...prev, customDays: e.target.value }))
                                            }
                                            className="text-lg font-semibold"
                                        />
                                        <p className="text-[11px] text-muted-foreground">Specify duration in days</p>
                                    </div>
                                )}
                            </div>

                            {/* ── Divider ────────────────────────── */}
                            <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

                            {/* ── Section 2: Description ────────────────────── */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <TrendingUp className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Plan Details</h3>
                                        <p className="text-xs text-muted-foreground">Describe what makes this plan special</p>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="description" className="font-semibold text-sm">
                                            Description
                                        </Label>
                                        <span className="text-xs text-muted-foreground">
                                            {form.description.length} / 200
                                        </span>
                                    </div>
                                    <Textarea
                                        id="description"
                                        value={form.description}
                                        rows={3}
                                        maxLength={200}
                                        placeholder="e.g., Full year of premium features. Save 33% compared to monthly."
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, description: e.target.value }))
                                        }
                                        className="text-sm"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        ✓ Write a compelling description for your customers
                                    </p>
                                </div>
                            </div>

                            {/* ── Divider ────────────────────────── */}
                            <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

                            {/* ── Section 3: Features ────────────────────── */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <Zap className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Features & Benefits</h3>
                                        <p className="text-xs text-muted-foreground">List what customers get with this plan</p>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="features" className="font-semibold text-sm">
                                            Features <span className="text-[11px] font-normal text-muted-foreground">(one per line)</span>
                                        </Label>
                                        <span className="text-xs font-semibold text-primary">
                                            {form.featuresText.split("\n").filter((l) => l.trim()).length} items
                                        </span>
                                    </div>
                                    <Textarea
                                        id="features"
                                        value={form.featuresText}
                                        rows={6}
                                        placeholder={`✓ Unlimited applications\n✓ Priority customer support\n✓ Resume builder & templates\n✓ Advanced job matching\n✓ Portfolio showcasing`}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, featuresText: e.target.value }))
                                        }
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        💡 Tip: Start each feature with ✓ or • for better formatting
                                    </p>
                                </div>
                            </div>

                            {/* ── Features Preview ────────────────────── */}
                            {form.featuresText.split("\n").filter((l) => l.trim()).length > 0 && (
                                <div className="rounded-xl bg-linear-to-br from-emerald-500/5 via-emerald-500/3 to-transparent border border-emerald-200/40 dark:border-emerald-800/40 p-5 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                            Live Preview
                                        </p>
                                    </div>
                                    <ul className="space-y-2">
                                        {form.featuresText
                                            .split("\n")
                                            .filter((l) => l.trim())
                                            .slice(0, 5)
                                            .map((feat, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span className="text-muted-foreground">{feat.trim()}</span>
                                                </li>
                                            ))}
                                    </ul>
                                    {form.featuresText.split("\n").filter((l) => l.trim()).length > 5 && (
                                        <div className="pt-2 border-t border-emerald-200/30 dark:border-emerald-800/30">
                                            <p className="text-xs text-muted-foreground">
                                                <strong>+{form.featuresText.split("\n").filter((l) => l.trim()).length - 5} more features</strong> included in this plan
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Premium Footer ────────────────────────── */}
                    <div className="border-t border-border/60 bg-linear-to-r from-muted/30 to-muted/10 px-6 py-4 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditingPlan(null)}
                            disabled={isUpdating}
                            className="px-6 h-10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpdatePlan}
                            disabled={isUpdating}
                            className="gap-2 px-8 h-10 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Updating…
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SubscriptionsManagementContent;
