import NotificationsContent from "@/components/modules/Dashboard/NotificationsContent";
import { getUserInfo } from "@/services/auth.services";

const AdminNotificationsPage = async () => {
    const userInfo = await getUserInfo();
    return <NotificationsContent notificationOwnerKey={userInfo?.id ?? "admin-notifications"} />;
};

export default AdminNotificationsPage;
