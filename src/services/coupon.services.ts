"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { ICoupon } from "@/types/user.types";

export async function getAllCoupons(params?: Record<string, unknown>) {
    return serverHttpClient.get<ICoupon[]>("/coupons", { params });
}

export async function createCoupon(data: Record<string, unknown>) {
    return serverHttpClient.post<ICoupon>("/coupons", data);
}

export async function deleteCoupon(id: string) {
    return serverHttpClient.delete<void>(`/coupons/${id}`);
}

export async function redeemCoupon(data: { code: string }) {
    return serverHttpClient.post<{ coins: number }>("/coupons/redeem", data);
}
