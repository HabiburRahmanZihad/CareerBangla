import { Skeleton } from "@/components/ui/skeleton";

function SectionHeaderSkeleton({
    center = false,
    tagWidth = "w-16",
    titleWidth = "w-72",
    descriptionWidth = "w-full max-w-xl",
}: {
    center?: boolean;
    tagWidth?: string;
    titleWidth?: string;
    descriptionWidth?: string;
}) {
    return (
        <div
            className={`mb-10 flex flex-col gap-2.5 ${center ? "mx-auto items-center text-center" : ""}`}
        >
            <Skeleton className={`h-3.5 rounded-full ${tagWidth}`} />
            <Skeleton className={`h-9 rounded-xl ${titleWidth}`} />
            <Skeleton className={`h-4 rounded-md ${descriptionWidth}`} />
        </div>
    );
}

export default function HomeLoading() {
    return (
        <div className="overflow-x-hidden">
            <section className="relative overflow-hidden pb-10 pt-8 sm:pb-12 sm:pt-10 lg:pb-16">
                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/85 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background/90 to-secondary/20" />

                        <div className="relative grid items-center gap-10 px-5 py-8 sm:px-7 sm:py-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-12 xl:px-12 xl:py-14">
                            <div className="max-w-2xl">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 shadow-sm">
                                    <Skeleton className="h-2 w-2 rounded-full" />
                                    <Skeleton className="h-3 w-52 rounded-md" />
                                </div>

                                <div className="space-y-3">
                                    <Skeleton className="h-12 w-full max-w-md rounded-xl sm:h-14" />
                                    <Skeleton className="h-12 w-full max-w-lg rounded-xl sm:h-14" />
                                    <Skeleton className="h-12 w-full max-w-sm rounded-xl sm:h-14" />
                                </div>

                                <div className="mt-5 space-y-2">
                                    <Skeleton className="h-4 w-full max-w-xl rounded-md" />
                                    <Skeleton className="h-4 w-full max-w-lg rounded-md" />
                                </div>

                                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl border border-border/50 bg-card/70 p-4 shadow-sm backdrop-blur"
                                        >
                                            <Skeleton className="mb-3 h-10 w-10 rounded-xl" />
                                            <Skeleton className="h-4 w-28 rounded-md" />
                                            <Skeleton className="mt-2 h-3 w-full rounded-md" />
                                            <Skeleton className="mt-1 h-3 w-4/5 rounded-md" />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                    <Skeleton className="h-12 w-full rounded-full sm:w-40" />
                                    <Skeleton className="h-12 w-full rounded-full sm:w-48" />
                                </div>

                                <div className="mt-7 flex flex-col gap-4 rounded-3xl border border-border/50 bg-card/70 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-3">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <Skeleton
                                                    key={index}
                                                    className="h-10 w-10 rounded-full border-2 border-background"
                                                />
                                            ))}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex gap-1">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <Skeleton key={index} className="h-3.5 w-3.5 rounded-sm" />
                                                ))}
                                            </div>
                                            <Skeleton className="h-4 w-44 rounded-md" />
                                            <Skeleton className="h-3 w-36 rounded-md" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 sm:w-auto">
                                        <div className="rounded-2xl bg-primary/10 px-3 py-2 text-center">
                                            <Skeleton className="mx-auto h-5 w-14 rounded-md" />
                                            <Skeleton className="mx-auto mt-2 h-3 w-16 rounded-md" />
                                        </div>
                                        <div className="rounded-2xl bg-emerald-500/10 px-3 py-2 text-center">
                                            <Skeleton className="mx-auto h-5 w-12 rounded-md" />
                                            <Skeleton className="mx-auto mt-2 h-3 w-20 rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative mx-auto w-full max-w-xl">
                                <div className="glass-strong glass-shadow relative overflow-hidden rounded-[2rem] border border-white/60 p-4 sm:p-5 dark:border-white/10">
                                    <div className="relative space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="space-y-2">
                                                <Skeleton className="h-3 w-32 rounded-md" />
                                                <Skeleton className="h-7 w-56 rounded-xl" />
                                            </div>
                                            <Skeleton className="h-7 w-32 rounded-full" />
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                                            <div className="rounded-[1.75rem] bg-slate-950 p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-3 w-24 rounded-md bg-white/10" />
                                                        <Skeleton className="h-9 w-20 rounded-xl bg-white/10" />
                                                        <Skeleton className="h-3 w-40 rounded-md bg-white/10" />
                                                    </div>
                                                    <Skeleton className="h-12 w-12 rounded-2xl bg-white/10" />
                                                </div>

                                                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
                                                    <Skeleton className="h-10 w-full rounded-xl bg-white/10" />
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {[72, 64, 60, 76].map((width, index) => (
                                                            <Skeleton
                                                                key={index}
                                                                className="h-6 rounded-full bg-white/10"
                                                                style={{ width }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid gap-3">
                                                {Array.from({ length: 2 }).map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-[1.5rem] border border-border/50 bg-card/80 p-4 shadow-sm"
                                                    >
                                                        <Skeleton className="mb-3 h-10 w-10 rounded-xl" />
                                                        <Skeleton className="h-3 w-28 rounded-md" />
                                                        <Skeleton className="mt-2 h-4 w-full rounded-md" />
                                                        <Skeleton className="mt-2 h-3 w-4/5 rounded-md" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-3">
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-[1.5rem] border border-border/50 bg-card/80 p-4 shadow-sm"
                                                >
                                                    <Skeleton className="mb-3 h-10 w-10 rounded-xl" />
                                                    <Skeleton className="h-7 w-16 rounded-md" />
                                                    <Skeleton className="mt-2 h-4 w-28 rounded-md" />
                                                    <Skeleton className="mt-2 h-3 w-full rounded-md" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 rounded-[1.5rem] border border-border/50 bg-card/85 p-4 shadow-sm backdrop-blur">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-28 rounded-md" />
                                            <Skeleton className="h-4 w-64 rounded-md" />
                                        </div>
                                        <Skeleton className="h-7 w-56 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-[1.5rem] border border-border/50 bg-card/80 p-4 shadow-sm backdrop-blur"
                            >
                                <Skeleton className="mb-3 h-11 w-11 rounded-2xl" />
                                <Skeleton className="h-8 w-20 rounded-xl" />
                                <Skeleton className="mt-2 h-4 w-28 rounded-md" />
                                <Skeleton className="mt-2 h-3 w-full rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden border-y border-border/50 bg-muted/30 py-16 md:py-24">
                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
                        <div className="glass-strong glass-shadow rounded-[2rem] border border-border/60 p-6 sm:p-7 lg:p-8">
                            <SectionHeaderSkeleton
                                tagWidth="w-14"
                                titleWidth="w-full max-w-md"
                                descriptionWidth="w-full max-w-xl"
                            />

                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/70 p-4"
                                    >
                                        <Skeleton className="mt-0.5 h-10 w-10 shrink-0 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-36 rounded-md" />
                                            <Skeleton className="h-3 w-full rounded-md" />
                                            <Skeleton className="h-3 w-4/5 rounded-md" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 rounded-[1.75rem] border border-border/60 bg-card p-4 sm:p-5">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-32 rounded-md" />
                                        <Skeleton className="h-4 w-60 rounded-md" />
                                    </div>
                                    <Skeleton className="h-7 w-40 rounded-full" />
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl bg-background p-4 text-center shadow-sm"
                                        >
                                            <Skeleton className="mx-auto h-8 w-18 rounded-xl" />
                                            <Skeleton className="mx-auto mt-2 h-3 w-20 rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:gap-5">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <article
                                    key={index}
                                    className="relative overflow-hidden rounded-[1.9rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6"
                                >
                                    <Skeleton className="absolute right-5 top-5 h-8 w-8 rounded-full" />

                                    <div className="flex items-start gap-4">
                                        <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-3 w-20 rounded-md" />
                                            <Skeleton className="h-6 w-52 rounded-md" />
                                            <Skeleton className="h-3 w-full rounded-md" />
                                            <Skeleton className="h-3 w-full rounded-md" />
                                            <Skeleton className="h-3 w-4/5 rounded-md" />
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                        <Skeleton className="h-8 w-48 rounded-full" />
                                        <Skeleton className="h-3 w-44 rounded-md" />
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-background py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
                        <div className="glass-strong glass-shadow rounded-[2rem] border border-border/60 p-6 sm:p-7 lg:p-8">
                            <SectionHeaderSkeleton
                                tagWidth="w-16"
                                titleWidth="w-full max-w-md"
                                descriptionWidth="w-full max-w-xl"
                            />

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-border/50 bg-card p-4 text-center"
                                    >
                                        <Skeleton className="mx-auto h-8 w-12 rounded-xl" />
                                        <Skeleton className="mx-auto mt-2 h-3 w-20 rounded-md" />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-3">
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/70 p-4"
                                    >
                                        <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-28 rounded-md" />
                                            <Skeleton className="h-3 w-full rounded-md" />
                                            <Skeleton className="h-3 w-4/5 rounded-md" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 rounded-[1.75rem] border border-border/60 bg-card p-4 sm:p-5">
                                <Skeleton className="h-3 w-28 rounded-md" />
                                <Skeleton className="mt-3 h-4 w-64 rounded-md" />
                                <Skeleton className="mt-3 h-3 w-full rounded-md" />
                                <Skeleton className="mt-2 h-3 w-4/5 rounded-md" />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="space-y-4 sm:space-y-5">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <article
                                        key={index}
                                        className="relative flex gap-4 sm:gap-5"
                                    >
                                        <div className="relative z-10 flex shrink-0 flex-col items-center">
                                            <Skeleton className="h-14 w-14 rounded-2xl" />
                                            <Skeleton className="mt-3 h-7 w-14 rounded-full" />
                                        </div>

                                        <div className="flex-1 rounded-[1.9rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-3 w-18 rounded-md" />
                                                    <Skeleton className="h-6 w-56 rounded-md" />
                                                    <Skeleton className="h-3 w-full rounded-md" />
                                                    <Skeleton className="h-3 w-full rounded-md" />
                                                    <Skeleton className="h-3 w-4/5 rounded-md" />
                                                </div>
                                                <Skeleton className="h-8 w-28 rounded-full" />
                                            </div>

                                            <div className="mt-5 flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                                <Skeleton className="h-8 w-56 rounded-full" />
                                                <Skeleton className="h-3 w-40 rounded-md" />
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-background py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
                        <SectionHeaderSkeleton
                            tagWidth="w-20"
                            titleWidth="w-full max-w-lg"
                            descriptionWidth="w-full max-w-xl"
                        />

                        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:w-136">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-border/60 bg-card px-4 py-3 text-center shadow-sm"
                                >
                                    <Skeleton className="mx-auto h-5 w-24 rounded-md" />
                                    <Skeleton className="mx-auto mt-2 h-3 w-28 rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
                        <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.7)] sm:p-7 lg:col-span-7">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="max-w-xl">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Skeleton className="h-12 w-12 rounded-2xl bg-white/10" />
                                            <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
                                        </div>
                                        <Skeleton className="h-3 w-28 rounded-md bg-white/10" />
                                        <Skeleton className="mt-3 h-8 w-72 rounded-xl bg-white/10" />
                                        <Skeleton className="mt-3 h-3 w-full max-w-lg rounded-md bg-white/10" />
                                        <Skeleton className="mt-2 h-3 w-4/5 rounded-md bg-white/10" />
                                    </div>
                                    <Skeleton className="h-8 w-36 rounded-full bg-white/10" />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {Array.from({ length: 2 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4"
                                        >
                                            <Skeleton className="h-3 w-24 rounded-md bg-white/10" />
                                            <Skeleton className="mt-3 h-4 w-full rounded-md bg-white/10" />
                                        </div>
                                    ))}
                                </div>

                                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 sm:p-5">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-28 rounded-md bg-white/10" />
                                            <Skeleton className="h-4 w-72 rounded-md bg-white/10" />
                                        </div>
                                        <Skeleton className="h-8 w-44 rounded-full bg-white/10" />
                                    </div>
                                </div>
                            </div>
                        </article>

                        <div className="grid gap-4 lg:col-span-5 lg:gap-5">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <article
                                    key={index}
                                    className="rounded-[1.8rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <Skeleton className="h-12 w-12 rounded-2xl" />
                                        <Skeleton className="h-7 w-12 rounded-full" />
                                    </div>
                                    <Skeleton className="mt-5 h-3 w-24 rounded-md" />
                                    <Skeleton className="mt-3 h-6 w-44 rounded-md" />
                                    <Skeleton className="mt-3 h-3 w-full rounded-md" />
                                    <Skeleton className="mt-2 h-3 w-4/5 rounded-md" />
                                </article>
                            ))}
                        </div>

                        {Array.from({ length: 3 }).map((_, index) => (
                            <article
                                key={index}
                                className="rounded-[1.7rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6 lg:col-span-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <Skeleton className="h-11 w-11 rounded-2xl" />
                                    <Skeleton className="h-7 w-12 rounded-full" />
                                </div>
                                <Skeleton className="mt-5 h-5 w-36 rounded-md" />
                                <Skeleton className="mt-3 h-3 w-20 rounded-md" />
                                <Skeleton className="mt-3 h-3 w-full rounded-md" />
                                <Skeleton className="mt-2 h-3 w-4/5 rounded-md" />
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative w-full overflow-hidden bg-background py-20 lg:py-32">
                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeaderSkeleton
                        center
                        tagWidth="w-24"
                        titleWidth="w-56"
                        descriptionWidth="w-full max-w-xl"
                    />

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-[1.5rem] border border-border/60 p-4 text-center sm:p-6"
                            >
                                <Skeleton className="mx-auto mb-4 h-12 w-12 rounded-2xl sm:h-14 sm:w-14" />
                                <Skeleton className="mx-auto h-4 w-3/4 rounded-md" />
                                <Skeleton className="mx-auto mt-3 h-3 w-1/2 rounded-md" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 flex justify-center">
                        <Skeleton className="h-14 w-full max-w-xs rounded-xl sm:w-44" />
                    </div>
                </div>
            </section>
            <section className="relative w-full overflow-hidden bg-background py-16 sm:py-20 lg:py-32">
                <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                        <div className="relative mx-auto w-full max-w-md pb-24 md:pl-4 lg:max-w-none lg:pb-0 lg:pl-10">
                            <div className="relative z-10 mx-auto aspect-4/5 w-full max-w-120 overflow-hidden rounded-[2.5rem] p-2">
                                <div className="h-full w-full rounded-[2rem] border border-border/50 bg-card p-4">
                                    <Skeleton className="h-full w-full rounded-[1.6rem]" />
                                </div>
                            </div>

                            <div className="absolute left-2 top-[14%] z-20 hidden sm:flex sm:-left-8 lg:-left-12">
                                <div className="flex items-center gap-3 rounded-2xl border border-border/60 px-4 py-3 shadow-sm">
                                    <Skeleton className="h-12 w-12 rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-20 rounded-md" />
                                        <Skeleton className="h-4 w-24 rounded-md" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute right-2 top-[44%] z-20 hidden max-w-48 rounded-3xl border border-border/50 p-4 shadow-sm sm:block sm:-right-6 lg:-right-10 lg:max-w-none lg:p-5">
                                <Skeleton className="mx-auto h-7 w-28 rounded-full" />
                                <Skeleton className="mx-auto mt-4 h-4 w-24 rounded-md" />
                                <div className="mt-4 flex items-center justify-center">
                                    <div className="flex -space-x-3">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <Skeleton key={index} className="h-10 w-10 rounded-full border-2 border-background" />
                                        ))}
                                    </div>
                                    <Skeleton className="ml-2 h-10 w-10 rounded-full" />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-1/2 z-20 flex w-[calc(100%-1rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-emerald-500/20 px-4 py-3 shadow-xl sm:-bottom-6 sm:left-4 sm:w-fit sm:max-w-none sm:translate-x-0 sm:gap-4 sm:px-6 sm:py-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32 rounded-md" />
                                    <Skeleton className="h-3 w-24 rounded-md" />
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mx-auto mt-2 flex h-full max-w-xl flex-col justify-center text-center lg:mx-0 lg:mt-0 lg:max-w-none lg:text-left">
                            <Skeleton className="mb-3 h-3 w-28 rounded-md" />

                            <div className="space-y-3">
                                <Skeleton className="h-9 w-full max-w-md rounded-xl" />
                                <Skeleton className="h-9 w-full max-w-lg rounded-xl" />
                                <Skeleton className="h-9 w-full max-w-sm rounded-xl" />
                            </div>

                            <div className="mt-4 space-y-2">
                                <Skeleton className="h-4 w-full rounded-md" />
                                <Skeleton className="h-4 w-4/5 rounded-md" />
                            </div>

                            <ul className="mt-8 space-y-4">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <li key={index} className="flex items-start gap-4 rounded-lg p-2">
                                        <Skeleton className="mt-0.5 h-7 w-7 shrink-0 rounded-full" />
                                        <Skeleton className="mt-1 h-4 w-full rounded-md" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative w-full overflow-hidden bg-background py-14 lg:py-20">
                <div className="relative z-10 container mx-auto grid grid-cols-1 gap-6 px-4 sm:gap-7 sm:px-6 lg:grid-cols-2 lg:px-8">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <article
                            key={index}
                            className="relative isolate overflow-hidden rounded-3xl border border-border/60 p-6 pb-44 shadow-sm sm:min-h-80 sm:p-8 sm:pb-10 sm:pr-40"
                        >
                            <div className="max-w-sm space-y-4 md:max-w-[60%]">
                                <Skeleton className="h-7 w-28 rounded-full" />
                                <Skeleton className="h-8 w-36 rounded-xl" />
                                <Skeleton className="h-3 w-full rounded-md" />
                                <Skeleton className="h-3 w-4/5 rounded-md" />
                                <Skeleton className="h-12 w-full rounded-xl sm:w-52" />
                            </div>

                            <div className="absolute bottom-0 right-1/2 translate-x-1/2 sm:right-4 sm:translate-x-0">
                                <Skeleton className="h-48 w-36 rounded-t-[2rem] sm:h-56 sm:w-40 md:h-64 md:w-44" />
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="border-y border-border/50 bg-muted/30 py-16 md:py-24">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeaderSkeleton
                        center
                        tagWidth="w-16"
                        titleWidth="w-72"
                        descriptionWidth="w-full max-w-xl"
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-border/50 bg-card p-6"
                            >
                                <div className="mb-5 flex items-center justify-between">
                                    <Skeleton className="h-11 w-11 rounded-xl" />
                                    <Skeleton className="h-6 w-28 rounded-full" />
                                </div>
                                <Skeleton className="h-5 w-36 rounded-md" />
                                <Skeleton className="mt-3 h-3 w-full rounded-md" />
                                <Skeleton className="mt-2 h-3 w-4/5 rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="overflow-hidden bg-background py-16 md:py-24">
                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[1.9rem] border border-primary/20 bg-slate-950 p-6 text-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)] sm:p-7">
                        <Skeleton className="h-3 w-24 rounded-md bg-white/10" />
                        <Skeleton className="mt-4 h-9 w-full max-w-lg rounded-xl bg-white/10" />
                        <Skeleton className="mt-4 h-4 w-full max-w-lg rounded-md bg-white/10" />
                        <Skeleton className="mt-2 h-4 w-4/5 rounded-md bg-white/10" />

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
                                >
                                    <Skeleton className="mx-auto h-7 w-20 rounded-md bg-white/10" />
                                    <Skeleton className="mx-auto mt-2 h-3 w-24 rounded-md bg-white/10" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-col gap-3 md:flex-row md:flex-wrap">
                            <Skeleton className="h-14 w-full rounded-2xl bg-white/10 md:w-52" />
                            <Skeleton className="h-14 w-full rounded-2xl bg-white/10 md:w-52" />
                        </div>

                        <div className="mt-6 border-t border-white/10 pt-6">
                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                <div className="flex -space-x-3">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            className="h-10 w-10 rounded-full border-2 border-slate-950 bg-white/10"
                                        />
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <Skeleton key={index} className="h-3.5 w-3.5 rounded-sm bg-white/10" />
                                        ))}
                                    </div>
                                    <Skeleton className="h-3 w-40 rounded-md bg-white/10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-background py-16 md:py-24">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeaderSkeleton
                        center
                        tagWidth="w-28"
                        titleWidth="w-64"
                        descriptionWidth="w-full max-w-xl"
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-col rounded-2xl border border-border/50 bg-card p-6"
                            >
                                <div className="mb-4 flex gap-1">
                                    {Array.from({ length: 5 }).map((_, starIndex) => (
                                        <Skeleton key={starIndex} className="h-3.5 w-3.5 rounded-sm" />
                                    ))}
                                </div>

                                <div className="mb-5 flex-1 space-y-2">
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-3/4 rounded-md" />
                                </div>

                                <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-28 rounded-md" />
                                        <Skeleton className="h-3 w-36 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-background py-16 md:py-24">
                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[2.2rem] border border-border/60 bg-card/85 p-4 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:p-5 lg:p-6">
                        <div className="grid gap-5 lg:grid-cols-[0.98fr_1.02fr] lg:gap-6">
                            <div className="rounded-[1.9rem] border border-primary/20 bg-slate-950 p-6 text-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)] sm:p-7">
                                <Skeleton className="h-3 w-28 rounded-md bg-white/10" />
                                <Skeleton className="mt-4 h-9 w-full max-w-md rounded-xl bg-white/10" />
                                <Skeleton className="mt-4 h-4 w-full max-w-lg rounded-md bg-white/10" />
                                <Skeleton className="mt-2 h-4 w-4/5 rounded-md bg-white/10" />

                                <div className="mt-6 space-y-3">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            className="h-8 w-52 rounded-full bg-white/10"
                                        />
                                    ))}
                                </div>

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                    <Skeleton className="h-12 w-full rounded-full bg-white/10 sm:w-40" />
                                    <Skeleton className="h-12 w-full rounded-full bg-white/10 sm:w-36" />
                                </div>

                                <div className="mt-7 border-t border-white/10 pt-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-8 w-24 rounded-xl bg-white/10" />
                                            <Skeleton className="h-3 w-40 rounded-md bg-white/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <Skeleton key={index} className="h-4 w-4 rounded-sm bg-white/10" />
                                                ))}
                                            </div>
                                            <Skeleton className="h-3 w-40 rounded-md bg-white/10" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-rows-[auto_1fr]">
                                <div className="rounded-[1.6rem] border border-border/60 bg-background px-5 py-4 shadow-sm">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-20 rounded-md" />
                                            <Skeleton className="h-4 w-56 rounded-md" />
                                        </div>
                                        <Skeleton className="h-8 w-32 rounded-full" />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="rounded-[1.65rem] border border-border/60 bg-card p-5 shadow-sm"
                                        >
                                            <Skeleton className="h-11 w-11 rounded-2xl" />
                                            <Skeleton className="mt-5 h-6 w-32 rounded-md" />
                                            <Skeleton className="mt-3 h-3 w-full rounded-md" />
                                            <Skeleton className="mt-2 h-3 w-4/5 rounded-md" />
                                            <Skeleton className="mt-5 h-8 w-24 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
