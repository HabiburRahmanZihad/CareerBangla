import AppDownloadSection from "@/components/modules/Home/AppDownloadSection";
import CvBannerSection from "@/components/modules/Home/CvBannerSection";
import EmployerCandidateBanner from "@/components/modules/Home/EmployerCandidateBanner";
import TopCategoriesSection from "@/components/modules/Home/TopCategoriesSection";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Award,
    BarChart3,
    Briefcase,
    Building2,
    CheckCircle2,
    FileUser,
    Search,
    Shield,
    Sparkles,
    Star,
    TrendingUp,
    UserPlus,
    Users,
    Zap,
} from "lucide-react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
    { value: "10K+", label: "Active Jobs", sublabel: "Updated daily" },
    { value: "5K+", label: "Verified Companies", sublabel: "Across Bangladesh" },
    { value: "50K+", label: "Registered Users", sublabel: "And growing fast" },
    { value: "95%", label: "Placement Rate", sublabel: "30-day average" },
];

const howItWorks = [
    {
        step: "01",
        icon: UserPlus,
        title: "Create Your Profile",
        description:
            "Build an ATS-optimized resume in minutes using our step-by-step builder with skill-matching tools.",
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
        borderHover: "hover:border-blue-200 dark:hover:border-blue-800/50",
    },
    {
        step: "02",
        icon: Search,
        title: "Discover Opportunities",
        description:
            "Browse thousands of verified job listings filtered by role, salary, location, and company size.",
        iconColor: "text-primary",
        iconBg: "bg-primary/10",
        borderHover: "hover:border-primary/25",
    },
    {
        step: "03",
        icon: CheckCircle2,
        title: "Apply & Get Hired",
        description:
            "One-click applications, real-time tracking, and direct recruiter connections — built for speed.",
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-500/10",
        borderHover: "hover:border-emerald-200 dark:hover:border-emerald-800/50",
    },
];

const whyChoose = [
    {
        icon: CheckCircle2,
        title: "Verified Community",
        description:
            "All recruiters and companies pass a strict verification process before going live — zero spam, zero fakes.",
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-500/10",
        borderHover: "hover:border-emerald-200 dark:hover:border-emerald-800/50",
    },
    {
        icon: Sparkles,
        title: "Smart Matching",
        description:
            "AI-powered matching connects you with roles that truly fit your skills, goals, and experience level.",
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
        borderHover: "hover:border-blue-200 dark:hover:border-blue-800/50",
    },
    {
        icon: Award,
        title: "Free for Job Seekers",
        description:
            "Resume builder, job search, ATS scoring, and application tracking — all 100% free, forever.",
        iconColor: "text-primary",
        iconBg: "bg-primary/10",
        borderHover: "hover:border-primary/25",
    },
];

const features = [
    {
        icon: Search,
        tag: "01",
        title: "Smart Job Search",
        description: "Filter by location, salary, skills, and experience for precision results.",
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
    },
    {
        icon: FileUser,
        tag: "02",
        title: "ATS Resume Builder",
        description: "Build ATS-optimized resumes with real-time section completion tracking.",
        iconColor: "text-primary",
        iconBg: "bg-primary/10",
    },
    {
        icon: BarChart3,
        tag: "03",
        title: "ATS Score Checker",
        description: "Compare your resume against any job description and get an instant match score.",
        iconColor: "text-violet-500",
        iconBg: "bg-violet-500/10",
    },
    {
        icon: Building2,
        tag: "04",
        title: "Company Profiles",
        description: "Explore company culture, team size, benefits, and direct recruiter contacts.",
        iconColor: "text-indigo-500",
        iconBg: "bg-indigo-500/10",
    },
    {
        icon: Shield,
        tag: "05",
        title: "Verified Recruiters",
        description: "Every recruiter manually reviewed before listing — no spam, no fakes.",
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-500/10",
    },
    {
        icon: Users,
        tag: "06",
        title: "Candidate Search",
        description: "Recruiters find top talent by skills, experience, and location instantly.",
        iconColor: "text-cyan-500",
        iconBg: "bg-cyan-500/10",
    },
];

const keyHighlights = [
    {
        icon: TrendingUp,
        title: "Career Growth",
        description: "Access roles from Bangladesh's leading employers across all major industries.",
        stat: "500+ Companies",
        iconGradient: "from-blue-500 to-indigo-500",
    },
    {
        icon: Zap,
        title: "Fast Hiring",
        description: "Smart matching helps candidates get hired up to 3× faster than traditional boards.",
        stat: "30-Day Average",
        iconGradient: "from-primary to-orange-400",
    },
    {
        icon: Award,
        title: "Professional Tools",
        description: "ATS analytics, recruiter dashboards, and resume scoring — premium tools included.",
        stat: "6 Core Tools",
        iconGradient: "from-violet-500 to-purple-500",
    },
];

const testimonials = [
    {
        name: "Rahim Uddin",
        role: "Software Engineer",
        company: "BRAC IT Services",
        text: "CareerBangla helped me land my first tech job in just 2 weeks. The ATS resume builder was a complete game-changer for breaking into the industry.",
        portrait: "men/32",
        rating: 5,
    },
    {
        name: "Fariha Islam",
        role: "Marketing Manager",
        company: "Shohoz",
        text: "The smart matching system showed me jobs I would never have found on my own. Got 3 interview calls in a single week — absolutely brilliant.",
        portrait: "women/44",
        rating: 5,
    },
    {
        name: "Tanvir Ahmed",
        role: "Product Designer",
        company: "Pathao",
        text: "Switched careers entirely through CareerBangla. The verified recruiter network means zero spam — only quality opportunities from day one.",
        portrait: "men/68",
        rating: 5,
    },
];

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({
    tag,
    title,
    description,
    center = false,
}: {
    tag: string;
    title: string;
    description?: string;
    center?: boolean;
}) {
    return (
        <div className={`mb-10 flex flex-col gap-2.5 ${center ? "items-center text-center mx-auto" : ""}`}>
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-primary">{tag}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug max-w-xl">
                {title}
            </h2>
            {description && (
                <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed max-w-xl">
                    {description}
                </p>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
    return (
        <div className="overflow-x-hidden">

            {/* ══════════════════════════════════════════
                HERO
            ══════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-slate-950 py-20 md:py-28 lg:py-32">
                {/* Ambient blobs */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-48 -top-24 h-[650px] w-[650px] rounded-full bg-primary/10 blur-[150px]" />
                    <div className="absolute -right-24 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/8 blur-[120px]" />
                    <div className="absolute left-1/2 top-1/3 -translate-x-1/2 h-[300px] w-[500px] rounded-full bg-violet-600/5 blur-[100px]" />
                </div>
                {/* Subtle dot grid */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />
                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-slate-950 to-transparent" />

                <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

                        {/* ── Left: Text Content ── */}
                        <div>
                            {/* Badge */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
                                    Bangladesh&apos;s #1 Job Portal
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-5">
                                Find Your Dream Job<br />
                                <span className="bg-linear-to-r from-primary via-orange-400 to-amber-400 bg-clip-text text-transparent">
                                    Faster Than Ever.
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed mb-8">
                                CareerBangla connects top talent with verified employers across
                                Bangladesh. Search thousands of real jobs, build your ATS resume,
                                and get hired — all on one platform.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 h-12 rounded-xl shadow-lg shadow-primary/20"
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
                                    className="border-white/15 text-white hover:bg-white/10 font-semibold h-12 rounded-xl bg-white/5 backdrop-blur-sm"
                                    asChild
                                >
                                    <Link href="/register">
                                        Create Free Account
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Social proof */}
                            <div className="mt-9 flex flex-wrap items-center gap-4 pt-8 border-t border-white/10">
                                <div className="flex -space-x-2.5">
                                    {["men/32", "women/44", "women/68", "men/75"].map((p, i) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            key={i}
                                            src={`https://randomuser.me/api/portraits/${p}.jpg`}
                                            alt="User"
                                            className="h-9 w-9 rounded-full border-2 border-slate-950 object-cover"
                                        />
                                    ))}
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-950 bg-primary text-[10px] font-black text-primary-foreground">
                                        9k+
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-0.5 mb-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-[12px] text-slate-400">
                                        Trusted by{" "}
                                        <span className="text-white font-semibold">50,000+</span>{" "}
                                        professionals
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Stats Cards Grid ── */}
                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            {stats.map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className={`rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur-sm hover:border-primary/30 hover:bg-white/8 transition-all duration-300 ${i % 2 === 1 ? "translate-y-6" : ""}`}
                                >
                                    <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                                    <p className="text-sm font-semibold text-white">{stat.label}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{stat.sublabel}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats strip (mobile / tablet only) ── */}
            <section className="lg:hidden bg-slate-900 border-b border-white/5">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-2 divide-x divide-y divide-white/5">
                        {stats.map((stat) => (
                            <div key={stat.label} className="py-5 px-4 text-center">
                                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                <p className="text-xs font-medium text-slate-300 mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                HOW IT WORKS
            ══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        tag="Process"
                        title="Get Hired in 3 Simple Steps"
                        description="CareerBangla streamlines every step of your job search — from building your resume to getting the offer letter."
                        center
                    />
                    <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
                        {/* Connector lines (desktop) */}
                        <div className="hidden sm:block absolute top-11 left-[36%] w-[28%] h-px bg-linear-to-r from-transparent via-border/80 to-transparent pointer-events-none" />
                        <div className="hidden sm:block absolute top-11 left-[64%] w-[28%] h-px bg-linear-to-r from-transparent via-border/80 to-transparent pointer-events-none" />

                        {howItWorks.map((step) => (
                            <div
                                key={step.step}
                                className={`group flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300 ${step.borderHover}`}
                            >
                                <div className={`mb-4 h-14 w-14 rounded-2xl ${step.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                                </div>
                                <span className="text-[10px] font-black tracking-[0.22em] uppercase text-muted-foreground/40 mb-2">
                                    Step {step.step}
                                </span>
                                <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                WHY CHOOSE
            ══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        tag="Why us"
                        title="Built for Bangladesh's Job Market"
                        description="We solve the real problems — fake listings, slow hiring, and poor matching. CareerBangla is engineered for results."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {whyChoose.map((item) => (
                            <div
                                key={item.title}
                                className={`group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg transition-all duration-300 ${item.borderHover}`}
                            >
                                <div className={`mb-4 h-11 w-11 rounded-xl ${item.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                                </div>
                                <h3 className="text-base font-semibold text-foreground mb-1.5">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                PLATFORM FEATURES
            ══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        tag="Platform"
                        title="Powerful Tools for Everyone"
                        description="From building the perfect resume to sourcing top candidates — one platform handles the entire hiring journey."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="group relative rounded-2xl border border-border/50 bg-card p-6 hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                                {/* Number watermark */}
                                <span className="absolute top-4 right-4 text-[11px] font-black text-muted-foreground/15 tabular-nums select-none">
                                    {feature.tag}
                                </span>
                                <div className={`mb-4 h-11 w-11 rounded-xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                                </div>
                                <h3 className="text-base font-semibold text-foreground mb-1.5">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                KEY HIGHLIGHTS
            ══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        tag="Results"
                        title="What Makes Us Different"
                        description="Proven outcomes that set CareerBangla apart from every other job portal in Bangladesh."
                        center
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {keyHighlights.map((item) => (
                            <div
                                key={item.title}
                                className="group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="mb-5 flex items-center justify-between">
                                    <div className={`h-11 w-11 rounded-xl bg-linear-to-br ${item.iconGradient} flex items-center justify-center shadow-sm`}>
                                        <item.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/15 px-2.5 py-1 rounded-full tracking-wide">
                                        {item.stat}
                                    </span>
                                </div>
                                <h3 className="text-base font-semibold text-foreground mb-1.5">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                TESTIMONIALS
            ══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        tag="Success Stories"
                        title="Real People. Real Results."
                        description="Thousands of professionals across Bangladesh found their dream jobs through CareerBangla."
                        center
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {testimonials.map((t) => (
                            <div
                                key={t.name}
                                className="rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg hover:border-border transition-all duration-300 flex flex-col"
                            >
                                {/* Stars */}
                                <div className="flex items-center gap-0.5 mb-4">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                {/* Quote */}
                                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                                    &ldquo;{t.text}&rdquo;
                                </p>
                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`https://randomuser.me/api/portraits/${t.portrait}.jpg`}
                                        alt={t.name}
                                        className="h-10 w-10 rounded-full object-cover border-2 border-border/50 shrink-0"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {t.role} · {t.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                EXTERNAL SECTIONS
            ══════════════════════════════════════════ */}
            <TopCategoriesSection />
            <CvBannerSection />
            <EmployerCandidateBanner />
            <AppDownloadSection />

            {/* ══════════════════════════════════════════
                CTA
            ══════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-slate-950 py-16 md:py-24">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[450px] w-[700px] rounded-full bg-primary/8 blur-[130px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:28px_28px]" />
                </div>
                <div className="relative z-10 container mx-auto max-w-3xl px-4 text-center">
                    <span className="mb-4 block text-[11px] font-bold tracking-[0.22em] uppercase text-primary">
                        Get Started Today
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                        Join 50,000+ professionals on CareerBangla. Free for job seekers —
                        no hidden fees, no limits.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12 rounded-xl shadow-lg shadow-primary/20 w-full sm:w-auto"
                            asChild
                        >
                            <Link href="/register">Get Started Free</Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/15 text-white hover:bg-white/10 font-semibold h-12 rounded-xl bg-white/5 w-full sm:w-auto"
                            asChild
                        >
                            <Link href="/jobs">
                                Explore Jobs
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
