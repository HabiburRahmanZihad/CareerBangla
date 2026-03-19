"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubscriptionPlans, purchaseSubscription } from "@/services/subscription.services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle, Crown } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { UserInfo } from "@/types/user.types";

interface SubscriptionsContentProps {
    userRole?: "USER" | "RECRUITER" | string;
    userInfo?: UserInfo;
}

const SubscriptionsContent = ({ userRole, userInfo }: SubscriptionsContentProps) => {
    const [couponCode, setCouponCode] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const { data: plansData, isLoading: plansLoading } = useQuery({
        queryKey: ["subscription-plans"],
        queryFn: () => getSubscriptionPlans(),
    });

    const { mutateAsync: purchase, isPending } = useMutation({
        mutationFn: (planName: string) => purchaseSubscription({ planName, couponCode: couponCode || undefined, referralCode: referralCode || undefined }),
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

    const plans: { durationDays: number; amount: number; plan: string; }[] =
        Array.isArray(plansData?.data) ? plansData.data : (plansData?.data as any)?.plans || [];

    const isPremium = userInfo?.isPremium;
    const premiumUntil = userInfo?.premiumUntil;

    const formatPlanName = (plan: string) => {
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
                    <Crown className="w-5 h-5 text-yellow-500" /> Optional Codes
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
                <p className="text-xs text-muted-foreground">Any valid discounts or referral bonuses will be applied automatically during checkout.</p>
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
