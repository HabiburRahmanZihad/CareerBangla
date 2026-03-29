"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { httpClient } from "@/lib/axios/httpClient";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
    AlertCircle, ArrowLeft, ArrowRight,
    BadgeCheck, Ban, ChevronRight,
    Clock, CreditCard, DollarSign,
    Eye, RefreshCw, Search, TrendingUp,
} from "lucide-react";
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

// ── Status config ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
    PAID: { label: "Paid", icon: BadgeCheck, bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
    UNPAID: { label: "Unpaid", icon: Clock, bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
    FAILED: { label: "Failed", icon: Ban, bg: "bg-destructive/10", text: "text-destructive", dot: "bg-destructive" },
};

const StatusPill = ({ status }: { status: string }) => {
    const cfg = STATUS_CONFIG[status] ?? { label: status, icon: Clock, bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" };
    const Icon = cfg.icon;
    return (
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black", cfg.bg, cfg.text)}>
            <Icon className="h-3 w-3" />
            {cfg.label}
        </span>
    );
};

// ── Stat card ──────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: React.ElementType; accent: string }) => (
    <div className={cn("relative rounded-2xl border border-border/40 bg-card overflow-hidden p-4 flex items-center gap-3")}>
        <div className={cn("absolute left-0 inset-y-0 w-1 bg-linear-to-b", accent)} />
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", accent.replace("from-", "bg-").split(" ")[0].replace("bg-", "bg-") + "/10")}>
            <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="pl-1">
            <p className="text-2xl font-black leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
    </div>
);

// ── Avatar ──────────────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
    "from-primary to-orange-600", "from-violet-500 to-purple-700",
    "from-blue-500 to-blue-700", "from-emerald-500 to-teal-700",
    "from-rose-500 to-pink-700", "from-amber-500 to-orange-600",
];
const avatarGradient = (name: string) =>
    AVATAR_GRADIENTS[(name.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length];

const UserAvatar = ({ name, size = 8 }: { name: string; size?: number }) => {
    const grad = avatarGradient(name);
    return (
        <div className={cn(`h-${size} w-${size} rounded-lg bg-linear-to-br shrink-0 flex items-center justify-center font-black text-white text-xs`, grad)}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────
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

    const paidCount = items.filter((i) => i.status === "PAID").length;
    const unpaidCount = items.filter((i) => i.status === "UNPAID").length;
    const failedCount = items.filter((i) => i.status === "FAILED").length;
    const totalAmount = items.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amount, 0);

    return (
        <div className="space-y-5">

            {/* ── Hero header ─────────────────────────────────────────────── */}
            <div className="relative rounded-2xl overflow-hidden bg-card border border-border/40">
                <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
                <div className="relative px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/30 shrink-0">
                            <CreditCard className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black">Payment Subscriptions</h1>
                            <p className="text-sm text-muted-foreground">Track all payment transactions across the platform</p>
                        </div>
                    </div>
                    {pag && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black">
                            <TrendingUp className="h-3.5 w-3.5" />
                            {pag.total} Total Payments
                        </span>
                    )}
                </div>
            </div>

            {/* ── Stats row ───────────────────────────────────────────────── */}
            {!isLoading && items.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard label="Paid (this page)" value={paidCount} icon={BadgeCheck} accent="from-emerald-500 to-emerald-500/10" />
                    <StatCard label="Unpaid (this page)" value={unpaidCount} icon={Clock} accent="from-amber-500 to-amber-500/10" />
                    <StatCard label="Failed (this page)" value={failedCount} icon={Ban} accent="from-destructive to-destructive/10" />
                    <StatCard label="Revenue (this page)" value={`৳${totalAmount.toLocaleString()}`} icon={DollarSign} accent="from-primary to-primary/10" />
                </div>
            )}

            {/* ── Filter bar ──────────────────────────────────────────────── */}
            <div className="relative rounded-2xl border border-border/40 bg-card overflow-hidden">
                <div className="absolute left-0 inset-y-0 w-1 bg-linear-to-b from-primary to-primary/10" />
                <div className="pl-6 pr-5 py-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="pl-9 rounded-xl"
                        />
                    </div>
                    <Select value={status || "ALL"} onValueChange={(v) => { setStatus(v === "ALL" ? "" : v); setPage(1); }}>
                        <SelectTrigger className="w-full sm:w-40 rounded-xl">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="UNPAID">Unpaid</SelectItem>
                            <SelectItem value="FAILED">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        variant="outline"
                        className="rounded-xl gap-2 shrink-0"
                    >
                        <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                </div>
            </div>

            {/* ── Content ─────────────────────────────────────────────────── */}
            <div className="relative rounded-2xl border border-border/40 bg-card overflow-hidden">
                <div className="absolute left-0 inset-y-0 w-1 bg-linear-to-b from-violet-500 to-violet-500/10" />

                {/* Table header */}
                <div className="pl-6 pr-5 py-3.5 border-b border-border/40 bg-muted/20 flex items-center justify-between gap-3">
                    <p className="font-black text-sm">
                        Transactions
                        {pag && <span className="ml-2 text-xs font-normal text-muted-foreground">({pag.total} total)</span>}
                    </p>
                    {isFetching && !isLoading && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <RefreshCw className="h-3 w-3 animate-spin" /> Refreshing...
                        </span>
                    )}
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="pl-6 pr-5 py-4 space-y-3">
                        {Array(6).fill(null).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-3.5 w-40" />
                                    <Skeleton className="h-3 w-56" />
                                </div>
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full hidden md:block" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="pl-6 pr-5 py-12 flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <p className="font-black text-destructive">Error loading payments</p>
                        <p className="text-sm text-muted-foreground text-center max-w-xs">
                            {error instanceof Error ? error.message : "Failed to fetch payment subscriptions"}
                        </p>
                        <Button type="button" onClick={() => refetch()} variant="outline" className="rounded-xl gap-2 mt-1">
                            <RefreshCw className="h-4 w-4" /> Try Again
                        </Button>
                    </div>
                ) : items.length === 0 ? (
                    <div className="pl-6 pr-5 py-12 flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="font-black">No payments found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/40 bg-muted/10">
                                        <th className="text-left px-5 py-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">User</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Plan</th>
                                        <th className="text-right px-5 py-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Amount</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Status</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Date</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors group"
                                        >
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <UserAvatar name={item.user.name} size={8} />
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm truncate">{item.user.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{item.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary/8 text-primary text-xs font-bold border border-primary/15">
                                                    {item.plan.replace(/_/g, " ")}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <span className="font-black text-sm">৳{item.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <StatusPill status={item.status} />
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-muted-foreground">
                                                {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedId(item.id)}
                                                    className="h-8 w-8 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors group-hover:border group-hover:border-primary/20"
                                                    title="View details"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile card list */}
                        <div className="md:hidden divide-y divide-border/30">
                            {items.map((item) => (
                                <button
                                    type="button"
                                    key={item.id}
                                    onClick={() => setSelectedId(item.id)}
                                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors text-left"
                                >
                                    <UserAvatar name={item.user.name} size={9} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-bold text-sm truncate">{item.user.name}</p>
                                            <span className="font-black text-sm shrink-0">৳{item.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 mt-0.5">
                                            <p className="text-xs text-muted-foreground truncate">{item.plan.replace(/_/g, " ")}</p>
                                            <StatusPill status={item.status} />
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ── Pagination ───────────────────────────────────────────────── */}
            {pag && pag.totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-sm text-muted-foreground">
                        Page <span className="font-bold text-foreground">{pag.page}</span> of{" "}
                        <span className="font-bold text-foreground">{pag.totalPages}</span>
                        <span className="ml-2 text-xs">({pag.total} results)</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="rounded-xl gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </Button>

                        {/* Page numbers */}
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, pag.totalPages) }, (_, i) => {
                                let p: number;
                                if (pag.totalPages <= 5) {
                                    p = i + 1;
                                } else if (page <= 3) {
                                    p = i + 1;
                                } else if (page >= pag.totalPages - 2) {
                                    p = pag.totalPages - 4 + i;
                                } else {
                                    p = page - 2 + i;
                                }
                                return (
                                    <button
                                        type="button"
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={cn(
                                            "h-9 w-9 rounded-xl text-sm font-bold transition-colors",
                                            p === page
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted text-muted-foreground"
                                        )}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPage(Math.min(pag.totalPages, page + 1))}
                            disabled={page === pag.totalPages}
                            className="rounded-xl gap-2"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Detail modal ─────────────────────────────────────────────── */}
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
