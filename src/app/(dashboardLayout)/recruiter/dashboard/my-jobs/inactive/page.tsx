import RecruiterInactiveJobsContent from "@/components/modules/Recruiter/RecruiterInactiveJobsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RecruiterInactiveJobsPage = async () => {
    await protectPageByRole("RECRUITER");

    return (
        <RecruiterInactiveJobsContent
            title="Inactive & Closed Jobs"
            description="Jobs with passed deadlines (Inactive) or rejected by admin (Closed) are shown here. You can permanently delete them if needed."
            emptyMessage="No inactive or closed jobs found."
        />
    );
};

export default RecruiterInactiveJobsPage;
