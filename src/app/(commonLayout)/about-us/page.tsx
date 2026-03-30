import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Briefcase,
    Lightbulb,
    Shield,
    Target,
    Users
} from "lucide-react";
import Link from "next/link";

const values = [
    {
        icon: Target,
        title: "Job-seeker first",
        description:
            "We design features around career progress, not vanity metrics or unnecessary complexity.",
        tone: "bg-primary/10 text-primary",
    },
    {
        icon: Shield,
        title: "Trust and safety",
        description:
            "Verified recruiters, cleaner listings, and a safer hiring experience remain core to the platform.",
        tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
        icon: Lightbulb,
        title: "Practical innovation",
        description:
            "We use technology to reduce friction and improve outcomes, not to add noise to the workflow.",
        tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
        icon: Users,
        title: "Real community",
        description:
            "CareerBangla grows by supporting professionals, recruiters, and companies across Bangladesh together.",
        tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
];

const stats = [
    {
        value: "50K+",
        label: "Professionals on the platform",
    },
    {
        value: "5K+",
        label: "Verified companies",
    },
    {
        value: "10K+",
        label: "Live job opportunities",
    },
    {
        value: "95%",
        label: "Matching success momentum",
    },
];

const timeline = [
    {
        year: "2023",
        title: "CareerBangla started",
        description:
            "The platform launched with a simple goal: make job search in Bangladesh more trustworthy and easier to navigate.",
    },
    {
        year: "2024",
        title: "Resume and verification tools expanded",
        description:
            "We added resume-building support and a stronger verification layer to improve both candidate readiness and recruiter trust.",
    },
    {
        year: "2025",
        title: "Employer network scaled",
        description:
            "Partnerships across startups, SMEs, and established companies helped widen access to better opportunities.",
    },
    {
        year: "2026",
        title: "Workflow became more intelligent",
        description:
            "Smarter matching and cleaner hiring flows pushed the platform closer to a full career operating system.",
    },
];

const teamMembers = [
    {
        name: "Sarah Ahmed",
        role: "Founder & CEO",
        description:
            "Leads product direction and long-term strategy with a strong focus on HR technology and career access.",
    },
    {
        name: "Karim Hassan",
        role: "CTO & Co-Founder",
        description:
            "Owns platform architecture and helps turn product complexity into a smoother, more reliable experience.",
    },
    {
        name: "Faria Khan",
        role: "Head of Partnerships",
        description:
            "Builds the employer network and keeps company relationships aligned with quality hiring standards.",
    },
    {
        name: "Rayan Siddique",
        role: "Head of Experience",
        description:
            "Shapes user flows across candidate and recruiter journeys to keep the platform clear and practical.",
    },
];

export default function AboutUsPage() {
    return (
        <div className="overflow-x-hidden bg-background">
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] border border-border/60 bg-card/85 p-5 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6 lg:p-8">
                        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                            <div className="max-w-3xl">
                                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                                    About CareerBangla
                                </span>
                                <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                    Building a better hiring experience for Bangladesh
                                </h1>
                                <p className="mt-5 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                                    CareerBangla exists to connect professionals with verified
                                    employers through a workflow that feels clearer, safer, and more
                                    useful than the traditional job-board model. We focus on real
                                    hiring momentum, not clutter.
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
                                        <Link href="/register">
                                            Create Account
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5"
                                    >
                                        <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                                            {stat.value}
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-6 md:py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-[1.8rem] border border-border/60 bg-card p-6 shadow-sm sm:p-7">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                Our mission
                            </p>
                            <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground">
                                Make job search more trustworthy and useful
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                                We want professionals to find relevant opportunities faster, prepare
                                better, and connect with real employers through a cleaner hiring
                                process.
                            </p>
                        </div>

                        <div className="rounded-[1.8rem] border border-border/60 bg-card p-6 shadow-sm sm:p-7">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                Our vision
                            </p>
                            <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground">
                                Become the most trusted career platform in the region
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                                We are building toward a future where career growth is driven by
                                talent, readiness, and access to quality employers rather than
                                connections or luck.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 max-w-2xl">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                            Core Values
                        </p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
                            Principles behind every product decision
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="rounded-[1.65rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6"
                            >
                                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${value.tone}`}>
                                    <value.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-5 text-lg font-black tracking-tight text-foreground">
                                    {value.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                Our Journey
                            </p>
                            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
                                How the platform evolved
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                                CareerBangla has grown step by step by focusing on trust, employer
                                quality, and better workflows for both candidates and recruiters.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {timeline.map((item) => (
                                <div
                                    key={item.year}
                                    className="rounded-[1.6rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                        <div className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                                            {item.year}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black tracking-tight text-foreground">
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 max-w-2xl">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                            Team
                        </p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
                            The people behind the platform
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {teamMembers.map((member) => (
                            <div
                                key={member.name}
                                className="rounded-[1.65rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Users className="h-5 w-5" />
                                </div>
                                <h3 className="mt-5 text-lg font-black tracking-tight text-foreground">
                                    {member.name}
                                </h3>
                                <p className="mt-1 text-sm font-semibold text-primary">
                                    {member.role}
                                </p>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] border border-primary/20 bg-slate-950 p-6 text-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)] sm:p-8 lg:p-10">
                        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div className="max-w-2xl">
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                    Join CareerBangla
                                </p>
                                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                                    Ready to explore better opportunities?
                                </h2>
                                <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                                    Join thousands of professionals who are using CareerBangla to
                                    discover jobs, improve their profiles, and connect with verified
                                    employers.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
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
                                    className="h-12 rounded-full border-white/10 bg-white/5 px-7 text-sm font-bold text-white hover:bg-white/10"
                                    asChild
                                >
                                    <Link href="/register">
                                        Get Started
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
