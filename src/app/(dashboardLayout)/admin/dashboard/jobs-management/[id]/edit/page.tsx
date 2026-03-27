import AdminJobEditContent from "@/components/modules/Admin/JobsManagement/AdminJobEditContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

interface JobEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

const JobEditPage = async ({ params }: JobEditPageProps) => {
    await protectPageByRole("ADMIN");
    const { id } = await params;

    return <AdminJobEditContent jobId={id} />;
};

export default JobEditPage;
