"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";

export interface IReferralStats {
    referralCode: string | null;
    totalReferrals: number;
    totalPaidReferrals: number;
    rewardsEarned: number;
    progressToNext: number;
    recentReferrals: {
        id: string;
        referredUserName: string;
        referredUserEmail: string;
        hasPaid: boolean;
        paidAt: string | null;
        createdAt: string;
    }[];
}

export interface ISearchReferralsResponse {
    results: {
        id: string;
        referredUserName: string;
        referredUserEmail: string;
        hasPaid: boolean;
        paidAt: string | null;
        createdAt: string;
    }[];
    count: number;
}

export async function getMyReferralStats() {
    logger.read("Fetching referral stats");
    return serverHttpClient.get<IReferralStats>("/referrals/my-stats");
}

export async function searchReferrals(query: string) {
    logger.read(`Searching referrals with query: ${query}`);
    return serverHttpClient.get<ISearchReferralsResponse>("/referrals/search", {
        params: { search: query },
    });
}
