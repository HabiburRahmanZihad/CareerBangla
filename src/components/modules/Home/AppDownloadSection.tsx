"use client";

import { Apple, Download, Play, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

export default function AppDownloadSection() {
    const handleComingSoon = () => {
        Swal.fire({
            icon: "info",
            title: "Coming Soon!",
            text: "Our mobile app is currently under development and will be available soon.",
            confirmButtonColor: "hsl(var(--primary))",
            confirmButtonText: "Got it!",
            background: "#0f172a", // slate-950
            color: "#fff",
        });
    };

    return (
        <section className="relative w-full overflow-hidden bg-background py-16 md:py-24">


            <div className="container relative z-10 mx-auto px-4 md:px-6">
                {/* Main Card Container */}
                <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 px-6 py-12 shadow-[0_0_80px_-20px_rgba(var(--primary),0.3)] md:px-12 md:py-16 lg:px-20 lg:py-20">


                    {/* Animated Grid Pattern */}
                    <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]" />

                    {/* Glowing Orbs Inside Card */}
                    <div className="absolute -right-20 -top-20 z-0 h-100 w-100 rounded-full bg-primary/40 blur-[100px] transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute -bottom-40 -left-20 z-0 h-100 w-100 rounded-full bg-blue-600/30 blur-[100px] transition-transform duration-1000 group-hover:translate-x-10 group-hover:scale-110" />

                    {/* Content */}
                    <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-8">

                        {/* LEFT SIDE: Typography & CTA */}
                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

                            {/* Headline */}
                            <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
                                Your Dream Job, <br className="hidden md:block" />
                                <span className="animate-gradient-x bg-linear-to-r from-primary via-orange-400 to-primary bg-size-[200%_auto] bg-clip-text text-transparent">
                                    Now in Your Pocket.
                                </span>
                            </h2>

                            {/* Description */}
                            <p className="mt-6 max-w-120 text-base leading-relaxed text-slate-300 md:text-lg">
                                Access thousands of job opportunities, track applications instantly, and get hired faster with the new CareerBangla app. Fast, secure, and always accessible.
                            </p>

                            {/* Buttons */}
                            <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                                {/* App Store */}
                                <button
                                    onClick={handleComingSoon}
                                    className="group/btn relative flex h-15 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.2)] active:translate-y-0 sm:w-50 cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" />
                                    <Apple className="h-7 w-7 text-white transition-transform group-hover/btn:scale-110" />
                                    <div className="flex flex-col justify-center text-left">
                                        <span className="mb-1 text-[10px] font-medium leading-none tracking-wide text-white/70">Download on the</span>
                                        <span className="text-[16px] font-bold leading-none text-white">App Store</span>
                                    </div>
                                </button>

                                {/* Play Store */}
                                <button
                                    onClick={handleComingSoon}
                                    className="group/btn relative flex h-15 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/10 hover:shadow-[0_0_40px_-5px_rgba(var(--primary),0.4)] active:translate-y-0 sm:w-50 cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" />
                                    <Play className="ml-1 h-6 w-6 text-white transition-transform group-hover/btn:scale-110" fill="currentColor" />
                                    <div className="flex flex-col justify-center text-left">
                                        <span className="mb-1 text-[10px] font-medium leading-none tracking-wide text-white/70">GET IT ON</span>
                                        <span className="text-[16px] font-bold leading-none text-white">Google Play</span>
                                    </div>
                                </button>
                            </div>

                            {/* Trust Stats */}
                            <div className="mt-10 flex w-full items-center justify-center gap-4 border-t border-white/10 pt-8 lg:justify-start">
                                <div className="flex -space-x-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="h-10 w-10 rounded-full border-2 border-slate-950 object-cover shadow-md" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="h-10 w-10 rounded-full border-2 border-slate-950 object-cover shadow-md" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" className="h-10 w-10 rounded-full border-2 border-slate-950 object-cover shadow-md" />
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 bg-slate-800 text-xs font-bold text-white shadow-md">
                                        9k+
                                    </div>
                                </div>
                                <div className="flex flex-col text-left">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="mt-1 text-xs font-medium text-slate-400">Trusted by 50,000+ professionals</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Visual/Device Showcase */}
                        <div className="relative mt-10 flex items-center justify-center lg:mt-0 lg:justify-end">
                            {/* Device & Floating Elements Container */}
                            <div className="relative w-full max-w-95 perspective-1000">
                                {/* Floor Shadow */}
                                <div className="absolute -bottom-8 left-1/2 h-6 w-[60%] -translate-x-1/2 rounded-[100%] bg-black/60 blur-[15px]" />
                                <div className="absolute -bottom-8 left-1/2 h-3 w-[40%] -translate-x-1/2 animate-pulse rounded-[100%] bg-primary/40 blur-[15px]" />

                                {/* The Mockup Image */}
                                <div className="relative z-10 transform-gpu overflow-visible transition-transform duration-700 hover:scale-[1.02]">
                                    <Image
                                        src="/images/h136.png"
                                        alt="CareerBangla App Mockup"
                                        width={400}
                                        height={550}
                                        priority
                                        className="animate-float! h-auto w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]"
                                    />

                                    {/* Floating Card 1 */}
                                    <div className="absolute -left-6 top-20 flex animate-bounce-slow items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 shadow-2xl backdrop-blur-xl transition-transform hover:scale-105 lg:-left-12">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                            <Download className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-[11px] font-medium text-white/60">Downloads</div>
                                            <div className="text-[15px] font-bold text-white">500K+</div>
                                        </div>
                                    </div>

                                    {/* Floating Card 2 */}
                                    <div className="absolute -right-4 bottom-32 flex animate-bounce-slow-delayed items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 shadow-2xl backdrop-blur-xl transition-transform hover:scale-105 lg:-right-8">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-[11px] font-medium text-white/60">Verification</div>
                                            <div className="text-[15px] font-bold text-white">100% Safe</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 4s ease infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-bounce-slow-delayed {
          animation: bounce-slow 5s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
        </section>
    );
}
