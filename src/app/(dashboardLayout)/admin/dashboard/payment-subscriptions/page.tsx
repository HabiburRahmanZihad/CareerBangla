import PaymentSubscriptionsContent from "@/components/modules/Admin/PaymentSubscriptions/PaymentSubscriptionsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const PaymentSubscriptionsPage = async () => {
    await protectPageByRole("SUPER_ADMIN");
    return <PaymentSubscriptionsContent />;
};

export default PaymentSubscriptionsPage;
