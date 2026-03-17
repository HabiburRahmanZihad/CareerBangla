"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { INotification } from "@/types/user.types";

export async function getMyNotifications(params?: Record<string, unknown>) {
    return httpClient.get<INotification[]>("/notifications", { params });
}

export async function getUnreadCount() {
    return httpClient.get<{ count: number }>("/notifications/unread-count");
}

export async function markAsRead(id: string) {
    return httpClient.patch<INotification>(`/notifications/read/${id}`, {});
}

export async function markAllAsRead() {
    return httpClient.patch<void>("/notifications/read-all", {});
}

export async function deleteNotification(id: string) {
    return httpClient.delete<void>(`/notifications/${id}`);
}
