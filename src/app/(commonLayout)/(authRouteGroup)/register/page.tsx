import RegisterForm from "@/components/modules/Auth/RegisterForm";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

interface RegisterPageProps {
    searchParams: Promise<{ ref?: string }>;
}

const RegisterPage = async ({ searchParams }: RegisterPageProps) => {
    const userInfo = await getUserInfo();

    // If user is already logged in, redirect to their dashboard
    if (userInfo) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    const params = await searchParams;
    const referralCode = params.ref || undefined;

    return <RegisterForm referralCode={referralCode} />;
};

export default RegisterPage;
