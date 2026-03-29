import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/lib/envConfig";
import { IMySubscription } from "@/services/subscription.services";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, CreditCard, Download, Sparkles, Tag, XCircle } from "lucide-react";
import { PaymentResultBanner } from "./PaymentResultBanner";

interface SubscriptionHistoryProps {
    setStep: (step: "overview" | "checkout" | "history") => void;
    showPaymentResult: string | null;
    setShowPaymentResult: (val: string | null) => void;
    historyLoading: boolean;
    subscriptions: IMySubscription[];
    getHistoryPlanLabel: (sub: IMySubscription) => string;
}

export const SubscriptionHistory = ({
    setStep,
    showPaymentResult,
    setShowPaymentResult,
    historyLoading,
    subscriptions,
    getHistoryPlanLabel,
}: SubscriptionHistoryProps) => {
    // ── Step 3: Purchase History ──

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-4 pb-6 border-b border-border/50">
                <div className="space-y-4">
                    <Button variant="secondary" className="mb-2 -ml-3 hover:bg-primary/10 rounded-xl" onClick={() => { setStep("overview"); setShowPaymentResult(null); }}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Plans
                    </Button>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground/90 pb-1">
                        Purchase History
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                        View your past invoices, active subscriptions, and payment history securely.
                    </p>
                </div>
            </div>

            <PaymentResultBanner showPaymentResult={showPaymentResult} setShowPaymentResult={setShowPaymentResult} />

            {historyLoading ? (
                <div className="space-y-4 animate-pulse mt-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-6 p-6 lg:p-8 rounded-2xl border border-border/50 bg-muted/10">
                            <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                            <div className="space-y-3 flex-1">
                                <Skeleton className="h-6 w-48 rounded-md" />
                                <Skeleton className="h-4 w-64 rounded-md" />
                                <Skeleton className="h-4 w-32 rounded-md" />
                            </div>
                            <div className="hidden md:flex flex-col items-end gap-3 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-8 shrink-0">
                                <Skeleton className="h-8 w-24 rounded-md" />
                                <Skeleton className="h-8 w-32 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : subscriptions.length === 0 ? (
                <Card className="border-dashed border-2 border-border/60 bg-muted/20 rounded-3xl overflow-hidden">
                    <CardContent className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <CreditCard className="w-10 h-10 text-primary opacity-80" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No purchases yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8">
                            You haven&apos;t made any purchases yet. Upgrade to premium to unlock all advanced features.
                        </p>
                        <Button size="lg" className="rounded-xl font-semibold shadow-lg shadow-primary/20" onClick={() => setStep("overview")}>
                            <Sparkles className="w-4 h-4 mr-2" /> View Premium Plans
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-5">
                    {subscriptions.map((sub) => {
                        const gatewayData = sub.paymentGatewayData as Record<string, unknown> | null;
                        const originalAmount = (gatewayData?.originalAmount as number) || sub.amount;
                        const discountAmt = (gatewayData?.discountAmount as number) || 0;

                        const isPaid = sub.status === "PAID";

                        return (
                            <Card key={sub.id} className={`overflow-hidden rounded-2xl transition-all hover:shadow-md ${isPaid ? 'border-primary/20 bg-background' : 'border-border/50 bg-muted/10'}`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 lg:p-8">
                                    <div className="flex items-start gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isPaid ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            {isPaid ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="font-bold text-xl text-foreground">{getHistoryPlanLabel(sub)}</h3>
                                                <Badge variant={isPaid ? "default" : sub.status === "UNPAID" ? "secondary" : "destructive"} className={isPaid ? "shadow-sm" : ""}>
                                                    {sub.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground font-medium">
                                                <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Ordered: {format(new Date(sub.createdAt), "PP")}</span>
                                                {sub.transactionId && (
                                                    <>
                                                        <span className="hidden sm:inline">&bull;</span>
                                                        <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded cursor-copy" title="Transaction ID">{sub.transactionId}</span>
                                                    </>
                                                )}
                                            </div>
                                            {isPaid && sub.currentPeriodStart && (
                                                <p className="text-xs font-semibold text-primary/80 mt-1">
                                                    Active: {format(new Date(sub.currentPeriodStart), "MMM d, yyyy")}
                                                    {sub.currentPeriodEnd ? ` — ${format(new Date(sub.currentPeriodEnd), "MMM d, yyyy")}` : " (Lifetime Access)"}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-8">
                                        <div className="text-left md:text-right">
                                            <div className="flex items-baseline gap-1 md:justify-end">
                                                {discountAmt > 0 && (
                                                    <span className="text-sm text-muted-foreground line-through mr-1 font-medium">&#2547;{originalAmount}</span>
                                                )}
                                                <span className="text-lg font-bold text-foreground">&#2547;</span>
                                                <span className="text-3xl font-black text-foreground">{sub.amount}</span>
                                            </div>
                                            {discountAmt > 0 && (
                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] uppercase mt-1">Saved &#2547;{discountAmt}</Badge>
                                            )}
                                        </div>
                                        {isPaid && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="rounded-lg shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors font-semibold"
                                                asChild
                                            >
                                                <a
                                                    href={`${envConfig.apiBaseUrl}/subscriptions/invoice/${sub.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Download className="w-4 h-4 mr-2" /> Download PDF
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );

};
