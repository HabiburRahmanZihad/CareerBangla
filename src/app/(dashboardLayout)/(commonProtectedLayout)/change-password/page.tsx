import ChangePasswordContent from "@/components/modules/Dashboard/ChangePasswordContent";
import { canAccessRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

const ChangePasswordPage = async () => {
    const userInfo = await getUserInfo();

    if (!userInfo) {
        redirect("/login");
    }

    if (!canAccessRoute("/change-password", userInfo.role)) {
        redirect("/login");
    }

    return <ChangePasswordContent />;
};

export default ChangePasswordPage;
