import ForgotPasswordForm from "@/components/modules/Auth/ForgotPasswordForm";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

const ForgotPasswordPage = async () => {
    const userInfo = await getUserInfo();

    // If user is already logged in, redirect to their dashboard
    if (userInfo) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
