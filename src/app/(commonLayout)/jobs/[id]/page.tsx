import JobDetailsContent from "@/components/modules/Jobs/JobDetailsContent";
import { getUserInfo } from "@/services/auth.services";
import { getJobById } from "@/services/job.services";
import { notFound } from "next/navigation";

interface JobDetailsPageProps {
    params: Promise<{ id: string }>;
}

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
    const { id } = await params;

    try {
        const [jobResponse, userInfo] = await Promise.all([
            getJobById(id),
            getUserInfo().catch(() => null),
        ]);

        if (!jobResponse.data) {
            notFound();
        }

        return (
            <div className="container mx-auto px-4 py-8">
                <JobDetailsContent
                    job={jobResponse.data}
                    userRole={userInfo?.role}
                />
            </div>
        );
    } catch {
        notFound();
    }
};

export default JobDetailsPage;
