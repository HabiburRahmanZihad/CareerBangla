import MyProfileContent from "@/components/modules/Dashboard/MyProfileContent";
import { getUserInfo } from "@/services/auth.services";

const MyProfilePage = async () => {
    const userInfo = await getUserInfo();
    return <MyProfileContent userInfo={userInfo} />;
};

export default MyProfilePage;
