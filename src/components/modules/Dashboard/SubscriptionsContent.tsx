"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    applyCouponDirect,
    getMySubscriptions,
    getSubscriptionPlans,
    ICheckoutCustomerInfo,
    IMySubscription,
    ISubscriptionPlanResponse,
    IValidatedCoupon,
    purchaseSubscription,
    validateCoupon,
} from "@/services/subscription.services";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { UserInfo } from "@/types/user.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isFuture } from "date-fns";
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
import { SubscriptionOverview } from "./SubscriptionOverview";
import { SubscriptionCheckout } from "./SubscriptionCheckout";
import { SubscriptionHistory } from "./SubscriptionHistory";

const SubscriptionsContent = ({ userInfo, userRole }: SubscriptionsContentProps) => {
    const searchParams = useSearchParams();
    const paymentStatus = searchParams.get("payment");

    const [step, setStep] = useState<Step>(paymentStatus ? "history" : "overview");
    const [selectedPlanKey, setSelectedPlanKey] = useState("BOOST_LIFETIME");
    const [couponCode, setCouponCode] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [billingInfo, setBillingInfo] = useState<ICheckoutCustomerInfo>({
        name: userInfo?.name || "",
        phone: userInfo?.phone || "",
        address: "",
        city: "",
        postcode: "",
    });
    const [billingErrors, setBillingErrors] = useState<Partial<ICheckoutCustomerInfo>>({});
    const gateway = "SSLCOMMERZ" as const;
    const [appliedCoupon, setAppliedCoupon] = useState<IValidatedCoupon | null>(null);

    const FREE_COUPON_TYPES = ["FREE_DAYS", "LIFETIME_FREE", "RECRUITER_DAYS", "RECRUITER_MONTHS"];
    const isFreeAccessCoupon = appliedCoupon ? FREE_COUPON_TYPES.includes(appliedCoupon.type) : false;
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
                customerInfo: billingInfo,
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
            toast.error(getRequestErrorMessage(err, "Failed to initiate payment"));
        },
    });

    const { mutateAsync: validateCouponMutation, isPending: couponValidating } = useMutation({
        mutationFn: (code: string) => validateCoupon(code),
        onSuccess: (response: any) => {
            const data = response?.data;
            if (data) {
                setAppliedCoupon(data as IValidatedCoupon);
                toast.success(`Coupon "${data.code}" applied!`);
            }
        },
        onError: (err: any) => {
            toast.error(getRequestErrorMessage(err, "Invalid coupon code"));
            setAppliedCoupon(null);
        },
    });

    const { mutateAsync: activateFreeCoupon, isPending: activatingFree } = useMutation({
        mutationFn: (code: string) => applyCouponDirect(code),
        onSuccess: (response: any) => {
            const msg = response?.data?.message || "Coupon activated successfully!";
            toast.success(msg);
            setAppliedCoupon(null);
            setCouponCode("");
            setStep("history");
            setShowPaymentResult("success");
        },
        onError: (err: any) => {
            toast.error(getRequestErrorMessage(err, "Failed to activate coupon"));
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
        if (isFreeAccessCoupon) return selectedPlanAmount; // 100% off — free
        if (appliedCoupon.discountPercent) {
            return Math.round(selectedPlanAmount * (appliedCoupon.discountPercent / 100));
        }
        if (appliedCoupon.discountAmount) {
            return Math.min(appliedCoupon.discountAmount, selectedPlanAmount);
        }
        return 0;
    }, [appliedCoupon, isFreeAccessCoupon, selectedPlan?.amount]);

    const getFinalAmount = useCallback(() => {
        const selectedPlanAmount = selectedPlan?.amount ?? CAREER_BOOST_PRICE;
        if (isFreeAccessCoupon) return 0;
        const discount = getDiscountAmount();
        return Math.max(selectedPlanAmount - discount, 1);
    }, [getDiscountAmount, isFreeAccessCoupon, selectedPlan?.amount]);

    const getCouponBenefitLabel = (coupon: IValidatedCoupon): string => {
        switch (coupon.type) {
            case "PERCENT_DISCOUNT": return `${coupon.discountPercent}% discount`;
            case "AMOUNT_DISCOUNT": return `৳${coupon.discountAmount} off`;
            case "FREE_DAYS": return `${coupon.freeDays} free days of premium`;
            case "RECRUITER_DAYS": return `${coupon.freeDays} free recruiter days`;
            case "RECRUITER_MONTHS": return `${coupon.freeMonths} free month${(coupon.freeMonths ?? 0) > 1 ? "s" : ""} of recruiter premium`;
            case "LIFETIME_FREE": return "lifetime free access";
            case "REFERRAL": return `৳${coupon.discountAmount} off (referral)`;
            default: return "discount applied";
        }
    };

    const validateBilling = (): boolean => {
        const errors: Partial<ICheckoutCustomerInfo> = {};
        if (!billingInfo.name.trim()) errors.name = "Full name is required";
        if (!billingInfo.phone.trim()) errors.phone = "Phone number is required";
        else if (!/^01\d{9}$/.test(billingInfo.phone.trim())) errors.phone = "Enter a valid 11-digit BD phone number (e.g. 01XXXXXXXXX)";
        if (!billingInfo.address.trim()) errors.address = "Address is required";
        if (!billingInfo.city.trim()) errors.city = "City is required";
        if (!billingInfo.postcode.trim()) errors.postcode = "Postcode is required";
        setBillingErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePurchase = () => {
        if (!validateBilling()) {
            toast.error("Please fill in all billing information before proceeding");
            return;
        }
        purchase();
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

    if (step === "overview") {
        return (
            <SubscriptionOverview
                plansLoading={plansLoading}
                isRecruiter={isRecruiter}
                isLifetime={Boolean(isLifetime)}
                isPremium={isPremium}
                premiumUntil={premiumUntil}
                hasActivePremium={hasActivePremium}
                resolvedPlans={resolvedPlans}
                selectedPlan={selectedPlan}
                selectedPlanKey={selectedPlanKey}
                setSelectedPlanKey={setSelectedPlanKey}
                setStep={setStep}
                disableOverviewPurchaseButton={disableOverviewPurchaseButton}
                showPaymentResult={showPaymentResult}
                setShowPaymentResult={setShowPaymentResult}
                refetchHistory={refetchHistory}
            />
        );
    }

    if (step === "checkout") {
        return (
            <SubscriptionCheckout
                setStep={setStep}
                setAppliedCoupon={setAppliedCoupon}
                setCouponCode={setCouponCode}
                billingInfo={billingInfo}
                setBillingInfo={setBillingInfo}
                billingErrors={billingErrors}
                setBillingErrors={setBillingErrors}
                isFreeAccessCoupon={isFreeAccessCoupon}
                selectedPlan={selectedPlan}
                appliedCoupon={appliedCoupon}
                couponCode={couponCode}
                referralCode={referralCode}
                setReferralCode={setReferralCode}
                handleApplyCoupon={handleApplyCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
                getCouponBenefitLabel={getCouponBenefitLabel}
                discountAmount={getDiscountAmount()}
                finalAmount={getFinalAmount()}
                activateFreeCoupon={activateFreeCoupon}
                activatingFree={activatingFree}
                handlePurchase={handlePurchase}
                purchasePending={purchasePending}
                isRecruiter={isRecruiter}
                isLifetime={Boolean(isLifetime)}
                couponValidating={couponValidating}
            />
        );
    }

    if (step === "history") {
        return (
            <SubscriptionHistory
                setStep={setStep}
                showPaymentResult={showPaymentResult}
                setShowPaymentResult={setShowPaymentResult}
                historyLoading={historyLoading}
                subscriptions={subscriptions}
                getHistoryPlanLabel={getHistoryPlanLabel}
            />
        );
    }

    return null;
};

export default SubscriptionsContent;
