import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, X, XCircle } from "lucide-react";

// ── Payment Result Banner ──
export const PaymentResultBanner = ({ showPaymentResult, setShowPaymentResult }: { showPaymentResult: string | null; setShowPaymentResult: (val: string | null) => void }) => {
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
