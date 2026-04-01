import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    BarChart3,
    Briefcase,
    Building2,
    CheckCircle2,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stats = [
    {
        value: "10K+",
        label: "Active jobs",
        sublabel: "Fresh roles updated daily",
        icon: Briefcase,
        iconColor: "text-primary",
        gradient: "from-primary/18 to-primary/5",
    },
    {
        value: "5K+",
        label: "Verified companies",
        sublabel: "Screened before going live",
        icon: Building2,
        iconColor: "text-blue-600 dark:text-blue-400",
        gradient: "from-blue-500/18 to-blue-500/5",
    },
    {
        value: "50K+",
        label: "Career builders",
        sublabel: "Professionals growing with us",
        icon: Users,
        iconColor: "text-emerald-600 dark:text-emerald-400",
        gradient: "from-emerald-500/18 to-emerald-500/5",
    },
    {
        value: "95%",
        label: "Placement rate",
        sublabel: "Strong hiring momentum",
        icon: TrendingUp,
        iconColor: "text-violet-600 dark:text-violet-400",
        gradient: "from-violet-500/18 to-violet-500/5",
    },
];

const platformPoints = [
    {
        icon: ShieldCheck,
        title: "Verified hiring ecosystem",
        description: "Real recruiters, real companies, no junk listings.",
        tone: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
    },
    {
        icon: BarChart3,
        title: "ATS-ready resume tools",
        description: "Build, score, and optimize before you apply.",
        tone: "bg-blue-500/12 text-blue-600 dark:text-blue-400",
    },
    {
        icon: Zap,
        title: "Fast application flow",
        description: "Discover, apply, and track everything in one place.",
        tone: "bg-primary/12 text-primary",
    },
];

const marketCards = [
    {
        title: "Today's priority",
        value: "Frontend / Marketing / Sales",
        note: "Most active categories across the platform",
        icon: Sparkles,
        tone: "bg-primary/12 text-primary",
    },
    {
        title: "Hiring confidence",
        value: "Verified recruiter network",
        note: "Manually reviewed before listing opens",
        icon: CheckCircle2,
        tone: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
    },
];

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pb-10 pt-8 sm:pb-12 sm:pt-10 lg:pb-16">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/85 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background/90 to-secondary/20 dark:from-primary/12 dark:via-background/85 dark:to-background" />
                    <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-linear-to-l from-primary/10 via-transparent to-transparent lg:block" />
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

                    <div className="relative grid items-center gap-10 px-5 py-8 sm:px-7 sm:py-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-12 xl:px-12 xl:py-14">
                        <div className="max-w-2xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 shadow-sm">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                                    Bangladesh&apos;s modern hiring platform
                                </span>
                            </div>

                            <div className="space-y-5">
                                <h1 className="max-w-xl text-[2.55rem] font-black leading-[1.02] tracking-tight text-foreground xs:text-4xl sm:text-5xl lg:text-6xl">
                                    Find the right job
                                    <span className="block text-foreground/75">
                                        without wasting weeks.
                                    </span>
                                    <span className="mt-2 block bg-linear-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                                        Build, apply, track, win.
                                    </span>
                                </h1>

                                <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                                    CareerBangla brings job discovery, ATS resume tools, recruiter
                                    verification, and application tracking into one sharper workflow.
                                    It feels closer to a career operating system than a job board.
                                </p>
                            </div>

                            <div className="mt-7 grid gap-3 sm:grid-cols-3">
                                {platformPoints.map((point) => (
                                    <div
                                        key={point.title}
                                        className="rounded-2xl border border-border/50 bg-card/70 p-4 shadow-sm backdrop-blur"
                                    >
                                        <div
                                            className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${point.tone}`}
                                        >
                                            <point.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-sm font-bold text-foreground">
                                            {point.title}
                                        </h3>
                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            {point.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <Button
                                    size="lg"
                                    className="h-12 w-full rounded-full px-7 text-sm font-bold shadow-[0_16px_36px_rgba(255,107,26,0.24)] sm:w-auto"
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
                                    className="h-12 w-full rounded-full border-border/70 bg-background/60 px-7 text-sm font-bold backdrop-blur hover:border-primary/35 hover:bg-primary/5 sm:w-auto"
                                    asChild
                                >
                                    <Link href="/register">
                                        Create Free Account
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-7 flex flex-col gap-4 rounded-3xl border border-border/50 bg-card/70 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {["men/32", "women/44", "women/68", "men/75"].map((portrait) => (
                                            <Image
                                                key={portrait}
                                                src={`https://randomuser.me/api/portraits/${portrait}.jpg`}
                                                alt="CareerBangla user"
                                                width={42}
                                                height={42}
                                                className="rounded-full border-2 border-background object-cover shadow-md"
                                            />
                                        ))}
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-black text-primary-foreground shadow-md">
                                            9k+
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Trusted by 50,000+ professionals
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            From first job seekers to experienced talent.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:w-auto">
                                    <div className="rounded-2xl bg-primary/10 px-3 py-2 text-center">
                                        <p className="text-lg font-black text-primary">1-click</p>
                                        <p className="text-[11px] font-semibold text-muted-foreground">
                                            fast apply
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-emerald-500/10 px-3 py-2 text-center">
                                        <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                                            Live
                                        </p>
                                        <p className="text-[11px] font-semibold text-muted-foreground">
                                            application tracking
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-xl">
                            <div className="absolute -left-4 top-8 hidden h-28 w-28 rounded-full bg-primary/10 blur-2xl sm:block" />
                            <div className="absolute -right-4 bottom-10 hidden h-24 w-24 rounded-full bg-orange-400/10 blur-2xl sm:block" />

                            <div className="glass-strong glass-shadow relative overflow-hidden rounded-[2rem] border border-white/60 p-4 sm:p-5 dark:border-white/10">
                                <div className="absolute inset-0 bg-linear-to-br from-white/75 via-white/45 to-primary/10 dark:from-white/4 dark:via-white/2 dark:to-primary/8" />

                                <div className="relative space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">
                                                Career command center
                                            </p>
                                            <h2 className="mt-1 text-xl font-black tracking-tight text-foreground sm:text-2xl">
                                                Smarter job search starts here
                                            </h2>
                                        </div>
                                        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                            Verified hiring flow
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                                        <div className="rounded-[1.75rem] bg-slate-950 p-4 text-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.8)]">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
                                                        Platform pulse
                                                    </p>
                                                    <p className="mt-1 text-3xl font-black tracking-tight text-white sm:text-[2.4rem]">
                                                        10K+
                                                    </p>
                                                    <p className="text-sm text-white/65">
                                                        Live roles ready to explore
                                                    </p>
                                                </div>
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                                    <Search className="h-6 w-6" />
                                                </div>
                                            </div>

                                            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
                                                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/70">
                                                    <Search className="h-4 w-4 text-primary" />
                                                    Search jobs, companies, or skills
                                                </div>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {["Frontend", "Remote", "Dhaka", "Marketing"].map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/75"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-3">
                                            {marketCards.map((card) => (
                                                <div
                                                    key={card.title}
                                                    className="rounded-[1.5rem] border border-border/50 bg-card/80 p-4 shadow-sm"
                                                >
                                                    <div
                                                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.tone}`}
                                                    >
                                                        <card.icon className="h-5 w-5" />
                                                    </div>
                                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground/70">
                                                        {card.title}
                                                    </p>
                                                    <p className="mt-2 text-sm font-bold leading-6 text-foreground">
                                                        {card.value}
                                                    </p>
                                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                        {card.note}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-3">
                                        {stats.slice(0, 3).map((stat) => (
                                            <div
                                                key={stat.label}
                                                className="relative overflow-hidden rounded-[1.5rem] border border-border/50 bg-card/80 p-4 shadow-sm"
                                            >
                                                <div
                                                    className={`absolute right-0 top-0 h-20 w-20 rounded-full bg-linear-to-br ${stat.gradient} blur-2xl`}
                                                />
                                                <div className="relative">
                                                    <div
                                                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${stat.gradient} ${stat.iconColor}`}
                                                    >
                                                        <stat.icon className="h-5 w-5" />
                                                    </div>
                                                    <p className="text-2xl font-black tracking-tight text-foreground">
                                                        {stat.value}
                                                    </p>
                                                    <p className="mt-1 text-sm font-bold text-foreground/85">
                                                        {stat.label}
                                                    </p>
                                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                        {stat.sublabel}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 rounded-[1.5rem] border border-border/50 bg-card/85 p-4 shadow-sm backdrop-blur">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">
                                            Why it feels faster
                                        </p>
                                        <p className="mt-1 text-base font-bold text-foreground">
                                            Everything important stays visible at a glance
                                        </p>
                                    </div>
                                    <div className="self-start rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground sm:self-auto">
                                        Responsive across mobile, tablet, and desktop
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="group relative overflow-hidden rounded-[1.5rem] border border-border/50 bg-card/80 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div
                                className={`absolute right-0 top-0 h-24 w-24 rounded-full bg-linear-to-br ${stat.gradient} blur-2xl opacity-80`}
                            />
                            <div className="relative">
                                <div
                                    className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${stat.gradient} ${stat.iconColor} transition-transform duration-300 group-hover:scale-110`}
                                >
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-sm font-bold text-foreground">
                                    {stat.label}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                    {stat.sublabel}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
