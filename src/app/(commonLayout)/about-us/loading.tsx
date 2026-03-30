import { Skeleton } from "@/components/ui/skeleton";

export default function AboutUsLoading() {
    return (
        <div className="overflow-hidden">
            {/* Hero Section Skeleton */}
            <section className="py-20 md:py-32 bg-slate-100">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center space-y-6">
                        <Skeleton className="h-8 w-32 mx-auto rounded-full" />
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full max-w-2xl mx-auto rounded-lg" />
                            <Skeleton className="h-12 w-4/5 max-w-2xl mx-auto rounded-lg" />
                        </div>
                        <Skeleton className="h-6 w-full max-w-xl mx-auto rounded-lg" />
                        <Skeleton className="h-6 w-4/5 max-w-xl mx-auto rounded-lg" />
                    </div>
                </div>
            </section>

            {/* Tabs Section Skeleton */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-32 rounded-lg" />
                        ))}
                    </div>
                    <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
            </section>

            {/* Stats Section Skeleton */}
            <section className="py-16 md:py-20 bg-slate-900">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <Skeleton className="h-10 w-64 mx-auto rounded-lg mb-4 bg-slate-700" />
                        <Skeleton className="h-6 w-96 mx-auto rounded-lg bg-slate-700" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-xl bg-slate-700" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section Skeleton */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <Skeleton className="h-10 w-64 mx-auto rounded-lg mb-4" />
                        <Skeleton className="h-6 w-80 mx-auto rounded-lg" />
                    </div>
                    <div className="space-y-10">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section Skeleton */}
            <section className="py-16 md:py-20 bg-slate-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <Skeleton className="h-10 w-64 mx-auto rounded-lg mb-4" />
                        <Skeleton className="h-6 w-80 mx-auto rounded-lg" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-48 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section Skeleton */}
            <section className="py-16 md:py-20 bg-slate-200">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <Skeleton className="h-10 w-96 mx-auto rounded-lg mb-4" />
                    <Skeleton className="h-6 w-80 mx-auto rounded-lg mb-8" />
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Skeleton className="h-12 w-40 rounded-lg" />
                        <Skeleton className="h-12 w-40 rounded-lg" />
                    </div>
                </div>
            </section>
        </div>
    );
}
