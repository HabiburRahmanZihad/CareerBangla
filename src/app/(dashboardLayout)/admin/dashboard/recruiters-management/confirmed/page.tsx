import ConfirmedRecruitersMain from "@/components/modules/Admin/RecruitersManagement/ConfirmedRecruitersMain";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const ConfirmedRecruitersPage = async () => {
    await protectPageByRole("ADMIN");
    return <ConfirmedRecruitersMain />;
};

export default ConfirmedRecruitersPage;
