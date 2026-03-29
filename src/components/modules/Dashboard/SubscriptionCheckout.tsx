import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICheckoutCustomerInfo, ISubscriptionPlanResponse, IValidatedCoupon } from "@/services/subscription.services";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CreditCard, Loader2, Shield, Sparkles, Tag, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface SubscriptionCheckoutProps {
    setStep: (step: "overview" | "checkout" | "history") => void;
    setAppliedCoupon: (val: IValidatedCoupon | null) => void;
    setCouponCode: (val: string) => void;
    billingInfo: ICheckoutCustomerInfo;
    setBillingInfo: Dispatch<SetStateAction<ICheckoutCustomerInfo>>;
    billingErrors: Partial<ICheckoutCustomerInfo>;
    setBillingErrors: Dispatch<SetStateAction<Partial<ICheckoutCustomerInfo>>>;
    isFreeAccessCoupon: boolean;
    selectedPlan: ISubscriptionPlanResponse;
    appliedCoupon: IValidatedCoupon | null;
    couponCode: string;
    referralCode: string;
    setReferralCode: (val: string) => void;
    handleApplyCoupon: () => void;
    handleRemoveCoupon: () => void;
    getCouponBenefitLabel: (coupon: IValidatedCoupon) => string;
    discountAmount: number;
    finalAmount: number;
    activateFreeCoupon: (code: string) => void;
    activatingFree: boolean;
    handlePurchase: () => void;
    purchasePending: boolean;
    isRecruiter: boolean;
    isLifetime: boolean;
    couponValidating: boolean;
}

export const SubscriptionCheckout = ({
    setStep,
    setAppliedCoupon,
    setCouponCode,
    billingInfo,
    setBillingInfo,
    billingErrors,
    setBillingErrors,
    isFreeAccessCoupon,
    selectedPlan,
    appliedCoupon,
    couponCode,
    referralCode,
    setReferralCode,
    handleApplyCoupon,
    handleRemoveCoupon,
    getCouponBenefitLabel,
    discountAmount,
    finalAmount,
    activateFreeCoupon,
    activatingFree,
    handlePurchase,
    purchasePending,
    isRecruiter,
    isLifetime,
    couponValidating,
}: SubscriptionCheckoutProps) => {
    // ── Step 2: Checkout ──



    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 relative">
            {/* Background decorative blobs */}
            <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-100 h-100 bg-primary/5 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-4 pb-6 border-b border-border/50">
                <div className="space-y-4">
                    <Button variant="ghost" className="mb-2 -ml-3 hover:bg-primary/10 rounded-xl" onClick={() => { setStep("overview"); setAppliedCoupon(null); setCouponCode(""); }}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Plans
                    </Button>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground/90 pb-1">
                        Complete Purchase
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                        Review your selected plan and securely process your payment.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10">
                {/* Left: Billing Info */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    <Card className="border-border/50 shadow-lg rounded-2xl bg-background/50 backdrop-blur-xl overflow-hidden">
                        <div className="h-1.5 w-full bg-linear-to-r from-primary to-blue-500"></div>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-primary" /> Billing Information
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Please provide your valid details for the invoice.</p>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-foreground/80 font-semibold">Full Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        placeholder="Your full name"
                                        value={billingInfo.name}
                                        onChange={(e) => { setBillingInfo(p => ({ ...p, name: e.target.value })); setBillingErrors(p => ({ ...p, name: undefined })); }}
                                        className={`h-12 rounded-xl bg-background/50 focus-visible:ring-primary/50 ${billingErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                    {billingErrors.name && <p className="text-xs text-destructive font-medium">{billingErrors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-foreground/80 font-semibold">Phone Number <span className="text-destructive">*</span></Label>
                                    <Input
                                        placeholder="01XXXXXXXXX"
                                        value={billingInfo.phone}
                                        onChange={(e) => { setBillingInfo(p => ({ ...p, phone: e.target.value })); setBillingErrors(p => ({ ...p, phone: undefined })); }}
                                        className={`h-12 rounded-xl bg-background/50 focus-visible:ring-primary/50 ${billingErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                    {billingErrors.phone && <p className="text-xs text-destructive font-medium">{billingErrors.phone}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground/80 font-semibold">Address <span className="text-destructive">*</span></Label>
                                <Input
                                    placeholder="House/Flat, Road, Area"
                                    value={billingInfo.address}
                                    onChange={(e) => { setBillingInfo(p => ({ ...p, address: e.target.value })); setBillingErrors(p => ({ ...p, address: undefined })); }}
                                    className={`h-12 rounded-xl bg-background/50 focus-visible:ring-primary/50 ${billingErrors.address ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                />
                                {billingErrors.address && <p className="text-xs text-destructive font-medium">{billingErrors.address}</p>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-foreground/80 font-semibold">City <span className="text-destructive">*</span></Label>
                                    <Input
                                        placeholder="e.g. Dhaka"
                                        value={billingInfo.city}
                                        onChange={(e) => { setBillingInfo(p => ({ ...p, city: e.target.value })); setBillingErrors(p => ({ ...p, city: undefined })); }}
                                        className={`h-12 rounded-xl bg-background/50 focus-visible:ring-primary/50 ${billingErrors.city ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                    {billingErrors.city && <p className="text-xs text-destructive font-medium">{billingErrors.city}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-foreground/80 font-semibold">Postcode <span className="text-destructive">*</span></Label>
                                    <Input
                                        placeholder="e.g. 1207"
                                        value={billingInfo.postcode}
                                        onChange={(e) => { setBillingInfo(p => ({ ...p, postcode: e.target.value })); setBillingErrors(p => ({ ...p, postcode: undefined })); }}
                                        className={`h-12 rounded-xl bg-background/50 focus-visible:ring-primary/50 ${billingErrors.postcode ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                    {billingErrors.postcode && <p className="text-xs text-destructive font-medium">{billingErrors.postcode}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    {!isFreeAccessCoupon && (
                        <Card className="border-border/50 shadow-lg rounded-2xl bg-background/50 backdrop-blur-xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-emerald-500" /> Secure Payment
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border border-primary/20 rounded-xl bg-primary/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border">
                                            <span className="font-black text-xs text-blue-600">SSL</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">SSLCommerz Gateway</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">Cards, bKash, Nagad, Rocket</p>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right: Order Summary Sidebar */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
                    <Card className="border border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl overflow-hidden bg-background/80 backdrop-blur-xl">
                        <div className="bg-primary/5 px-6 py-6 border-b border-border/50">
                            <h3 className="font-bold text-lg mb-1">Order Summary</h3>
                            <p className="text-sm text-muted-foreground">{selectedPlan.name.replace("6 Months", "3 Months")}</p>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            {/* Selected Plan features preview */}
                            <div className="space-y-3 pb-4 border-b border-border/50">
                                {selectedPlan.features.slice(0, 3).map((f, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="text-sm text-muted-foreground">{f}</span>
                                    </div>
                                ))}
                                {selectedPlan.features.length > 3 && (
                                    <div className="text-xs font-semibold text-primary pl-6">
                                        + {selectedPlan.features.length - 3} more premium features
                                    </div>
                                )}
                            </div>

                            {/* Coupon */}
                            <div className="space-y-3 pb-4 border-b border-border/50">
                                <Label className="text-sm font-semibold">Apply Coupon or Referral</Label>
                                {appliedCoupon ? (
                                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800/50 rounded-xl">
                                        <Tag className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex-1 truncate">
                                            <span className="font-bold">{appliedCoupon.code}</span>
                                            <span className="opacity-75"> - {getCouponBenefitLabel(appliedCoupon)}</span>
                                        </span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50 rounded-full" onClick={handleRemoveCoupon}>
                                            <X className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                                            className="h-10 rounded-lg bg-background/50 focus-visible:ring-primary/50 uppercase"
                                        />
                                        <Button variant="secondary" onClick={handleApplyCoupon} disabled={couponValidating || !couponCode.trim()} className="h-10 rounded-lg whitespace-nowrap">
                                            {couponValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                        </Button>
                                    </div>
                                )}
                                <div className="space-y-2 mt-2">
                                    <Input
                                        placeholder="Referral Code (Optional)"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value)}
                                        className="h-10 rounded-lg bg-background/50 focus-visible:ring-primary/50"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">If referred by a friend, enter it here.</p>
                                </div>
                            </div>

                            {/* Price breakdown */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Original Price</span>
                                    <span className={isFreeAccessCoupon ? "line-through text-muted-foreground" : "font-medium"}>
                                        &#2547;{selectedPlan.amount.toLocaleString()}
                                    </span>
                                </div>

                                {appliedCoupon && discountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                        <span>Discount</span>
                                        <span>
                                            {isFreeAccessCoupon ? "−৳" + selectedPlan.amount.toLocaleString() : `−৳${discountAmount.toLocaleString()}`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <div className={`p-6 pt-0 mt-auto ${isFreeAccessCoupon ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""}`}>
                            <div className="border-t border-border pt-4 mb-6 flex justify-between items-center">
                                <span className="font-bold">Total Payout</span>
                                {isFreeAccessCoupon ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-2xl flex items-center gap-2">
                                        FREE <Sparkles className="w-5 h-5" />
                                    </span>
                                ) : (
                                    <span className="text-primary font-black text-3xl">&#2547;{finalAmount.toLocaleString()}</span>
                                )}
                            </div>

                            {isFreeAccessCoupon ? (
                                <Button
                                    className="w-full h-14 text-lg font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 text-white"
                                    size="lg"
                                    onClick={() => appliedCoupon && activateFreeCoupon(appliedCoupon.code)}
                                    disabled={activatingFree}
                                >
                                    {activatingFree ? (
                                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Activating...</>
                                    ) : (
                                        <><Sparkles className="w-5 h-5 mr-2" /> Activate For Free</>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20 group/pay"
                                    size="lg"
                                    onClick={handlePurchase}
                                    disabled={purchasePending || (!isRecruiter && isLifetime)}
                                >
                                    {!isRecruiter && isLifetime ? (
                                        "Already Premium"
                                    ) : purchasePending ? (
                                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Redirecting to SSL...</>
                                    ) : (
                                        <>Proceed to Pay <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/pay:translate-x-1" /></>
                                    )}
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );

};
