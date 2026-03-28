import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

interface ResetPasswordParams {
    searchParams: Promise<{ email?: string; phone?: string }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordParams) => {
    const userInfo = await getUserInfo();

    // If user is already logged in, redirect to their dashboard
    if (userInfo) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    const params = await searchParams;
    return <ResetPasswordForm email={params.email || ""} phone={params.phone || ""} />;
};

export default ResetPasswordPage;
