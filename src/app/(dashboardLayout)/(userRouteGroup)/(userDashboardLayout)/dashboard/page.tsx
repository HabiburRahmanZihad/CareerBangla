import UserDashboardContent from "@/components/modules/Dashboard/UserDashboardContent";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

const UserDashboardPage = async () => {
    const userInfo = await getUserInfo();

    if (!userInfo) {
        redirect("/login");
    }

    return <UserDashboardContent userInfo={userInfo} />;
};

export default UserDashboardPage;
