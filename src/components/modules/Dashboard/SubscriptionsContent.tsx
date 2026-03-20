"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    getSubscriptionPlans,
    purchaseSubscription,
    getMySubscriptions,
    validateCoupon,
    ISubscriptionPlanResponse,
    IMySubscription,
} from "@/services/subscription.services";
import { UserInfo } from "@/types/user.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    ArrowLeft,
    CheckCircle,
    Crown,
    CreditCard,
    Download,
    Tag,
    X,
    Loader2,
    AlertCircle,
    XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import envConfig from "@/lib/envConfig";

interface SubscriptionsContentProps {
    userRole?: "USER" | "RECRUITER" | string;
    userInfo?: UserInfo;
}

type Step = "plans" | "checkout" | "history";

const SubscriptionsContent = ({ userInfo }: SubscriptionsContentProps) => {
    const searchParams = useSearchParams();
    const paymentStatus = searchParams.get("payment");

    const [step, setStep] = useState<Step>(paymentStatus ? "history" : "plans");
    const [selectedPlan, setSelectedPlan] = useState<ISubscriptionPlanResponse | null>(null);
    const [couponCode, setCouponCode] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [gateway, setGateway] = useState<"STRIPE" | "SSLCOMMERZ">("SSLCOMMERZ");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number | null; discountAmount: number | null } | null>(null);
    const [showPaymentResult, setShowPaymentResult] = useState<string | null>(paymentStatus);

    // Auto-dismiss payment result after 8 seconds
    useEffect(() => {
        if (showPaymentResult) {
            const timer = setTimeout(() => setShowPaymentResult(null), 8000);
            return () => clearTimeout(timer);
        }
    }, [showPaymentResult]);

    const { data: plansData, isLoading: plansLoading } = useQuery({
        queryKey: ["subscription-plans"],
        queryFn: () => getSubscriptionPlans(),
    });

    const { data: historyData, isLoading: historyLoading, refetch: refetchHistory } = useQuery({
        queryKey: ["my-subscriptions"],
        queryFn: () => getMySubscriptions(),
        enabled: step === "history",
    });

    const { mutateAsync: purchase, isPending: purchasePending } = useMutation({
        mutationFn: () =>
            purchaseSubscription({
                planName: selectedPlan!.planKey,
                couponCode: appliedCoupon?.code || undefined,
                referralCode: referralCode || undefined,
                gateway,
            }),
        onSuccess: (response: any) => {
            const url = response?.data?.paymentUrl || response?.data?.url || response?.data?.redirectUrl || response?.url;
            if (url) {
                window.location.href = url;
            } else {
                toast.success("Redirecting to payment gateway...");
            }
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to initiate payment");
        },
    });

    const { mutateAsync: validateCouponMutation, isPending: couponValidating } = useMutation({
        mutationFn: (code: string) => validateCoupon(code),
        onSuccess: (response: any) => {
            const data = response?.data;
            if (data) {
                setAppliedCoupon({ code: data.code, discountPercent: data.discountPercent, discountAmount: data.discountAmount });
                toast.success(`Coupon "${data.code}" applied!`);
            }
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Invalid coupon code");
            setAppliedCoupon(null);
        },
    });

    const isPremium = userInfo?.isPremium;
    const premiumUntil = userInfo?.premiumUntil;

    const plans: ISubscriptionPlanResponse[] = (plansData?.data as any)?.plans || [];

    const getDiscountAmount = useCallback(() => {
        if (!appliedCoupon || !selectedPlan) return 0;
        if (appliedCoupon.discountPercent) {
            return Math.round(selectedPlan.amount * (appliedCoupon.discountPercent / 100));
        }
        if (appliedCoupon.discountAmount) {
            return Math.min(appliedCoupon.discountAmount, selectedPlan.amount);
        }
        return 0;
    }, [appliedCoupon, selectedPlan]);

    const getFinalAmount = useCallback(() => {
        if (!selectedPlan) return 0;
        const discount = getDiscountAmount();
        return Math.max(selectedPlan.amount - discount, 1);
    }, [selectedPlan, getDiscountAmount]);

    const handleSelectPlan = (plan: ISubscriptionPlanResponse) => {
        setSelectedPlan(plan);
        setAppliedCoupon(null);
        setCouponCode("");
        setStep("checkout");
    };

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return;
        validateCouponMutation(couponCode.trim());
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
    };

    const subscriptions: IMySubscription[] = (historyData?.data as any) || [];

    // ── Payment Result Banner ──
    const PaymentResultBanner = () => {
        if (!showPaymentResult) return null;

        if (showPaymentResult === "success") {
            return (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-6 flex items-start gap-4">
                    <CheckCircle className="w-8 h-8 text-green-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-green-700 dark:text-green-300">Payment Successful!</h3>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Your premium subscription has been activated. An invoice has been sent to your email.
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowPaymentResult(null)}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            );
        }

        if (showPaymentResult === "cancelled") {
            return (
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 text-yellow-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-300">Payment Cancelled</h3>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                            Your payment was cancelled. No charges were made. You can try again anytime.
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowPaymentResult(null)}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            );
        }

        return (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start gap-4">
                <XCircle className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-300">Payment Failed</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Something went wrong with your payment. Please try again or contact support.
                    </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentResult(null)}>
                    <X className="w-4 h-4" />
                </Button>
            </div>
        );
    };

    // ── Loading ──
    if (plansLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-80 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    // ── Step 1: Plan Selection ──
    if (step === "plans") {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Premium Subscriptions</h1>
                        <p className="text-muted-foreground mt-2">Upgrade to Premium to unlock unlimited profile edits, PDF downloads, and priority ATS matching.</p>
                    </div>
                    <Button variant="outline" onClick={() => { setStep("history"); refetchHistory(); }}>
                        <CreditCard className="w-4 h-4 mr-2" /> My Purchases
                    </Button>
                </div>

                <PaymentResultBanner />

                {isPremium && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                <Crown className="w-5 h-5" /> You are a Premium Member
                            </h3>
                            {premiumUntil && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Your premium access is valid until <strong className="text-foreground">{format(new Date(premiumUntil), "PPP")}</strong>.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <Card key={plan.planKey} className={`relative flex flex-col hover:border-primary transition-colors ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                            {plan.popular && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1">Most Popular</Badge>
                            )}
                            <CardHeader className="text-center pb-2">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{plan.durationDays} Days Access</p>
                            </CardHeader>
                            <CardContent className="flex-1 text-center pb-6">
                                <div className="my-4">
                                    <span className="text-4xl font-extrabold">&#2547;{plan.amount}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                                <ul className="space-y-2 text-sm text-left mt-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        <span>{plan.durationDays} Days Premium Tag</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full text-md h-12"
                                    size="lg"
                                    variant={plan.popular ? "default" : "outline"}
                                    onClick={() => handleSelectPlan(plan)}
                                >
                                    Select Plan
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // ── Step 2: Checkout / Payment Setup ──
    if (step === "checkout" && selectedPlan) {
        const discount = getDiscountAmount();
        const finalAmount = getFinalAmount();

        return (
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <Button variant="ghost" onClick={() => { setStep("plans"); setAppliedCoupon(null); setCouponCode(""); }} className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Plans
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Complete Your Purchase</h1>
                    <p className="text-muted-foreground mt-1">Review your selected plan and proceed to payment.</p>
                </div>

                {/* Selected Plan Summary */}
                <Card className="border-primary/30">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Crown className="w-5 h-5 text-yellow-500" />
                                {selectedPlan.name} Plan
                            </span>
                            <Badge variant="secondary">{selectedPlan.durationDays} Days</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                        <ul className="grid grid-cols-2 gap-2 text-sm">
                            {selectedPlan.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Coupon Code */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Tag className="w-5 h-5 text-orange-500" /> Coupon & Referral
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Coupon Code</Label>
                            {appliedCoupon ? (
                                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium text-green-700 dark:text-green-300 flex-1">
                                        Coupon &quot;{appliedCoupon.code}&quot; applied!
                                        {appliedCoupon.discountPercent && ` (${appliedCoupon.discountPercent}% off)`}
                                        {appliedCoupon.discountAmount && ` (৳${appliedCoupon.discountAmount} off)`}
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemoveCoupon}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="e.g. SUMMER50"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                                    />
                                    <Button variant="secondary" onClick={handleApplyCoupon} disabled={couponValidating || !couponCode.trim()}>
                                        {couponValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Referral Code (Optional)</Label>
                            <Input
                                placeholder="If referred by a friend"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Referral codes are tracked for the referral reward program.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Gateway */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-500" /> Payment Method
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={gateway} onValueChange={(val: any) => setGateway(val)}>
                            <SelectTrigger className="w-full font-semibold">
                                <SelectValue placeholder="Select Payment Gateway" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SSLCOMMERZ">SSLCommerz (Local BDT Cards/bKash/Nagad)</SelectItem>
                                <SelectItem value="STRIPE">Stripe (International Debit/Credit)</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Price Summary */}
                <Card className="bg-muted/30">
                    <CardContent className="pt-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>&#2547;{selectedPlan.amount}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount{appliedCoupon?.code ? ` (${appliedCoupon.code})` : ""}</span>
                                <span>-&#2547;{discount}</span>
                            </div>
                        )}
                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">&#2547;{finalAmount}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full h-12 text-md"
                            size="lg"
                            onClick={() => purchase()}
                            disabled={purchasePending}
                        >
                            {purchasePending ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                            ) : (
                                `Pay ৳${finalAmount} with ${gateway === "STRIPE" ? "Stripe" : "SSLCommerz"}`
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // ── Step 3: Purchase History ──
    if (step === "history") {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <Button variant="ghost" onClick={() => { setStep("plans"); setShowPaymentResult(null); }} className="mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Plans
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Purchase History</h1>
                        <p className="text-muted-foreground mt-1">View your past subscriptions and download invoices.</p>
                    </div>
                </div>

                <PaymentResultBanner />

                {historyLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-lg" />
                        ))}
                    </div>
                ) : subscriptions.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No subscriptions yet. Purchase a plan to get started!
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {subscriptions.map((sub) => {
                            const gatewayData = sub.paymentGatewayData as Record<string, unknown> | null;
                            const originalAmount = (gatewayData?.originalAmount as number) || sub.amount;
                            const discountAmt = (gatewayData?.discountAmount as number) || 0;

                            return (
                                <Card key={sub.id}>
                                    <CardContent className="py-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-lg">{sub.plan} Plan</h3>
                                                    <Badge variant={sub.status === "PAID" ? "default" : sub.status === "UNPAID" ? "secondary" : "destructive"}>
                                                        {sub.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {sub.transactionId && <span className="font-mono text-xs">{sub.transactionId}</span>}
                                                    {" "}&middot;{" "}
                                                    {format(new Date(sub.createdAt), "PPP")}
                                                </p>
                                                {sub.currentPeriodStart && sub.currentPeriodEnd && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Period: {format(new Date(sub.currentPeriodStart), "MMM d, yyyy")} - {format(new Date(sub.currentPeriodEnd), "MMM d, yyyy")}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="font-bold text-lg">&#2547;{sub.amount}</p>
                                                    {discountAmt > 0 && (
                                                        <p className="text-xs text-green-600 line-through">&#2547;{originalAmount}</p>
                                                    )}
                                                </div>
                                                {sub.status === "PAID" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={async () => {
                                                            try {
                                                                const res = await fetch(`${envConfig.apiBaseUrl}/subscriptions/invoice/${sub.id}`, {
                                                                    credentials: "include",
                                                                });
                                                                if (!res.ok) throw new Error("Failed to download invoice");
                                                                const blob = await res.blob();
                                                                const url = URL.createObjectURL(blob);
                                                                const a = document.createElement("a");
                                                                a.href = url;
                                                                a.download = `CareerBangla-Invoice-${sub.transactionId || sub.id}.pdf`;
                                                                a.click();
                                                                URL.revokeObjectURL(url);
                                                            } catch {
                                                                toast.error("Failed to download invoice");
                                                            }
                                                        }}
                                                    >
                                                        <Download className="w-4 h-4 mr-1" /> Invoice
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return null;
};

export default SubscriptionsContent;
