"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";
import { ICoupon } from "@/types/user.types";

export async function getAllCoupons(params?: Record<string, unknown>) {
    logger.read("Fetching all coupons");
    return serverHttpClient.get<ICoupon[]>("/coupons", { params });
}

export async function createCoupon(data: Record<string, unknown>) {
    logger.create("Creating coupon", { code: data.code });
    return serverHttpClient.post<ICoupon>("/coupons", data);
}

export async function deleteCoupon(id: string) {
    logger.delete(`Deleting coupon → id: ${id}`);
    return serverHttpClient.delete<void>(`/coupons/${id}`);
}

export async function redeemCoupon(data: { code: string }) {
    logger.update(`Redeeming coupon → code: ${data.code}`);
    return serverHttpClient.post<{ coins: number }>("/coupons/redeem", data);
}
