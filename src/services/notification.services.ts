"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { INotification } from "@/types/user.types";

export async function getMyNotifications(params?: Record<string, unknown>) {
    return serverHttpClient.get<INotification[]>("/notifications", { params });
}

export async function getUnreadCount() {
    return serverHttpClient.get<{ count: number }>("/notifications/unread-count");
}

export async function markAsRead(id: string) {
    return serverHttpClient.patch<INotification>(`/notifications/read/${id}`, {});
}

export async function markAllAsRead() {
    return serverHttpClient.patch<void>("/notifications/read-all", {});
}

export async function deleteNotification(id: string) {
    return serverHttpClient.delete<void>(`/notifications/${id}`);
}
