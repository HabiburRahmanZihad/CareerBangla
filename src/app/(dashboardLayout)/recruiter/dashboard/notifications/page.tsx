import NotificationsContent from "@/components/modules/Dashboard/NotificationsContent";
import { getUserInfo } from "@/services/auth.services";

const RecruiterNotificationsPage = async () => {
    const userInfo = await getUserInfo();
    return <NotificationsContent notificationOwnerKey={userInfo?.id ?? "recruiter-notifications"} />;
};

export default RecruiterNotificationsPage;
