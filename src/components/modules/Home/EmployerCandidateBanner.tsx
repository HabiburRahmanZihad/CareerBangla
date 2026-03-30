import Image from "next/image";
import Link from "next/link";

export default function EmployerCandidateBanner() {
    return (
        <section className="relative w-full overflow-hidden bg-background py-14 lg:py-20">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto grid container grid-cols-1 gap-6 px-4 sm:gap-7 sm:px-6 lg:grid-cols-2 lg:px-8">
                {/* Employers Card */}
                <article className="group relative isolate overflow-hidden rounded-3xl border border-primary/15 bg-primary min-h-80 shadow-[0_12px_40px_-12px_hsl(var(--primary)/0.55)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-14px_hsl(var(--primary)/0.65)]">
                    {/* top right soft shape */}
                    <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-sky-200/90" />

                    {/* bottom left shape */}
                    <div className="absolute -bottom-16 left-0 h-24 w-56 rounded-t-full bg-yellow-200/95" />

                    <div className="absolute inset-0 bg-linear-to-r from-black/10 via-transparent to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/15 via-black/0 to-transparent" />

                    <div className="relative z-10 flex h-full flex-col justify-center px-6 py-8 pr-28 sm:px-8 sm:py-10 sm:pr-40 md:max-w-[60%] md:pr-8">
                        <span className="mb-3 inline-flex w-fit rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary-foreground">
                            Hiring Solutions
                        </span>

                        <h3 className="mb-4 text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl lg:text-[2.35rem]">
                            Employers
                        </h3>

                        <p className="mb-7 max-w-sm text-sm leading-7 text-primary-foreground/90 sm:mb-8 sm:text-base sm:leading-8">
                            Post jobs, manage applications, and find top talent with our comprehensive recruiting platform. Reach qualified candidates across Bangladesh.
                        </p>

                        <Link
                            href="/register/recruiter"
                            className="group/btn inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-card px-5 text-sm font-bold text-foreground shadow-md transition-all hover:scale-[1.02] hover:bg-background sm:h-14 sm:w-55 sm:text-base"
                        >
                            Register Account
                            <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                        </Link>
                    </div>

                    <div className="pointer-events-none absolute bottom-0 right-1 z-10 transition-transform duration-500 group-hover:translate-x-1 sm:right-4 md:right-6">
                        <Image
                            src="/images/employ.webp"
                            alt="Employer"
                            width={290}
                            height={320}
                            className="h-47.5 w-auto object-contain object-bottom sm:h-57.5 md:h-67.5 lg:h-75"
                            priority
                        />
                    </div>
                </article>

                {/* Candidate Card */}
                <article className="group relative isolate overflow-hidden rounded-3xl border border-border/60 bg-secondary min-h-80 shadow-[0_12px_40px_-16px_hsl(var(--foreground)/0.28)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_hsl(var(--foreground)/0.35)]">
                    {/* bottom right dark wedge */}
                    <div className="absolute -bottom-10 right-0 h-40 w-44 rotate-45 bg-primary" />

                    <div className="absolute inset-0 bg-linear-to-r from-white/25 via-transparent to-transparent dark:from-white/5" />

                    <div className="relative z-10 flex h-full flex-col justify-center px-6 py-8 pr-28 sm:px-8 sm:py-10 sm:pr-40 md:max-w-[60%] md:pr-8">
                        <span className="mb-3 inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
                            Career Growth
                        </span>

                        <h3 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.35rem]">
                            Candidate
                        </h3>

                        <p className="mb-7 max-w-sm text-sm leading-7 text-foreground/70 sm:mb-8 sm:text-base sm:leading-8">
                            Build your ATS-optimized resume, discover your ideal job matches, and connect with top employers. Your career journey starts here.
                        </p>

                        <Link
                            href="/register"
                            className="group/btn inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-card px-5 text-sm font-bold text-primary shadow-md transition-all hover:scale-[1.02] hover:bg-background sm:h-14 sm:w-55 sm:text-base"
                        >
                            Register Account
                            <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                        </Link>
                    </div>

                    <div className="pointer-events-none absolute bottom-0 right-1 z-10 transition-transform duration-500 group-hover:translate-x-1 sm:right-4 md:right-5">
                        <Image
                            src="/images/remove.png"
                            alt="Candidate"
                            width={300}
                            height={320}
                            className="h-48.75 w-auto object-contain object-bottom sm:h-58.75 md:h-68.75 lg:h-76.25"
                            priority
                        />
                    </div>
                </article>
            </div>
        </section>
    );
}
