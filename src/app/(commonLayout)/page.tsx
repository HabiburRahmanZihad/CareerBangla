import TopCategoriesSection from "@/components/modules/Home/TopCategoriesSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, Briefcase, Building2, FileUser, Search, Shield, Users } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Search,
        title: "Smart Job Search",
        description: "Find relevant jobs with advanced filters by location, skills, experience, and job type.",
    },
    {
        icon: FileUser,
        title: "ATS Resume Builder",
        description: "Build an ATS-optimized resume and track your profile completion score.",
    },
    {
        icon: BarChart3,
        title: "ATS Score Checker",
        description: "Check how well your resume matches specific job requirements.",
    },
    {
        icon: Building2,
        title: "Company Profiles",
        description: "Explore verified recruiters and company profiles before applying.",
    },
    {
        icon: Shield,
        title: "Verified Recruiters",
        description: "All recruiters are verified by admins to ensure job posting quality.",
    },
    {
        icon: Users,
        title: "Candidate Search",
        description: "Recruiters can search and filter candidates by skills, experience, and location.",
    },
];

const stats = [
    { value: "10K+", label: "Active Jobs" },
    { value: "5K+", label: "Companies" },
    { value: "50K+", label: "Job Seekers" },
    { value: "95%", label: "Success Rate" },
];

export default function Home() {
    return (
        <div>
            {/* Hero Section */}
            <section className="py-20 md:py-32 bg-linear-to-br from-primary/5 via-background to-accent/5">
                <div className="container mx-auto px-4 text-center">
                    <Badge variant="secondary" className="mb-4">
                        Bangladesh&apos;s Leading Job Portal
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Find Your Dream
                        <span className="text-primary"> Career</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Connect with top companies, build your ATS-optimized resume, and land your perfect job with CareerBangla.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" asChild>
                            <Link href="/jobs">
                                <Briefcase className="mr-2 h-5 w-5" />
                                Browse Jobs
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/register">
                                Create Account
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-3">Why Choose CareerBangla?</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Everything you need to advance your career or find the perfect candidate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <Card key={feature.title} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Categories Section */}
            <TopCategoriesSection />

            {/* CTA Section */}
            <section className="py-20 bg-primary/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                        Join thousands of job seekers and recruiters on CareerBangla. Create your free account today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" asChild>
                            <Link href="/register">Get Started Free</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/jobs">Explore Jobs</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
