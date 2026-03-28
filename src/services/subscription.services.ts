"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";

export interface ISubscriptionPlanResponse {
    name: string;
    planKey: string;
    amount: number;
    description: string;
    features: string[];
    lifetime: boolean;
    durationDays?: number | null;
    recruiterOnly?: boolean;
    isActive?: boolean;
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
    logger.read("Fetching subscription plans");
    return serverHttpClient.get<{ plans: ISubscriptionPlanResponse[] }>("/subscriptions/plans");
}

export async function purchaseSubscription(data: { planKey?: string; couponCode?: string; referralCode?: string }) {
    logger.create(`Purchasing subscription → plan: ${data.planKey || "BOOST_LIFETIME"}`);
    return serverHttpClient.post<{ paymentUrl: string }>("/subscriptions/purchase", { ...data, planKey: data.planKey || "BOOST_LIFETIME", gateway: "SSLCOMMERZ" });
}

export async function cancelSubscription(subscriptionId: string) {
    logger.update(`Cancelling subscription → id: ${subscriptionId}`);
    return serverHttpClient.post<IMySubscription>(`/subscriptions/cancel/${subscriptionId}`, {});
}

export async function getMySubscriptions() {
    logger.read("Fetching my subscriptions");
    return serverHttpClient.get<IMySubscription[]>("/subscriptions/my-subscriptions");
}

export async function validateCoupon(code: string) {
    logger.read(`Validating coupon → code: ${code}`);
    return serverHttpClient.post<{ id: string; code: string; discountPercent: number | null; discountAmount: number | null }>("/coupons/validate", { code });
}
