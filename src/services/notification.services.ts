"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";
import { INotification } from "@/types/user.types";

export async function getMyNotifications(params?: Record<string, unknown>) {
    logger.read("Fetching notifications");
    return serverHttpClient.get<INotification[]>("/notifications", { params });
}

export async function getUnreadCount() {
    logger.read("Fetching unread notification count");
    return serverHttpClient.get<{ count: number }>("/notifications/unread-count");
}

export async function markAsRead(id: string) {
    logger.update(`Marking notification as read → id: ${id}`);
    return serverHttpClient.patch<INotification>(`/notifications/read/${id}`, {});
}

export async function markAllAsRead() {
    logger.update("Marking all notifications as read");
    return serverHttpClient.patch<void>("/notifications/read-all", {});
}

export async function deleteNotification(id: string) {
    logger.delete(`Deleting notification → id: ${id}`);
    return serverHttpClient.delete<void>(`/notifications/${id}`);
}
