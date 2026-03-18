import WalletContent from "@/components/modules/Dashboard/WalletContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const RecruiterWalletPage = async () => {
    await protectPageByRole("RECRUITER");
    return <WalletContent />;
};

export default RecruiterWalletPage;
