"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubscriptionPlans, purchaseSubscription } from "@/services/subscription.services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle, Coins } from "lucide-react";
import { toast } from "sonner";

const SubscriptionsContent = ({ userRole }: { userRole?: "USER" | "RECRUITER" | string }) => {
    const { data, isLoading } = useQuery({
        queryKey: ["subscription-plans"],
        queryFn: () => getSubscriptionPlans(),
    });

    const { mutateAsync: purchase, isPending } = useMutation({
        mutationFn: (planId: string) => purchaseSubscription({ planId }),
        onSuccess: (response) => {
            if (response.data?.url) {
                window.location.href = response.data.url;
            } else {
                toast.success("Subscription activated!");
            }
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to purchase subscription");
        },
    });

    if (isLoading) {
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

    const plans: { name: string; coins: number; amount: number; description: string }[] =
        Array.isArray((data?.data as any)?.plans) ? (data?.data as any).plans : [];
    const coinCosts = (data?.data as any)?.coinCosts;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Subscription Plans</h1>
                <p className="text-muted-foreground">Purchase coins to unlock premium features</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.filter(p => p.amount > 0).map((plan) => (
                    <Card key={plan.name} className="relative hover:shadow-md transition-shadow">
                        {plan.name.toLowerCase().includes("pro") && (
                            <Badge className="absolute -top-2 right-4">Popular</Badge>
                        )}
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{plan.name}</span>
                            </CardTitle>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">&#2547;{plan.amount}</span>
                                <span className="text-muted-foreground">/ one-time</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <Coins className="h-5 w-5 text-yellow-500" />
                                <span className="font-semibold">{plan.coins} coins</span>
                                <span className="text-xs text-muted-foreground ml-auto">added to wallet</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => purchase(plan.name)}
                                disabled={isPending}
                            >
                                {isPending ? "Processing..." : `Get ${plan.coins} Coins`}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {coinCosts && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userRole !== "RECRUITER" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Coins className="h-4 w-4 text-yellow-500" /> Coin Costs for Job Seekers
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between py-1 border-b">
                                    <span className="text-muted-foreground">Apply to a Job</span>
                                    <span className="font-semibold">{coinCosts.user.applyJob} coins</span>
                                </div>
                                <div className="flex justify-between py-1 border-b">
                                    <span className="text-muted-foreground">View Recruiter Email</span>
                                    <span className="font-semibold">{coinCosts.user.viewRecruiterEmail} coins</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-muted-foreground">Update Filled Profile Sections</span>
                                    <span className="font-semibold">15 coins</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {userRole === "RECRUITER" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Coins className="h-4 w-4 text-yellow-500" /> Coin Costs for Recruiters
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between py-1 border-b">
                                    <span className="text-muted-foreground">Post a Job</span>
                                    <span className="font-semibold">{coinCosts.recruiter.postJob} coins</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-muted-foreground">View Candidate Profile</span>
                                    <span className="font-semibold">{coinCosts.recruiter.viewCandidate} coins</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubscriptionsContent;
