export default function MyProfileLoading() {
    return (
        <div className="space-y-6 max-w-5xl pb-10 animate-pulse">

            {/* Page heading */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="space-y-1.5">
                    <div className="h-7 w-32 rounded-lg bg-muted" />
                    <div className="h-3.5 w-64 rounded-lg bg-muted" />
                </div>
                <div className="h-8 w-28 rounded-xl bg-muted" />
            </div>

            {/* Hero card */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                {/* Cover */}
                <div className="h-28 sm:h-36 bg-muted rounded-t-2xl" />
                {/* Avatar + info row */}
                <div className="px-5 sm:px-7 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
                        {/* Avatar */}
                        <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-4 border-background bg-muted shadow-lg shrink-0" />
                        {/* Info */}
                        <div className="flex-1 min-w-0 sm:pb-1 space-y-2.5">
                            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                                <div className="h-6 w-44 rounded-lg bg-muted" />
                                <div className="h-5 w-20 rounded-full bg-muted" />
                                <div className="h-5 w-20 rounded-full bg-muted" />
                            </div>
                            <div className="h-4 w-48 rounded-lg bg-muted" />
                            <div className="flex flex-wrap gap-4">
                                <div className="h-3.5 w-40 rounded bg-muted" />
                                <div className="h-3.5 w-28 rounded bg-muted" />
                                <div className="h-3.5 w-32 rounded bg-muted" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* LEFT SIDEBAR */}
                <div className="lg:col-span-1 space-y-4">

                    {/* Account Details */}
                    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                            <div className="h-4 w-32 rounded-lg bg-muted" />
                        </div>
                        <div className="p-5 space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                                    <div className="h-7 w-7 rounded-lg bg-muted shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-2.5 w-16 rounded bg-muted" />
                                        <div className="h-3.5 w-full max-w-35 rounded bg-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                            <div className="h-4 w-28 rounded-lg bg-muted" />
                        </div>
                        <div className="p-5 space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-9 w-full rounded-xl bg-muted" />
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                            <div className="h-4 w-24 rounded-lg bg-muted" />
                        </div>
                        <div className="p-5 space-y-2">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                                    <div className="h-7 w-7 rounded-lg bg-muted shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-2.5 w-16 rounded bg-muted" />
                                        <div className="h-3.5 w-28 rounded bg-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT MAIN */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Career Boost / status banner */}
                    <div className="rounded-2xl border border-border/50 bg-card p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-36 rounded-lg bg-muted" />
                            <div className="h-3 w-52 rounded bg-muted" />
                        </div>
                        <div className="h-8 w-24 rounded-xl bg-muted shrink-0" />
                    </div>

                    {/* Profile completion */}
                    <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-36 rounded-lg bg-muted" />
                            <div className="h-4 w-10 rounded-lg bg-muted" />
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

                    {/* Personal Info */}
                    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                            <div className="h-4 w-40 rounded-lg bg-muted" />
                        </div>
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                                    <div className="h-7 w-7 rounded-lg bg-muted shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-2.5 w-16 rounded bg-muted" />
                                        <div className="h-3.5 w-28 rounded bg-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                            <div className="h-4 w-16 rounded-lg bg-muted" />
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <div className="h-2.5 w-28 rounded bg-muted mb-2.5" />
                                <div className="flex flex-wrap gap-1.5">
                                    {[64, 80, 56, 96, 72, 48, 88, 64].map((w, i) => (
                                        <div key={i} className="h-6 rounded-full bg-muted" style={{ width: w }} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="h-2.5 w-20 rounded bg-muted mb-2.5" />
                                <div className="flex flex-wrap gap-1.5">
                                    {[72, 88, 64, 80, 56].map((w, i) => (
                                        <div key={i} className="h-6 rounded-full bg-muted" style={{ width: w }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Experience timeline */}
                    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                            <div className="h-4 w-32 rounded-lg bg-muted" />
                        </div>
                        <div className="p-5 space-y-5">
                            {[1, 2].map((i) => (
                                <div key={i} className="relative pl-6">
                                    <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-muted" />
                                    <div className="absolute left-1.25 top-4 bottom-0 w-px bg-muted" />
                                    <div className="flex justify-between items-start gap-2 mb-1.5">
                                        <div className="h-4 w-40 rounded bg-muted" />
                                        <div className="h-3 w-28 rounded bg-muted shrink-0" />
                                    </div>
                                    <div className="h-3 w-32 rounded bg-muted mb-2" />
                                    <div className="space-y-1">
                                        <div className="h-2.5 w-full rounded bg-muted" />
                                        <div className="h-2.5 w-4/5 rounded bg-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
