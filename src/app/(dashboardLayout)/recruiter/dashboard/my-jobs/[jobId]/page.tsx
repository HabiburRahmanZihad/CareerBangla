import RecruiterJobDetailsEditContent from "@/components/modules/Recruiter/RecruiterJobDetailsEditContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";
import { getJobById } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { notFound } from "next/navigation";

interface RecruiterJobDetailsPageProps {
    params: Promise<{ jobId: string }>;
}

const RecruiterJobDetailsPage = async ({ params }: RecruiterJobDetailsPageProps) => {
    await protectPageByRole("RECRUITER");
    const { jobId } = await params;

    try {
        const response = await getJobById(jobId);
        if (!response?.data) {
            notFound();
        }

        return (
            <RecruiterJobDetailsEditContent
                job={response.data as IJob & { deadline?: string; applicationDeadline?: string }}
            />
        );
    } catch {
        notFound();
    }
};

export default RecruiterJobDetailsPage;
