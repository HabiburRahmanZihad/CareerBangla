import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md transition-all duration-300">
            <div className="relative flex items-center justify-center mb-6">
                {/* Outer Glowing Ring */}
                <div className="absolute inset-0 h-32 w-32 rounded-full border-t-2 border-primary/40 blur-sm animate-[spin_2s_linear_infinite]" />

                {/* Fast Inner Ring */}
                <div className="absolute h-24 w-24 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin duration-700" />

                {/* Slower Middle Ring */}
                <div className="h-20 w-20 rounded-full border-2 border-transparent border-b-primary/60 border-l-primary/60 animate-[spin_1.5s_linear_infinite_reverse]" />

                {/* Core Icon */}
                <Loader2 className="absolute h-10 w-10 animate-spin text-primary" />
            </div>

            <div className="mb-3">
                <Image
                    src="/carrerBanglalogo.png"
                    alt="CareerBangla"
                    width={180}
                    height={70}
                    priority
                    className="object-contain"
                />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground animate-pulse">
                CareerBangla
            </h2>
            <p className="mt-2 text-sm text-muted-foreground animate-pulse animate-delay-150">
                Loading your future...
            </p>
        </div>
    );
}
