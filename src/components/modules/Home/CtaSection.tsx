import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Briefcase,
    CheckCircle2,
    FileUser,
    ShieldCheck,
    Sparkles,
    Star,
} from "lucide-react";
import Link from "next/link";

const trustPoints = [
    "Free for job seekers",
    "Verified recruiter network",
    "ATS-ready resume support",
];

const quickActions = [
    {
        title: "Start your account",
        description: "Create your profile and unlock the full job-seeker workflow.",
        href: "/register",
        icon: Sparkles,
        tone: "bg-primary/10 text-primary",
    },
    {
        title: "Explore open jobs",
        description: "Jump straight into live opportunities across top industries.",
        href: "/jobs",
        icon: Briefcase,
        tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
        title: "Build your resume",
        description: "Prepare a stronger profile before you start applying.",
        href: "/register",
        icon: FileUser,
        tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
];

export default function CtaSection() {
    return (
        <section className="relative overflow-hidden bg-background py-16 md:py-24">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-secondary/40 blur-3xl" />
            </div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-[2.2rem] border border-border/60 bg-card/85 p-4 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:p-5 lg:p-6">
                    <div className="grid gap-5 lg:grid-cols-[0.98fr_1.02fr] lg:gap-6">
                        <div className="rounded-[1.9rem] border border-primary/20 bg-slate-950 p-6 text-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)] sm:p-7">
                            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                                Get Started Today
                            </span>

                            <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-[2rem]">
                                Ready to turn job search into real momentum?
                            </h2>

                            <p className="mt-4 max-w-lg text-sm leading-7 text-white/70 sm:text-base">
                                CareerBangla is built to help candidates move with more clarity:
                                better discovery, stronger resumes, cleaner recruiter trust, and a
                                workflow that keeps progress visible.
                            </p>

                            <div className="mt-6 space-y-3">
                                {trustPoints.map((point) => (
                                    <div
                                        key={point}
                                        className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80"
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                        {point}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    size="lg"
                                    className="h-12 w-full rounded-full px-7 text-sm font-bold shadow-[0_16px_36px_rgba(255,107,26,0.24)] sm:w-auto"
                                    asChild
                                >
                                    <Link href="/register">
                                        Get Started Free
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-12 w-full rounded-full border-white/10 bg-white/5 px-7 text-sm font-bold text-white hover:bg-white/10 sm:w-auto"
                                    asChild
                                >
                                    <Link href="/jobs">
                                        Browse Jobs
                                        <Briefcase className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-7 border-t border-white/10 pt-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-2xl font-black text-white">50,000+</p>
                                        <p className="text-xs font-medium text-white/60">
                                            professionals already on the platform
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                        <span className="text-xs font-semibold text-white/70">
                                            Trusted by candidates nationwide
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-rows-[auto_1fr]">
                            <div className="rounded-[1.6rem] border border-border/60 bg-background px-5 py-4 shadow-sm">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                            Final step
                                        </p>
                                        <p className="mt-1 text-base font-bold text-foreground">
                                            Pick the fastest path into the platform
                                        </p>
                                    </div>
                                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-foreground/80">
                                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                        Verified platform
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                {quickActions.map((action) => (
                                    <Link
                                        key={action.title}
                                        href={action.href}
                                        className="group rounded-[1.65rem] border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${action.tone}`}>
                                            <action.icon className="h-5 w-5" />
                                        </div>

                                        <h3 className="mt-5 text-lg font-black tracking-tight text-foreground">
                                            {action.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                            {action.description}
                                        </p>

                                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80">
                                            Continue
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
