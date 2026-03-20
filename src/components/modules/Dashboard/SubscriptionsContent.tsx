"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubscriptionPlans, purchaseSubscription } from "@/services/subscription.services";
import { UserInfo } from "@/types/user.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCircle, Crown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SubscriptionsContentProps {
    userRole?: "USER" | "RECRUITER" | string;
    userInfo?: UserInfo;
}

const SubscriptionsContent = ({ userInfo }: SubscriptionsContentProps) => {
    const [couponCode, setCouponCode] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [gateway, setGateway] = useState<"STRIPE" | "SSLCOMMERZ">("SSLCOMMERZ");
    const { data: plansData, isLoading: plansLoading } = useQuery({
        queryKey: ["subscription-plans"],
        queryFn: () => getSubscriptionPlans(),
    });

    const { mutateAsync: purchase, isPending } = useMutation({
        mutationFn: (planName: string) => purchaseSubscription({ planName, couponCode: couponCode || undefined, referralCode: referralCode || undefined, gateway }),
        onSuccess: (response: any) => {
            if (response?.data?.redirectUrl) {
                window.location.href = response.data.redirectUrl;
            } else if (response?.data?.url) {
                window.location.href = response.data.url;
            } else if (response?.url) {
                window.location.href = response.url;
            } else if (response?.data?.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                toast.success("Redirecting to payment gateway...");
            }
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to purchase subscription");
        },
    });

    if (plansLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-64 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    const rawPlans: any[] =
        Array.isArray(plansData?.data) ? plansData.data : (plansData?.data as any)?.plans || [];

    const PLAN_DURATIONS: Record<string, number> = {
        FREE: 0,
        MONTHLY: 30,
        QUARTERLY: 90,
        BIANNUAL: 180,
        YEARLY: 365,
    };

    const plans: { durationDays: number; amount: number; plan: string; }[] = rawPlans
        .filter((p: any) => (p.name || p.plan)?.toUpperCase() !== "FREE")
        .map((p: any) => {
            const planName = (p.plan || p.name || "").toUpperCase();
            return {
                plan: planName,
                amount: p.amount ?? 0,
                durationDays: p.durationDays ?? PLAN_DURATIONS[planName] ?? 0,
            };
        });

    const isPremium = userInfo?.isPremium;
    const premiumUntil = userInfo?.premiumUntil;

    const formatPlanName = (plan: string) => {
        if (!plan) return "";
        return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Premium Subscriptions</h1>
                <p className="text-muted-foreground mt-2">Upgrade to Premium to unlock unlimited profile edits, PDF downloads, and priority ATS matching.</p>
            </div>

            {isPremium && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                            <Crown className="w-5 h-5" /> You are a Premium Member
                        </h3>
                        {premiumUntil && (
                            <p className="text-sm text-muted-foreground mt-1">
                                Your premium access is valid until <strong className="text-foreground">{format(new Date(premiumUntil), "PPP")}</strong>.
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4 max-w-xl">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" /> Subscription Setup
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="couponCode">Coupon Code</Label>
                        <Input
                            id="couponCode"
                            placeholder="e.g. SUMMER50"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="referralCode">Referral Code</Label>
                        <Input
                            id="referralCode"
                            placeholder="If referred by a friend"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value)}
                        />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground p-2 bg-muted/50 rounded-md">
                    Note: Referral and Coupon codes are currently used for <strong>tracking purposes only</strong> and will not apply a financial discount to your checkout total.
                </p>

                <div className="space-y-2 pt-2 border-t">
                    <Label htmlFor="gateway" className="font-medium">Selected Payment Gateway</Label>
                    <Select value={gateway} onValueChange={(val: any) => setGateway(val)}>
                        <SelectTrigger id="gateway" className="w-full font-semibold">
                            <SelectValue placeholder="Select Payment Gateway" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SSLCOMMERZ">SSLCommerz (Local BDT Cards/bKash)</SelectItem>
                            <SelectItem value="STRIPE">Stripe (International Debit/Credit)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {plans.map((plan) => (
                    <Card key={plan.plan} className="relative flex flex-col hover:border-primary transition-colors">
                        {plan.plan === "QUARTERLY" && (
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1">Most Popular</Badge>
                        )}
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-2xl">{formatPlanName(plan.plan)}</CardTitle>
                            <p className="text-sm text-muted-foreground">{plan.durationDays} Days Access</p>
                        </CardHeader>
                        <CardContent className="flex-1 text-center pb-6">
                            <div className="my-4">
                                <span className="text-4xl font-extrabold">&#2547;{plan.amount}</span>
                            </div>
                            <ul className="space-y-2 text-sm text-left mt-6">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>Download Custom ATS PDF</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>Unlimited Profile Editing</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>Priority Application Review</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{plan.durationDays} Premium Tag</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full text-md h-12"
                                size="lg"
                                onClick={() => purchase(plan.plan)}
                                disabled={isPending}
                            >
                                {isPending ? "Processing..." : `Subscribe Now`}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionsContent;
