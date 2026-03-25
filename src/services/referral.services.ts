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

export async function getMyReferralStats() {
    logger.read("Fetching referral stats");
    return serverHttpClient.get<IReferralStats>("/referrals/my-stats");
}
