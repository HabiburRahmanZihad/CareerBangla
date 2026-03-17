"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAdminDashboardData } from "@/types/dashboard.types";

export async function getDashboardStats() {
    return httpClient.get<IAdminDashboardData>("/stats");
}
