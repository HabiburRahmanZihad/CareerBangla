import RecruiterRegisterForm from "@/components/modules/Auth/RecruiterRegisterForm";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Register as Recruiter | CareerBangla",
    description: "Create a recruiter account on CareerBangla to post jobs and find talent.",
};

const RecruiterRegisterPage = async () => {
    const userInfo = await getUserInfo();

    if (userInfo) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    return <RecruiterRegisterForm />;
};

export default RecruiterRegisterPage;
