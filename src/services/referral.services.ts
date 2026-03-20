"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";

export interface IReferralStats {
    referralCode: string | null;
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
    return serverHttpClient.get<IReferralStats>("/referrals/my-stats");
}
