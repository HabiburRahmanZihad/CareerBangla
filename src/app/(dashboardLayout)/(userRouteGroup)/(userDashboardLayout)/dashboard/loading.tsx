export default function UserDashboardLoading() {
    return (
        <div className="space-y-6 pb-8 animate-pulse">

            {/* Hero banner skeleton */}
            <div className="rounded-2xl bg-muted h-32 sm:h-28" />

            {/* Profile completion skeleton */}
            <div className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="h-4 w-36 rounded-lg bg-muted" />
                        <div className="h-3 w-52 rounded-lg bg-muted" />
                    </div>
                    <div className="h-9 w-14 rounded-lg bg-muted" />
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted" />
                <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-muted" />
                            <div className="h-2.5 w-10 rounded bg-muted hidden sm:block" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Stat cards skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                                <div className="h-3 w-20 rounded-lg bg-muted" />
                                <div className="h-9 w-16 rounded-lg bg-muted" />
                                <div className="h-2.5 w-28 rounded bg-muted" />
                            </div>
                            <div className="h-11 w-11 rounded-xl bg-muted shrink-0" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts row skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Area chart */}
                <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card p-5 space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1.5">
                            <div className="h-4 w-40 rounded-lg bg-muted" />
                            <div className="h-3 w-32 rounded-lg bg-muted" />
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-muted" />
                    </div>
                    {/* Fake chart bars */}
                    <div className="h-52 rounded-xl bg-muted/50 flex items-end justify-around px-4 pb-4 gap-1">
                        {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50, 75, 95].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-t-sm bg-muted"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Donut chart */}
                <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1.5">
                            <div className="h-4 w-32 rounded-lg bg-muted" />
                            <div className="h-3 w-16 rounded-lg bg-muted" />
                        </div>
                        <div className="h-6 w-8 rounded-full bg-muted" />
                    </div>
                    <div className="flex flex-col items-center gap-4 pt-2">
                        <div className="h-32 w-32 rounded-full border-[12px] border-muted bg-transparent" />
                        <div className="space-y-2 w-full">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-muted shrink-0" />
                                    <div className="h-2.5 flex-1 rounded bg-muted" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent applications skeleton */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-border/40">
                    <div className="space-y-1.5">
                        <div className="h-4 w-36 rounded-lg bg-muted" />
                        <div className="h-3 w-28 rounded-lg bg-muted" />
                    </div>
                    <div className="h-7 w-16 rounded-lg bg-muted" />
                </div>
                <div className="p-3 space-y-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                            <div className="h-9 w-9 rounded-xl bg-muted shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3.5 w-44 rounded-md bg-muted" />
                                <div className="h-3 w-28 rounded-md bg-muted" />
                            </div>
                            <div className="h-6 w-20 rounded-full bg-muted shrink-0" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick access skeleton */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-1 w-4 rounded-full bg-muted" />
                    <div className="h-3 w-24 rounded-lg bg-muted" />
                </div>
                <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-border/50 bg-card">
                            <div className="h-10 w-10 rounded-xl bg-muted" />
                            <div className="h-2.5 w-12 rounded bg-muted" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
