"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteNotification, getMyNotifications, markAllAsRead, markAsRead } from "@/services/notification.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

const NotificationsContent = () => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["my-notifications"],
        queryFn: () => getMyNotifications({ limit: "50" }),
    });

    const { mutateAsync: markRead } = useMutation({
        mutationFn: (id: string) => markAsRead(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-notifications"] }),
    });

    const { mutateAsync: markAll } = useMutation({
        mutationFn: () => markAllAsRead(),
        onSuccess: () => {
            toast.success("All notifications marked as read");
            queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
        },
    });

    const { mutateAsync: deleteNotif } = useMutation({
        mutationFn: (id: string) => deleteNotification(id),
        onSuccess: () => {
            toast.success("Notification deleted");
            queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
            </div>
        );
    }

    const notifications = data?.data || [];
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={() => markAll()}>
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No notifications yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <Card key={notif.id} className={notif.isRead ? "opacity-70" : ""}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-sm">{notif.title}</CardTitle>
                                        {!notif.isRead && <Badge variant="default" className="text-[10px]">New</Badge>}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {!notif.isRead && (
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markRead(notif.id)}>
                                                <CheckCheck className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteNotif(notif.id)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground">{notif.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {notif.createdAt && formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsContent;
