import RecruiterDashboardContent from "@/components/modules/Recruiter/RecruiterDashboardContent";
import { canAccessRoute, getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

const RecruiterDashboardPage = async () => {
    const userInfo = await getUserInfo();

    if (!userInfo) {
        redirect("/login");
    }

    if (!canAccessRoute("/recruiter/dashboard", userInfo.role)) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    return <RecruiterDashboardContent userInfo={userInfo} />;
};

export default RecruiterDashboardPage;
