import JobDetailsContent from "@/components/modules/Jobs/JobDetailsContent";
import { getUserInfo } from "@/services/auth.services";
import { getJobById } from "@/services/job.services";
import { notFound, redirect } from "next/navigation";

interface JobDetailsPageProps {
    params: Promise<{ id: string }>;
}

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
    const { id } = await params;

    const userInfo = await getUserInfo().catch(() => null);
    if (!userInfo) {
        redirect(`/login?redirect=/jobs/${id}`);
    }

    try {
        const jobResponse = await getJobById(id);

        if (!jobResponse.data) {
            notFound();
        }

        return (
            <div className="container mx-auto px-4 py-8">
                <JobDetailsContent
                    job={jobResponse.data}
                    userRole={userInfo.role}
                    isPremium={userInfo.isPremium}
                />
            </div>
        );
    } catch {
        notFound();
    }
};

export default JobDetailsPage;
