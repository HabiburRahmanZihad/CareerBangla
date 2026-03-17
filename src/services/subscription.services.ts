"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ISubscription, ISubscriptionPlan } from "@/types/user.types";

export async function getSubscriptionPlans() {
    return httpClient.get<ISubscriptionPlan[]>("/subscriptions/plans");
}

export async function purchaseSubscription(data: { planId: string; couponCode?: string }) {
    return httpClient.post<{ url: string }>("/subscriptions/purchase", data);
}

export async function cancelSubscription(subscriptionId: string) {
    return httpClient.post<ISubscription>(`/subscriptions/cancel/${subscriptionId}`, {});
}

export async function getMySubscriptions() {
    return httpClient.get<ISubscription[]>("/subscriptions/my-subscriptions");
}
