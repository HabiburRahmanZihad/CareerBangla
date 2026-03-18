import UsersManagementContent from "@/components/modules/Admin/UsersManagement/UsersManagementContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const UsersManagementPage = async () => {
    await protectPageByRole("ADMIN");
    return <UsersManagementContent />;
};

export default UsersManagementPage;
