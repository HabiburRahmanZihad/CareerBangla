import WalletContent from "@/components/modules/Dashboard/WalletContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const WalletPage = async () => {
    await protectPageByRole("USER");
    return <WalletContent />;
};

export default WalletPage;
