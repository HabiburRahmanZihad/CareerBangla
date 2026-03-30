import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the exact section layout of page.tsx so the transition is seamless.

export default function HomeLoading() {
    return (
        <div className="overflow-x-hidden">

            {/* ── Hero skeleton ── */}
            <section className="relative overflow-hidden bg-slate-950 py-20 md:py-28 lg:py-32">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-48 -top-24 h-[650px] w-[650px] rounded-full bg-white/3 blur-[150px]" />
                </div>
                <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        {/* Left text */}
                        <div className="space-y-5">
                            <Skeleton className="h-7 w-56 rounded-full bg-white/10" />
                            <div className="space-y-2">
                                <Skeleton className="h-12 w-full max-w-sm rounded-xl bg-white/8" />
                                <Skeleton className="h-12 w-4/5 max-w-xs rounded-xl bg-white/8" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full max-w-lg rounded-md bg-white/5" />
                                <Skeleton className="h-4 w-4/5 rounded-md bg-white/5" />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Skeleton className="h-12 w-36 rounded-xl bg-white/12" />
                                <Skeleton className="h-12 w-44 rounded-xl bg-white/8" />
                            </div>
                            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                <div className="flex -space-x-2.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Skeleton key={i} className="h-9 w-9 rounded-full bg-white/12" />
                                    ))}
                                </div>
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3 w-24 rounded-md bg-white/8" />
                                    <Skeleton className="h-3 w-40 rounded-md bg-white/5" />
                                </div>
                            </div>
                        </div>
                        {/* Right stat cards */}
                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            {[0, 1, 2, 3].map((i) => (
                                <Skeleton
                                    key={i}
                                    className={`h-28 rounded-2xl bg-white/5 ${i % 2 === 1 ? "translate-y-6" : ""}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats strip (mobile) ── */}
            <section className="lg:hidden bg-slate-900 border-b border-white/5">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-2 divide-x divide-y divide-white/5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="py-5 px-4 flex flex-col items-center gap-2">
                                <Skeleton className="h-7 w-14 rounded-md bg-white/10" />
                                <Skeleton className="h-3 w-20 rounded-md bg-white/5" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works skeleton ── */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col items-center gap-3 text-center mx-auto">
                        <Skeleton className="h-3.5 w-16 rounded-full" />
                        <Skeleton className="h-9 w-72 rounded-xl" />
                        <Skeleton className="h-4 w-96 rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card p-6">
                                <Skeleton className="h-14 w-14 rounded-2xl" />
                                <Skeleton className="h-3 w-14 rounded-full" />
                                <Skeleton className="h-5 w-40 rounded-md" />
                                <div className="space-y-1.5 w-full">
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-4/5 mx-auto rounded-md" />
                                    <Skeleton className="h-3 w-3/5 mx-auto rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why Choose skeleton ── */}
            <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col gap-3">
                        <Skeleton className="h-3.5 w-12 rounded-full" />
                        <Skeleton className="h-9 w-80 rounded-xl" />
                        <Skeleton className="h-4 w-full max-w-xl rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
                                <Skeleton className="h-11 w-11 rounded-xl" />
                                <Skeleton className="h-5 w-40 rounded-md" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-4/5 rounded-md" />
                                    <Skeleton className="h-3 w-3/5 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features skeleton ── */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col gap-3">
                        <Skeleton className="h-3.5 w-18 rounded-full" />
                        <Skeleton className="h-9 w-72 rounded-xl" />
                        <Skeleton className="h-4 w-full max-w-xl rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
                                <Skeleton className="h-11 w-11 rounded-xl" />
                                <Skeleton className="h-5 w-44 rounded-md" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-3/4 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Key Highlights skeleton ── */}
            <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col items-center gap-3 text-center mx-auto">
                        <Skeleton className="h-3.5 w-16 rounded-full" />
                        <Skeleton className="h-9 w-64 rounded-xl" />
                        <Skeleton className="h-4 w-80 rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-11 w-11 rounded-xl" />
                                    <Skeleton className="h-6 w-28 rounded-full" />
                                </div>
                                <Skeleton className="h-5 w-40 rounded-md" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-4/5 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials skeleton ── */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col items-center gap-3 text-center mx-auto">
                        <Skeleton className="h-3.5 w-28 rounded-full" />
                        <Skeleton className="h-9 w-64 rounded-xl" />
                        <Skeleton className="h-4 w-96 rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-2xl border border-border/50 bg-card p-6 flex flex-col gap-4">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Skeleton key={s} className="h-3.5 w-3.5 rounded-sm" />
                                    ))}
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-3/4 rounded-md" />
                                </div>
                                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-3.5 w-28 rounded-md" />
                                        <Skeleton className="h-3 w-36 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Categories skeleton ── */}
            <section className="py-20 lg:py-32 bg-background border-y border-border/50">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 flex flex-col items-center gap-3 text-center">
                        <Skeleton className="h-7 w-80 rounded-full" />
                        <Skeleton className="h-9 w-60 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-border/60 p-4 sm:p-6">
                                <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl" />
                                <Skeleton className="h-4 w-3/4 rounded-md" />
                                <Skeleton className="h-3 w-1/2 rounded-md" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 flex justify-center">
                        <Skeleton className="h-14 w-44 rounded-xl" />
                    </div>
                </div>
            </section>

            {/* ── CV Banner skeleton ── */}
            <section className="py-20 lg:py-32 bg-background">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
                        <Skeleton className="aspect-[4/5] w-full max-w-sm mx-auto rounded-[2.5rem]" />
                        <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-9 w-3/4 rounded-xl" />
                                <Skeleton className="h-9 w-1/2 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full rounded-md" />
                                <Skeleton className="h-4 w-4/5 rounded-md" />
                            </div>
                            <div className="space-y-2.5 mt-2">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Employer / Candidate skeleton ── */}
            <section className="py-14 lg:py-20 bg-background">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-80 rounded-3xl" />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── App Download skeleton ── */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Skeleton className="h-80 md:h-96 rounded-[2.5rem]" />
                </div>
            </section>

            {/* ── CTA skeleton ── */}
            <section className="py-16 md:py-24 bg-slate-950">
                <div className="container mx-auto max-w-3xl px-4 flex flex-col items-center gap-4">
                    <Skeleton className="h-3.5 w-32 rounded-full bg-white/10" />
                    <Skeleton className="h-9 w-72 rounded-xl bg-white/10" />
                    <Skeleton className="h-4 w-96 rounded-md bg-white/5" />
                    <div className="flex gap-3 mt-2">
                        <Skeleton className="h-12 w-40 rounded-xl bg-white/15" />
                        <Skeleton className="h-12 w-36 rounded-xl bg-white/8" />
                    </div>
                </div>
            </section>
        </div>
    );
}
