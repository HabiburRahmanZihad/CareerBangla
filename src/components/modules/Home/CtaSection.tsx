import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CtaSection() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-16 md:py-24">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-112.5 w-175 -translate-x-1/2 rounded-full bg-primary/8 blur-[130px]" />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[28px_28px]" />
            </div>
            <div className="relative z-10 container mx-auto max-w-3xl px-4 text-center">
                <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                    Get Started Today
                </span>
                <h2 className="mb-3 text-2xl font-bold leading-snug text-white sm:text-3xl">
                    Ready to Land Your Dream Job?
                </h2>
                <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
                    Join 50,000+ professionals on CareerBangla. Free for job seekers,
                    no hidden fees, no limits.
                </p>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button
                        size="lg"
                        className="h-12 w-full rounded-xl bg-primary px-8 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 sm:w-auto"
                        asChild
                    >
                        <Link href="/register">Get Started Free</Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-12 w-full rounded-xl border-white/15 bg-white/5 font-semibold text-white hover:bg-white/10 sm:w-auto"
                        asChild
                    >
                        <Link href="/jobs">
                            Explore Jobs
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
