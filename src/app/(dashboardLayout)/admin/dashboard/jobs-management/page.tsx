import JobsManagementContent from "@/components/modules/Admin/JobsManagement/JobsManagementContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const JobsManagementPage = async () => {
    await protectPageByRole("ADMIN");
    return <JobsManagementContent />;
};

export default JobsManagementPage;
