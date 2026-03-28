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

export interface ICheckoutCustomerInfo {
    name: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
}

export async function purchaseSubscription(data: { planKey?: string; couponCode?: string; referralCode?: string; gateway?: "SSLCOMMERZ"; customerInfo?: ICheckoutCustomerInfo }) {
    logger.create(`Purchasing subscription → plan: ${data.planKey || "BOOST_LIFETIME"}`);
    return serverHttpClient.post<{ paymentUrl: string }>("/subscriptions/purchase", { ...data, planKey: data.planKey || "BOOST_LIFETIME", gateway: data.gateway || "SSLCOMMERZ" });
}

export async function cancelSubscription(subscriptionId: string) {
    logger.update(`Cancelling subscription → id: ${subscriptionId}`);
    return serverHttpClient.post<IMySubscription>(`/subscriptions/cancel/${subscriptionId}`, {});
}

export async function getMySubscriptions() {
    logger.read("Fetching my subscriptions");
    return serverHttpClient.get<IMySubscription[]>("/subscriptions/my-subscriptions");
}

export interface IValidatedCoupon {
    id: string;
    code: string;
    type: string;
    targetRole: string;
    description: string | null;
    discountPercent: number | null;
    discountAmount: number | null;
    freeDays: number | null;
    freeMonths: number | null;
    isLifetime: boolean;
    commissionAmount: number | null;
}

export async function validateCoupon(code: string) {
    logger.read(`Validating coupon → code: ${code}`);
    return serverHttpClient.post<IValidatedCoupon>("/coupons/validate", { code });
}

export async function applyCouponDirect(code: string) {
    logger.create(`Applying coupon directly → code: ${code}`);
    return serverHttpClient.post<{ message: string; type: string }>("/coupons/apply", { code });
}
