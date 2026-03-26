"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveSessions, logoutAllDevices, revokeSession } from "@/services/auth.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
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
    const [showLogoutAllConfirm, setShowLogoutAllConfirm] = useState(false);
    const [showRemoveDeviceConfirm, setShowRemoveDeviceConfirm] = useState(false);
    const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
    const [isCurrentDevicePending, setIsCurrentDevicePending] = useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["active-sessions"],
        queryFn: () => getActiveSessions(),
    });

    const { mutate: revokeOne, isPending: isRevoking } = useMutation({
        mutationFn: (sessionId: string) => revokeSession(sessionId),
        onSuccess: () => {
            toast.success("Device removed successfully");
            if (isCurrentDevicePending) {
                router.push("/login");
            } else {
                queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
                refetch();
            }
            setPendingSessionId(null);
            setShowRemoveDeviceConfirm(false);
            setIsCurrentDevicePending(false);
        },
        onError: () => {
            toast.error("Failed to remove device");
            setPendingSessionId(null);
            setShowRemoveDeviceConfirm(false);
        },
    });

    const { mutate: logoutAll, isPending: isLoggingOutAll } = useMutation({
        mutationFn: () => logoutAllDevices(),
        onSuccess: () => {
            toast.success("Logged out from all devices");
            setShowLogoutAllConfirm(false);
            router.push("/login");
        },
        onError: () => {
            toast.error("Failed to logout from all devices");
            setShowLogoutAllConfirm(false);
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessions: SessionItem[] = (data as any)?.data || [];

    const handleLogoutAllClick = () => {
        setShowLogoutAllConfirm(true);
    };

    const handleRemoveDeviceClick = (sessionId: string, isCurrentDevice: boolean) => {
        setPendingSessionId(sessionId);
        setIsCurrentDevicePending(isCurrentDevice);
        setShowRemoveDeviceConfirm(true);
    };

    const handleConfirmRemoveDevice = () => {
        if (pendingSessionId) {
            revokeOne(pendingSessionId);
        }
    };

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
                        onClick={handleLogoutAllClick}
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
                                            onClick={() => handleRemoveDeviceClick(session.id, isCurrentDevice)}
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

            <AlertDialog open={showLogoutAllConfirm} onOpenChange={setShowLogoutAllConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Logout from All Devices?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will log you out from all devices. You will need to login again to access your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => logoutAll()}
                            disabled={isLoggingOutAll}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoggingOutAll ? "Logging out..." : "Logout All"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showRemoveDeviceConfirm} onOpenChange={setShowRemoveDeviceConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Device?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {isCurrentDevicePending
                                ? "This will logout from the current device. You will need to login again."
                                : "This will remove the device from your account."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmRemoveDevice}
                            disabled={isRevoking}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isRevoking ? "Removing..." : isCurrentDevicePending ? "Logout" : "Remove"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DevicesContent;
