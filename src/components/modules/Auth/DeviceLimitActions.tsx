"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ILoginPayload } from "@/zod/auth.validation";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";

const DEVICE_LIMIT_LOGIN_CONTEXT_KEY = "device-limit-login-context";

interface DeviceLimitActionsProps {
    redirectPath?: string;
}

const DeviceLimitActions = ({ redirectPath }: DeviceLimitActionsProps) => {
    const [error, setError] = useState<string | null>(null);

    const cancelPath = useMemo(() => {
        return `/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`;
    }, [redirectPath]);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ payload, requestedRedirectPath }: { payload: ILoginPayload; requestedRedirectPath?: string }) =>
            loginAction(payload, requestedRedirectPath, true),
    });

    const handleCancel = () => {
        if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(DEVICE_LIMIT_LOGIN_CONTEXT_KEY);
            window.location.href = cancelPath;
        }
    };

    const handleLogoutAllAndLogin = async () => {
        setError(null);

        if (typeof window === "undefined") return;

        try {
            const storedContext = window.sessionStorage.getItem(DEVICE_LIMIT_LOGIN_CONTEXT_KEY);

            if (!storedContext) {
                setError("Login session data expired. Please login again.");
                window.location.href = cancelPath;
                return;
            }

            const parsed = JSON.parse(storedContext) as { payload?: ILoginPayload; redirectPath?: string };
            const payload = parsed.payload;

            if (!payload?.identifier || !payload?.password) {
                setError("Login session data is invalid. Please login again.");
                window.location.href = cancelPath;
                return;
            }

            const result = (await mutateAsync({ payload, requestedRedirectPath: parsed.redirectPath || redirectPath })) as any;

            if (!result.success) {
                setError(result.message || "Unable to continue login.");
                return;
            }

            window.sessionStorage.removeItem(DEVICE_LIMIT_LOGIN_CONTEXT_KEY);
            window.location.href = result.redirectPath || "/dashboard";
        } catch (err: any) {
            setError(err?.message || "Failed to logout all devices and login.");
        }
    };

    return (
        <>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleCancel} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="button" className="w-full sm:w-auto" onClick={handleLogoutAllAndLogin} disabled={isPending}>
                    {isPending ? "Processing..." : "Logout all devices & Login"}
                </Button>
            </div>
        </>
    );
};

export default DeviceLimitActions;
