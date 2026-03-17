"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { IAdminDashboardData } from "@/types/dashboard.types";

export async function getDashboardStats() {
    return serverHttpClient.get<IAdminDashboardData>("/stats");
}
