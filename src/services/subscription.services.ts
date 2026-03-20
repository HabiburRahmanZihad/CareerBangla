"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";

export interface ISubscriptionPlanResponse {
    name: string;
    planKey: string;
    amount: number;
    description: string;
    features: string[];
    lifetime: boolean;
}

export interface IMySubscription {
    id: string;
    plan: string;
    amount: number;
    transactionId: string | null;
    status: "PAID" | "UNPAID" | "FAILED";
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    couponId: string | null;
    paymentGatewayData: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
}

export async function getSubscriptionPlans() {
    return serverHttpClient.get<{ plans: ISubscriptionPlanResponse[] }>("/subscriptions/plans");
}

export async function purchaseSubscription(data: { planKey?: string; couponCode?: string; referralCode?: string; gateway?: "STRIPE" | "SSLCOMMERZ" }) {
    return serverHttpClient.post<{ paymentUrl: string }>("/subscriptions/purchase", { ...data, planKey: data.planKey || "BOOST_LIFETIME" });
}

export async function cancelSubscription(subscriptionId: string) {
    return serverHttpClient.post<IMySubscription>(`/subscriptions/cancel/${subscriptionId}`, {});
}

export async function getMySubscriptions() {
    return serverHttpClient.get<IMySubscription[]>("/subscriptions/my-subscriptions");
}

export async function validateCoupon(code: string) {
    return serverHttpClient.post<{ id: string; code: string; discountPercent: number | null; discountAmount: number | null }>("/coupons/validate", { code });
}
