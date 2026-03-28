"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { recruiterRegisterAction } from "@/app/(authLayout)/register/recruiter/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IRecruiterRegisterPayload, recruiterRegisterZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const RecruiterRegisterForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IRecruiterRegisterPayload) => recruiterRegisterAction(payload),
    });

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            companyName: "",
            industry: "",
            contactNumber: "",
            designation: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = (await mutateAsync(value)) as any;
                if (result.success) {
                    setSuccess(true);
                } else {
                    setServerError(result.message || "Registration failed");
                }
            } catch (error: any) {
                setServerError(`Registration failed: ${error.message}`);
            }
        },
    });

    if (success) {
        return (
            <Card className="w-full max-w-md mx-auto shadow-md">
                <CardContent className="pt-8 pb-8 text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h2 className="text-xl font-bold">Registration Successful!</h2>
                    <p className="text-muted-foreground">
                        Your recruiter account has been created and is pending admin approval. You will be able to log in once your account is approved.
                    </p>
                    <Link href="/login">
                        <Button className="mt-4">Go to Login</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Register as Recruiter</CardTitle>
                <CardDescription>
                    Create a recruiter account to post jobs and find talent.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    method="POST"
                    action="#"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field
                        name="name"
                        validators={{ onChange: recruiterRegisterZodSchema.shape.name }}
                    >
                        {(field) => (
                            <AppField field={field} label="Full Name" type="text" placeholder="Enter your full name" />
                        )}
                    </form.Field>

                    <form.Field
                        name="email"
                        validators={{ onChange: recruiterRegisterZodSchema.shape.email }}
                    >
                        {(field) => (
                            <AppField field={field} label="Email" type="email" placeholder="Enter your email" />
                        )}
                    </form.Field>

                    <form.Field
                        name="password"
                        validators={{ onChange: recruiterRegisterZodSchema.shape.password }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                append={
                                    <Button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        variant="ghost"
                                        size="icon"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" aria-hidden="true" />
                                        ) : (
                                            <Eye className="size-4" aria-hidden="true" />
                                        )}
                                    </Button>
                                }
                            />
                        )}
                    </form.Field>

                    <form.Field
                        name="companyName"
                        validators={{ onChange: recruiterRegisterZodSchema.shape.companyName }}
                    >
                        {(field) => (
                            <AppField field={field} label="Company Name" type="text" placeholder="Enter your company name" />
                        )}
                    </form.Field>

                    <form.Field
                        name="industry"
                        validators={{ onChange: recruiterRegisterZodSchema.shape.industry }}
                    >
                        {(field) => (
                            <AppField field={field} label="Industry" type="text" placeholder="e.g., Technology, Finance" />
                        )}
                    </form.Field>

                    <form.Field name="contactNumber">
                        {(field) => (
                            <AppField field={field} label="Contact Number (Optional)" type="tel" placeholder="01XXXXXXXXX" />
                        )}
                    </form.Field>

                    <form.Field name="designation">
                        {(field) => (
                            <AppField field={field} label="Designation (Optional)" type="text" placeholder="e.g. HR Manager" />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton
                                isPending={isSubmitting || isPending}
                                pendingLabel="Creating Account..."
                                disabled={!canSubmit}
                            >
                                Register as Recruiter
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>

            <CardFooter className="justify-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Looking for a job instead?{" "}
                    <Link href="/register" className="text-primary font-medium hover:underline underline-offset-4">
                        Register as Job Seeker
                    </Link>
                    {" "}&middot;{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">
                        Log In
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
};

export default RecruiterRegisterForm;
