import ReferralContent from "@/components/modules/Dashboard/ReferralContent";
import { Metadata } from "next";
import { getUserInfo } from "@/services/auth.services";
import { getMyReferralStats } from "@/services/referral.services";

export const metadata: Metadata = {
    title: "Referrals | CareerBangla",
    description: "Refer friends and earn Premium",
};

export default async function ReferralsPage() {
    const [userInfo, statsResponse] = await Promise.all([
        getUserInfo(),
        getMyReferralStats().catch(() => null),
    ]);

    return (
        <ReferralContent
            userInfo={userInfo || undefined}
            referralStats={statsResponse?.data || undefined}
        />
    );
}
