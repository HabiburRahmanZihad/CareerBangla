import SubscriptionsContent from "@/components/modules/Dashboard/SubscriptionsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const SubscriptionsPage = async () => {
    await protectPageByRole("USER");
    return <SubscriptionsContent userRole="USER" />;
};

export default SubscriptionsPage;
