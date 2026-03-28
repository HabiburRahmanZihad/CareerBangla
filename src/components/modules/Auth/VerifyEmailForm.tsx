"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginAction } from "@/app/(authLayout)/login/_action";
import { verifyEmailAction } from "@/app/(authLayout)/verify-email/_action";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { httpClient } from "@/lib/axios/httpClient";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface VerifyEmailFormProps {
    email: string;
}

const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
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
        mutationFn: () => verifyEmailAction(email, otp),
        onSuccess: async (result) => {
            if (!result.success) {
                setError(result.message);
                return;
            }

            toast.success("Email verified successfully!");

            // Auto-login to get a full session (including session token)
            // The verify-email endpoint may not return a session token
            const stored = sessionStorage.getItem("pendingVerification");
            if (stored) {
                try {
                    const { email: storedEmail, password } = JSON.parse(stored);
                    const loginResult = await loginAction({ identifier: storedEmail, password }) as any;
                    sessionStorage.removeItem("pendingVerification");

                    if (loginResult.success) {
                        const targetPath = loginResult.redirectPath || "/dashboard";
                        window.location.href = targetPath;
                        return;
                    }
                } catch {
                    sessionStorage.removeItem("pendingVerification");
                }
            }

            // Fallback: redirect to login page if auto-login fails
            window.location.href = "/login";
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
                    Your OTP has been sent to your email. Please check your inbox.
                </CardDescription>
                <p className="text-sm text-muted-foreground mt-1">
                    OTP sent to <strong>{email}</strong>
                </p>
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
