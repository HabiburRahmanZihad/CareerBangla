import { Skeleton } from "@/components/ui/skeleton";

const StatCardSkeleton = ({ accent }: { accent: string }) => (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4">
        <div className={`absolute inset-y-0 left-0 w-1 bg-linear-to-b ${accent}`} />
        <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3.5 w-24" />
            </div>
        </div>
    </div>
);

const AdminCardSkeleton = () => (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
        <div className="bg-linear-to-br from-muted/60 via-muted/30 to-transparent p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3.5 w-48" />
            </div>
        </div>

        <div className="p-5 pt-0">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/40 px-3 py-3">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 flex-1" />
                </div>
                <Skeleton className="h-4 w-4 rounded" />
            </div>
        </div>
    </div>
);

export default function AdminsManagementLoading() {
    return (
        <div className="space-y-6 py-1">
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-red-500/10 via-background to-rose-500/5 p-6 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-2xl" />
                            <Skeleton className="h-6 w-28 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-72 max-w-full" />
                            <Skeleton className="h-4 w-80 max-w-full" />
                        </div>
                    </div>
                    <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCardSkeleton accent="from-primary to-orange-600" />
                <StatCardSkeleton accent="from-red-600 to-rose-600" />
                <StatCardSkeleton accent="from-blue-600 to-cyan-600" />
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/70 p-4 sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="flex-1">
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-24 rounded-full" />
                        <div className="flex rounded-xl border border-border/50 p-1">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <AdminCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
