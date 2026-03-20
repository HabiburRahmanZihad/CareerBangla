"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubscriptionPlans } from "@/services/subscription.services";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Rocket } from "lucide-react";

const SubscriptionsManagementContent = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["admin-subscription-plans"],
        queryFn: () => getSubscriptionPlans(),
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

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Subscriptions Management</h1>

            {plans.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No subscription plans found.
                    </CardContent>
                </Card>
            ) : (
                <div className="max-w-lg">
                    {plans.map((plan: any) => (
                        <Card key={plan.planKey || plan.name} className="border-primary">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Rocket className="h-5 w-5 text-primary" />
                                        {plan.name}
                                    </CardTitle>
                                    <Badge variant="default">
                                        {plan.lifetime ? "Lifetime" : "Active"}
                                    </Badge>
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubscriptionsManagementContent;
