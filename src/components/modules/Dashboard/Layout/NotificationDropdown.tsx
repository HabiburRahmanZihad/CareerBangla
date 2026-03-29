"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole } from "@/lib/authUtils";
import { getMyNotifications, markAllAsRead, markAsRead } from "@/services/notification.services";
import { INotification } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    AlertTriangle, Award, Bell, BellOff,
    Briefcase, Calendar, CheckCheck,
    CheckCircle2, CreditCard, Info,
    Send, Sparkles, Star,
    UserPlus, XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ── Type → icon + color config (matches real backend enum values) ───────────────
type IconConfig = {
    icon: React.ElementType;
    bg: string;
    color: string;
    dot: string;
    itemBg: string;
};

const TYPE_CONFIG: Record<string, IconConfig> = {
    APPLICATION_SUBMITTED: {
        icon: Send,
        bg: "bg-blue-500/15",
        color: "text-blue-600 dark:text-blue-400",
        dot: "bg-blue-500",
        itemBg: "bg-blue-50/60 dark:bg-blue-950/15",
    },
    APPLICATION_SHORTLISTED: {
        icon: Star,
        bg: "bg-violet-500/15",
        color: "text-violet-600 dark:text-violet-400",
        dot: "bg-violet-500",
        itemBg: "bg-violet-50/60 dark:bg-violet-950/15",
    },
    APPLICATION_INTERVIEW: {
        icon: Calendar,
        bg: "bg-amber-500/15",
        color: "text-amber-600 dark:text-amber-400",
        dot: "bg-amber-500",
        itemBg: "bg-amber-50/60 dark:bg-amber-950/15",
    },
    APPLICATION_HIRED: {
        icon: Award,
        bg: "bg-emerald-500/15",
        color: "text-emerald-600 dark:text-emerald-400",
        dot: "bg-emerald-500",
        itemBg: "bg-emerald-50/60 dark:bg-emerald-950/15",
    },
    APPLICATION_REJECTED: {
        icon: XCircle,
        bg: "bg-rose-500/15",
        color: "text-rose-600 dark:text-rose-400",
        dot: "bg-rose-500",
        itemBg: "bg-rose-50/60 dark:bg-rose-950/15",
    },
    SUBSCRIPTION_ACTIVATED: {
        icon: CreditCard,
        bg: "bg-amber-500/15",
        color: "text-amber-600 dark:text-amber-400",
        dot: "bg-amber-500",
        itemBg: "bg-amber-50/60 dark:bg-amber-950/15",
    },
    SUBSCRIPTION_EXPIRING_SOON: {
        icon: AlertTriangle,
        bg: "bg-orange-500/15",
        color: "text-orange-600 dark:text-orange-400",
        dot: "bg-orange-500",
        itemBg: "bg-orange-50/60 dark:bg-orange-950/15",
    },
    RECRUITER_APPROVED: {
        icon: UserPlus,
        bg: "bg-emerald-500/15",
        color: "text-emerald-600 dark:text-emerald-400",
        dot: "bg-emerald-500",
        itemBg: "bg-emerald-50/60 dark:bg-emerald-950/15",
    },
    RECRUITER_REJECTED: {
        icon: XCircle,
        bg: "bg-rose-500/15",
        color: "text-rose-600 dark:text-rose-400",
        dot: "bg-rose-500",
        itemBg: "bg-rose-50/60 dark:bg-rose-950/15",
    },
    JOB_POSTED: {
        icon: Briefcase,
        bg: "bg-indigo-500/15",
        color: "text-indigo-600 dark:text-indigo-400",
        dot: "bg-indigo-500",
        itemBg: "bg-indigo-50/60 dark:bg-indigo-950/15",
    },
    GENERAL: {
        icon: Info,
        bg: "bg-primary/10",
        color: "text-primary",
        dot: "bg-primary",
        itemBg: "bg-primary/5",
    },
};

const DEFAULT_CONFIG: IconConfig = {
    icon: Sparkles,
    bg: "bg-muted/50",
    color: "text-muted-foreground",
    dot: "bg-muted-foreground",
    itemBg: "",
};

const getConfig = (type: string): IconConfig => TYPE_CONFIG[type] ?? DEFAULT_CONFIG;

// ── Notification row ───────────────────────────────────────────────────────────
const NotifItem = ({
    notif,
    onMarkRead,
}: {
    notif: INotification;
    onMarkRead: (id: string) => void;
}) => {
    const cfg = getConfig(notif.type);
    const Icon = cfg.icon;
    const timeAgo = notif.createdAt
        ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })
        : "";

    return (
        <div
            className={`relative flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 group ${notif.isRead
                ? "hover:bg-muted/40"
                : `${cfg.itemBg} hover:brightness-95`
                }`}
            onClick={() => { if (!notif.isRead) onMarkRead(notif.id); }}
        >
            {/* Icon */}
            <div className={`h-8 w-8 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className={`h-4 w-4 ${cfg.color}`} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 space-y-0.5">
                <p className={`text-xs font-bold leading-snug ${notif.isRead ? "text-foreground/70" : "text-foreground"}`}>
                    {notif.title}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {notif.message}
                </p>
                <p className="text-[10px] text-muted-foreground/50 font-medium">{timeAgo}</p>
            </div>

            {/* Unread dot */}
            {!notif.isRead && (
                <div className={`h-2 w-2 rounded-full ${cfg.dot} shrink-0 mt-1.5`} />
            )}
        </div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const NotificationDropdown = ({ userRole }: { userRole?: UserRole }) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const notificationsPagePath =
        userRole === "ADMIN" || userRole === "SUPER_ADMIN"
            ? "/admin/dashboard/notifications"
            : userRole === "RECRUITER"
                ? "/recruiter/dashboard/notifications"
                : "/dashboard/notifications";

    const { data: notificationsData } = useQuery({
        queryKey: ["notifications-dropdown"],
        queryFn: () => getMyNotifications({ limit: 50 }),
    });

    const { mutate: markRead } = useMutation({
        mutationFn: (id: string) => markAsRead(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications-dropdown"] }),
    });

    const { mutate: markAll, isPending: isMarkingAll } = useMutation({
        mutationFn: () => markAllAsRead(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications-dropdown"] }),
    });

    const notifications: INotification[] = notificationsData?.data ?? [];
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="relative h-9 w-9 rounded-xl border border-border/60 bg-card flex items-center justify-center hover:bg-muted/50 hover:border-border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-black border-2 border-background">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={10}
                collisionPadding={12}
                className="w-80 max-w-[calc(100vw-24px)] p-0 rounded-2xl border border-border/50 shadow-2xl shadow-black/10 flex flex-col max-h-[80vh]"
            >
                {/* ── Header ───────────────────────────────────────────────── */}
                <div className="px-4 py-3.5 border-b border-border/30 bg-muted/10 flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Bell className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-black leading-none">Notifications</p>
                            {unreadCount > 0 && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {unreadCount} unread
                                </p>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black">
                                {unreadCount}
                            </span>
                        )}
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={() => markAll()}
                            disabled={isMarkingAll}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                        >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Mark all read
                        </button>
                    )}
                </div>

                {/* ── Notification list ─────────────────────────────────────── */}
                <ScrollArea className="flex-1 min-h-0 overflow-hidden">
                    {notifications.length > 0 ? (
                        <div className="p-2 space-y-0.5">
                            {/* Unread section label */}
                            {unreadCount > 0 && (
                                <p className="px-3 pt-1 pb-0.5 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                                    Unread
                                </p>
                            )}
                            {notifications
                                .filter((n) => !n.isRead)
                                .map((n) => (
                                    <NotifItem key={n.id} notif={n} onMarkRead={markRead} />
                                ))}

                            {/* Read section label */}
                            {notifications.some((n) => n.isRead) && (
                                <p className="px-3 pt-2 pb-0.5 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                                    Earlier
                                </p>
                            )}
                            {notifications
                                .filter((n) => n.isRead)
                                .map((n) => (
                                    <NotifItem key={n.id} notif={n} onMarkRead={markRead} />
                                ))}
                        </div>
                    ) : (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center py-12 gap-3 px-4">
                            <div className="h-14 w-14 rounded-2xl bg-muted/50 border border-border/40 flex items-center justify-center">
                                <BellOff className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-foreground/70">All caught up!</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">No new notifications</p>
                            </div>
                        </div>
                    )}
                </ScrollArea>

                {/* ── Footer ───────────────────────────────────────────────── */}
                <div className="border-t border-border/30 bg-muted/5 shrink-0">
                    <button
                        type="button"
                        onClick={() => router.push(notificationsPagePath)}
                        className="w-full px-4 py-3 text-xs font-bold text-primary hover:text-primary/80 hover:bg-muted/20 transition-all flex items-center justify-center gap-1.5"
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        View All Notifications
                    </button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationDropdown;
