import JobDetailsContent from "@/components/modules/Jobs/JobDetailsContent";
import { getJobById } from "@/services/job.services";
import { notFound } from "next/navigation";

interface JobDetailsPageProps {
    params: Promise<{ id: string }>;
}

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
    const { id } = await params;

    try {
        const response = await getJobById(id);

        if (!response.data) {
            notFound();
        }

        return (
            <div className="container mx-auto px-4 py-8">
                <JobDetailsContent job={response.data} />
            </div>
        );
    } catch {
        notFound();
    }
};

export default JobDetailsPage;
