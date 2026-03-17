"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICoinTransaction, IWallet } from "@/types/user.types";

export async function getMyWallet() {
    return httpClient.get<IWallet>("/wallet");
}

export async function getTransactionHistory(params?: Record<string, unknown>) {
    return httpClient.get<ICoinTransaction[]>("/wallet/transactions", { params });
}
