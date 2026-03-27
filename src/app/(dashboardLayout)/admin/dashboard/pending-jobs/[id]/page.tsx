import PendingJobDetailsContent from "@/components/modules/Admin/JobsManagement/PendingJobDetailsContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";
import { getPendingJobById } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { notFound } from "next/navigation";

interface PendingJobDetailsPageProps {
    params: Promise<{ id: string }>;
}

const PendingJobDetailsPage = async ({ params }: PendingJobDetailsPageProps) => {
    await protectPageByRole("ADMIN");
    const { id } = await params;

    try {
        const response = await getPendingJobById(id);
        if (!response?.data) {
            notFound();
        }

        return <PendingJobDetailsContent job={response.data as IJob & { requirements?: string[]; responsibilities?: string[]; benefits?: string[] }} />;
    } catch {
        notFound();
    }
};

export default PendingJobDetailsPage;
