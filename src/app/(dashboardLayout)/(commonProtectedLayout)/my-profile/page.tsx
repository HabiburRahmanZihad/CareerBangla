import MyProfileContent from "@/components/modules/Dashboard/MyProfileContent";
import { canAccessRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

const MyProfilePage = async () => {
    const userInfo = await getUserInfo();

    if (!userInfo) {
        redirect("/login");
    }

    if (!canAccessRoute("/my-profile", userInfo.role)) {
        redirect("/login");
    }

    return <MyProfileContent userInfo={userInfo} />;
};

export default MyProfilePage;
