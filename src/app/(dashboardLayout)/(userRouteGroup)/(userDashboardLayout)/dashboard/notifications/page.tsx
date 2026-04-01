import NotificationsContent from "@/components/modules/Dashboard/NotificationsContent";
import { getUserInfo } from "@/services/auth.services";

const NotificationsPage = async () => {
    const userInfo = await getUserInfo();
    return <NotificationsContent notificationOwnerKey={userInfo?.id ?? "user-notifications"} />;
};

export default NotificationsPage;
