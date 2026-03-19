import SubscriptionsContent from "@/components/modules/Dashboard/SubscriptionsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";
import { getUserInfo } from "@/services/auth.services";

const RecruiterSubscriptionsPage = async () => {
    await protectPageByRole("RECRUITER");
    const userInfo = await getUserInfo();
    return <SubscriptionsContent userRole="RECRUITER" userInfo={userInfo || undefined} />;
};

export default RecruiterSubscriptionsPage;
