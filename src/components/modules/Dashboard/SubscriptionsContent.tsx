"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/lib/envConfig";
import {
    getMySubscriptions,
    getSubscriptionPlans,
    IMySubscription,
    ISubscriptionPlanResponse,
    purchaseSubscription,
    validateCoupon,
} from "@/services/subscription.services";
import { UserInfo } from "@/types/user.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, isFuture } from "date-fns";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    CreditCard,
    Download,
    Loader2,
    Rocket,
    Sparkles,
    Tag,
    X,
    XCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface SubscriptionsContentProps {
    userRole?: "USER" | "RECRUITER" | string;
    userInfo?: UserInfo;
}

type Step = "overview" | "checkout" | "history";

const CAREER_BOOST_PRICE = 4999;
const CAREER_BOOST_FEATURES = [
    "Download Custom ATS PDF",
    "Unlimited Profile Editing",
    "Priority Application Review",
    "Career Boost Badge on Profile",
    "Lifetime Access",
];

// ── Payment Result Banner ──
const PaymentResultBanner = ({ showPaymentResult, setShowPaymentResult }: { showPaymentResult: string | null; setShowPaymentResult: (val: string | null) => void }) => {
    if (!showPaymentResult) return null;

    if (showPaymentResult === "success") {
        return (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-6 flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-700 dark:text-green-300">Payment Successful!</h3>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Your premium plan has been activated. An invoice has been sent to your email.
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

const SubscriptionsContent = ({ userInfo, userRole }: SubscriptionsContentProps) => {
    const searchParams = useSearchParams();
    const paymentStatus = searchParams.get("payment");

    const [step, setStep] = useState<Step>(paymentStatus ? "history" : "overview");
    const [selectedPlanKey, setSelectedPlanKey] = useState("BOOST_LIFETIME");
    const [couponCode, setCouponCode] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const gateway = "SSLCOMMERZ" as const;
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number | null; discountAmount: number | null } | null>(null);
    const [showPaymentResult, setShowPaymentResult] = useState<string | null>(paymentStatus);

    useEffect(() => {
        if (showPaymentResult) {
            const timer = setTimeout(() => setShowPaymentResult(null), 8000);
            return () => clearTimeout(timer);
        }
    }, [showPaymentResult]);

    const { data: historyData, isLoading: historyLoading, refetch: refetchHistory } = useQuery({
        queryKey: ["my-subscriptions"],
        queryFn: () => getMySubscriptions(),
        enabled: step === "history",
    });

    const { data: plansData, isLoading: plansLoading } = useQuery({
        queryKey: ["subscription-plans"],
        queryFn: () => getSubscriptionPlans(),
    });

    const { mutateAsync: purchase, isPending: purchasePending } = useMutation({
        mutationFn: () =>
            purchaseSubscription({
                planKey: selectedPlanKey,
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

    const isRecruiter = (userInfo?.role || userRole) === "RECRUITER";
    const rawPlans: ISubscriptionPlanResponse[] =
        ((plansData as any)?.data?.plans as ISubscriptionPlanResponse[])
        || ((plansData as any)?.plans as ISubscriptionPlanResponse[])
        || [];

    const availablePlans = rawPlans.filter((plan) => {
        if (isRecruiter) {
            return plan.planKey.startsWith("RECRUITER_");
        }
        return !plan.planKey.startsWith("RECRUITER_");
    });

    const fallbackPlan: ISubscriptionPlanResponse = {
        name: "Career Boost (Lifetime)",
        planKey: "BOOST_LIFETIME",
        amount: CAREER_BOOST_PRICE,
        description: "Lifetime access to all Career Boost features. One-time payment, no recurring charges.",
        features: CAREER_BOOST_FEATURES,
        lifetime: true,
    };

    const resolvedPlans = useMemo(
        () => availablePlans.length > 0 ? availablePlans : [fallbackPlan],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [availablePlans.map(p => p.planKey).join(","), isRecruiter]
    );
    const selectedPlan = resolvedPlans.find((plan) => plan.planKey === selectedPlanKey) || resolvedPlans[0] || fallbackPlan;

    useEffect(() => {
        if (!resolvedPlans.some((plan) => plan.planKey === selectedPlanKey)) {
            setSelectedPlanKey(resolvedPlans[0]?.planKey || "BOOST_LIFETIME");
        }
    }, [resolvedPlans, selectedPlanKey]);

    const isPremium = userInfo?.isPremium;
    const premiumUntil = userInfo?.premiumUntil;
    const isLifetime = isPremium && !premiumUntil;
    const hasActivePremium = Boolean(isPremium) && (!premiumUntil || isFuture(new Date(premiumUntil)));
    const disableOverviewPurchaseButton = !isRecruiter && hasActivePremium;

    const getDiscountAmount = useCallback(() => {
        const selectedPlanAmount = selectedPlan?.amount ?? CAREER_BOOST_PRICE;
        if (!appliedCoupon) return 0;
        if (appliedCoupon.discountPercent) {
            return Math.round(selectedPlanAmount * (appliedCoupon.discountPercent / 100));
        }
        if (appliedCoupon.discountAmount) {
            return Math.min(appliedCoupon.discountAmount, selectedPlanAmount);
        }
        return 0;
    }, [appliedCoupon, selectedPlan?.amount]);

    const getFinalAmount = useCallback(() => {
        const selectedPlanAmount = selectedPlan?.amount ?? CAREER_BOOST_PRICE;
        const discount = getDiscountAmount();
        return Math.max(selectedPlanAmount - discount, 1);
    }, [getDiscountAmount, selectedPlan?.amount]);

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return;
        validateCouponMutation(couponCode.trim());
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
    };

    const subscriptions: IMySubscription[] = (historyData?.data as any) || [];

    const getHistoryPlanLabel = useCallback((sub: IMySubscription) => {
        const gatewayData = sub.paymentGatewayData as Record<string, unknown> | null;
        const planKey = typeof gatewayData?.planKey === "string" ? gatewayData.planKey : null;
        const planFromKey = resolvedPlans.find((plan) => plan.planKey === planKey);
        if (planFromKey) return planFromKey.name;

        const fallbackMap: Record<string, string> = {
            PREMIUM: "Career Boost (Lifetime)",
            RECRUITER_MONTHLY: "Recruiter Premium (Monthly)",
            RECRUITER_6_MONTHS: "Recruiter Premium (3 Months)",
            RECRUITER_YEARLY: "Recruiter Premium (Yearly)",
        };

        return fallbackMap[sub.plan] || "Premium Subscription";
    }, [resolvedPlans]);

    // ── Step 1: Overview - Career Boost Plan ──
    if (step === "overview") {
        if (plansLoading) {
            return (
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-72" />
                            <Skeleton className="h-5 w-96" />
                        </div>
                        <Skeleton className="h-9 w-32" />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: isRecruiter ? 3 : 1 }).map((_, i) => (
                            <Skeleton key={i} className="h-72 rounded-xl" />
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{isRecruiter ? "Recruiter Premium Plans" : "Career Boost"}</h1>
                        <p className="text-muted-foreground mt-2">
                            {isRecruiter
                                ? "Choose a recruiter premium plan that matches your hiring pace."
                                : "Supercharge your career with lifetime access to all premium features."}
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => { setStep("history"); refetchHistory(); }}>
                        <CreditCard className="w-4 h-4 mr-2" /> My Purchases
                    </Button>
                </div>

                <PaymentResultBanner showPaymentResult={showPaymentResult} setShowPaymentResult={setShowPaymentResult} />

                {!isRecruiter && isLifetime && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                            <Rocket className="w-5 h-5" /> You have Lifetime Career Boost
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            You already have lifetime access to all Career Boost features. No further action needed!
                        </p>
                    </div>
                )}

                {!isRecruiter && isPremium && premiumUntil && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                            <Rocket className="w-5 h-5" /> Career Boost Active
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Your Career Boost access (from referral rewards) is valid until <strong className="text-foreground">{format(new Date(premiumUntil), "PPP")}</strong>.
                            Upgrade to lifetime to never worry about expiration!
                        </p>
                    </div>
                )}

                {isRecruiter && hasActivePremium && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                            <Rocket className="w-5 h-5" /> Recruiter Premium Active
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            You have already purchased a premium plan. If you want, you can buy additional months in advance, which will extend your subscription duration and let you stay worry-free.
                        </p>
                    </div>
                )}

                {isRecruiter ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {resolvedPlans.map((plan) => {
                            const isSelected = selectedPlan.planKey === plan.planKey;

                            return (
                                <Card key={plan.planKey} className={`relative ${isSelected ? "border-primary shadow-lg" : ""}`}>
                                    {isSelected && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-sm">
                                            <Sparkles className="w-3.5 h-3.5 mr-1" /> Selected
                                        </Badge>
                                    )}
                                    <CardHeader className="text-center pt-8 pb-2">
                                        <CardTitle className="text-xl">{plan.name.replace("6 Months", "3 Months")}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{plan.description.replace("6 months", "3 months")}</p>
                                    </CardHeader>
                                    <CardContent className="text-center pb-6">
                                        <div className="my-4">
                                            <span className="text-4xl font-extrabold">&#2547;{plan.amount}</span>
                                        </div>
                                        <ul className="space-y-2 text-sm text-left max-w-xs mx-auto">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className="w-full h-11"
                                            variant={isSelected ? "default" : "outline"}
                                            onClick={() => {
                                                setSelectedPlanKey(plan.planKey);
                                                setStep("checkout");
                                            }}
                                        >
                                            Choose Plan
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="max-w-lg mx-auto">
                        <Card className="relative border-primary shadow-lg">
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-sm">
                                <Sparkles className="w-3.5 h-3.5 mr-1" /> Lifetime Access
                            </Badge>
                            <CardHeader className="text-center pt-8 pb-2">
                                <CardTitle className="text-3xl flex items-center justify-center gap-2">
                                    <Rocket className="w-7 h-7 text-primary" /> Career Boost
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">One-time payment, forever access</p>
                            </CardHeader>
                            <CardContent className="text-center pb-6">
                                <div className="my-6">
                                    <span className="text-5xl font-extrabold">&#2547;{selectedPlan.amount}</span>
                                    <span className="text-muted-foreground ml-2">one-time</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6">{selectedPlan.description}</p>
                                <ul className="space-y-3 text-sm text-left max-w-xs mx-auto">
                                    {selectedPlan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full h-12 text-md"
                                    size="lg"
                                    onClick={() => setStep("checkout")}
                                    disabled={disableOverviewPurchaseButton}
                                >
                                    {disableOverviewPurchaseButton ? (
                                        "Already Premium"
                                    ) : (
                                        <><Rocket className="w-4 h-4 mr-2" /> Upgrade to Career Boost</>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </div>
        );
    }

    // ── Step 2: Checkout ──
    if (step === "checkout") {
        const discount = getDiscountAmount();
        const finalAmount = getFinalAmount();

        return (
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <Button variant="ghost" onClick={() => { setStep("overview"); setAppliedCoupon(null); setCouponCode(""); }} className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Complete Your Purchase</h1>
                    <p className="text-muted-foreground mt-1">Review your selected plan and proceed to payment.</p>
                </div>

                {/* Plan Summary */}
                <Card className="border-primary/30">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Rocket className="w-5 h-5 text-primary" />
                                {selectedPlan.name.replace("6 Months", "3 Months")}
                            </span>
                            <Badge>{selectedPlan.lifetime ? "Lifetime" : "Duration"}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{selectedPlan.description.replace("6 months", "3 months")}</p>
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

                {/* Coupon & Referral */}
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

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-500" /> Payment Method
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                            <div>
                                <p className="font-semibold text-sm">SSLCommerz</p>
                                <p className="text-xs text-muted-foreground">Pay securely in BDT — Cards, bKash, Nagad, Rocket &amp; more</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Price Summary */}
                <Card className="bg-muted/30">
                    <CardContent className="pt-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{selectedPlan.name.replace("6 Months", "3 Months")}</span>
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
                            disabled={purchasePending || (!isRecruiter && isLifetime)}
                        >
                            {!isRecruiter && isLifetime ? (
                                "You already have Lifetime Career Boost"
                            ) : purchasePending ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                            ) : (
                                `Pay ৳${finalAmount} via SSLCommerz`
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
                        <Button variant="ghost" onClick={() => { setStep("overview"); setShowPaymentResult(null); }} className="mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Purchase History</h1>
                        <p className="text-muted-foreground mt-1">View your past purchases and download invoices.</p>
                    </div>
                </div>

                <PaymentResultBanner showPaymentResult={showPaymentResult} setShowPaymentResult={setShowPaymentResult} />

                {historyLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-lg" />
                        ))}
                    </div>
                ) : subscriptions.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No purchases yet. Get Career Boost to unlock all features!
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
                                                    <h3 className="font-semibold text-lg">{getHistoryPlanLabel(sub)}</h3>
                                                    <Badge variant={sub.status === "PAID" ? "default" : sub.status === "UNPAID" ? "secondary" : "destructive"}>
                                                        {sub.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {sub.transactionId && <span className="font-mono text-xs">{sub.transactionId}</span>}
                                                    {" "}&middot;{" "}
                                                    {format(new Date(sub.createdAt), "PPP")}
                                                </p>
                                                {sub.currentPeriodStart && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Activated: {format(new Date(sub.currentPeriodStart), "MMM d, yyyy")}
                                                        {sub.currentPeriodEnd ? ` - ${format(new Date(sub.currentPeriodEnd), "MMM d, yyyy")}` : " (Lifetime)"}
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
                                                        asChild
                                                    >
                                                        <a
                                                            href={`${envConfig.apiBaseUrl}/subscriptions/invoice/${sub.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Download className="w-4 h-4 mr-1" /> Invoice
                                                        </a>
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
