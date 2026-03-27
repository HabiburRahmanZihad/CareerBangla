import RecruiterJobsByStatusContent from "@/components/modules/Recruiter/RecruiterJobsByStatusContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RecruiterPendingJobsPage = async () => {
    await protectPageByRole("RECRUITER");

    return (
        <RecruiterJobsByStatusContent
            title="Pending / Not Approved Jobs"
            description="Jobs waiting for admin approval are shown here."
            status="DRAFT"
            emptyMessage="No pending or unapproved jobs found."
        />
    );
};

export default RecruiterPendingJobsPage;
