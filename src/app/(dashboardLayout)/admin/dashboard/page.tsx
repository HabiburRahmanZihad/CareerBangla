import AdminDashboardContent from "@/components/modules/Admin/AdminDashboardContent";
import { canAccessRoute, getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

const AdminDashboardPage = async () => {
    const userInfo = await getUserInfo();

    if (!userInfo) {
        redirect("/login");
    }

    if (!canAccessRoute("/admin/dashboard", userInfo.role)) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    return <AdminDashboardContent />;
};

export default AdminDashboardPage;
