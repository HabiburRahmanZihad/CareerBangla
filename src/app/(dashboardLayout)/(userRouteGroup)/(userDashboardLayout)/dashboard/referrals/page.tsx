import ReferralContent from "@/components/modules/Dashboard/ReferralContent";
import { Metadata } from "next";
import { getUserInfo } from "@/services/auth.services";

export const metadata: Metadata = {
    title: "Referrals | CareerBangla",
    description: "Refer friends and earn Premium",
};

export default async function ReferralsPage() {
    const userInfo = await getUserInfo();
    return <ReferralContent userInfo={userInfo || undefined} />;
}
