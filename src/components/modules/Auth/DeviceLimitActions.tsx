"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { loginAction } from "@/app/(authLayout)/login/_action";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { ILoginPayload } from "@/zod/auth.validation";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, Loader2, LogOut } from "lucide-react";
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
            setError(getRequestErrorMessage(err, "Failed to logout all devices and login."));
        }
    };

    return (
        <div className="space-y-3">

            {/* Error state */}
            {error && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                    <div className="h-6 w-6 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-400 font-medium leading-relaxed">{error}</p>
                </div>
            )}

            {/* Primary action — Logout all & login */}
            <button
                type="button"
                onClick={handleLogoutAllAndLogin}
                disabled={isPending}
                className="w-full relative flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-linear-to-r from-primary to-primary/80 text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
            >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                {isPending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Logging out all devices…
                    </>
                ) : (
                    <>
                        <LogOut className="h-4 w-4" />
                        Logout All Devices &amp; Continue
                    </>
                )}
            </button>

            {/* Secondary action — Cancel */}
            <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-transparent hover:bg-muted/40 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
            </button>
        </div>
    );
};

export default DeviceLimitActions;
