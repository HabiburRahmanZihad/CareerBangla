"use client";

import { getActiveSessions, logoutAllDevices, revokeSession } from "@/services/auth.services";
import { swalDanger } from "@/lib/swal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
    AlertTriangle, CheckCircle2, Chrome,
    Clock, Globe, Laptop, Loader2,
    LogOut, Monitor, Shield,
    ShieldAlert, Smartphone, Tablet, Trash2,
    Wifi,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SessionItem {
    id: string;
    createdAt: string;
    expiresAt: string;
    ipAddress: string | null;
    userAgent: string | null;
    accessTokenExpiresAt: string | null;
    refreshTokenExpiresAt: string | null;
}

// ── User agent parsing ─────────────────────────────────────────────────────────
const parseUserAgent = (ua: string | null) => {
    if (!ua) return { device: "Desktop", browser: "Unknown Browser", os: "Unknown OS", browserShort: "Unknown" };

    let browser = "Unknown Browser";
    let browserShort = "Unknown";
    if (ua.includes("Edg/")) { browser = "Microsoft Edge"; browserShort = "Edge"; }
    else if (ua.includes("Chrome/") && !ua.includes("Edg/")) { browser = "Google Chrome"; browserShort = "Chrome"; }
    else if (ua.includes("Firefox/")) { browser = "Mozilla Firefox"; browserShort = "Firefox"; }
    else if (ua.includes("Safari/") && !ua.includes("Chrome/")) { browser = "Safari"; browserShort = "Safari"; }
    else if (ua.includes("Opera/") || ua.includes("OPR/")) { browser = "Opera"; browserShort = "Opera"; }
    else if (ua.includes("Brave/")) { browser = "Brave"; browserShort = "Brave"; }

    let os = "Unknown OS";
    if (ua.includes("Windows NT 10")) os = "Windows 10/11";
    else if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac OS X")) os = "macOS";
    else if (ua.includes("Linux") && !ua.includes("Android")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone")) os = "iOS (iPhone)";
    else if (ua.includes("iPad")) os = "iPadOS";

    let device = "Desktop";
    if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) device = "Mobile";
    else if (ua.includes("iPad") || ua.includes("Tablet")) device = "Tablet";

    return { device, browser, os, browserShort };
};

const DeviceIcon = ({ device, isCurrent }: { device: string; isCurrent: boolean }) => {
    const cls = `h-6 w-6 ${isCurrent ? "text-primary" : "text-muted-foreground"}`;
    if (device === "Mobile") return <Smartphone className={cls} />;
    if (device === "Tablet") return <Tablet className={cls} />;
    if (device === "Laptop") return <Laptop className={cls} />;
    return <Monitor className={cls} />;
};

// ── Session card ──────────────────────────────────────────────────────────────
const SessionCard = ({
    session,
    index,
    isRevoking,
    revokingId,
    onRemove,
}: {
    session: SessionItem;
    index: number;
    isRevoking: boolean;
    revokingId: string | null;
    onRemove: (id: string, isCurrent: boolean) => void;
}) => {
    const { device, browser, os, browserShort } = parseUserAgent(session.userAgent);
    const isCurrent = index === 0;
    const isExpired = new Date(session.expiresAt) < new Date();
    const isPending = revokingId === session.id && isRevoking;

    const loginAgo = formatDistanceToNow(new Date(session.createdAt), { addSuffix: true });
    const expiresAt = format(new Date(session.expiresAt), "MMM d, yyyy · h:mm a");

    return (
        <div className={`relative rounded-2xl border overflow-hidden transition-all duration-200 group ${
            isCurrent
                ? "border-primary/30 bg-card shadow-md shadow-primary/5"
                : isExpired
                    ? "border-border/30 bg-muted/20 opacity-70"
                    : "border-border/40 bg-card hover:border-border/70 hover:shadow-sm"
        }`}>
            {/* Current device accent stripe */}
            {isCurrent && (
                <div className="absolute left-0 inset-y-0 w-0.75 bg-linear-to-b from-primary to-primary/10" />
            )}

            <div className="px-5 sm:px-6 py-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    {/* Left: icon + info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Device icon bubble */}
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            isCurrent ? "bg-primary/10" : "bg-muted/50"
                        }`}>
                            <DeviceIcon device={device} isCurrent={isCurrent} />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1.5">
                            {/* Title row */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                    <Chrome className={`h-3.5 w-3.5 shrink-0 ${isCurrent ? "text-primary/70" : "text-muted-foreground/60"}`} />
                                    <p className="text-sm font-bold leading-none">
                                        {browser}
                                    </p>
                                </div>
                                <span className="text-muted-foreground/40 text-xs">on</span>
                                <p className="text-sm font-bold leading-none">{os}</p>

                                {isCurrent && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20">
                                        <CheckCircle2 className="h-2.5 w-2.5" /> This Device
                                    </span>
                                )}
                                {isExpired && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-destructive/10 text-destructive border border-destructive/20">
                                        <AlertTriangle className="h-2.5 w-2.5" /> Expired
                                    </span>
                                )}
                            </div>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Globe className="h-3 w-3 shrink-0" />
                                    {session.ipAddress || "Unknown IP"}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                <span className="flex items-center gap-1">
                                    <Wifi className="h-3 w-3 shrink-0" />
                                    {device}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 shrink-0" />
                                    Logged in {loginAgo}
                                </span>
                            </div>

                            {/* Expiry */}
                            <p className={`text-[11px] font-medium ${isExpired ? "text-destructive/70" : "text-muted-foreground/60"}`}>
                                Session expires: {expiresAt}
                            </p>
                        </div>
                    </div>

                    {/* Right: action button */}
                    <button
                        type="button"
                        onClick={() => onRemove(session.id, isCurrent)}
                        disabled={isRevoking}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${
                            isCurrent
                                ? "border border-border/60 bg-transparent text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 disabled:opacity-50"
                                : "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 disabled:opacity-50"
                        }`}
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isCurrent ? (
                            <><LogOut className="h-4 w-4" /> Logout</>
                        ) : (
                            <><Trash2 className="h-4 w-4" /> Remove</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const DevicesContent = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
    const [isCurrentDevicePending, setIsCurrentDevicePending] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["active-sessions"],
        queryFn: () => getActiveSessions(),
    });

    const { mutate: revokeOne, isPending: isRevoking } = useMutation({
        mutationFn: (sessionId: string) => revokeSession(sessionId),
        onSuccess: () => {
            toast.success("Device removed successfully");
            setPendingSessionId(null);
            if (isCurrentDevicePending) {
                router.push("/login");
            } else {
                queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
            }
            setIsCurrentDevicePending(false);
        },
        onError: () => {
            toast.error("Failed to remove device");
            setPendingSessionId(null);
        },
    });

    const { mutate: logoutAll, isPending: isLoggingOutAll } = useMutation({
        mutationFn: () => logoutAllDevices(),
        onSuccess: () => {
            toast.success("Logged out from all devices");
            router.push("/login");
        },
        onError: () => {
            toast.error("Failed to logout from all devices");
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessions: SessionItem[] = (data as any)?.data || [];
    const activeCount = sessions.filter((s) => new Date(s.expiresAt) >= new Date()).length;

    const handleRemoveClick = async (sessionId: string, isCurrent: boolean) => {
        const result = await swalDanger({
            title: isCurrent ? "Logout This Device?" : "Remove Device?",
            text: isCurrent
                ? "This will log you out from the current device. You'll need to sign in again."
                : "This will remove the selected device from your account. They'll need to sign in again.",
            confirmText: isCurrent ? "Logout" : "Remove",
        });
        if (result.isConfirmed) {
            setPendingSessionId(sessionId);
            setIsCurrentDevicePending(isCurrent);
            revokeOne(sessionId);
        }
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="w-full space-y-5 animate-pulse">
                <div className="space-y-1.5">
                    <div className="h-7 w-32 rounded-lg bg-muted" />
                    <div className="h-4 w-72 rounded-lg bg-muted" />
                </div>
                <div className="rounded-3xl border border-border/40 bg-card overflow-hidden">
                    <div className="px-6 py-5 border-b border-border/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-muted" />
                            <div className="space-y-1.5">
                                <div className="h-4 w-28 rounded-lg bg-muted" />
                                <div className="h-3 w-20 rounded bg-muted" />
                            </div>
                        </div>
                        <div className="h-8 w-28 rounded-xl bg-muted" />
                    </div>
                    {[1, 2].map((i) => (
                        <div key={i} className="px-6 py-5 border-b border-border/20 last:border-0 flex gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-muted shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/2 rounded-lg bg-muted" />
                                <div className="h-3 w-3/4 rounded bg-muted" />
                                <div className="h-3 w-1/3 rounded bg-muted" />
                            </div>
                            <div className="h-9 w-24 rounded-xl bg-muted shrink-0 self-center" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-5">

            {/* Page header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-black tracking-tight">Active Devices</h1>
                        {sessions.length > 0 && (
                            <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-black">
                                {sessions.length}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {activeCount > 0
                            ? `${activeCount} active session${activeCount > 1 ? "s" : ""} — max 2 devices allowed`
                            : "No active sessions found"}
                    </p>
                </div>

                {sessions.length > 0 && (
                    <button
                        type="button"
                        onClick={async () => {
                        const r = await swalDanger({ title: "Logout from All Devices?", text: "This will end all active sessions across every device. You'll need to sign in again everywhere.", confirmText: "Logout All" });
                        if (r.isConfirmed) logoutAll();
                    }}
                        disabled={isLoggingOutAll}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-sm font-bold hover:bg-destructive/20 transition-all disabled:opacity-50"
                    >
                        {isLoggingOutAll
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <LogOut className="h-4 w-4" />}
                        Logout All Devices
                    </button>
                )}
            </div>

            {/* Main card */}
            <div className="rounded-3xl border border-border/40 bg-card overflow-hidden">

                {/* Card header — device limit indicator */}
                <div className="px-6 py-4 border-b border-border/30 bg-muted/10 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Device Limit</p>
                            <p className="text-[11px] text-muted-foreground">Up to 2 simultaneous sessions</p>
                        </div>
                    </div>

                    {/* Usage bar */}
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            {[0, 1].map((i) => (
                                <div key={i} className={`h-2.5 w-8 rounded-full transition-all ${
                                    i < sessions.length
                                        ? sessions.length >= 2
                                            ? "bg-destructive"
                                            : "bg-primary"
                                        : "bg-muted"
                                }`} />
                            ))}
                        </div>
                        <span className={`text-xs font-black ${sessions.length >= 2 ? "text-destructive" : "text-muted-foreground"}`}>
                            {sessions.length}/2
                        </span>
                    </div>
                </div>

                {/* Sessions list */}
                {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-20 w-20 rounded-3xl bg-muted/50 border border-border/40 flex items-center justify-center">
                            <Monitor className="h-9 w-9 text-muted-foreground/40" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="font-bold">No active sessions</p>
                            <p className="text-sm text-muted-foreground">You don&apos;t have any active devices.</p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-border/20">
                        {sessions.map((session, index) => (
                            <div key={session.id} className="px-5 py-1">
                                <SessionCard
                                    session={session}
                                    index={index}
                                    isRevoking={isRevoking}
                                    revokingId={pendingSessionId}
                                    onRemove={handleRemoveClick}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Security tip footer */}
                <div className="px-6 py-4 border-t border-border/20 bg-muted/5">
                    <div className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            If you don&apos;t recognize a device, <span className="font-bold text-foreground">remove it immediately</span> and{" "}
                            <a href="/dashboard/change-password" className="font-bold text-primary hover:underline">change your password</a>.
                            {" "}Logging in from a 3rd device will require removing an existing session first.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DevicesContent;
