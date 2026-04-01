"use client";

import { deleteNotification, getMyNotifications, markAllAsRead, markAsRead } from "@/services/notification.services";
import { INotification } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, isThisWeek, isToday, isYesterday } from "date-fns";
import {
    Award,
    BellOff, Briefcase, Calendar,
    CheckCheck, CheckCircle2, CreditCard,
    Info, Loader2, Send,
    Star, Trash2, UserPlus, XCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Type config ────────────────────────────────────────────────────────────────
type NotifConfig = {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    accentCls: string;
    unreadBg: string;
};

const TYPE_CONFIG: Record<string, NotifConfig> = {
    APPLICATION_SUBMITTED: {
        icon: Send,
        iconBg: "bg-blue-500/15",
        iconColor: "text-blue-600 dark:text-blue-400",
        accentCls: "from-blue-500 to-blue-500/10",
        unreadBg: "bg-blue-50/50 dark:bg-blue-950/10",
    },
    APPLICATION_SHORTLISTED: {
        icon: Star,
        iconBg: "bg-violet-500/15",
        iconColor: "text-violet-600 dark:text-violet-400",
        accentCls: "from-violet-500 to-violet-500/10",
        unreadBg: "bg-violet-50/50 dark:bg-violet-950/10",
    },
    APPLICATION_INTERVIEW: {
        icon: Calendar,
        iconBg: "bg-amber-500/15",
        iconColor: "text-amber-600 dark:text-amber-400",
        accentCls: "from-amber-500 to-amber-500/10",
        unreadBg: "bg-amber-50/50 dark:bg-amber-950/10",
    },
    APPLICATION_HIRED: {
        icon: Award,
        iconBg: "bg-emerald-500/15",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        accentCls: "from-emerald-500 to-emerald-500/10",
        unreadBg: "bg-emerald-50/50 dark:bg-emerald-950/10",
    },
    APPLICATION_REJECTED: {
        icon: XCircle,
        iconBg: "bg-rose-500/15",
        iconColor: "text-rose-600 dark:text-rose-400",
        accentCls: "from-rose-500 to-rose-500/10",
        unreadBg: "bg-rose-50/50 dark:bg-rose-950/10",
    },
    SUBSCRIPTION_ACTIVATED: {
        icon: CreditCard,
        iconBg: "bg-amber-500/15",
        iconColor: "text-amber-600 dark:text-amber-400",
        accentCls: "from-amber-500 to-amber-500/10",
        unreadBg: "bg-amber-50/50 dark:bg-amber-950/10",
    },
    SUBSCRIPTION_EXPIRING_SOON: {
        icon: CreditCard,
        iconBg: "bg-orange-500/15",
        iconColor: "text-orange-600 dark:text-orange-400",
        accentCls: "from-orange-500 to-orange-500/10",
        unreadBg: "bg-orange-50/50 dark:bg-orange-950/10",
    },
    GENERAL: {
        icon: Info,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        accentCls: "from-primary to-primary/10",
        unreadBg: "bg-primary/5",
    },
    RECRUITER_APPROVED: {
        icon: UserPlus,
        iconBg: "bg-emerald-500/15",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        accentCls: "from-emerald-500 to-emerald-500/10",
        unreadBg: "bg-emerald-50/50 dark:bg-emerald-950/10",
    },
    RECRUITER_REJECTED: {
        icon: XCircle,
        iconBg: "bg-rose-500/15",
        iconColor: "text-rose-600 dark:text-rose-400",
        accentCls: "from-rose-500 to-rose-500/10",
        unreadBg: "bg-rose-50/50 dark:bg-rose-950/10",
    },
    JOB_POSTED: {
        icon: Briefcase,
        iconBg: "bg-indigo-500/15",
        iconColor: "text-indigo-600 dark:text-indigo-400",
        accentCls: "from-indigo-500 to-indigo-500/10",
        unreadBg: "bg-indigo-50/50 dark:bg-indigo-950/10",
    },
};

const DEFAULT_CONFIG: NotifConfig = {
    icon: Info,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    accentCls: "from-primary to-primary/10",
    unreadBg: "bg-primary/5",
};

const getConfig = (type: string): NotifConfig =>
    TYPE_CONFIG[type] ?? DEFAULT_CONFIG;

// ── Filter tabs ────────────────────────────────────────────────────────────────
type FilterKey = "ALL" | "UNREAD" | "APPLICATION" | "JOB" | "PAYMENT" | "SYSTEM";

const FILTERS: { key: FilterKey; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "UNREAD", label: "Unread" },
    { key: "APPLICATION", label: "Applications" },
    { key: "JOB", label: "Jobs" },
    { key: "PAYMENT", label: "Payments" },
    { key: "SYSTEM", label: "System" },
];

const matchFilter = (type: string, filter: FilterKey) => {
    if (filter === "ALL") return true;
    if (filter === "APPLICATION") return type.startsWith("APPLICATION_");
    if (filter === "JOB") return type === "JOB_POSTED";
    if (filter === "PAYMENT") return type.startsWith("SUBSCRIPTION_");
    if (filter === "SYSTEM") return type === "GENERAL" || type.startsWith("RECRUITER_");
    return true;
};

// ── Group by date ──────────────────────────────────────────────────────────────
const getGroupLabel = (date: string): string => {
    const d = new Date(date);
    if (isToday(d)) return "Today";
    if (isYesterday(d)) return "Yesterday";
    if (isThisWeek(d)) return "This Week";
    return "Older";
};

const GROUP_ORDER = ["Today", "Yesterday", "This Week", "Older"];

// ── Notification Card ──────────────────────────────────────────────────────────
const NotifCard = ({
    notif,
    onMarkRead,
    onDelete,
    isMarkingRead,
    isDeleting,
}: {
    notif: INotification;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
    isMarkingRead: boolean;
    isDeleting: boolean;
}) => {
    const cfg = getConfig(notif.type);
    const Icon = cfg.icon;
    const timeAgo = notif.createdAt
        ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })
        : "";

    return (
        <div
            className={`relative group rounded-2xl border overflow-hidden transition-all duration-200 ${notif.isRead
                ? "border-border/40 bg-card hover:border-border/70"
                : `border-border/50 ${cfg.unreadBg} hover:border-border/80 shadow-sm`
                }`}
            onClick={() => { if (!notif.isRead) onMarkRead(notif.id); }}
            style={{ cursor: notif.isRead ? "default" : "pointer" }}
        >
            {/* Unread accent stripe */}
            {!notif.isRead && (
                <div className={`absolute left-0 inset-y-0 w-0.75 bg-linear-to-b ${cfg.accentCls}`} />
            )}

            <div className="flex items-start gap-4 px-5 py-4">
                {/* Icon */}
                <div className={`h-10 w-10 rounded-xl ${cfg.iconBg} flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105`}>
                    <Icon className={`h-5 w-5 ${cfg.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className={`text-sm font-bold leading-snug ${notif.isRead ? "text-foreground/80" : "text-foreground"}`}>
                                    {notif.title}
                                </p>
                                {!notif.isRead && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-primary text-primary-foreground uppercase tracking-wider shrink-0">
                                        New
                                    </span>
                                )}
                            </div>
                            <p className={`text-sm mt-0.5 leading-relaxed ${notif.isRead ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                                {notif.message}
                            </p>
                            <p className="text-[11px] text-muted-foreground/50 mt-1.5 font-medium">
                                {timeAgo}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notif.isRead && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onMarkRead(notif.id); }}
                                    disabled={isMarkingRead}
                                    title="Mark as read"
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                                >
                                    {isMarkingRead
                                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        : <CheckCircle2 className="h-3.5 w-3.5" />}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
                                disabled={isDeleting}
                                title="Delete"
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                            >
                                {isDeleting
                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    : <Trash2 className="h-3.5 w-3.5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Unread dot (always visible) */}
                {!notif.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />
                )}
            </div>
        </div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const NotificationsContent = ({ notificationOwnerKey }: { notificationOwnerKey: string }) => {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<FilterKey>("ALL");
    const [markingId, setMarkingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const notificationsQueryKey = ["my-notifications", notificationOwnerKey];

    const { data, isLoading } = useQuery({
        queryKey: notificationsQueryKey,
        queryFn: () => getMyNotifications({ limit: "100" }),
    });

    const { mutateAsync: markRead } = useMutation({
        mutationFn: (id: string) => markAsRead(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationsQueryKey }),
    });

    const { mutateAsync: markAll, isPending: isMarkingAll } = useMutation({
        mutationFn: () => markAllAsRead(),
        onSuccess: () => {
            toast.success("All notifications marked as read");
            queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
        },
    });

    const { mutateAsync: deleteNotif } = useMutation({
        mutationFn: (id: string) => deleteNotification(id),
        onSuccess: () => {
            toast.success("Notification deleted");
            queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
        },
    });

    const handleMarkRead = async (id: string) => {
        setMarkingId(id);
        try { await markRead(id); } finally { setMarkingId(null); }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try { await deleteNotif(id); } finally { setDeletingId(null); }
    };

    const allNotifications: INotification[] = data?.data ?? [];
    const unreadCount = allNotifications.filter((n) => !n.isRead).length;

    // Filter by tab
    const filtered = allNotifications.filter((n) => {
        if (filter === "UNREAD") return !n.isRead;
        return matchFilter(n.type, filter);
    });

    // Group by date
    const grouped: Record<string, INotification[]> = {};
    for (const n of filtered) {
        const label = n.createdAt ? getGroupLabel(n.createdAt) : "Older";
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(n);
    }
    const orderedGroups = GROUP_ORDER.filter((g) => grouped[g]?.length);

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="w-full space-y-5 animate-pulse">
                <div className="space-y-1.5">
                    <div className="h-7 w-44 rounded-lg bg-muted" />
                    <div className="h-4 w-64 rounded-lg bg-muted" />
                </div>
                <div className="rounded-3xl border border-border/40 bg-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-border/30 flex gap-3">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="h-8 w-24 rounded-xl bg-muted" />)}
                    </div>
                    <div className="p-5 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl border border-border/30">
                                <div className="h-10 w-10 rounded-xl bg-muted shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/3 rounded-lg bg-muted" />
                                    <div className="h-3 w-3/4 rounded bg-muted" />
                                    <div className="h-3 w-1/4 rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
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
                        <h1 className="text-2xl font-black tracking-tight">Notifications</h1>
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-black">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                            : "You're all caught up!"}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={() => markAll()}
                        disabled={isMarkingAll}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 bg-card text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-all disabled:opacity-50"
                    >
                        {isMarkingAll
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <CheckCheck className="h-4 w-4" />}
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Main card */}
            <div className="rounded-3xl border border-border/40 bg-card overflow-hidden">

                {/* Filter tabs */}
                <div className="px-5 sm:px-6 py-3 border-b border-border/30 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {FILTERS.map(({ key, label }) => {
                        const count = key === "UNREAD"
                            ? unreadCount
                            : key === "ALL"
                                ? allNotifications.length
                                : allNotifications.filter((n) => matchFilter(n.type, key)).length;

                        const isActive = filter === key;

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setFilter(key)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    }`}
                            >
                                {label}
                                {count > 0 && (
                                    <span className={`inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[9px] font-black ${isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                                        }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                    {filtered.length === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="relative">
                                <div className="h-20 w-20 rounded-3xl bg-muted/50 border border-border/40 flex items-center justify-center">
                                    <BellOff className="h-9 w-9 text-muted-foreground/40" />
                                </div>
                                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-muted border border-border/40 flex items-center justify-center">
                                    <span className="text-[10px] font-black text-muted-foreground">0</span>
                                </div>
                            </div>
                            <div className="text-center space-y-1">
                                <p className="font-bold text-foreground">
                                    {filter === "ALL" ? "No notifications yet" : `No ${FILTERS.find(f => f.key === filter)?.label.toLowerCase()} notifications`}
                                </p>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    {filter === "ALL"
                                        ? "We'll notify you when something important happens."
                                        : "Try switching to another tab to see more."}
                                </p>
                            </div>
                            {filter !== "ALL" && (
                                <button
                                    type="button"
                                    onClick={() => setFilter("ALL")}
                                    className="text-xs font-bold text-primary hover:opacity-80 transition-opacity"
                                >
                                    View all notifications
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orderedGroups.map((groupLabel) => (
                                <div key={groupLabel} className="space-y-2">
                                    {/* Group label */}
                                    <div className="flex items-center gap-3 px-1">
                                        <p className="text-[11px] font-black text-muted-foreground/50 uppercase tracking-widest whitespace-nowrap">
                                            {groupLabel}
                                        </p>
                                        <div className="flex-1 h-px bg-border/30" />
                                        <p className="text-[11px] text-muted-foreground/40 font-semibold shrink-0">
                                            {grouped[groupLabel].length}
                                        </p>
                                    </div>

                                    {/* Cards */}
                                    <div className="space-y-2">
                                        {grouped[groupLabel].map((notif) => (
                                            <NotifCard
                                                key={notif.id}
                                                notif={notif}
                                                onMarkRead={handleMarkRead}
                                                onDelete={handleDelete}
                                                isMarkingRead={markingId === notif.id}
                                                isDeleting={deletingId === notif.id}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsContent;
