import SectionHeader from "@/components/modules/Home/SectionHeader";
import {
    BarChart3,
    Building2,
    CheckCircle2,
    FileUser,
    Search,
    Shield,
    Users,
} from "lucide-react";

const features = [
    {
        icon: Search,
        tag: "01",
        title: "Smart Job Search",
        description:
            "Search by salary, location, skills, and experience so candidates can get to the right jobs faster instead of sifting through noise.",
        detailOne: "Deep filtering by role and experience",
        detailTwo: "Built for sharper discovery, not bulk scrolling",
        audience: "For job seekers",
        iconTone: "text-primary",
        badgeTone: "border-primary/20 bg-primary/10 text-primary",
        panelTone: "bg-slate-950 text-white",
        mutedTone: "text-white/65",
        borderTone: "border-white/10",
        className: "lg:col-span-7 lg:row-span-2",
    },
    {
        icon: FileUser,
        tag: "02",
        title: "ATS Resume Builder",
        description:
            "Build stronger resumes with structured sections and completion guidance that helps candidates prepare before applying.",
        audience: "Profile tools",
        iconTone: "text-blue-600 dark:text-blue-400",
        badgeTone: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300",
        panelTone: "bg-card",
        mutedTone: "text-muted-foreground",
        borderTone: "border-border/60 hover:border-blue-200 dark:hover:border-blue-900/60",
        className: "lg:col-span-5",
    },
    {
        icon: BarChart3,
        tag: "03",
        title: "ATS Score Checker",
        description:
            "Compare resumes against job requirements and spot what needs improvement before the application is sent.",
        audience: "Optimization",
        iconTone: "text-violet-600 dark:text-violet-400",
        badgeTone: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-300",
        panelTone: "bg-card",
        mutedTone: "text-muted-foreground",
        borderTone: "border-border/60 hover:border-violet-200 dark:hover:border-violet-900/60",
        className: "lg:col-span-5",
    },
    {
        icon: Building2,
        tag: "04",
        title: "Company Profiles",
        description:
            "See culture, team context, and employer details before applying so decisions feel more informed.",
        audience: "Research",
        iconTone: "text-indigo-600 dark:text-indigo-400",
        badgeTone: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-300",
        panelTone: "bg-card",
        mutedTone: "text-muted-foreground",
        borderTone: "border-border/60 hover:border-indigo-200 dark:hover:border-indigo-900/60",
        className: "lg:col-span-4",
    },
    {
        icon: Shield,
        tag: "05",
        title: "Verified Recruiters",
        description:
            "Every recruiter goes through review before appearing on the platform, which raises trust across the hiring flow.",
        audience: "Trust layer",
        iconTone: "text-emerald-600 dark:text-emerald-400",
        badgeTone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
        panelTone: "bg-card",
        mutedTone: "text-muted-foreground",
        borderTone: "border-border/60 hover:border-emerald-200 dark:hover:border-emerald-900/60",
        className: "lg:col-span-4",
    },
    {
        icon: Users,
        tag: "06",
        title: "Candidate Search",
        description:
            "Recruiters can discover relevant talent by skills, experience, and location from one cleaner workspace.",
        audience: "Recruiter tools",
        iconTone: "text-cyan-600 dark:text-cyan-400",
        badgeTone: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-300",
        panelTone: "bg-card",
        mutedTone: "text-muted-foreground",
        borderTone: "border-border/60 hover:border-cyan-200 dark:hover:border-cyan-900/60",
        className: "lg:col-span-4",
    },
];

const platformSignals = [
    { label: "Core tools", value: "6" },
    { label: "Candidate + recruiter workflow", value: "Unified" },
    { label: "Verified trust model", value: "Built-in" },
];

export default function PlatformFeaturesSection() {
    const featured = features[0];
    const secondary = features.slice(1, 3);
    const bottomRow = features.slice(3);

    return (
        <section className="relative overflow-hidden bg-background py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
                    <SectionHeader
                        tag="Platform"
                        title="One Product, Multiple Career Workflows"
                        description="Instead of isolated tools, CareerBangla packages search, resume building, recruiter trust, and candidate sourcing into one connected system."
                    />

                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:w-136">
                        {platformSignals.map((signal) => (
                            <div
                                key={signal.label}
                                className="rounded-2xl border border-border/60 bg-card px-4 py-3 text-center shadow-sm"
                            >
                                <p className="text-sm font-black tracking-tight text-foreground sm:text-base">
                                    {signal.value}
                                </p>
                                <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                                    {signal.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
                    <article
                        className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.7)] sm:p-7 ${featured.className} ${featured.panelTone} ${featured.borderTone}`}
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="max-w-xl">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                            <featured.icon className={`h-6 w-6 ${featured.iconTone}`} />
                                        </div>
                                        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black tracking-[0.18em] text-white/60">
                                            FEATURE {featured.tag}
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/55">
                                        {featured.audience}
                                    </p>
                                    <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                                        {featured.title}
                                    </h3>
                                    <p className={`mt-3 max-w-lg text-sm leading-7 ${featured.mutedTone}`}>
                                        {featured.description}
                                    </p>
                                </div>

                                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80">
                                    Platform anchor tool
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55">
                                        What it solves
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-white">
                                        {featured.detailOne}
                                    </p>
                                </div>
                                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55">
                                        Why it matters
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-white">
                                        {featured.detailTwo}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 sm:p-5">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55">
                                            Search workspace
                                        </p>
                                        <p className="mt-2 text-base font-bold text-white">
                                            Role, salary, location, and experience all stay visible
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                        Designed for faster filtering
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    <div className="grid gap-4 lg:col-span-5 lg:gap-5">
                        {secondary.map((feature) => (
                            <article
                                key={feature.title}
                                className={`group rounded-[1.8rem] border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 ${feature.panelTone} ${feature.borderTone}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.badgeTone}`}>
                                        <feature.icon className={`h-5 w-5 ${feature.iconTone}`} />
                                    </div>
                                    <div className={`rounded-full border px-3 py-1 text-[11px] font-black tracking-[0.18em] ${feature.badgeTone}`}>
                                        {feature.tag}
                                    </div>
                                </div>

                                <p className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                                    {feature.audience}
                                </p>
                                <h3 className="mt-2 text-xl font-black tracking-tight text-foreground">
                                    {feature.title}
                                </h3>
                                <p className={`mt-3 text-sm leading-7 ${feature.mutedTone}`}>
                                    {feature.description}
                                </p>
                            </article>
                        ))}
                    </div>

                    {bottomRow.map((feature) => (
                        <article
                            key={feature.title}
                            className={`group rounded-[1.7rem] border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${feature.className} ${feature.panelTone} ${feature.borderTone}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${feature.badgeTone}`}>
                                    <feature.icon className={`h-5 w-5 ${feature.iconTone}`} />
                                </div>
                                <div className={`rounded-full border px-3 py-1 text-[11px] font-black tracking-[0.18em] ${feature.badgeTone}`}>
                                    {feature.tag}
                                </div>
                            </div>

                            <h3 className="mt-5 text-lg font-black tracking-tight text-foreground">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground/70">
                                {feature.audience}
                            </p>
                            <p className={`mt-3 text-sm leading-7 ${feature.mutedTone}`}>
                                {feature.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
