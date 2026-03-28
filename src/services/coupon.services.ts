"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";
import { ICoupon } from "@/types/user.types";

export async function getAllCoupons() {
    logger.read("Fetching all coupons");
    return serverHttpClient.get<ICoupon[]>("/coupons");
}

export async function getCouponById(id: string) {
    logger.read(`Fetching coupon → id: ${id}`);
    return serverHttpClient.get<ICoupon>(`/coupons/${id}`);
}

export async function createCoupon(data: Record<string, unknown>) {
    logger.create("Creating coupon");
    return serverHttpClient.post<ICoupon>("/coupons", data);
}

export async function deleteCoupon(id: string) {
    logger.delete(`Deleting coupon → id: ${id}`);
    return serverHttpClient.delete<void>(`/coupons/${id}`);
}

export async function validateCoupon(data: { code: string }) {
    logger.read(`Validating coupon → code: ${data.code}`);
    return serverHttpClient.post("/coupons/validate", data);
}

export async function applyCoupon(data: { code: string }) {
    logger.update(`Applying coupon → code: ${data.code}`);
    return serverHttpClient.post("/coupons/apply", data);
}
