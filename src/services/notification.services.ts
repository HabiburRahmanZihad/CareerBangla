import { httpClient } from "@/lib/axios/httpClient";
import { logger } from "@/lib/logger";
import { INotification } from "@/types/user.types";

export async function getMyNotifications(params?: Record<string, unknown>) {
    logger.read("Fetching notifications");
    return httpClient.get<INotification[]>("/notifications", { params });
}

export async function getUnreadCount() {
    logger.read("Fetching unread notification count");
    return httpClient.get<{ count: number }>("/notifications/unread-count");
}

export async function markAsRead(id: string) {
    logger.update(`Marking notification as read → id: ${id}`);
    return httpClient.patch<INotification>(`/notifications/read/${id}`, {});
}

export async function markAllAsRead() {
    logger.update("Marking all notifications as read");
    return httpClient.patch<void>("/notifications/read-all", {});
}

export async function deleteNotification(id: string) {
    logger.delete(`Deleting notification → id: ${id}`);
    return httpClient.delete<void>(`/notifications/${id}`);
}
