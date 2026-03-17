import JobsPageContent from "@/components/modules/Jobs/JobsPageContent";
import { getJobCategories, getJobs } from "@/services/job.services";

interface JobsPageProps {
    searchParams: Promise<{
        page?: string;
        searchTerm?: string;
        location?: string;
        jobType?: string;
        experienceLevel?: string;
        locationType?: string;
        categoryId?: string;
        skills?: string;
    }>;
}

const JobsPage = async ({ searchParams }: JobsPageProps) => {
    const params = await searchParams;
    const page = params.page || "1";

    const [jobsResponse, categoriesResponse] = await Promise.all([
        getJobs({
            page,
            limit: "12",
            status: "OPEN",
            ...params,
        }),
        getJobCategories(),
    ]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Browse Jobs</h1>
                <p className="text-muted-foreground">
                    Find your next opportunity from {jobsResponse.meta?.total || 0} available positions
                </p>
            </div>

            <JobsPageContent
                jobs={jobsResponse.data || []}
                meta={jobsResponse.meta}
                categories={categoriesResponse.data || []}
                currentParams={params}
            />
        </div>
    );
};

export default JobsPage;
