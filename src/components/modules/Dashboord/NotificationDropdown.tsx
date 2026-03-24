"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMyNotifications, getUnreadCount, markAllAsRead, markAsRead } from "@/services/notification.services";
import { INotification } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Bell, Briefcase, CheckCircle, CreditCard, Info, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "APPLICATION":
            return <Briefcase className="h-4 w-4 text-blue-600" />
        case "JOB":
            return <Briefcase className="h-4 w-4 text-green-600" />
        case "PAYMENT":
            return <CreditCard className="h-4 w-4 text-amber-600" />
        case "SYSTEM":
            return <CheckCircle className="h-4 w-4 text-purple-600" />
        case "USER":
            return <UserPlus className="h-4 w-4 text-green-600" />
        default:
            return <Info className="h-4 w-4 text-gray-600" />
    }
}

const NotificationDropdown = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: notificationsData } = useQuery({
        queryKey: ["notifications-dropdown"],
        queryFn: () => getMyNotifications({ limit: 10 }),
    });

    const { data: unreadData } = useQuery({
        queryKey: ["notifications-unread-count"],
        queryFn: () => getUnreadCount(),
    });

    const { mutate: markRead } = useMutation({
        mutationFn: (id: string) => markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications-dropdown"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
        },
    });

    const { mutate: markAll } = useMutation({
        mutationFn: () => markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications-dropdown"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
        },
    });

    const notifications: INotification[] = notificationsData?.data || [];
    const unreadCount = unreadData?.data?.count ?? 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size={"icon"} className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center" variant={"destructive"}>
                            <span className="text-[10px]">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={"end"} className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs h-auto p-1" onClick={() => markAll()}>
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <ScrollArea className="h-75">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="flex flex-col items-start gap-2 p-3 cursor-pointer"
                                onClick={() => {
                                    if (!notification.isRead) markRead(notification.id);
                                }}
                            >
                                <div className="mt-0.5">
                                    {getNotificationIcon(notification.type)}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium leading-none">
                                            {notification.title}
                                        </p>
                                        {!notification.isRead && (
                                            <div className="h-2 w-2 rounded-full bg-blue-600" />
                                        )}
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>

                                    {notification.createdAt && (
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(notification.createdAt), {
                                                addSuffix: true
                                            })}
                                        </p>
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    )}
                </ScrollArea>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="text-center justify-center cursor-pointer"
                    onClick={() => router.push("/dashboard/notifications")}
                >
                    View All Notifications
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    )
}

export default NotificationDropdown
