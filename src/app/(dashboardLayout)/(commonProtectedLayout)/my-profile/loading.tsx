import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyProfileLoading() {
    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in-0 duration-500">
            {/* Page Title */}
            <Skeleton className="h-8 w-40" />

            {/* ── Profile Header Card ── */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <Skeleton className="w-24 h-24 rounded-full" />
                            <Skeleton className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full" />
                        </div>
                        {/* Name, role, badges, contact */}
                        <div className="flex-1 space-y-3 w-full">
                            <div className="flex flex-wrap items-center gap-2">
                                <Skeleton className="h-6 w-44" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                                <Skeleton className="h-5 w-24 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-56" />
                            <div className="flex flex-wrap items-center gap-4">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-36" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Career Boost Status ── */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border px-4 py-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-36" />
                                <Skeleton className="h-4 w-52" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </CardContent>
            </Card>

            {/* ── Profile Completion ── */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-4 w-10" />
                        </div>
                        <Skeleton className="h-3 w-full rounded-full" />
                        <Skeleton className="h-3 w-64" />
                    </div>
                </CardContent>
            </Card>

            {/* ── Account Details ── */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="h-5 w-36" />
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                                <Skeleton className="h-5 w-5 rounded mt-0.5 shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-4 w-full max-w-45" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ── Personal Information ── */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="h-5 w-44" />
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                                <Skeleton className="h-5 w-5 rounded mt-0.5 shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-4 w-full max-w-50" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ── Skills ── */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="space-y-4">
                        {/* Technical Skills */}
                        <div>
                            <Skeleton className="h-3 w-28 mb-2" />
                            <div className="flex flex-wrap gap-1.5">
                                {[16, 20, 14, 24, 18, 12, 22, 16].map((w, i) => (
                                    <Skeleton key={i} className="h-6 rounded-full" style={{ width: `${w * 4}px` }} />
                                ))}
                            </div>
                        </div>
                        {/* Soft Skills */}
                        <div>
                            <Skeleton className="h-3 w-20 mb-2" />
                            <div className="flex flex-wrap gap-1.5">
                                {[18, 22, 16, 20, 14].map((w, i) => (
                                    <Skeleton key={i} className="h-6 rounded-full" style={{ width: `${w * 4}px` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Quick Actions ── */}
            <Card>
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-28" />
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-9 w-32 rounded-md" />
                        <Skeleton className="h-9 w-32 rounded-md" />
                        <Skeleton className="h-9 w-48 rounded-md" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
