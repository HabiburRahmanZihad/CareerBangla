import PaymentSubscriptionsContent from "@/components/modules/Admin/PaymentSubscriptions/PaymentSubscriptionsContent";
import { protectPage } from "@/lib/protectedPageHelpers";

const PaymentSubscriptionsPage = async () => {
    await protectPage("/admin/dashboard/payment-subscriptions");
    return <PaymentSubscriptionsContent />;
};

export default PaymentSubscriptionsPage;
