import { httpClient } from "@/lib/axios/httpClient";
import { logger } from "@/lib/logger";
import { IAdminDashboardData } from "@/types/dashboard.types";

export async function getDashboardStats() {
    logger.read("Fetching dashboard stats");
    return httpClient.get<IAdminDashboardData>("/stats");
}
