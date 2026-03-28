import VerifyEmailForm from "@/components/modules/Auth/VerifyEmailForm";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

interface VerifyEmailParams {
    searchParams: Promise<{ email?: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailParams) => {
    const userInfo = await getUserInfo();

    // If user is already logged in, redirect to their dashboard
    if (userInfo) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    const params = await searchParams;
    return <VerifyEmailForm email={params.email || ""} />;
};

export default VerifyEmailPage;
