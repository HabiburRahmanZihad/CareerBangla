"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { httpClient } from "@/lib/axios/httpClient";
import { useQuery } from "@tanstack/react-query";
import { Eye, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { PaymentDetailModal } from "./PaymentDetailModal";

interface Subscription {
    id: string;
    transactionId: string | null;
    plan: string;
    amount: number;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
}

interface Response {
    data: Subscription[];
    pagination: { page: number; total: number; totalPages: number };
}

export default function PaymentSubscriptionsContent() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { data, isLoading, isFetching, refetch, error } = useQuery({
        queryKey: ["payments", page, search, status],
        queryFn: async () => {
            const res = await httpClient.get<Response>("/subscriptions/admin/all-payments", {
                params: { page, limit: 10, search: search || undefined, status: status || undefined },
            });
            return res.data;
        },
    });

    const items = data?.data || [];
    const pag = data?.pagination;

    const getStatusBadge = (s: string) => {
        const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            PAID: "default",
            UNPAID: "secondary",
            FAILED: "destructive",
        };
        return map[s] || "outline";
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Payment Subscriptions</h1>
                <p className="text-sm text-muted-foreground">View all payment subscription details</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>

                        <Select value={status} onValueChange={(v) => { setStatus(v === "ALL" ? "" : v); setPage(1); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="UNPAID">Unpaid</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button onClick={() => refetch()} disabled={isFetching} variant="outline">
                            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Total: {pag?.total || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            {Array(5)
                                .fill(null)
                                .map((_, i) => (
                                    <Skeleton key={i} className="h-12 w-full" />
                                ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No payments found</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600 bg-red-50 rounded p-4">
                            <p className="font-semibold">Error loading payments</p>
                            <p className="text-sm mt-2">{error instanceof Error ? error.message : "Failed to fetch payment subscriptions"}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.user.name}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {item.user.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.plan.replace(/_/g, " ")}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ৳{item.amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadge(item.status)}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedId(item.id)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {pag && pag.totalPages > 1 && (
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                        Page {pag.page} of {pag.totalPages}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setPage(Math.min(pag.totalPages, page + 1))}
                            disabled={page === pag.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {selectedId && (
                <PaymentDetailModal
                    subscriptionId={selectedId}
                    isOpen={!!selectedId}
                    onClose={() => setSelectedId(null)}
                />
            )}
        </div>
    );
}
