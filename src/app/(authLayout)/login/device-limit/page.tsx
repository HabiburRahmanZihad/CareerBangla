import DeviceLimitActions from "@/components/modules/Auth/DeviceLimitActions";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import {
    AlertTriangle, Monitor,
    MonitorSmartphone, Shield, Smartphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface DeviceLimitPageProps {
    searchParams: Promise<{ redirect?: string }>;
}

const DeviceLimitPage = async ({ searchParams }: DeviceLimitPageProps) => {
    const userInfo = await getUserInfo();

    if (userInfo) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    const params = await searchParams;
    const redirectPath = params.redirect;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">

            {/* ── Background ───────────────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-background via-muted/20 to-background" />
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "radial-gradient(circle,currentColor 1px,transparent 1px)", backgroundSize: "24px 24px" }}
            />
            {/* Ambient blobs */}
            <div className="pointer-events-none absolute top-1/4 -left-40 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-1/4 -right-40 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />

            {/* ── Content ──────────────────────────────────────────────── */}
            <div className="relative w-full max-w-md">

                {/* Brand */}
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <Image
                            src="/carrerBanglalogo.png"
                            alt="CareerBangla"
                            width={158}
                            height={48}
                            priority
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Glass card */}
                <div className="backdrop-blur-xl bg-card/90 border border-border/60 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden">

                    {/* Warning header strip */}
                    <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 px-6 py-3 flex items-center gap-2.5">
                        <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-xs font-black text-white tracking-widest uppercase">Security Notice</span>
                        <div className="ml-auto flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/40" />
                            ))}
                        </div>
                    </div>

                    <div className="p-7 space-y-6">

                        {/* Device conflict visualization */}
                        <div className="flex flex-col items-center gap-5">
                            <div className="flex items-end justify-center gap-3">

                                {/* Device 1 — active elsewhere */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="relative h-16 w-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center shadow-sm">
                                        <Monitor className="h-8 w-8 text-primary" />
                                        <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-green-500 border-2 border-background flex items-center justify-center shadow-sm">
                                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-wider">Active</span>
                                </div>

                                {/* Conflict bar */}
                                <div className="flex flex-col items-center gap-1 pb-7">
                                    <div className="h-px w-8 bg-border/60" />
                                    <span className="text-[11px] font-black text-muted-foreground/50 tracking-wider">VS</span>
                                    <div className="h-px w-8 bg-border/60" />
                                </div>

                                {/* Device 2 — you now */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="relative h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 border-dashed flex items-center justify-center shadow-sm">
                                        <Smartphone className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                                        <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-amber-500 border-2 border-background flex items-center justify-center shadow-sm">
                                            <span className="text-[8px] text-white font-black">!</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">You Now</span>
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="text-center space-y-2">
                                <h1 className="text-2xl font-black tracking-tight">Already Logged In Elsewhere</h1>
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                    Your account is active on another device. Only one session is allowed at a time.
                                </p>
                            </div>
                        </div>

                        {/* What will happen */}
                        <div className="rounded-2xl bg-muted/30 border border-border/40 p-4 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3.5">
                                What will happen
                            </p>
                            {[
                                {
                                    icon: Shield,
                                    text: "All existing sessions will be securely terminated",
                                    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                                },
                                {
                                    icon: MonitorSmartphone,
                                    text: "You will be logged in on this device immediately",
                                    color: "bg-green-500/10 text-green-600 dark:text-green-400",
                                },
                            ].map(({ icon: Icon, text, color }, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${color}`}>
                                        <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Actions (client component) */}
                        <DeviceLimitActions redirectPath={redirectPath} />
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground/50 mt-6 font-medium">
                    This is a security feature to protect your account.
                </p>
            </div>
        </div>
    );
};

export default DeviceLimitPage;
