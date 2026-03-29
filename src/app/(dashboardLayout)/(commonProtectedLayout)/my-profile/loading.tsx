export default function MyProfileLoading() {
    return (
        <div className="space-y-5 max-w-5xl pb-12 animate-pulse">

            {/* Page heading */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="space-y-1.5">
                    <div className="h-7 w-32 rounded-lg bg-muted" />
                    <div className="h-3.5 w-64 rounded-lg bg-muted" />
                </div>
                <div className="h-8 w-28 rounded-xl bg-muted" />
            </div>

            {/* Hero card */}
            <div className="rounded-3xl border border-border/40 bg-card overflow-hidden">
                {/* Cover */}
                <div className="h-40 sm:h-48 bg-muted rounded-t-3xl" />
                {/* Avatar + info */}
                <div className="px-6 sm:px-8">
                    <div className="-mt-12 sm:-mt-16 mb-5 w-fit">
                        <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-xl bg-muted border-2 border-card" />
                    </div>
                    <div className="pb-6 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-44 rounded-lg bg-muted" />
                            <div className="h-5 w-20 rounded-full bg-muted" />
                        </div>
                        <div className="h-4 w-48 rounded-lg bg-muted" />
                        <div className="h-3.5 w-36 rounded bg-muted" />
                    </div>
                </div>
            </div>

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* LEFT SIDEBAR */}
                <div className="space-y-4">

                    {/* Account Details */}
                    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-border/30 flex items-center gap-2.5 bg-muted/10">
                            <div className="h-4 w-4 rounded bg-muted shrink-0" />
                            <div className="h-4 w-28 rounded-lg bg-muted" />
                        </div>
                        <div className="p-5 space-y-1">
                            {/* Status pills row */}
                            <div className="flex gap-1.5 pb-3.5 border-b border-border/20 mb-0.5">
                                <div className="h-6 w-16 rounded-full bg-muted" />
                                <div className="h-6 w-18 rounded-full bg-muted" />
                                <div className="h-6 w-20 rounded-full bg-muted" />
                            </div>
                            {/* Info rows */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-border/20 last:border-0">
                                    <div className="h-6 w-6 rounded-md bg-muted shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-2 w-16 rounded bg-muted" />
                                        <div className="h-3.5 w-32 rounded bg-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-border/30 flex items-center gap-2.5 bg-muted/10">
                            <div className="h-4 w-4 rounded bg-muted shrink-0" />
                            <div className="h-4 w-24 rounded-lg bg-muted" />
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border/40 bg-muted/20">
                                        <div className="h-5 w-5 rounded bg-muted" />
                                        <div className="h-2.5 w-12 rounded bg-muted" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-destructive/15 flex items-center gap-2.5 bg-destructive/10">
                            <div className="h-4 w-4 rounded bg-muted shrink-0" />
                            <div className="h-4 w-24 rounded-lg bg-muted" />
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="h-3 w-full rounded bg-muted" />
                            <div className="h-3 w-3/4 rounded bg-muted" />
                            <div className="h-8 w-32 rounded-lg bg-muted" />
                        </div>
                    </div>
                </div>

                {/* RIGHT MAIN */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Career Boost banner */}
                    <div className="rounded-2xl border border-border/40 bg-card p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-36 rounded-lg bg-muted" />
                            <div className="h-3 w-52 rounded bg-muted" />
                        </div>
                        <div className="h-8 w-24 rounded-xl bg-muted shrink-0" />
                    </div>

                    {/* Profile Completion */}
                    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-border/30 flex items-center gap-2.5 bg-muted/10">
                            <div className="h-4 w-4 rounded bg-muted shrink-0" />
                            <div className="h-4 w-36 rounded-lg bg-muted" />
                        </div>
                        <div className="p-5 flex items-center gap-5">
                            <div className="h-22 w-22 rounded-full bg-muted shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-48 rounded-lg bg-muted" />
                                <div className="h-2.5 w-full rounded-full bg-muted" />
                                <div className="h-3.5 w-32 rounded bg-muted" />
                            </div>
                        </div>
                    </div>

                    {/* Experience timeline */}
                    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-border/30 flex items-center gap-2.5 bg-muted/10">
                            <div className="h-4 w-4 rounded bg-muted shrink-0" />
                            <div className="h-4 w-32 rounded-lg bg-muted" />
                        </div>
                        <div className="p-5 space-y-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="relative pl-7">
                                    <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-muted" />
                                    <div className="absolute left-1.5 top-5 bottom-0 w-px bg-muted" />
                                    <div className="flex justify-between items-start gap-2 mb-1.5">
                                        <div className="h-4 w-40 rounded bg-muted" />
                                        <div className="h-3.5 w-28 rounded-full bg-muted shrink-0" />
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
