export default function ChangePasswordLoading() {
    return (
        <div className="max-w-lg space-y-4 animate-pulse">

            {/* Heading */}
            <div className="space-y-2">
                <div className="h-7 w-44 rounded-lg bg-muted" />
                <div className="h-4 w-72 rounded-lg bg-muted" />
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-border/40 bg-card overflow-hidden">

                {/* Header strip */}
                <div className="px-7 py-5 border-b border-border/30 flex items-center gap-4 bg-muted/10">
                    <div className="h-11 w-11 rounded-2xl bg-muted shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-4 w-28 rounded-lg bg-muted" />
                        <div className="h-3 w-48 rounded bg-muted" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
                </div>

                {/* Form body */}
                <div className="px-7 py-6 space-y-5">

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

                    {/* Submit button */}
                    <div className="h-10 w-full rounded-xl bg-muted" />
                </div>
            </div>

            {/* Footer note */}
            <div className="h-3 w-64 rounded bg-muted mx-auto" />
        </div>
    );
}
