import SectionHeader from "@/components/modules/Home/SectionHeader";
import { Award, CheckCircle2, Sparkles } from "lucide-react";

const whyChoose = [
    {
        icon: CheckCircle2,
        title: "Verified Community",
        description:
            "All recruiters and companies pass a strict verification process before going live, zero spam, zero fakes.",
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
            "Resume builder, job search, ATS scoring, and application tracking, all 100% free, forever.",
        iconColor: "text-primary",
        iconBg: "bg-primary/10",
        borderHover: "hover:border-primary/25",
    },
];

export default function WhyChooseSection() {
    return (
        <section className="border-y border-border/50 bg-muted/30 py-16 md:py-24">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    tag="Why us"
                    title="Built for Bangladesh's Job Market"
                    description="We solve the real problems, fake listings, slow hiring, and poor matching. CareerBangla is engineered for results."
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {whyChoose.map((item) => (
                        <div
                            key={item.title}
                            className={`group rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg ${item.borderHover}`}
                        >
                            <div
                                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${item.iconBg}`}
                            >
                                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                            </div>
                            <h3 className="mb-1.5 text-base font-semibold text-foreground">
                                {item.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
