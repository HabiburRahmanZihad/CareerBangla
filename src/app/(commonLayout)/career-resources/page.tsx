import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    BarChart3,
    Briefcase,
    CheckCircle2,
    FileUser,
    Search,
    ShieldCheck,
    Target,
} from "lucide-react";
import Link from "next/link";

const resourceCards = [
    {
        icon: FileUser,
        title: "Resume preparation",
        description:
            "Build a cleaner profile, strengthen your resume structure, and present your experience more clearly.",
        tone: "bg-primary/10 text-primary",
    },
    {
        icon: Search,
        title: "Job search strategy",
        description:
            "Use filtering, targeting, and category discovery more intentionally instead of applying randomly.",
        tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
        icon: BarChart3,
        title: "ATS readiness",
        description:
            "Improve the match between your resume and the kinds of roles you want to pursue.",
        tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
        icon: ShieldCheck,
        title: "Safe hiring habits",
        description:
            "Focus on verified employers, cleaner communication, and more trustworthy opportunities.",
        tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
];

const actionSteps = [
    "Build a complete profile before applying broadly",
    "Use filters to narrow roles by fit, not only by title",
    "Improve your resume before applying to high-priority jobs",
    "Track outcomes and learn from application responses",
];

export default function CareerResourcesPage() {
    return (
        <div className="overflow-x-hidden bg-background">
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] border border-border/60 bg-card/85 p-5 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6 lg:p-8">
                        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                            <div className="max-w-3xl">
                                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                                    Career Resources
                                </span>
                                <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                    Practical guidance for better job-search decisions
                                </h1>
                                <p className="mt-5 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                                    This page collects the core areas professionals need to improve:
                                    resume quality, job targeting, ATS readiness, and safer hiring
                                    behavior. The goal is momentum, not information overload.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5">
                                    <p className="text-2xl font-black tracking-tight text-foreground">4</p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Core focus areas
                                    </p>
                                </div>
                                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5">
                                    <p className="text-2xl font-black tracking-tight text-foreground">Clear</p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Action-oriented guidance
                                    </p>
                                </div>
                                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5">
                                    <p className="text-2xl font-black tracking-tight text-foreground">ATS</p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Resume readiness focus
                                    </p>
                                </div>
                                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5">
                                    <p className="text-2xl font-black tracking-tight text-foreground">Safe</p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Verified hiring mindset
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-6 md:py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {resourceCards.map((resource) => (
                            <div
                                key={resource.title}
                                className="rounded-[1.65rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6"
                            >
                                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${resource.tone}`}>
                                    <resource.icon className="h-5 w-5" />
                                </div>
                                <h2 className="mt-5 text-lg font-black tracking-tight text-foreground">
                                    {resource.title}
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                    {resource.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="rounded-[1.8rem] border border-border/60 bg-card p-6 shadow-sm sm:p-7">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                Recommended flow
                            </p>
                            <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground">
                                Use the platform with more intention
                            </h2>

                            <div className="mt-6 space-y-3">
                                {actionSteps.map((step) => (
                                    <div
                                        key={step}
                                        className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80"
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[1.8rem] border border-primary/20 bg-slate-950 p-6 text-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)] sm:p-8">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                Next move
                            </p>
                            <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                                Put these ideas into action
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                                Career resources matter only when they improve decisions. Start with
                                job discovery or resume preparation and build momentum from there.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Button size="lg" className="h-12 rounded-full px-7 text-sm font-bold" asChild>
                                    <Link href="/jobs">
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        Explore Jobs
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-12 rounded-full border-white/10 bg-white/5 px-7 text-sm font-bold text-white hover:bg-white/10"
                                    asChild
                                >
                                    <Link href="/register">
                                        Create Account
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
