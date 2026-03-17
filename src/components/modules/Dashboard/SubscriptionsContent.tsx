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

const SubscriptionsContent = () => {
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

    const plans = data?.data || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Subscription Plans</h1>
                <p className="text-muted-foreground">Choose a plan to get more coins</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card key={plan.id} className="relative hover:shadow-md transition-shadow">
                        {plan.name.toLowerCase().includes("pro") && (
                            <Badge className="absolute -top-2 right-4">Popular</Badge>
                        )}
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{plan.name}</span>
                            </CardTitle>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">&#2547;{plan.price}</span>
                                <span className="text-muted-foreground">/ {plan.duration} days</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4 p-2 bg-primary/5 rounded-lg">
                                <Coins className="h-5 w-5 text-yellow-500" />
                                <span className="font-semibold">{plan.coins} coins</span>
                            </div>
                            <ul className="space-y-2">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => purchase(plan.id)}
                                disabled={isPending}
                            >
                                {isPending ? "Processing..." : "Subscribe"}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionsContent;
