"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { httpClient } from "@/lib/axios/httpClient";
import { getSubscriptionPlans } from "@/services/subscription.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Pencil, RefreshCw, Rocket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type TimelinePreset = "LIFETIME" | "MONTHLY" | "THREE_MONTHS" | "SIX_MONTHS" | "YEARLY" | "CUSTOM";

interface PlanFormState {
    amount: string;
    description: string;
    timelinePreset: TimelinePreset;
    customDays: string;
    featuresText: string;
}

const getTimelinePresetFromDays = (durationDays?: number | null): TimelinePreset => {
    if (durationDays === null || durationDays === undefined) return "LIFETIME";
    if (durationDays === 30) return "MONTHLY";
    if (durationDays === 90) return "THREE_MONTHS";
    if (durationDays === 180) return "SIX_MONTHS";
    if (durationDays === 365) return "YEARLY";
    return "CUSTOM";
};

const getTimelineLabel = (durationDays?: number | null) => {
    if (durationDays === null || durationDays === undefined) return "Lifetime";
    return `${durationDays} days`;
};

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
        mutationFn: ({ planKey, payload }: { planKey: string; payload: Record<string, unknown> }) =>
            httpClient.patch(`/admins/subscription-plans/${planKey}`, payload),
        onSuccess: () => {
            toast.success("Subscription plan updated successfully");
            setEditingPlan(null);
            queryClient.invalidateQueries({ queryKey: ["admin-subscription-plans"] });
            queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error?.message || "Failed to update subscription plan");
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-48 rounded-lg max-w-lg" />
            </div>
        );
    }

    const plans: any[] = (data?.data as any)?.plans || [];
    const userPlans = plans.filter((plan) => !plan.recruiterOnly);
    const recruiterPlans = plans.filter((plan) => plan.recruiterOnly);

    const isCustomTimeline = form.timelinePreset === "CUSTOM";

    const roleLabel = editingPlan ? (editingPlan.recruiterOnly ? "Recruiter Plan" : "User Plan") : "";

    const openEditDialog = (plan: any) => {
        const timelinePreset = getTimelinePresetFromDays(plan.durationDays);
        setEditingPlan(plan);
        setForm({
            amount: String(plan.amount ?? ""),
            description: plan.description ?? "",
            timelinePreset,
            customDays: timelinePreset === "CUSTOM" ? String(plan.durationDays ?? "") : "",
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
            const parsedCustomDays = Number(form.customDays);
            if (!Number.isInteger(parsedCustomDays) || parsedCustomDays <= 0) {
                toast.error("Custom timeline must be a positive whole number of days");
                return;
            }
            customDays = parsedCustomDays;
        }

        const features = form.featuresText
            .split("\n")
            .map((item) => item.trim())
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

    const renderPlanCard = (plan: any) => (
        <Card key={plan.planKey || plan.name} className="border-primary/60 hover:border-primary transition-colors">
            <CardHeader>
                <div className="flex items-center justify-between gap-3">
                    <div className="space-y-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Rocket className="h-5 w-5 text-primary" />
                            {plan.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={plan.recruiterOnly ? "secondary" : "default"}>
                                {plan.recruiterOnly ? "Recruiter Plan" : "User Plan"}
                            </Badge>
                            <Badge variant="outline">{getTimelineLabel(plan.durationDays)}</Badge>
                        </div>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => openEditDialog(plan)}>
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">&#2547;{plan.amount}</span>
                    <span className="text-muted-foreground">/ one-time</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                {plan.features && plan.features.length > 0 && (
                    <ul className="space-y-1.5">
                        {plan.features.map((feature: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Subscriptions Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Plans are grouped by target audience so admins can quickly manage the right package.
                    </p>
                </div>
                <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                    <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card>
                    <CardContent className="py-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">User Plans</p>
                        <p className="text-2xl font-semibold mt-1">{userPlans.length}</p>
                        <p className="text-sm text-muted-foreground">For regular users and career seekers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Recruiter Plans</p>
                        <p className="text-2xl font-semibold mt-1">{recruiterPlans.length}</p>
                        <p className="text-sm text-muted-foreground">For recruiters and hiring teams</p>
                    </CardContent>
                </Card>
            </div>

            {plans.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No subscription plans found.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">User Subscriptions</h2>
                            <Badge variant="secondary">{userPlans.length} plan{userPlans.length === 1 ? "" : "s"}</Badge>
                        </div>
                        {userPlans.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No user subscription plans available.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {userPlans.map(renderPlanCard)}
                            </div>
                        )}
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Recruiter Subscriptions</h2>
                            <Badge variant="secondary">{recruiterPlans.length} plan{recruiterPlans.length === 1 ? "" : "s"}</Badge>
                        </div>
                        {recruiterPlans.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No recruiter subscription plans available.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {recruiterPlans.map(renderPlanCard)}
                            </div>
                        )}
                    </section>
                </div>
            )}

            <Dialog open={Boolean(editingPlan)} onOpenChange={(open) => !open && setEditingPlan(null)}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Subscription Plan</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                            Plan: <span className="font-medium text-foreground">{editingPlan?.name}</span> ({roleLabel})
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (BDT)</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="1"
                                value={form.amount}
                                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timeline">Timeline</Label>
                            <Select
                                value={form.timelinePreset}
                                onValueChange={(value: TimelinePreset) => setForm((prev) => ({ ...prev, timelinePreset: value }))}
                            >
                                <SelectTrigger id="timeline">
                                    <SelectValue placeholder="Select timeline" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LIFETIME">Lifetime</SelectItem>
                                    <SelectItem value="MONTHLY">Monthly (30 days)</SelectItem>
                                    <SelectItem value="THREE_MONTHS">3 Months (90 days)</SelectItem>
                                    <SelectItem value="SIX_MONTHS">6 Months (180 days)</SelectItem>
                                    <SelectItem value="YEARLY">Yearly (365 days)</SelectItem>
                                    <SelectItem value="CUSTOM">Custom Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {isCustomTimeline && (
                            <div className="space-y-2">
                                <Label htmlFor="customDays">Custom Days</Label>
                                <Input
                                    id="customDays"
                                    type="number"
                                    min="1"
                                    value={form.customDays}
                                    onChange={(e) => setForm((prev) => ({ ...prev, customDays: e.target.value }))}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={form.description}
                                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="features">Features (one per line)</Label>
                            <Textarea
                                id="features"
                                value={form.featuresText}
                                onChange={(e) => setForm((prev) => ({ ...prev, featuresText: e.target.value }))}
                                rows={6}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditingPlan(null)} disabled={isUpdating}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleUpdatePlan} disabled={isUpdating}>
                            {isUpdating ? "Updating..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SubscriptionsManagementContent;
