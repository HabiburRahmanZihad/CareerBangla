"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyWallet, getTransactionHistory } from "@/services/wallet.services";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Coins } from "lucide-react";
import Link from "next/link";

const WalletContent = () => {
    const { data: walletData, isLoading: walletLoading } = useQuery({
        queryKey: ["my-wallet"],
        queryFn: () => getMyWallet(),
    });

    const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
        queryKey: ["transaction-history"],
        queryFn: () => getTransactionHistory({ limit: "20" }),
    });

    if (walletLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    const wallet = walletData?.data;
    const transactions = transactionsData?.data || [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Wallet</h1>

            {/* Balance Card */}
            <Card className="bg-linear-to-br from-primary/10 to-primary/5">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Available Balance</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Coins className="h-8 w-8 text-yellow-500" />
                                <span className="text-4xl font-bold">{wallet?.balance ?? 0}</span>
                                <span className="text-lg text-muted-foreground">coins</span>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href="/dashboard/subscriptions">Buy Coins</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    {transactionsLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : transactions.length > 0 ? (
                        <div className="space-y-3">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {tx.type === "CREDIT" ? (
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                <ArrowDownLeft className="h-4 w-4 text-green-600" />
                                            </div>
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                                <ArrowUpRight className="h-4 w-4 text-red-600" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium">{tx.details || tx.purpose}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {tx.createdAt && formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={tx.type === "CREDIT" ? "default" : "destructive"}>
                                        {tx.type === "CREDIT" ? "+" : "-"}{tx.amount} coins
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No transactions yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default WalletContent;
