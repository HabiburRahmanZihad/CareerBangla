import RejectedRecruitersContent from "@/components/modules/Admin/RecruitersManagement/RejectedRecruitersContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RejectedRecruitersPage = async () => {
    await protectPageByRole("ADMIN");
    return <RejectedRecruitersContent />;
};

export default RejectedRecruitersPage;
