"use client";

import {
    Apple,
    Play,
    Star
} from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

const appSignals = [
    { label: "Projected installs", value: "500K+" },
    { label: "Safer sessions", value: "100%" },
    { label: "Application updates", value: "Live" },
];



export default function AppDownloadSection() {
    const handleComingSoon = () => {
        Swal.fire({
            icon: "info",
            title: "Coming Soon!",
            text: "Our mobile app is currently under development and will be available soon.",
            confirmButtonColor: "hsl(var(--primary))",
            confirmButtonText: "Got it!",
            background: "#0f172a",
            color: "#fff",
        });
    };

    return (
        <section className=" overflow-hidden bg-background py-16 md:py-24">

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="">
                    <div className="rounded-[1.9rem] border border-primary/20 bg-slate-950 p-6 text-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)] sm:p-7">
                        <span className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                            Mobile App
                        </span>

                        <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">
                            CareerBangla, designed for the phone in your hand
                        </h2>

                        <p className="mt-4 max-w-lg text-sm leading-7 text-white/70 sm:text-base">
                            The mobile experience is being built to keep job search, application
                            tracking, and recruiter updates inside one simpler workflow that feels
                            fast enough for everyday use.
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {appSignals.map((signal) => (
                                <div
                                    key={signal.label}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
                                >
                                    <p className="text-2xl font-black tracking-tight text-white">
                                        {signal.value}
                                    </p>
                                    <p className="mt-1 text-[11px] font-semibold text-white/60">
                                        {signal.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-col gap-3 md:flex-row md:flex-wrap">
                            <button
                                onClick={handleComingSoon}
                                className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 text-left transition-colors hover:bg-white/10 md:w-52 cursor-pointer"
                            >
                                <Apple className="h-7 w-7 text-white" />
                                <div className="min-w-0 flex-1">
                                    <div className="text-[10px] font-semibold uppercase tracking-wide text-white/60">
                                        Download on the
                                    </div>
                                    <div className="text-base font-black text-white wrap-break-word">
                                        App Store
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={handleComingSoon}
                                className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 text-left transition-colors hover:bg-white/10 md:w-52 cursor-pointer"
                            >
                                <Play className="h-6 w-6 text-white" fill="currentColor" />
                                <div className="min-w-0 flex-1">
                                    <div className="text-[10px] font-semibold uppercase tracking-wide text-white/60">
                                        Get it on
                                    </div>
                                    <div className="text-base font-black text-white wrap-break-word">
                                        Google Play
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div className="mt-6 border-t border-white/10 pt-6">
                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                <div className="flex -space-x-3">
                                    {["men/32", "women/44", "women/68"].map((portrait) => (
                                        <Image
                                            key={portrait}
                                            src={`https://randomuser.me/api/portraits/${portrait}.jpg`}
                                            alt="CareerBangla user"
                                            width={40}
                                            height={40}
                                            className="rounded-full border-2 border-slate-950 object-cover"
                                        />
                                    ))}
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 bg-slate-800 text-xs font-bold text-white">
                                        9k+
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-1 text-xs font-medium text-white/65">
                                        Trusted by 50,000+ professionals
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
