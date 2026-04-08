import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    BookOpen,
    Briefcase,
    Clock,
    FileText,
    Lightbulb,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Career Blog | CareerBangla",
    description:
        "Practical career advice, resume tips, interview guides, and job market insights for Bangladesh professionals.",
};

const FEATURED_POST = {
    category: "Career Growth",
    categoryColor: "bg-primary/10 text-primary",
    readTime: "6 min read",
    title: "How to Stand Out in Bangladesh's Competitive Job Market in 2026",
    excerpt:
        "The Bangladeshi job market has evolved rapidly. With more graduates entering tech, business, and creative fields than ever before, your resume alone is no longer enough. Here's how to build a career edge that actually works.",
    author: "Sarah Ahmed",
    date: "April 5, 2026",
    slug: "#",
};

const POSTS = [
    {
        icon: FileText,
        category: "Resume Tips",
        categoryColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        readTime: "4 min read",
        title: "ATS-Proof Your Resume: 7 Things Most Candidates Miss",
        excerpt:
            "Most resumes fail before a human reads them. Applicant Tracking Systems filter out 75% of applications. These fixes will get you past the bots.",
        author: "Rayan Siddique",
        date: "April 2, 2026",
        slug: "#",
    },
    {
        icon: Users,
        category: "Interviews",
        categoryColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        readTime: "5 min read",
        title: "The 10 Most Common Interview Questions in Bangladeshi Tech Companies",
        excerpt:
            "We collected feedback from 200+ interviews at Dhaka-based tech firms. Here are the recurring questions and how to answer them with confidence.",
        author: "Faria Khan",
        date: "March 28, 2026",
        slug: "#",
    },
    {
        icon: TrendingUp,
        category: "Job Market",
        categoryColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
        readTime: "7 min read",
        title: "Top 10 In-Demand Skills in Bangladesh for 2026",
        excerpt:
            "From React and Python to digital marketing and supply chain management — here are the skills employers are actively hiring for right now.",
        author: "Karim Hassan",
        date: "March 21, 2026",
        slug: "#",
    },
    {
        icon: Lightbulb,
        category: "Career Advice",
        categoryColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        readTime: "3 min read",
        title: "From Fresher to Hired: A 30-Day Action Plan",
        excerpt:
            "No experience, no network, no problem. This structured 30-day plan has helped hundreds of fresh graduates land their first job.",
        author: "Sarah Ahmed",
        date: "March 15, 2026",
        slug: "#",
    },
    {
        icon: Briefcase,
        category: "Salary Guide",
        categoryColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        readTime: "5 min read",
        title: "Bangladesh Salary Benchmarks 2026: Know Your Worth",
        excerpt:
            "Are you being paid fairly? We analyzed thousands of job listings to build a salary reference guide across tech, finance, marketing, and more.",
        author: "Rayan Siddique",
        date: "March 10, 2026",
        slug: "#",
    },
    {
        icon: BookOpen,
        category: "Platform Guide",
        categoryColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
        readTime: "3 min read",
        title: "How to Use CareerBangla's AI Tools to Get More Interviews",
        excerpt:
            "CareerBot, ATS score analysis, and smart job suggestions aren't just features — they're a system. Here's how to use them together effectively.",
        author: "Faria Khan",
        date: "March 3, 2026",
        slug: "#",
    },
];

const CATEGORIES = [
    { label: "All Posts", active: true },
    { label: "Resume Tips", active: false },
    { label: "Interviews", active: false },
    { label: "Job Market", active: false },
    { label: "Career Advice", active: false },
    { label: "Salary Guide", active: false },
    { label: "Platform Guide", active: false },
];

export default function BlogPage() {
    return (
        <div className="overflow-x-hidden bg-background">
            {/* Hero */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] border border-border/60 bg-card/85 p-5 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6 lg:p-8">
                        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                            <div className="max-w-3xl">
                                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                                    Career Blog
                                </span>
                                <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                    Practical advice for your career in Bangladesh
                                </h1>
                                <p className="mt-5 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                                    Resume writing, interview prep, salary insights, and job market
                                    analysis — written for professionals navigating the Bangladeshi
                                    job landscape.
                                </p>
                                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        size="lg"
                                        className="h-12 rounded-full px-7 text-sm font-bold"
                                        asChild
                                    >
                                        <Link href="/jobs">
                                            <Briefcase className="mr-2 h-4 w-4" />
                                            Browse Jobs
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-12 rounded-full px-7 text-sm font-bold"
                                        asChild
                                    >
                                        <Link href="/help">
                                            Help Center
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5">
                                    <p className="text-2xl font-black tracking-tight text-foreground">
                                        Weekly
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        New articles every week
                                    </p>
                                </div>
                                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5">
                                    <p className="text-2xl font-black tracking-tight text-foreground">
                                        BD
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Bangladesh job market focused
                                    </p>
                                </div>
                                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5">
                                    <p className="text-2xl font-black tracking-tight text-foreground">
                                        Free
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        All articles free to read
                                    </p>
                                </div>
                                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5">
                                    <p className="text-2xl font-black tracking-tight text-foreground">
                                        AI
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        AI-powered career tips
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-4 md:py-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                            Featured Article
                        </p>
                    </div>
                    <Link href={FEATURED_POST.slug} className="group block">
                        <div className="rounded-[2rem] border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
                            <div className="flex flex-wrap items-center gap-3">
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${FEATURED_POST.categoryColor}`}
                                >
                                    {FEATURED_POST.category}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    {FEATURED_POST.readTime}
                                </span>
                            </div>
                            <h2 className="mt-4 text-2xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
                                {FEATURED_POST.title}
                            </h2>
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                                {FEATURED_POST.excerpt}
                            </p>
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">
                                            {FEATURED_POST.author}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {FEATURED_POST.date}
                                        </p>
                                    </div>
                                </div>
                                <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                                    Read Article
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Category Filter */}
            <section className="pt-12 pb-2">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.label}
                                className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                                    cat.active
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Posts */}
            <section className="py-10 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {POSTS.map((post) => (
                            <Link key={post.title} href={post.slug} className="group block">
                                <div className="flex h-full flex-col rounded-[1.65rem] border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${post.categoryColor}`}
                                        >
                                            <post.icon className="h-5 w-5" />
                                        </div>
                                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {post.readTime}
                                        </span>
                                    </div>

                                    <span
                                        className={`mt-4 inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${post.categoryColor}`}
                                    >
                                        {post.category}
                                    </span>

                                    <h3 className="mt-3 text-lg font-black leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                                        {post.title}
                                    </h3>
                                    <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
                                        <div>
                                            <p className="text-xs font-semibold text-foreground">
                                                {post.author}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {post.date}
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] border border-primary/20 bg-slate-950 p-6 text-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)] sm:p-8 lg:p-10">
                        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div className="max-w-2xl">
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                    Stay Updated
                                </p>
                                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                                    Get career insights in your inbox
                                </h2>
                                <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                                    New articles on resume writing, interview prep, and the
                                    Bangladesh job market — delivered weekly. No spam.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button
                                    size="lg"
                                    className="h-12 rounded-full px-7 text-sm font-bold"
                                    asChild
                                >
                                    <Link href="/register">
                                        Create Free Account
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-12 rounded-full border-white/10 bg-white/5 px-7 text-sm font-bold text-white hover:bg-white/10"
                                    asChild
                                >
                                    <Link href="/jobs">Browse Jobs</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
