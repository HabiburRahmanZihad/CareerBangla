"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { httpClient } from "@/lib/axios/httpClient";
import { forgotPasswordZodSchema, IForgotPasswordPayload } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ForgotPasswordForm = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IForgotPasswordPayload) =>
            httpClient.post("/auth/forget-password", payload),
        onSuccess: (_, variables) => {
            toast.success("OTP sent to your email!");
            router.push(`/reset-password?email=${variables.email}`);
        },
        onError: (err: any) => {
            setServerError(err?.response?.data?.message || "Failed to send OTP");
        },
    });

    const form = useForm({
        defaultValues: { email: "", phone: "" },
        onSubmit: async ({ value }) => {
            setServerError(null);
            await mutateAsync(value);
        },
    });

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email to receive a password reset OTP.
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
                    <form.Field
                        name="email"
                        validators={{ onChange: forgotPasswordZodSchema.shape.email }}
                    >
                        {(field) => (
                            <AppField field={field} label="Email" type="email" placeholder="Enter your email" />
                        )}
                    </form.Field>

                    <form.Field
                        name="phone"
                        validators={{ onChange: forgotPasswordZodSchema.shape.phone }}
                    >
                        {(field) => (
                            <AppField field={field} label="Phone Number" type="tel" placeholder="01XXXXXXXXX" />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <AppSubmitButton isPending={isPending} pendingLabel="Sending OTP...">
                        Send Reset OTP
                    </AppSubmitButton>
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

export default ForgotPasswordForm;
