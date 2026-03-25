import MyResumeContent from "@/components/modules/Dashboard/Resume/MyResumeContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const MyResumePage = async () => {
    await protectPageByRole("USER");
    return <MyResumeContent />;
};

export default MyResumePage;
