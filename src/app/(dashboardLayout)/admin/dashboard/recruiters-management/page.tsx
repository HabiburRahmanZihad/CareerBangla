import RecruitersManagementDashboard from "@/components/modules/Admin/RecruitersManagement/RecruitersManagementDashboard";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RecruitersManagementPage = async () => {
    await protectPageByRole("ADMIN");
    return <RecruitersManagementDashboard />;
};

export default RecruitersManagementPage;
