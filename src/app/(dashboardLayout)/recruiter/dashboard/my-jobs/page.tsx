import MyJobsContent from "@/components/modules/Recruiter/MyJobsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const MyJobsPage = async () => {
    await protectPageByRole("RECRUITER");
    return <MyJobsContent />;
};

export default MyJobsPage;
