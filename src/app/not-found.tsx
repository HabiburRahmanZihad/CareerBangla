import Link from "next/link";
import { Briefcase, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="text-center max-w-lg w-full">
                {/* Big 404 */}
                <div className="relative mb-6">
                    <p className="text-[10rem] font-extrabold leading-none select-none bg-gradient-to-br from-primary/20 to-primary/5 bg-clip-text text-transparent">
                        404
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary/10 rounded-full p-6">
                            <Search className="w-14 h-14 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
                <p className="text-muted-foreground text-base mb-8">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link href="/">
                        <Button size="lg" className="w-full sm:w-auto gap-2">
                            <Home className="w-4 h-4" />
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/jobs">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                            <Briefcase className="w-4 h-4" />
                            Browse Jobs
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
