import SubscriptionsContent from "@/components/modules/Dashboard/SubscriptionsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RecruiterSubscriptionsPage = async () => {
    await protectPageByRole("RECRUITER");
    return <SubscriptionsContent userRole="RECRUITER" />;
};

export default RecruiterSubscriptionsPage;
