import SectionHeader from "@/components/modules/Home/SectionHeader";
import { Award, TrendingUp, Zap } from "lucide-react";

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
        description: "Smart matching helps candidates get hired up to 3x faster than traditional boards.",
        stat: "30-Day Average",
        iconGradient: "from-primary to-orange-400",
    },
    {
        icon: Award,
        title: "Professional Tools",
        description: "ATS analytics, recruiter dashboards, and resume scoring, premium tools included.",
        stat: "6 Core Tools",
        iconGradient: "from-violet-500 to-purple-500",
    },
];

export default function KeyHighlightsSection() {
    return (
        <section className="border-y border-border/50 bg-muted/30 py-16 md:py-24">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    tag="Results"
                    title="What Makes Us Different"
                    description="Proven outcomes that set CareerBangla apart from every other job portal in Bangladesh."
                    center
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {keyHighlights.map((item) => (
                        <div
                            key={item.title}
                            className="group rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${item.iconGradient} shadow-sm`}
                                >
                                    <item.icon className="h-5 w-5 text-white" />
                                </div>
                                <span className="rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary">
                                    {item.stat}
                                </span>
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
