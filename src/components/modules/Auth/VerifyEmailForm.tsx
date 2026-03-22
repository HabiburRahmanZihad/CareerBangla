"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { httpClient } from "@/lib/axios/httpClient";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface VerifyEmailFormProps {
    email: string;
}

const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    const { mutateAsync: resendOtp, isPending: isResending } = useMutation({
        mutationFn: () => httpClient.post("/auth/resend-verify-email", { email }),
        onSuccess: () => {
            toast.success("OTP resent successfully!");
            setTimeLeft(60);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to resend OTP");
        },
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => httpClient.post("/auth/verify-email", { email, otp }),
        onSuccess: async () => {
            toast.success("Email verified successfully!");

            // Auto-login using stored credentials from registration
            const stored = sessionStorage.getItem("pendingVerification");
            if (stored) {
                try {
                    const { email: storedEmail, password } = JSON.parse(stored);
                    const loginResult = await loginAction({ identifier: storedEmail, password }) as any;
                    sessionStorage.removeItem("pendingVerification");

                    if (loginResult.success) {
                        const targetPath = loginResult.redirectPath || "/dashboard";
                        router.push(targetPath);
                        router.refresh();
                        return;
                    }
                } catch {
                    sessionStorage.removeItem("pendingVerification");
                }
            }

            // Fallback: redirect to login if auto-login fails
            router.push("/login");
        },
        onError: (err: any) => {
            setError(err?.response?.data?.message || "Verification failed");
        },
    });

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                <CardDescription>
                    We sent a 6-digit OTP to <strong>{email}</strong>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (otp.length === 6) mutateAsync();
                    }}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <Label>Enter OTP</Label>
                        <div className="flex justify-center">
                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <AppSubmitButton
                        isPending={isPending}
                        pendingLabel="Verifying..."
                        disabled={otp.length !== 6 || isPending}
                    >
                        Verify Email
                    </AppSubmitButton>

                    <div className="text-center text-sm pt-2">
                        {timeLeft > 0 ? (
                            <span className="text-muted-foreground">Didn&apos;t receive code? Resend in {timeLeft}s</span>
                        ) : (
                            <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto font-normal"
                                onClick={() => resendOtp()}
                                disabled={isResending}
                            >
                                {isResending ? "Resending..." : "Send again"}
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default VerifyEmailForm;
