import UsersManagementMain from "@/components/modules/Admin/UsersManagement/UsersManagementMain";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const UsersManagementPage = async () => {
    await protectPageByRole("ADMIN");
    return <UsersManagementMain />;
};

export default UsersManagementPage;
