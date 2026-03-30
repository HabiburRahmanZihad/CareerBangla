import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stats = [
    { value: "10K+", label: "Active Jobs", sublabel: "Updated daily" },
    { value: "5K+", label: "Verified Companies", sublabel: "Across Bangladesh" },
    { value: "50K+", label: "Registered Users", sublabel: "And growing fast" },
    { value: "95%", label: "Placement Rate", sublabel: "30-day average" },
];

export default function HeroSection() {
    return (
        <>
            <section className="relative overflow-hidden bg-slate-950 py-20 md:py-28 lg:py-32">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-48 -top-24 h-162.5 w-162.5 rounded-full bg-primary/10 blur-[150px]" />
                    <div className="absolute -right-24 bottom-0 h-125 w-125 rounded-full bg-blue-600/8 blur-[120px]" />
                    <div className="absolute left-1/2 top-1/3 -translate-x-1/2 h-75 w-125 rounded-full bg-violet-600/5 blur-[100px]" />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[28px_28px]" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-slate-950 to-transparent" />

                <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
                                    Bangladesh&apos;s #1 Job Portal
                                </span>
                            </div>

                            <h1 className="mb-5 text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl">
                                Find Your Dream Job
                                <br />
                                <span className="bg-linear-to-r from-primary via-orange-400 to-amber-400 bg-clip-text text-transparent">
                                    Faster Than Ever.
                                </span>
                            </h1>

                            <p className="mb-8 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
                                CareerBangla connects top talent with verified employers across
                                Bangladesh. Search thousands of real jobs, build your ATS resume,
                                and get hired, all on one platform.
                            </p>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button
                                    size="lg"
                                    className="h-12 rounded-xl bg-primary px-7 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
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
                                    className="h-12 rounded-xl border-white/15 bg-white/5 font-semibold text-white backdrop-blur-sm hover:bg-white/10"
                                    asChild
                                >
                                    <Link href="/register">
                                        Create Free Account
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
                                <div className="flex -space-x-2.5">
                                    {["men/32", "women/44", "women/68", "men/75"].map((portrait) => (
                                        <Image
                                            key={portrait}
                                            src={`https://randomuser.me/api/portraits/${portrait}.jpg`}
                                            alt="User"
                                            width={36}
                                            height={36}
                                            className="rounded-full border-2 border-slate-950 object-cover"
                                        />
                                    ))}
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-950 bg-primary text-[10px] font-black text-primary-foreground">
                                        9k+
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-0.5 flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="h-3 w-3 fill-amber-400 text-amber-400"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[12px] text-slate-400">
                                        Trusted by{" "}
                                        <span className="font-semibold text-white">50,000+</span>{" "}
                                        professionals
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="hidden grid-cols-2 gap-4 lg:grid">
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className={`rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-white/8 ${index % 2 === 1 ? "translate-y-6" : ""}`}
                                >
                                    <p className="mb-1 text-3xl font-bold text-primary">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm font-semibold text-white">
                                        {stat.label}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                        {stat.sublabel}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-white/5 bg-slate-900 lg:hidden">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-2 divide-x divide-y divide-white/5">
                        {stats.map((stat) => (
                            <div key={stat.label} className="px-4 py-5 text-center">
                                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                <p className="mt-0.5 text-xs font-medium text-slate-300">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
