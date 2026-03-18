import RecruiterApplicationsContent from "@/components/modules/Recruiter/RecruiterApplicationsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RecruiterApplicationsPage = async () => {
    await protectPageByRole("RECRUITER");
    return <RecruiterApplicationsContent />;
};

export default RecruiterApplicationsPage;
