export default function ChangePasswordLoading() {
    return (
        <div className="w-full space-y-5 animate-pulse">

            {/* Heading */}
            <div className="space-y-2">
                <div className="h-7 w-44 rounded-lg bg-muted" />
                <div className="h-4 w-72 rounded-lg bg-muted" />
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-border/40 bg-card overflow-hidden">

                {/* Header */}
                <div className="px-6 sm:px-8 py-5 border-b border-border/30 flex items-center gap-4 bg-muted/10">
                    <div className="h-11 w-11 rounded-2xl bg-muted shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-4 w-28 rounded-lg bg-muted" />
                        <div className="h-3 w-48 rounded bg-muted" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
                </div>

                {/* Two-column body */}
                <div className="grid grid-cols-1 lg:grid-cols-5">

                    {/* Left — form */}
                    <div className="lg:col-span-3 px-6 sm:px-8 py-7 space-y-5 lg:border-r border-border/30">
                        {/* Field 1 */}
                        <div className="space-y-1.5">
                            <div className="h-3.5 w-32 rounded bg-muted" />
                            <div className="h-10 w-full rounded-lg bg-muted" />
                        </div>
                        {/* Divider */}
                        <div className="h-px w-full bg-muted" />
                        {/* Field 2 */}
                        <div className="space-y-1.5">
                            <div className="h-3.5 w-28 rounded bg-muted" />
                            <div className="h-10 w-full rounded-lg bg-muted" />
                        </div>
                        {/* Field 3 */}
                        <div className="space-y-1.5">
                            <div className="h-3.5 w-36 rounded bg-muted" />
                            <div className="h-10 w-full rounded-lg bg-muted" />
                        </div>
                        {/* Submit */}
                        <div className="h-10 w-full rounded-xl bg-muted" />
                    </div>

                    {/* Right — tips */}
                    <div className="lg:col-span-2 px-6 sm:px-8 lg:px-7 py-7 bg-muted/10 border-t border-border/30 lg:border-t-0 space-y-5">
                        <div className="h-3 w-24 rounded bg-muted" />
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="h-7 w-7 rounded-lg bg-muted shrink-0" />
                                <div className="flex-1 space-y-1.5 pt-1">
                                    <div className="h-3 w-full rounded bg-muted" />
                                    <div className="h-3 w-4/5 rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                        <div className="rounded-2xl border border-border/40 bg-card p-4 space-y-3">
                            <div className="h-3 w-24 rounded bg-muted" />
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="h-4 w-4 rounded-full bg-muted shrink-0" />
                                    <div className="h-3 w-40 rounded bg-muted" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
