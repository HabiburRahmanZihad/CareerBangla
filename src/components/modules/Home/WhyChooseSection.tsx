import SectionHeader from "@/components/modules/Home/SectionHeader";
import {
    Award,
    CheckCircle2,
    Clock3,
    ShieldCheck,
    Sparkles,
    Target,
} from "lucide-react";

const whyChoose = [
    {
        icon: ShieldCheck,
        eyebrow: "Trust Layer",
        title: "Verified Community",
        description:
            "Recruiters and companies go through review before they appear on the platform, which keeps fake posts and low-quality outreach out of your workflow.",
        proof: "Manual review before listing",
        accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        border: "hover:border-emerald-200 dark:hover:border-emerald-900/60",
    },
    {
        icon: Target,
        eyebrow: "Matching Engine",
        title: "Smarter Job Discovery",
        description:
            "Instead of forcing users to dig through noise, the platform pushes attention toward relevant jobs based on skills, goals, and experience depth.",
        proof: "Built for stronger fit, not more clutter",
        accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        border: "hover:border-blue-200 dark:hover:border-blue-900/60",
    },
    {
        icon: Award,
        eyebrow: "Candidate Value",
        title: "Free Core Tools",
        description:
            "Resume building, ATS scoring, application tracking, and job search stay accessible to job seekers without locking the important workflow behind paywalls.",
        proof: "Career tools available from day one",
        accent: "bg-primary/10 text-primary",
        border: "hover:border-primary/30",
    },
];

const trustSignals = [
    { label: "Verified employers", value: "5K+" },
    { label: "Active candidates", value: "50K+" },
    { label: "Average hiring speed", value: "30 days" },
];

const operatingPoints = [
    {
        icon: CheckCircle2,
        title: "Cleaner hiring signal",
        text: "Less spam, less guesswork, and clearer recruiter intent.",
        tone: "text-emerald-600 dark:text-emerald-400",
    },
    {
        icon: Clock3,
        title: "Faster decision path",
        text: "Users can move from search to application without bouncing across tools.",
        tone: "text-blue-600 dark:text-blue-400",
    },
    {
        icon: Sparkles,
        title: "Better experience quality",
        text: "The platform is designed to feel premium without becoming heavy or confusing.",
        tone: "text-primary",
    },
];

export default function WhyChooseSection() {
    return (
        <section className="relative overflow-hidden border-y border-border/50 bg-muted/30 py-16 md:py-24">
            {/* <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-secondary/50 blur-3xl" />
            </div> */}

            <div className="container relative mx-auto  px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
                    <div className="glass-strong glass-shadow rounded-[2rem] border border-border/60 p-6 sm:p-7 lg:p-8">
                        <SectionHeader
                            tag="Why us"
                            title="Built for Bangladesh's Job Market"
                            description="We solve the real friction in hiring: fake listings, weak matching, and scattered career tools. The experience is designed to be cleaner, faster, and more dependable."
                        />

                        <div className="space-y-4">
                            {operatingPoints.map((point) => (
                                <div
                                    key={point.title}
                                    className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/70 p-4"
                                >
                                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background">
                                        <point.icon className={`h-5 w-5 ${point.tone}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground">
                                            {point.title}
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            {point.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-[1.75rem] border border-border/60 bg-card p-4 sm:p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                        Platform confidence
                                    </p>
                                    <p className="mt-1 text-base font-bold text-foreground">
                                        A hiring experience that reduces noise
                                    </p>
                                </div>
                                <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    Candidate-first workflow
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {trustSignals.map((signal) => (
                                    <div
                                        key={signal.label}
                                        className="rounded-2xl bg-background p-4 text-center shadow-sm"
                                    >
                                        <p className="text-2xl font-black tracking-tight text-foreground">
                                            {signal.value}
                                        </p>
                                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                            {signal.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:gap-5">
                        {whyChoose.map((item, index) => (
                            <article
                                key={item.title}
                                className={`group relative overflow-hidden rounded-[1.9rem] border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.border}`}
                            >
                                <div className="absolute right-5 top-5 flex h-8 min-w-8 items-center justify-center rounded-full border border-border/60 bg-background px-2 text-[11px] font-black text-muted-foreground">
                                    0{index + 1}
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${item.accent}`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div className="max-w-xl">
                                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                                                {item.eyebrow}
                                            </p>
                                            <h3 className="mt-1 text-lg font-black tracking-tight text-foreground sm:text-xl">
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                        {item.proof}
                                    </div>
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Designed to improve trust and speed together
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
