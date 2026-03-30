import SectionHeader from "@/components/modules/Home/SectionHeader";
import { CheckCircle2, Search, UserPlus } from "lucide-react";

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
            "One-click applications, real-time tracking, and direct recruiter connections, built for speed.",
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-500/10",
        borderHover: "hover:border-emerald-200 dark:hover:border-emerald-800/50",
    },
];

export default function HowItWorksSection() {
    return (
        <section className="bg-background py-16 md:py-24">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    tag="Process"
                    title="Get Hired in 3 Simple Steps"
                    description="CareerBangla streamlines every step of your job search, from building your resume to getting the offer letter."
                    center
                />
                <div className="relative grid grid-cols-1 gap-5 md:gap-8 sm:grid-cols-3">
                    <div className="pointer-events-none absolute left-[36%] top-11 hidden h-px w-[28%] bg-linear-to-r from-transparent via-border/80 to-transparent sm:block" />
                    <div className="pointer-events-none absolute left-[64%] top-11 hidden h-px w-[28%] bg-linear-to-r from-transparent via-border/80 to-transparent sm:block" />

                    {howItWorks.map((step) => (
                        <div
                            key={step.step}
                            className={`group flex flex-col items-center rounded-2xl border border-border/50 bg-card p-6 text-center transition-all duration-300 hover:shadow-lg ${step.borderHover}`}
                        >
                            <div
                                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${step.iconBg}`}
                            >
                                <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                            </div>
                            <span className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground/40">
                                Step {step.step}
                            </span>
                            <h3 className="mb-2 text-base font-bold text-foreground">
                                {step.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
