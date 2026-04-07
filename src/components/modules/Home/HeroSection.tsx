"use client";

import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    BarChart3,
    Briefcase,
    Building2,
    ChevronDown,
    Code2,
    Megaphone,
    Palette,
    Search,
    ShieldCheck,
    Star,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

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

const categorySlides = [
    {
        icon: Code2,
        title: "Software & Engineering",
        jobs: "2,400+",
        tone: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10",
        description: "Frontend, Backend, DevOps & more",
    },
    {
        icon: Megaphone,
        title: "Marketing & Sales",
        jobs: "1,100+",
        tone: "text-primary",
        bg: "bg-primary/10",
        description: "Digital, Content, Growth & B2B Sales",
    },
    {
        icon: Palette,
        title: "Design & Creative",
        jobs: "680+",
        tone: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-500/10",
        description: "UI/UX, Graphic, Motion & Branding",
    },
    {
        icon: BarChart3,
        title: "Finance & Banking",
        jobs: "850+",
        tone: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        description: "Accounting, Audit & Investment",
    },
    {
        icon: ShieldCheck,
        title: "HR & Administration",
        jobs: "430+",
        tone: "text-pink-600 dark:text-pink-400",
        bg: "bg-pink-500/10",
        description: "Talent, Recruitment & Office Mgmt",
    },
];

const marketCards = [
    {
        title: "Today's priority",
        value: "Frontend / Marketing / Sales",
        note: "Most active categories across the platform",
        icon: Zap,
        tone: "bg-primary/12 text-primary",
    },
    {
        title: "Hiring confidence",
        value: "Verified recruiter network",
        note: "Manually reviewed before listing opens",
        icon: ShieldCheck,
        tone: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
    },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HeroSection() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimating(true);
            setTimeout(() => {
                setActiveSlide((prev) => (prev + 1) % categorySlides.length);
                setAnimating(false);
            }, 300);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const goToSlide = (idx: number) => {
        if (idx === activeSlide) return;
        setAnimating(true);
        setTimeout(() => {
            setActiveSlide(idx);
            setAnimating(false);
        }, 200);
    };

    const handleScrollDown = () => {
        const next = document.getElementById("why-choose-section");
        if (next) {
            next.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollBy({ top: window.innerHeight * 0.7, behavior: "smooth" });
        }
    };

    const slide = categorySlides[activeSlide];

    return (
        <section
            className="relative flex min-h-[60vh] flex-col overflow-hidden pb-6 pt-6 sm:min-h-[62vh] sm:pb-8 sm:pt-8 lg:min-h-[65vh] lg:pb-10"
        >
            <div className="container relative mx-auto flex flex-1 flex-col px-4 sm:px-6 lg:px-8">
                {/* Main hero card */}
                <div className="relative flex-1 overflow-hidden rounded-[2rem] border border-border/60 bg-background/85 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background/90 to-secondary/20 dark:from-primary/12 dark:via-background/85 dark:to-background" />
                    <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-linear-to-l from-primary/10 via-transparent to-transparent lg:block" />
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

                    <div className="relative grid items-center gap-8 px-5 py-7 sm:px-7 sm:py-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-10 xl:px-12">
                        {/* ── Left ── */}
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 shadow-sm">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                                    Bangladesh&apos;s modern hiring platform
                                </span>
                            </div>

                            <h1 className="max-w-xl text-[2.3rem] font-black leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
                                Find the right job
                                <span className="block text-foreground/75">
                                    without wasting weeks.
                                </span>
                                <span className="mt-1 block bg-linear-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                                    Build, apply, track, win.
                                </span>
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                                CareerBangla brings job discovery, ATS resume tools, recruiter
                                verification, and application tracking into one sharper workflow.
                            </p>

                            {/* ── Category Slider ── */}
                            <div className="mt-5 overflow-hidden rounded-2xl border border-border/50 bg-card/70 p-4 shadow-sm backdrop-blur">
                                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                                    Browse by category
                                </p>

                                {/* Slide card */}
                                <div
                                    className={`flex items-center gap-4 transition-all duration-300 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                                        }`}
                                >
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${slide.bg} ${slide.tone}`}>
                                        <slide.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-base font-black ${slide.tone}`}>{slide.title}</p>
                                            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                                                {slide.jobs} jobs
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-muted-foreground">{slide.description}</p>
                                    </div>
                                </div>

                                {/* Dot indicators */}
                                <div className="mt-3 flex items-center gap-1.5">
                                    {categorySlides.map((_, idx) => (
                                        <button
                                            type="button"
                                            key={idx}
                                            onClick={() => goToSlide(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeSlide
                                                ? "w-6 bg-primary"
                                                : "w-1.5 bg-border hover:bg-primary/40"
                                                }`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                    <Link
                                        href="/jobs"
                                        className="ml-auto text-[11px] font-semibold text-primary hover:underline"
                                    >
                                        See all →
                                    </Link>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

                            {/* Social proof */}
                            <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-border/50 bg-card/70 p-3.5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex shrink-0 -space-x-2">
                                        {[
                                            { initials: "R", bg: "from-orange-400 to-orange-600" },
                                            { initials: "F", bg: "from-violet-400 to-violet-600" },
                                            { initials: "T", bg: "from-emerald-400 to-emerald-600" },
                                            { initials: "A", bg: "from-blue-400 to-blue-600" },
                                        ].map((user) => (
                                            <div
                                                key={user.initials}
                                                className={`h-8 w-8 rounded-full border-2 border-background bg-linear-to-br ${user.bg} flex items-center justify-center text-[10px] font-black text-white shadow-md shrink-0`}
                                            >
                                                {user.initials}
                                            </div>
                                        ))}
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-[9px] font-black text-primary-foreground shadow-md shrink-0">
                                            9k+
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <p className="text-xs font-semibold text-foreground">
                                            Trusted by 50,000+ professionals
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 sm:w-auto">
                                    <div className="rounded-2xl bg-primary/10 px-3 py-1.5 text-center">
                                        <p className="text-sm font-black text-primary">1-click</p>
                                        <p className="text-[10px] font-semibold text-muted-foreground">fast apply</p>
                                    </div>
                                    <div className="rounded-2xl bg-emerald-500/10 px-3 py-1.5 text-center">
                                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">Live</p>
                                        <p className="text-[10px] font-semibold text-muted-foreground">tracking</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Right Panel ── */}
                        <div className="relative mx-auto w-full max-w-xl">
                            <div className="absolute -left-4 top-8 hidden h-24 w-24 rounded-full bg-primary/10 blur-2xl sm:block" />
                            <div className="absolute -right-4 bottom-8 hidden h-20 w-20 rounded-full bg-orange-400/10 blur-2xl sm:block" />

                            <div className="glass-strong glass-shadow relative overflow-hidden rounded-[2rem] border border-white/60 p-4 sm:p-5 dark:border-white/10">
                                <div className="absolute inset-0 bg-linear-to-br from-white/75 via-white/45 to-primary/10 dark:from-white/4 dark:via-white/2 dark:to-primary/8" />

                                <div className="relative space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">
                                                Career command center
                                            </p>
                                            <h2 className="mt-1 text-lg font-black tracking-tight text-foreground sm:text-xl">
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
                                                    <p className="mt-1 text-3xl font-black tracking-tight text-white">
                                                        10K+
                                                    </p>
                                                    <p className="text-sm text-white/65">
                                                        Live roles to explore
                                                    </p>
                                                </div>
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                                    <Search className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                                                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                                                    <Search className="h-4 w-4 text-primary" />
                                                    Search jobs, companies, skills
                                                </div>
                                                <div className="mt-2.5 flex flex-wrap gap-2">
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
                                                    className="rounded-[1.5rem] border border-border/50 bg-card/80 p-3 shadow-sm"
                                                >
                                                    <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${card.tone}`}>
                                                        <card.icon className="h-4 w-4" />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/70">
                                                        {card.title}
                                                    </p>
                                                    <p className="mt-1 text-xs font-bold leading-5 text-foreground">
                                                        {card.value}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                                                        {card.note}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        {stats.map((stat) => (
                                            <div
                                                key={stat.label}
                                                className="relative overflow-hidden rounded-4xl border border-border/50 bg-card/80 p-3 shadow-sm"
                                            >
                                                <div className={`absolute right-0 top-0 h-16 w-16 rounded-full bg-linear-to-br ${stat.gradient} blur-2xl`} />
                                                <div className="relative">
                                                    <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br ${stat.gradient} ${stat.iconColor}`}>
                                                        <stat.icon className="h-4 w-4" />
                                                    </div>
                                                    <p className="text-lg font-black tracking-tight text-foreground">{stat.value}</p>
                                                    <p className="mt-0.5 text-[11px] font-bold text-foreground/80">{stat.label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Scroll indicator ── */}
                <div className="mt-4 flex justify-center">
                    <button
                        type="button"
                        onClick={handleScrollDown}
                        className="group flex flex-col items-center gap-1 text-muted-foreground/60 transition-colors hover:text-primary"
                        aria-label="Scroll to next section"
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Explore</span>
                        <ChevronDown className="h-5 w-5 animate-bounce group-hover:text-primary" />
                    </button>
                </div>
            </div>
        </section>
    );
}
