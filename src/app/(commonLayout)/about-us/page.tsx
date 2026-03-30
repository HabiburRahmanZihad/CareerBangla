"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowRight,
    Briefcase,
    Lightbulb,
    Shield,
    Target,
    Users
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Team members data
const teamMembers = [
    {
        name: "Sarah Ahmed",
        role: "Founder & CEO",
        description: "Led CareerBangla from vision to reality with 10+ years in HR tech",
        icon: "👩‍💼",
    },
    {
        name: "Karim Hassan",
        role: "CTO & Co-Founder",
        description: "Built our tech infrastructure and drives innovation with AI/ML",
        icon: "👨‍💻",
    },
    {
        name: "Faria Khan",
        role: "Head of Partnerships",
        description: "Connects us with 5K+ verified companies across Bangladesh",
        icon: "🤝",
    },
    {
        name: "Rayan Siddique",
        role: "Head of User Experience",
        description: "Ensures every user has a seamless job search experience",
        icon: "✨",
    },
];

// Core values
const values = [
    {
        icon: Target,
        title: "Job-Seeker First",
        description: "Every feature we build is designed with your career growth in mind",
    },
    {
        icon: Shield,
        title: "Trust & Safety",
        description: "All recruiters verified. All data encrypted. Your privacy protected.",
    },
    {
        icon: Lightbulb,
        title: "Innovation",
        description: "AI-powered matching technology that finds your perfect role",
    },
    {
        icon: Users,
        title: "Community",
        description: "Building a supportive network of professionals across Bangladesh",
    },
];

// Impact metrics
const impacts = [
    {
        number: "50K+",
        label: "Active Job Seekers",
        description: "Building their careers with us",
    },
    {
        number: "5K+",
        label: "Verified Companies",
        description: "From startups to enterprises",
    },
    {
        number: "10K+",
        label: "Jobs Posted",
        description: "Fresh opportunities daily",
    },
    {
        number: "95%",
        label: "Match Success Rate",
        description: "AI-powered accuracy",
    },
];

// Timeline data
const timeline = [
    {
        year: "2023",
        title: "CareerBangla Founded",
        description: "Started with a mission to revolutionize job search in Bangladesh",
    },
    {
        year: "2024",
        title: "Reached 10K Users",
        description: "Expanded to include ATS resume builder and verification system",
    },
    {
        year: "2025",
        title: "5K+ Companies",
        description: "Partnered with Bangladesh's top employers and startups",
    },
    {
        year: "2026",
        title: "95% Success Rate",
        description: "Launched AI matching algorithm and premium features",
    },
];

export default function AboutUsPage() {
    const [activeTab, setActiveTab] = useState("mission");

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="py-20 md:py-32 bg-linear-to-br from-orange-50 via-white to-blue-50 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 max-w-7xl relative z-10">
                    <div className="text-center space-y-6">
                        <Badge variant="outline" className="mx-auto text-xs px-4 py-1.5">
                            Our Story
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
                            Connecting Dreams with
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-blue-600 block">
                                Opportunities
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            CareerBangla is Bangladesh&apos;s most trusted job portal, helping 50K+ professionals find their dream careers with verified employers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values Tabs */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="space-y-12">
                        {/* Tabs */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {[
                                { id: "mission", label: "Our Mission" },
                                { id: "vision", label: "Our Vision" },
                                { id: "values", label: "Our Values" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === tab.id
                                        ? "bg-orange-500 text-white shadow-lg"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="bg-linear-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-8 md:p-12 min-h-64">
                            {activeTab === "mission" && (
                                <div className="space-y-4 animate-fadeIn">
                                    <div className="flex items-start gap-4">
                                        <Target className="w-8 h-8 text-orange-500 shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Our Mission</h3>
                                            <p className="text-lg text-slate-600 leading-relaxed">
                                                To revolutionize the job search experience in Bangladesh by connecting talented professionals with verified employers through innovative technology. We&apos;re committed to making career advancement accessible, transparent, and rewarding for everyone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "vision" && (
                                <div className="space-y-4 animate-fadeIn">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-8 h-8 text-blue-500 shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Our Vision</h3>
                                            <p className="text-lg text-slate-600 leading-relaxed">
                                                To become Asia&apos;s most trusted and innovative job platform, where every professional has equal opportunity to reach their full potential. We envision a world where career success is determined by talent, not connections.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "values" && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Our Core Values</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {values.map((value, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                                    <value.icon className="w-6 h-6 text-orange-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 mb-1">{value.title}</h4>
                                                    <p className="text-sm text-slate-600">{value.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-16 md:py-20 bg-linear-to-r from-slate-900 to-slate-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black mb-4">Our Impact in Numbers</h2>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                            Real results for real professionals across Bangladesh
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {impacts.map((impact, index) => (
                            <Card key={index} className="border-slate-700 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                                <CardContent className="p-6 text-center">
                                    <p className="text-4xl md:text-5xl font-black text-orange-400 mb-2">
                                        {impact.number}
                                    </p>
                                    <p className="font-bold text-white mb-2">{impact.label}</p>
                                    <p className="text-sm text-slate-300">{impact.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Our Journey</h2>
                        <p className="text-lg text-slate-600">
                            From startup to Bangladesh&apos;s leading job platform
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-orange-500 to-blue-500 transform -translate-x-1/2"></div>

                        {/* Timeline items */}
                        <div className="space-y-10 md:space-y-16">
                            {timeline.map((item, index) => (
                                <div key={index} className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                                    {/* Content */}
                                    <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                                        <Card className="bg-slate-50 border-slate-200 hover:border-orange-200 hover:shadow-lg transition-all">
                                            <CardContent className="p-6">
                                                <Badge variant="outline" className="mb-3 bg-orange-100 text-orange-700 border-0">
                                                    {item.year}
                                                </Badge>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                                <p className="text-slate-600">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Timeline dot */}
                                    <div className="hidden md:flex md:w-12 justify-center">
                                        <div className="w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 md:py-20 bg-linear-to-b from-slate-50 to-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Meet Our Team</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Passionate professionals dedicated to changing careers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="border-slate-200 hover:border-orange-200 hover:shadow-lg transition-all overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="text-5xl mb-4">{member.icon}</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
                                    <p className="text-sm font-semibold text-orange-600 mb-3">{member.role}</p>
                                    <p className="text-sm text-slate-600">{member.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-linear-to-r from-orange-500 to-orange-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Find Your Dream Job?</h2>
                    <p className="text-lg text-orange-100 max-w-xl mx-auto mb-8">
                        Join thousands of professionals who&apos;ve found their perfect career match on CareerBangla.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-100 px-8 font-bold" asChild>
                            <Link href="/jobs">
                                <Briefcase className="mr-2 h-5 w-5" />
                                Browse Jobs
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white bg-white/10 text-white  px-8 font-bold"
                            asChild
                        >
                            <Link href="/register">
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
