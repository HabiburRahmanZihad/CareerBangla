"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";

export interface IReferralHistory {
    id: string;
    referrerId: string;
    referredUserId: string;
    hasPaid: boolean;
    paidAt: string | null;
    createdAt: string;
    referrer: {
        id: string;
        name: string;
        email: string;
        referralCode: string;
        isPremium: boolean;
    };
    referredUser: {
        id: string;
        name: string;
        email: string;
        isPremium: boolean;
    };
}

export interface ICouponUsage {
    id: string;
    code: string;
    usageCount: number;
    maxUsage: number;
    status: string;
    usedAt: string | null;
    expiresAt: string | null;
}

interface TrackingDataResponse<T> {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    data: T[];
}

export async function getReferralTracking(page: number = 1, limit: number = 20) {
    logger.read(`Fetching referral tracking → page: ${page}`);
    return serverHttpClient.get<TrackingDataResponse<IReferralHistory>>(`/tracking/referrals?page=${page}&limit=${limit}`);
}

export async function getCouponUsageTracking(page: number = 1, limit: number = 20) {
    logger.read(`Fetching coupon usage tracking → page: ${page}`);
    return serverHttpClient.get<TrackingDataResponse<ICouponUsage>>(`/tracking/coupons?page=${page}&limit=${limit}`);
}
