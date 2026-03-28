import JobsPageContent from "@/components/modules/Jobs/JobsPageContent";
import { getJobCategories, getJobs } from "@/services/job.services";

interface JobsPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        searchTerm?: string;
        location?: string;
        jobType?: string;
        categoryId?: string;
        salaryMin?: string;
        salaryMax?: string;
        datePosted?: string;
        sortBy?: string;
    }>;
}

const JobsPage = async ({ searchParams }: JobsPageProps) => {
    const params = await searchParams;

    const [jobsResponse, categoriesResponse] = await Promise.all([
        getJobs({
            page: params.page || "1",
            limit: params.limit || "12",
            searchTerm: params.searchTerm,
            location: params.location,
            jobType: params.jobType,
            categoryId: params.categoryId,
            salaryMin: params.salaryMin,
            salaryMax: params.salaryMax,
            datePosted: params.datePosted,
            sortBy: params.sortBy,
        }),
        getJobCategories(),
    ]);

    return (
        <JobsPageContent
            jobs={jobsResponse.data || []}
            meta={jobsResponse.meta}
            categories={categoriesResponse.data || []}
            currentParams={params}
        />
    );
};

export default JobsPage;
