import RecruiterApplicationsContent from "@/components/modules/Admin/RecruitersManagement/RecruiterApplicationsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RecruiterApplicationsPage = async () => {
    await protectPageByRole("ADMIN");
    return <RecruiterApplicationsContent />;
};

export default RecruiterApplicationsPage;
