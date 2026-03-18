"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { httpClient } from "@/lib/axios/httpClient";
import { resetPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ResetPasswordFormProps {
    email: string;
}

const ResetPasswordForm = ({ email }: ResetPasswordFormProps) => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    const { mutateAsync: resendOtp, isPending: isResending } = useMutation({
        mutationFn: () => httpClient.post("/auth/forget-password", { email }),
        onSuccess: () => {
            toast.success("OTP resent successfully!");
            setTimeLeft(60);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to resend OTP");
        },
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: { email: string; otp: string; newPassword: string }) =>
            httpClient.post("/auth/reset-password", data),
        onSuccess: () => {
            toast.success("Password reset successfully!");
            router.push("/login");
        },
        onError: (err: any) => {
            setServerError(err?.response?.data?.message || "Failed to reset password");
        },
    });

    const form = useForm({
        defaultValues: { newPassword: "" },
        onSubmit: async ({ value }) => {
            setServerError(null);
            await mutateAsync({ email, otp, newPassword: value.newPassword });
        },
    });

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>
                    Enter the OTP sent to <strong>{email}</strong> and your new password.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
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

                    <form.Field
                        name="newPassword"
                        validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                append={
                                    <Button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        variant="ghost"
                                        size="icon"
                                    >
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </Button>
                                }
                            />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <AppSubmitButton
                        isPending={isPending}
                        pendingLabel="Resetting..."
                        disabled={otp.length !== 6 || isPending}
                    >
                        Reset Password
                    </AppSubmitButton>

                    <div className="text-center text-sm pt-2">
                        {timeLeft > 0 ? (
                            <span className="text-muted-foreground">Didn't receive code? Resend in {timeLeft}s</span>
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

            <CardFooter className="justify-center border-t pt-4">
                <Link href="/login" className="text-sm text-primary hover:underline">
                    Back to Login
                </Link>
            </CardFooter>
        </Card>
    );
};

export default ResetPasswordForm;
