import RecruitersManagementContent from "@/components/modules/Admin/RecruitersManagement/RecruitersManagementContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RecruitersManagementPage = async () => {
    await protectPageByRole("ADMIN");
    return <RecruitersManagementContent />;
};

export default RecruitersManagementPage;
