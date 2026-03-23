"use server";

import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { logger } from "@/lib/logger";
import { ICoinTransaction, IWallet } from "@/types/user.types";

export async function getMyWallet() {
    logger.read("Fetching wallet");
    return serverHttpClient.get<IWallet>("/wallet");
}

export async function getTransactionHistory(params?: Record<string, unknown>) {
    logger.read("Fetching transaction history");
    return serverHttpClient.get<ICoinTransaction[]>("/wallet/transactions", { params });
}
