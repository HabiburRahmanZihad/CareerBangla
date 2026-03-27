import RecruiterInactiveJobsContent from "@/components/modules/Recruiter/RecruiterInactiveJobsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RecruiterInactiveJobsPage = async () => {
    await protectPageByRole("RECRUITER");

    return (
        <RecruiterInactiveJobsContent
            title="Inactive Jobs"
            description="Jobs with passed deadlines are shown here. You can permanently delete them if needed."
            emptyMessage="No inactive jobs found."
        />
    );
};

export default RecruiterInactiveJobsPage;
