import RecruiterDashboardContent from "@/components/modules/Recruiter/RecruiterDashboardContent";
import { getUserInfo } from "@/services/auth.services";

const RecruiterDashboardPage = async () => {
    const userInfo = await getUserInfo();
    return <RecruiterDashboardContent userInfo={userInfo} />;
};

export default RecruiterDashboardPage;
