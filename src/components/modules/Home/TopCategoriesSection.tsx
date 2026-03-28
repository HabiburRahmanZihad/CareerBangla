import { getJobCategories } from "@/services/job.services";
import { IJobCategory } from "@/types/user.types";
import { Briefcase } from "lucide-react";
import Link from "next/link";

const COLORS = [
    "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
    "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
    "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400",
    "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400",
    "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
    "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
    "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400",
    "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
    "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
];

const TopCategoriesSection = async () => {
    let categories: IJobCategory[] = [];

    try {
        const res = await getJobCategories();
        categories = res?.data ?? [];
    } catch {
        return null;
    }

    if (categories.length === 0) return null;

    // Sort by live job count descending
    const sorted = [...categories].sort(
        (a, b) => (b._count?.jobs ?? 0) - (a._count?.jobs ?? 0)
    );

    // Top 12 with jobs > 0; if fewer than 12, pad with zero-job categories
    const withJobs = sorted.filter((c) => (c._count?.jobs ?? 0) > 0).slice(0, 12);
    const noJobs = sorted.filter((c) => (c._count?.jobs ?? 0) === 0);
    const display = withJobs.length >= 12
        ? withJobs
        : [...withJobs, ...noJobs].slice(0, 12);

    if (display.length === 0) return null;

    return (
        <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-3">Browse by Category</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Explore opportunities across top industries and find the role that fits you best.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {display.map((cat, i) => {
                        const jobCount = cat._count?.jobs ?? 0;
                        return (
                            <Link
                                key={cat.id}
                                href={`/jobs?categoryId=${cat.id}`}
                                className="group"
                            >
                                <div className="flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all text-center cursor-pointer">
                                    <div className={`p-3 rounded-xl ${COLORS[i % COLORS.length]}`}>
                                        <Briefcase className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold leading-tight line-clamp-2">{cat.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {jobCount > 0
                                                ? `${jobCount} job${jobCount !== 1 ? "s" : ""}`
                                                : "No jobs yet"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/jobs"
                        className="text-sm text-primary hover:underline font-medium"
                    >
                        View all jobs →
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TopCategoriesSection;
