import RecruiterJobsByStatusContent from "@/components/modules/Recruiter/RecruiterJobsByStatusContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RecruiterApprovedJobsPage = async () => {
    await protectPageByRole("RECRUITER");

    return (
        <RecruiterJobsByStatusContent
            title="Approved Jobs"
            description="Jobs approved by admin and currently live are shown here."
            status="LIVE"
            emptyMessage="No approved jobs found yet."
        />
    );
};

export default RecruiterApprovedJobsPage;
