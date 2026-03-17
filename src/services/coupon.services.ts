"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICoupon } from "@/types/user.types";

export async function getAllCoupons(params?: Record<string, unknown>) {
    return httpClient.get<ICoupon[]>("/coupons", { params });
}

export async function createCoupon(data: Record<string, unknown>) {
    return httpClient.post<ICoupon>("/coupons", data);
}

export async function deleteCoupon(id: string) {
    return httpClient.delete<void>(`/coupons/${id}`);
}

export async function redeemCoupon(data: { code: string }) {
    return httpClient.post<{ coins: number }>("/coupons/redeem", data);
}
