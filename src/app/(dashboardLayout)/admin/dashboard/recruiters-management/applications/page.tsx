import RecruiterApplicationsMain from "@/components/modules/Admin/RecruitersManagement/RecruiterApplicationsMain";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RecruiterApplicationsPage = async () => {
    await protectPageByRole("ADMIN");
    return <RecruiterApplicationsMain />;
};

export default RecruiterApplicationsPage;
