import SubscriptionsManagementContent from "@/components/modules/Admin/SubscriptionsManagement/SubscriptionsManagementContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const SubscriptionsManagementPage = async () => {
    await protectPageByRole("ADMIN");
    return <SubscriptionsManagementContent />;
};

export default SubscriptionsManagementPage;
