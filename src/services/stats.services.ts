"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";
import { IAdminDashboardData } from "@/types/dashboard.types";

export async function getDashboardStats() {
    logger.read("Fetching dashboard stats");
    return serverHttpClient.get<IAdminDashboardData>("/stats");
}
