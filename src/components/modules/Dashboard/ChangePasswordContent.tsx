"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { httpClient } from "@/lib/axios/httpClient";
import { changePasswordZodSchema, IChangePasswordPayload } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordContent = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IChangePasswordPayload) =>
            httpClient.post("/auth/change-password", payload),
        onSuccess: () => {
            toast.success("Password changed successfully!");
            form.reset();
        },
        onError: (err: any) => {
            setServerError(err?.response?.data?.message || "Failed to change password");
        },
    });

    const form = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            await mutateAsync(value);
        },
    });

    return (
        <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-6">Change Password</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Update Your Password</CardTitle>
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
                            name="currentPassword"
                            validators={{ onChange: changePasswordZodSchema.shape.currentPassword }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Current Password"
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    append={
                                        <Button type="button" onClick={() => setShowCurrentPassword((v) => !v)} variant="ghost" size="icon">
                                            {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </Button>
                                    }
                                />
                            )}
                        </form.Field>

                        <form.Field
                            name="newPassword"
                            validators={{ onChange: changePasswordZodSchema.shape.newPassword }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="New Password"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    append={
                                        <Button type="button" onClick={() => setShowNewPassword((v) => !v)} variant="ghost" size="icon">
                                            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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

                        <AppSubmitButton isPending={isPending} pendingLabel="Changing...">
                            Change Password
                        </AppSubmitButton>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChangePasswordContent;
