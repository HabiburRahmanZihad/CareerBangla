"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { ICoinTransaction, IWallet } from "@/types/user.types";

export async function getMyWallet() {
    return serverHttpClient.get<IWallet>("/wallet");
}

export async function getTransactionHistory(params?: Record<string, unknown>) {
    return serverHttpClient.get<ICoinTransaction[]>("/wallet/transactions", { params });
}
