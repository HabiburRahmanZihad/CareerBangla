import CouponsManagementContent from "@/components/modules/Admin/CouponsManagement/CouponsManagementContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const CouponsManagementPage = async () => {
    await protectPageByRole("ADMIN");
    return <CouponsManagementContent />;
};

export default CouponsManagementPage;
