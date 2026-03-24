"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveSessions, logoutAllDevices, revokeSession } from "@/services/auth.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, format } from "date-fns";
import {
    Globe,
    Laptop,
    Loader2,
    LogOut,
    Monitor,
    Smartphone,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
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

const parseUserAgent = (ua: string | null) => {
    if (!ua) return { device: "Unknown Device", browser: "Unknown Browser", os: "Unknown OS" };

    let browser = "Unknown Browser";
    if (ua.includes("Edg/")) browser = "Microsoft Edge";
    else if (ua.includes("Chrome/") && !ua.includes("Edg/")) browser = "Google Chrome";
    else if (ua.includes("Firefox/")) browser = "Mozilla Firefox";
    else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";
    else if (ua.includes("Opera/") || ua.includes("OPR/")) browser = "Opera";

    let os = "Unknown OS";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac OS")) os = "macOS";
    else if (ua.includes("Linux") && !ua.includes("Android")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    let device = "Desktop";
    if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) device = "Mobile";
    else if (ua.includes("iPad") || ua.includes("Tablet")) device = "Tablet";

    return { device, browser, os };
};

const getDeviceIcon = (device: string) => {
    if (device === "Mobile") return <Smartphone className="w-5 h-5" />;
    if (device === "Tablet") return <Laptop className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
};

const DevicesContent = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["active-sessions"],
        queryFn: () => getActiveSessions(),
    });

    const { mutate: revokeOne, isPending: isRevoking } = useMutation({
        mutationFn: (sessionId: string) => revokeSession(sessionId),
        onSuccess: () => {
            toast.success("Device removed successfully");
            queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
            refetch();
        },
        onError: () => {
            toast.error("Failed to remove device");
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

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage devices where you are currently logged in. Maximum 2 devices allowed.
                    </p>
                </div>
                {sessions.length > 0 && (
                    <Button
                        variant="destructive"
                        onClick={() => logoutAll()}
                        disabled={isLoggingOutAll}
                    >
                        {isLoggingOutAll ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging out...</>
                        ) : (
                            <><LogOut className="w-4 h-4 mr-2" /> Logout All Devices</>
                        )}
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-lg" />
                    ))}
                </div>
            ) : sessions.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No active sessions found.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {sessions.map((session, index) => {
                        const { device, browser, os } = parseUserAgent(session.userAgent);
                        const isCurrentDevice = index === 0;
                        const isExpired = new Date(session.expiresAt) < new Date();

                        return (
                            <Card key={session.id} className={isCurrentDevice ? "border-primary/50" : ""}>
                                <CardContent className="py-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-lg ${isCurrentDevice ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                                {getDeviceIcon(device)}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold">
                                                        {browser} on {os}
                                                    </h3>
                                                    {isCurrentDevice && (
                                                        <Badge variant="default" className="text-xs">
                                                            This Device
                                                        </Badge>
                                                    )}
                                                    {isExpired && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Expired
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <Globe className="w-3.5 h-3.5" />
                                                    <span>{session.ipAddress || "Unknown IP"}</span>
                                                    <span>&middot;</span>
                                                    <span>{device}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Logged in {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                                                    {" "}&middot;{" "}
                                                    Expires {format(new Date(session.expiresAt), "MMM d, yyyy h:mm a")}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant={isCurrentDevice ? "outline" : "destructive"}
                                            size="sm"
                                            onClick={() => {
                                                if (isCurrentDevice) {
                                                    revokeOne(session.id);
                                                    router.push("/login");
                                                } else {
                                                    revokeOne(session.id);
                                                }
                                            }}
                                            disabled={isRevoking}
                                        >
                                            {isRevoking ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <><Trash2 className="w-4 h-4 mr-1" /> {isCurrentDevice ? "Logout" : "Remove"}</>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Card className="bg-muted/30">
                <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">
                        You can be logged in on a maximum of <strong>2 devices</strong> at the same time.
                        If you try to login from a 3rd device, you will need to logout from all devices first.
                        If you don&apos;t recognize a device, remove it immediately and change your password.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DevicesContent;
