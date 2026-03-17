"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubscriptionPlans } from "@/services/subscription.services";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, CreditCard } from "lucide-react";

const SubscriptionsManagementContent = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["admin-subscription-plans"],
        queryFn: () => getSubscriptionPlans(),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    const plans = data?.data || [];

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <Card key={plan.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        {plan.name}
                                    </CardTitle>
                                    <Badge variant={plan.isActive ? "default" : "secondary"}>
                                        {plan.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">&#2547;{plan.price}</span>
                                    <span className="text-muted-foreground">/ {plan.duration} days</span>
                                </div>
                                <p className="text-sm text-primary font-medium">{plan.coins} coins included</p>
                                {plan.features && plan.features.length > 0 && (
                                    <ul className="space-y-1.5">
                                        {plan.features.map((feature, i) => (
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
