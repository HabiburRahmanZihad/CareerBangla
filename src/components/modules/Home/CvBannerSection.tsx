"use client";

import { CheckCircle2, Mail, Plus, Star, Upload } from "lucide-react";
import Image from "next/image";

export default function CvBannerSection() {
    return (
        <section className="relative w-full overflow-hidden bg-background py-16 sm:py-20 lg:py-32">
            {/* Ambient Ambient Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -right-[5%] w-125 h-125 rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute top-[40%] -left-[10%] w-100 h-100 rounded-full bg-secondary/20 blur-[100px]" />

                <div className="absolute inset-0 bg-[radial-linear(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] opacity-30 dark:bg-[radial-linear(#374151_1px,transparent_1px)] dark:opacity-20" />
            </div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

                    {/* LEFT SIDE: Image & Premium Floating Cards */}
                    <div className="relative mx-auto w-full max-w-md pb-24 lg:max-w-none lg:pb-0 md:pl-4 lg:pl-10">
                        {/* Main Image Wrapper */}
                        <div className="relative z-10 mx-auto aspect-4/5 w-full max-w-120 transform-gpu overflow-hidden rounded-[2.5rem] p-2 transition-transform duration-700 hover:scale-[1.02]">
                            <div className="absolute inset-0 rounded-[2.5rem] border border-primary/20 bg-primary/5 shadow-2xl dark:border-primary/10 dark:bg-primary/5" />
                            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-inner">
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-transparent z-10 pointer-events-none" />
                                <Image
                                    src="/images/h134.jpg" // Using the provided image
                                    alt="Professional CV Portrait"
                                    width={600}
                                    height={800}
                                    className="h-full w-full object-cover object-center transition-transform duration-1000 hover:scale-105"
                                    priority
                                />
                            </div>
                        </div>

                        {/* 1. Work Inquiry Floating Card  */}
                        <div className="absolute left-2 top-[14%] z-20 hidden max-w-[calc(100%-1rem)] animate-float items-center gap-3 rounded-2xl glass-strong glass-shadow glass-border px-4 py-3 transition-transform duration-300 hover:scale-105 sm:flex sm:-left-8 lg:-left-12">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 text-left">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                                    Work Inquiry
                                </p>
                                <p className="text-sm font-extrabold text-foreground wrap-break-word">
                                    CareerBangla
                                </p>
                            </div>
                        </div>

                        {/* 2. Candidates Floating Card */}
                        <div className="absolute right-2 top-[44%] z-20 hidden max-w-48 animate-float-delayed rounded-3xl glass-strong glass-shadow border border-border/50 p-4 transition-transform duration-300 hover:scale-105 sm:block sm:-right-6 lg:-right-10 lg:max-w-none lg:p-5">
                            <div className="mb-3 flex items-center justify-center gap-1.5 rounded-full bg-background/80 py-1.5 px-3 backdrop-blur-sm">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="mb-4 text-center text-sm font-black text-foreground">
                                10k+ Candidates
                            </p>

                            <div className="flex items-center justify-center">
                                <div className="flex -space-x-3">
                                    {[32, 44, 68, 75].map((num, idx) => (
                                        <Image
                                            key={idx}
                                            src={`https://randomuser.me/api/portraits/${idx % 2 === 0 ? 'men' : 'women'}/${num}.jpg`}
                                            alt="Candidate"
                                            width={40}
                                            height={40}
                                            className="rounded-full border-2 border-background object-cover shadow-sm transition-transform hover:-translate-y-1 hover:z-30 relative"
                                        />
                                    ))}
                                </div>
                                <div className="ml-2 flex h-10 w-10 z-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-md transition-all hover:rotate-90 hover:scale-110 hover:bg-primary">
                                    <Plus className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Upload Output / CV Floating Card */}
                        <div className="absolute bottom-0 left-1/2 z-20 flex w-[calc(100%-1rem)] max-w-sm -translate-x-1/2 animate-bounce-slow items-center gap-3 rounded-2xl glass-strong border border-emerald-500/20 px-4 py-3 shadow-xl transition-transform duration-300 hover:scale-105 sm:-bottom-6 sm:left-4 sm:w-fit sm:max-w-none sm:translate-x-0 sm:gap-4 sm:px-6 sm:py-4">
                            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                <Upload className="h-5 w-5 z-10" />
                                <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20 opacity-75" />
                            </div>
                            <div className="min-w-0 text-left">
                                <p className="text-sm font-extrabold text-foreground wrap-break-word">
                                    Analyze Your CV
                                </p>
                                <p className="mt-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 wrap-break-word">
                                    Instant AI Feedback
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Typography & CTA */}
                    <div className="relative z-10 mx-auto mt-2 flex h-full max-w-xl flex-col justify-center text-center lg:mx-0 lg:mt-0 lg:max-w-none lg:text-left">

                        <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] uppercase text-primary text-center lg:text-left">
                            Resume Builder
                        </span>

                        {/* Headline */}
                        <h2 className="text-2xl sm:text-3xl font-bold leading-snug tracking-tight text-foreground">
                            A Professional{" "}
                            <span className="relative inline-block text-primary">
                                CV
                                <svg className="absolute -bottom-1 left-0 w-full h-2.5 text-primary/30" viewBox="0 0 100 12" preserveAspectRatio="none"><path d="M0,10 Q50,-10 100,10" stroke="currentColor" strokeWidth="4" fill="transparent" /></svg>
                            </span>{" "}
                            is your ticket to the{" "}
                            <span className="animate-linear-x bg-linear-to-r from-primary via-amber-500 to-primary bg-size-[200%_auto] bg-clip-text text-transparent">
                                dream job
                            </span>
                        </h2>

                        <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                            Start searching for jobs by attending career fairs, using customized job boards, or directly reaching out to top recruiters in your targeted network.
                        </p>

                        <ul className="mt-8 inline-block w-full space-y-4 text-left">
                            {[
                                "Build a standout profile in minutes.",
                                "Connect with top-tier companies globally.",
                                "Receive job matches tailored to your skills."
                            ].map((item, idx) => (
                                <li key={idx} className="group flex items-start gap-4 p-2 -ml-2 rounded-lg transition-colors hover:bg-muted/50 cursor-default">
                                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 transition-transform group-hover:scale-110">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-foreground/80 transition-colors group-hover:text-foreground sm:text-base">{item}</span>
                                </li>
                            ))}
                        </ul>


                    </div>
                </div>
            </div>

            {/* Reusable Keyframe Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(-1deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float 7s ease-in-out infinite;
                    animation-delay: 2s;
                }
                @keyframes linear-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-linear-x {
                    animation: linear-x 5s ease infinite;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
