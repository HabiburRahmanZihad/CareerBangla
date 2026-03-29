import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ISubscriptionPlanResponse } from "@/services/subscription.services";
import { format } from "date-fns";
import { CheckCircle2, CreditCard, Crown, Rocket, Shield, Sparkles, Star, Zap } from "lucide-react";
import { PaymentResultBanner } from "./PaymentResultBanner";

interface SubscriptionOverviewProps {
    plansLoading: boolean;
    isRecruiter: boolean;
    isLifetime: boolean;
    isPremium: boolean | undefined;
    premiumUntil: string | undefined | null;
    hasActivePremium: boolean;
    resolvedPlans: ISubscriptionPlanResponse[];
    selectedPlan: ISubscriptionPlanResponse;
    selectedPlanKey: string;
    setSelectedPlanKey: (key: string) => void;
    setStep: (step: "overview" | "checkout" | "history") => void;
    disableOverviewPurchaseButton: boolean;
    showPaymentResult: string | null;
    setShowPaymentResult: (val: string | null) => void;
    refetchHistory: () => void;
}

export const SubscriptionOverview = ({
    plansLoading,
    isRecruiter,
    isLifetime,
    isPremium,
    premiumUntil,
    hasActivePremium,
    resolvedPlans,
    selectedPlan,
    setSelectedPlanKey,
    setStep,
    disableOverviewPurchaseButton,
    showPaymentResult,
    setShowPaymentResult,
    refetchHistory
}: SubscriptionOverviewProps) => {
    // ── Step 1: Overview - Career Boost Plan ──

    if (plansLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto space-y-12 animate-pulse pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-4 pb-8 border-b border-border/50">
                    <div className="space-y-4 w-full">
                        <Skeleton className="h-8 w-40 rounded-full" />
                        <Skeleton className="h-12 md:h-16 w-3/4 max-w-lg rounded-2xl" />
                        <Skeleton className="h-6 w-full max-w-2xl rounded-xl" />
                    </div>
                    <Skeleton className="h-12 w-48 shrink-0 rounded-xl" />
                </div>

                {isRecruiter ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-6 z-10 relative">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-115 w-full rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="w-full max-w-5xl mx-auto pt-4 relative z-10">
                        <Skeleton className="h-100 w-full rounded-[2rem]" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center pb-20">

            <div className="w-full max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-4 pb-8 border-b border-border/50">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide uppercase">
                            {isRecruiter ? <Crown className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
                            {isRecruiter ? "Premium for Employers" : "Level Up Your Career"}
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="lg"
                        className="shrink-0 bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-primary/20 transition-all font-semibold border-primary/20 gap-2 h-12 rounded-xl"
                        onClick={() => { setStep("history"); refetchHistory(); }}
                    >
                        <CreditCard className="w-5 h-5 text-primary" /> My Purchases
                    </Button>
                </div>

                <PaymentResultBanner showPaymentResult={showPaymentResult} setShowPaymentResult={setShowPaymentResult} />

                {/* Notification Banners */}
                <div className="space-y-4 max-w-3xl mx-auto">
                    {!isRecruiter && isLifetime && (
                        <div className="group relative overflow-hidden bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/20 rounded-2xl p-6 shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="w-24 h-24 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-2">
                                <Shield className="w-6 h-6" /> Lifetime Career Boost Verified!
                            </h3>
                            <p className="text-muted-foreground relative z-10">
                                You already hold lifetime access to all Career Boost features. Keep crushing those interviews!
                            </p>
                        </div>
                    )}
                    {!isRecruiter && isPremium && premiumUntil && (
                        <div className="bg-linear-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-2 mb-2">
                                <Zap className="w-6 h-6" /> Career Boost Active
                            </h3>
                            <p className="text-muted-foreground">
                                Your reward access is valid until <strong className="text-foreground">{format(new Date(premiumUntil), "PPP")}</strong>. Upgrade to lifetime for permanent access!
                            </p>
                        </div>
                    )}
                    {isRecruiter && hasActivePremium && (
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-2">
                                <Crown className="w-6 h-6" /> Recruiter Premium Active
                            </h3>
                            <p className="text-muted-foreground">
                                You have an active premium plan. Buying another extends your subscription duration automatically.
                            </p>
                        </div>
                    )}
                </div>

                {isRecruiter ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-6 z-10 relative">
                        {resolvedPlans.map((plan) => {
                            const isSelected = selectedPlan.planKey === plan.planKey;

                            return (
                                <div key={plan.planKey} className={`relative group rounded-3xl overflow-hidden transition-all duration-300 ${isSelected ? 'scale-105 shadow-2xl shadow-primary/20 border-primary' : 'bg-background/40 hover:bg-background/60 backdrop-blur-xl border border-border shadow-lg hover:shadow-xl hover:-translate-y-2'}`}>
                                    {/* Highlight Gradient for Selected */}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent pointer-events-none"></div>
                                    )}
                                    {/* Colored top border */}
                                    <div className={`absolute top-0 left-0 w-full h-1.5 ${isSelected ? 'bg-primary' : 'bg-muted-foreground/20'}`}></div>

                                    {isSelected && (
                                        <div className="absolute top-4 right-4 animate-bounce">
                                            <Badge className="bg-primary/20 text-primary border-none shadow-none"><Star className="w-3.5 h-3.5 mr-1 fill-primary" /> Popular</Badge>
                                        </div>
                                    )}

                                    <div className="p-8 pb-0">
                                        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name.replace("6 Months", "3 Months")}</h3>
                                        <p className="text-sm text-muted-foreground min-h-10 leading-relaxed">{plan.description.replace("6 months", "3 months")}</p>
                                    </div>

                                    <div className="p-8 space-y-8 flex flex-col justify-between h-[calc(100%-120px)]">
                                        <div>
                                            <div className="mb-6 flex items-baseline">
                                                <span className="text-4xl font-extrabold">&#2547;{plan.amount}</span>
                                                <span className="text-muted-foreground ml-2 text-sm font-medium">/plan</span>
                                            </div>

                                            <div className="space-y-4">
                                                {plan.features.map((feature, i) => (
                                                    <div key={i} className="flex items-start gap-3">
                                                        <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'} shrink-0 mt-0.5`} />
                                                        <span className="text-sm font-medium text-foreground/80">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Button
                                            className={`w-full h-12 text-md font-semibold transition-all rounded-xl ${isSelected ? 'shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5' : ''}`}
                                            variant={isSelected ? "default" : "outline"}
                                            onClick={() => {
                                                setSelectedPlanKey(plan.planKey);
                                                setStep("checkout");
                                            }}
                                        >
                                            {isSelected ? "Continue with Selected" : "Choose Plan"}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="w-full max-w-5xl mx-auto pt-4 relative z-10">

                        <div className="relative rounded-[2rem] overflow-hidden bg-background/80 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-2xl transition-all duration-500">
                            <div className="grid md:grid-cols-5 gap-0">
                                {/* Left Side: Details & Features */}
                                <div className="md:col-span-3 p-8 lg:p-12 relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
                                            <Rocket className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl lg:text-4xl font-black bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Career Boost</h2>
                                            <p className="text-muted-foreground flex items-center gap-2 mt-1 font-medium">
                                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 shadow-sm"><Zap className="w-3 h-3 mr-1 fill-primary" /> Lifetime Access</Badge>
                                                <span className="hidden sm:inline">&middot; One-time payment</span>
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                                        {selectedPlan.description}
                                    </p>

                                    <div className="space-y-5">
                                        <h3 className="font-semibold text-foreground/90 uppercase tracking-widest text-xs flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-emerald-500" />
                                            Everything included:
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {selectedPlan.features.map((feature, i) => (
                                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/80 transition-colors border border-transparent hover:border-border/50">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 shadow-sm">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-foreground/80 leading-tight pt-0.5">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Price & CTA */}
                                <div className="md:col-span-2 relative p-8 lg:p-12 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-900/80 dark:to-slate-950/90 border-t md:border-t-0 md:border-l border-border/50 flex flex-col justify-center items-center text-center overflow-hidden">
                                    <div className="z-10 w-full space-y-8">
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-background/50 border border-border">Yours Forever</span>
                                            <div className="flex items-baseline justify-center text-foreground mt-4 pb-2">
                                                <span className="text-3xl font-bold pr-1 text-primary">৳</span>
                                                <span className="text-7xl font-black tracking-tighter drop-shadow-md">{selectedPlan.amount}</span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1 relative overflow-hidden group/btn"
                                            onClick={() => setStep("checkout")}
                                            disabled={disableOverviewPurchaseButton}
                                        >
                                            <span className="relative flex items-center justify-center gap-2 w-full text-white">
                                                {disableOverviewPurchaseButton ? (
                                                    "Already Premium"
                                                ) : (
                                                    <>Unlock Career Boost <Rocket className="w-5 h-5 ml-1 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" /></>
                                                )}
                                            </span>
                                        </Button>

                                        <p className="text-xs font-medium text-muted-foreground text-center flex items-center justify-center gap-1">
                                            <Shield className="w-3 h-3" /> Secure checkout via SSLCommerz.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

};
