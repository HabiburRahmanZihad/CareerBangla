import ConfirmedRecruitersContent from "@/components/modules/Admin/RecruitersManagement/ConfirmedRecruitersContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const ConfirmedRecruitersPage = async () => {
    await protectPageByRole("ADMIN");
    return <ConfirmedRecruitersContent />;
};

export default ConfirmedRecruitersPage;
