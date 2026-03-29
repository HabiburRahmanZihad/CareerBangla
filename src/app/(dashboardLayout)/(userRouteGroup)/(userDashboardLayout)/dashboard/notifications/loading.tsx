export default function NotificationsLoading() {
    return (
        <div className="w-full space-y-5 animate-pulse">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1.5">
                    <div className="h-7 w-44 rounded-lg bg-muted" />
                    <div className="h-4 w-56 rounded-lg bg-muted" />
                </div>
                <div className="h-9 w-36 rounded-xl bg-muted" />
            </div>

            {/* Main card */}
            <div className="rounded-3xl border border-border/40 bg-card overflow-hidden">

                {/* Tab strip */}
                <div className="px-5 py-3 border-b border-border/30 flex gap-2">
                    {[80, 64, 100, 56, 80, 72].map((w, i) => (
                        <div key={i} className="h-8 rounded-xl bg-muted shrink-0" style={{ width: w }} />
                    ))}
                </div>

                {/* Notification rows */}
                <div className="p-5 space-y-6">

                    {/* Group: Today */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-12 rounded bg-muted" />
                            <div className="flex-1 h-px bg-muted" />
                        </div>
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl border border-border/30">
                                <div className="h-10 w-10 rounded-xl bg-muted shrink-0" />
                                <div className="flex-1 space-y-2 pt-0.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-2/5 rounded-lg bg-muted" />
                                        <div className="h-4 w-8 rounded-full bg-muted" />
                                    </div>
                                    <div className="h-3 w-4/5 rounded bg-muted" />
                                    <div className="h-3 w-1/4 rounded bg-muted" />
                                </div>
                                <div className="h-2 w-2 rounded-full bg-muted mt-2 shrink-0" />
                            </div>
                        ))}
                    </div>

                    {/* Group: Yesterday */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-20 rounded bg-muted" />
                            <div className="flex-1 h-px bg-muted" />
                        </div>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex gap-4 p-4 rounded-2xl border border-border/30 ${i > 1 ? "opacity-60" : ""}`}>
                                <div className="h-10 w-10 rounded-xl bg-muted shrink-0" />
                                <div className="flex-1 space-y-2 pt-0.5">
                                    <div className="h-4 w-1/3 rounded-lg bg-muted" />
                                    <div className="h-3 w-3/5 rounded bg-muted" />
                                    <div className="h-3 w-1/5 rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
