import PendingJobsContent from "@/components/modules/Admin/JobsManagement/PendingJobsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const PendingJobsPage = async () => {
    await protectPageByRole("ADMIN");
    return <PendingJobsContent />;
};

export default PendingJobsPage;
