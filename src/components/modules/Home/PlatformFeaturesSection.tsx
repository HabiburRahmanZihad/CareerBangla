import SectionHeader from "@/components/modules/Home/SectionHeader";
import {
    BarChart3,
    Building2,
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
        description: "Every recruiter manually reviewed before listing, no spam, no fakes.",
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

export default function PlatformFeaturesSection() {
    return (
        <section className="bg-background py-16 md:py-24">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    tag="Platform"
                    title="Powerful Tools for Everyone"
                    description="From building the perfect resume to sourcing top candidates, one platform handles the entire hiring journey."
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
                        >
                            <span className="absolute right-4 top-4 select-none text-[11px] font-black tabular-nums text-muted-foreground/15">
                                {feature.tag}
                            </span>
                            <div
                                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${feature.iconBg}`}
                            >
                                <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                            </div>
                            <h3 className="mb-1.5 text-base font-semibold text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
