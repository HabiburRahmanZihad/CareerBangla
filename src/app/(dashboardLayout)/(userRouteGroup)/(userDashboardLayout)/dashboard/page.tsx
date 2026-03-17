import UserDashboardContent from "@/components/modules/Dashboard/UserDashboardContent";
import { getUserInfo } from "@/services/auth.services";

const UserDashboardPage = async () => {
    const userInfo = await getUserInfo();

    return <UserDashboardContent userInfo={userInfo} />;
};

export default UserDashboardPage;
