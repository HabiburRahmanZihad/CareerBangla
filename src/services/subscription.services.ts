"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { ISubscription, ISubscriptionPlan } from "@/types/user.types";

export async function getSubscriptionPlans() {
    return serverHttpClient.get<ISubscriptionPlan[]>("/subscriptions/plans");
}

export async function purchaseSubscription(data: { planName: string; couponCode?: string; referralCode?: string }) {
    return serverHttpClient.post<{ url: string }>("/subscriptions/purchase", data);
}

export async function cancelSubscription(subscriptionId: string) {
    return serverHttpClient.post<ISubscription>(`/subscriptions/cancel/${subscriptionId}`, {});
}

export async function getMySubscriptions() {
    return serverHttpClient.get<ISubscription[]>("/subscriptions/my-subscriptions");
}
