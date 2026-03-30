import { getJobCategories } from "@/services/job.services";
import { IJobCategory } from "@/types/user.types";
import {
    ArrowRight,
    Boxes,
    Briefcase,
    BusFront,
    Calculator,
    CalendarDays,
    Code2,
    IdCard,
    Megaphone,
    MessageCircleMore,
    PieChart,
    Scale,
    Stethoscope,
    TrendingUp
} from "lucide-react";
import Link from "next/link";

const ICONS = [
    Code2,
    Megaphone,
    PieChart,
    MessageCircleMore,
    TrendingUp,
    IdCard,
    Scale,
    Calculator,
    CalendarDays,
    Stethoscope,
    Boxes,
    BusFront,
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
        <section className="relative w-full overflow-hidden bg-background py-20 lg:py-32">


            <div className="container relative z-10 mx-auto  px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 relative">
                    {/* Description */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 mx-auto w-fit">
                        Explore opportunities across top industries and find the role that fits you best.
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-foreground tracking-tight">
                        Browse by <span className="text-primary relative inline-block">
                            Category
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 12" preserveAspectRatio="none"><path d="M0,10 Q50,-10 100,10" stroke="currentColor" strokeWidth="4" fill="transparent" /></svg>
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-6">
                    {display.map((cat, i) => {
                        const jobCount = cat._count?.jobs ?? 0;
                        const Icon = ICONS[i % ICONS.length] || Briefcase;

                        return (
                            <Link
                                key={cat.id}
                                href={`/jobs?categoryId=${cat.id}`}
                                className="group flex flex-col justify-between cursor-pointer rounded-[1.5rem] glass-strong glass-shadow border border-border/60 p-4 sm:p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40 dark:hover:shadow-primary/10 relative overflow-hidden"
                            >
                                {/* Card Hover linear */}
                                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <div className="relative z-10">
                                    <div className="mb-4 sm:mb-5 flex justify-center">
                                        <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
                                            <Icon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                    </div>

                                    <h3 className="mb-1 text-[13px] sm:text-[15px] font-bold text-foreground leading-snug line-clamp-3 sm:line-clamp-2 transition-colors group-hover:text-primary wrap-break-word hyphens-auto">
                                        {cat.title}
                                    </h3>
                                </div>

                                <p className="relative z-10 text-xs sm:text-sm font-semibold text-muted-foreground mt-2 sm:mt-3 transition-colors group-hover:text-foreground/80">
                                    {jobCount > 0
                                        ? `${jobCount} open position${jobCount !== 1 ? "s" : ""}`
                                        : "0 open positions"}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-16 flex justify-center">
                    <Link
                        href="/jobs"
                        className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/40 active:translate-y-0"
                    >
                        All Categories
                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TopCategoriesSection;
