export default function DevicesLoading() {
    return (
        <div className="w-full space-y-5 animate-pulse">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                        <div className="h-7 w-36 rounded-lg bg-muted" />
                        <div className="h-6 w-6 rounded-full bg-muted" />
                    </div>
                    <div className="h-4 w-64 rounded-lg bg-muted" />
                </div>
                <div className="h-9 w-40 rounded-xl bg-muted" />
            </div>

            {/* Main card */}
            <div className="rounded-3xl border border-border/40 bg-card overflow-hidden">

                {/* Card header — device limit bar */}
                <div className="px-6 py-4 border-b border-border/30 bg-muted/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-muted shrink-0" />
                        <div className="space-y-1.5">
                            <div className="h-4 w-28 rounded-lg bg-muted" />
                            <div className="h-3 w-44 rounded bg-muted" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="h-2.5 w-8 rounded-full bg-muted" />
                            <div className="h-2.5 w-8 rounded-full bg-muted" />
                        </div>
                        <div className="h-4 w-6 rounded bg-muted" />
                    </div>
                </div>

                {/* Session rows */}
                <div className="divide-y divide-border/20">
                    {/* Current device */}
                    <div className="px-5 py-4">
                        <div className="relative rounded-2xl border border-border/40 px-5 py-5">
                            <div className="absolute left-0 inset-y-0 w-0.75 rounded-l-2xl bg-muted" />
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="h-12 w-12 rounded-2xl bg-muted shrink-0" />
                                    <div className="flex-1 space-y-2 pt-0.5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-36 rounded-lg bg-muted" />
                                            <div className="h-5 w-20 rounded-full bg-muted" />
                                        </div>
                                        <div className="h-3 w-56 rounded bg-muted" />
                                        <div className="h-3 w-44 rounded bg-muted" />
                                    </div>
                                </div>
                                <div className="h-9 w-24 rounded-xl bg-muted shrink-0" />
                            </div>
                        </div>
                    </div>

                    {/* Second device */}
                    <div className="px-5 py-4 opacity-60">
                        <div className="rounded-2xl border border-border/30 px-5 py-5">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="h-12 w-12 rounded-2xl bg-muted shrink-0" />
                                    <div className="flex-1 space-y-2 pt-0.5">
                                        <div className="h-4 w-48 rounded-lg bg-muted" />
                                        <div className="h-3 w-52 rounded bg-muted" />
                                        <div className="h-3 w-40 rounded bg-muted" />
                                    </div>
                                </div>
                                <div className="h-9 w-24 rounded-xl bg-muted shrink-0" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer tip */}
                <div className="px-6 py-4 border-t border-border/20 bg-muted/5">
                    <div className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-lg bg-muted shrink-0" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-3 w-full rounded bg-muted" />
                            <div className="h-3 w-4/5 rounded bg-muted" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
