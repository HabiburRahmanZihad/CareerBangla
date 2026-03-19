import SubscriptionsContent from "@/components/modules/Dashboard/SubscriptionsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";
import { getUserInfo } from "@/services/auth.services";

const SubscriptionsPage = async () => {
    await protectPageByRole("USER");
    const userInfo = await getUserInfo();
    return <SubscriptionsContent userRole="USER" userInfo={userInfo || undefined} />;
};

export default SubscriptionsPage;
