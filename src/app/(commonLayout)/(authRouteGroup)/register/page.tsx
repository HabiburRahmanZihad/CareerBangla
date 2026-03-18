import RegisterForm from "@/components/modules/Auth/RegisterForm";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
    const userInfo = await getUserInfo();

    // If user is already logged in, redirect to their dashboard
    if (userInfo) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    return <RegisterForm />;
};

export default RegisterPage;
