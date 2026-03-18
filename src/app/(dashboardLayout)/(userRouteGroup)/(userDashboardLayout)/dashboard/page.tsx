import UserDashboardContent from "@/components/modules/Dashboard/UserDashboardContent";
import { canAccessRoute, getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

const UserDashboardPage = async () => {
    const userInfo = await getUserInfo();

    if (!userInfo) {
        redirect("/login");
    }

    if (!canAccessRoute("/dashboard", userInfo.role)) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    return <UserDashboardContent userInfo={userInfo} />;
};

export default UserDashboardPage;
