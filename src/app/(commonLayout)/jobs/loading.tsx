import { Skeleton } from "@/components/ui/skeleton";

// ── Shimmer pulse override via inline animation ───────────────────────────────
// We use the default Skeleton shimmer. All layout mirrors JobsPageContent exactly.

const ListCardSkeleton = () => (
    <div className="flex gap-4 p-4 rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm">
        {/* Logo */}
        <Skeleton className="h-12 w-12 rounded-xl shrink-0" />

        <div className="flex-1 min-w-0 space-y-2">
            {/* Badges row */}
            <div className="flex gap-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            {/* Title */}
            <Skeleton className="h-4 w-3/5 rounded-md" />
            {/* Meta row */}
            <div className="flex gap-3">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            {/* Description */}
            <Skeleton className="h-3 w-4/5 rounded-md" />
            {/* Bottom badges */}
            <div className="flex gap-2 pt-0.5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
            </div>
        </div>

        {/* Bookmark */}
        <Skeleton className="h-4 w-4 rounded shrink-0 mt-1" />
    </div>
);

const SidebarSkeleton = () => (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-primary/8 px-5 py-4 border-b border-white/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-28 rounded-md" />
            </div>
        </div>

        <div className="p-5 space-y-6">
            {/* Keywords */}
            <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-9 w-full rounded-lg" />
            </div>

            {/* Location */}
            <div className="space-y-2">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-9 w-full rounded-lg" />
            </div>

            {/* Category */}
            <div className="space-y-2">
                <Skeleton className="h-3 w-18 rounded-md" />
                <Skeleton className="h-9 w-full rounded-lg" />
            </div>

            {/* Job Type pills */}
            <div className="space-y-2">
                <Skeleton className="h-3 w-16 rounded-md" />
                <div className="flex flex-wrap gap-1.5">
                    {["All", "Full Time", "Part Time", "Contract", "Internship", "Remote"].map((_, i) => (
                        <Skeleton key={i} className="h-7 rounded-full" style={{ width: `${[36, 72, 72, 70, 80, 60][i]}px` }} />
                    ))}
                </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
                <Skeleton className="h-3 w-28 rounded-md" />
                <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-9 rounded-lg" />
                    <Skeleton className="h-9 rounded-lg" />
                </div>
            </div>

            {/* Date Posted */}
            <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-md" />
                <div className="space-y-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                            <Skeleton className="h-2 w-2 rounded-full shrink-0" />
                            <Skeleton className="h-3.5 rounded-md" style={{ width: `${[60, 96, 80, 90, 92][i]}px` }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Button */}
            <Skeleton className="h-9 w-full rounded-lg" />
        </div>
    </div>
);

export default function JobsLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* ── Hero Banner Skeleton ── */}
            <div className="relative overflow-hidden border-b bg-linear-to-br from-primary/8 via-primary/4 to-background">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/8 blur-2xl" />

                <div className="relative container mx-auto px-4 py-14 text-center">
                    {/* Badge */}
                    <div className="flex justify-center mb-5">
                        <Skeleton className="h-7 w-52 rounded-full" />
                    </div>

                    {/* Headline */}
                    <div className="flex justify-center mb-3">
                        <Skeleton className="h-12 w-80 rounded-xl" />
                    </div>
                    <div className="flex justify-center mb-8">
                        <Skeleton className="h-5 w-96 rounded-md" />
                    </div>

                    {/* Search bar – glass outline */}
                    <div className="max-w-2xl mx-auto backdrop-blur-xl bg-white/60 dark:bg-white/8 border border-white/50 dark:border-white/15 rounded-2xl shadow-xl p-2 mb-7 flex gap-2">
                        <Skeleton className="flex-1 h-10 rounded-xl" />
                        <Skeleton className="h-10 w-px rounded-none" />
                        <Skeleton className="w-44 h-10 rounded-xl" />
                        <Skeleton className="w-24 h-10 rounded-xl" />
                    </div>

                    {/* Trending chips */}
                    <div className="flex items-center justify-center flex-wrap gap-2">
                        <Skeleton className="h-4 w-20 rounded-md" />
                        {[60, 96, 44, 56, 76, 70].map((w, i) => (
                            <Skeleton key={i} className="h-6 rounded-full" style={{ width: `${w}px` }} />
                        ))}
                    </div>
                </div>

                {/* Stats strip */}
                <div className="border-t border-white/30 backdrop-blur-md bg-white/40 dark:bg-white/5">
                    <div className="container mx-auto px-4 py-3.5 flex items-center justify-center gap-8 flex-wrap">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-8 rounded-md" />
                                <Skeleton className="h-4 w-16 rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6 items-start">
                    {/* ── Left: Results ── */}
                    <div className="flex-1 min-w-0 space-y-4">
                        {/* Results bar */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <Skeleton className="h-4 w-32 rounded-md" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-40 rounded-lg" />
                                <Skeleton className="h-8 w-24 rounded-lg" />
                                <Skeleton className="h-8 w-16 rounded-lg" />
                            </div>
                        </div>

                        {/* List card skeletons */}
                        <div className="space-y-2.5">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ListCardSkeleton key={i} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-1.5 pt-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-8 rounded-lg" />
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Filter Sidebar ── */}
                    <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
                        <SidebarSkeleton />
                    </aside>
                </div>
            </div>
        </div>
    );
}
