import HiredCandidatesContent from "@/components/modules/Recruiter/HiredCandidatesContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const HiredCandidatesPage = async () => {
    await protectPageByRole("RECRUITER");
    return <HiredCandidatesContent />;
};

export default HiredCandidatesPage;
