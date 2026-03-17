"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { httpClient } from "@/lib/axios/httpClient";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface VerifyEmailFormProps {
    email: string;
}

const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => httpClient.post("/auth/verify-email", { email, otp }),
        onSuccess: () => {
            toast.success("Email verified successfully!");
            router.push("/dashboard");
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
                        disabled={otp.length !== 6}
                    >
                        Verify Email
                    </AppSubmitButton>
                </form>
            </CardContent>
        </Card>
    );
};

export default VerifyEmailForm;
