"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import CareerBanglaLogo from "@/components/shared/CareerBanglaLogo";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { httpClient } from "@/lib/axios/httpClient";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { resetPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyholeOpen,
    Mail,
    RotateCcw,
    ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ── Password strength ─────────────────────────────────────────────────────────
const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score, label: "Fair", color: "bg-amber-500" };
    if (score <= 3) return { score, label: "Good", color: "bg-yellow-500" };
    if (score <= 4) return { score, label: "Strong", color: "bg-emerald-500" };
    return { score, label: "Very strong", color: "bg-emerald-600" };
};

// ── Extract readable message from backend error (handles Zod JSON strings) ───
const extractErrorMessage = (err: any, fallback: string): string => {
    const raw = getRequestErrorMessage(err, fallback);
    if (!raw) return fallback;
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed[0]?.message) return parsed[0].message;
    } catch {
        // not JSON — use as-is
    }
    return raw;
};

// ── Mask email ────────────────────────────────────────────────────────────────
const maskEmail = (email: string) => {
    const [user, domain] = email.split("@");
    if (!domain || user.length <= 2) return email;
    return `${user[0]}${"*".repeat(Math.min(user.length - 2, 4))}${user[user.length - 1]}@${domain}`;
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface ResetPasswordFormProps {
    email: string;
    phone: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
const ResetPasswordForm = ({ email, phone }: ResetPasswordFormProps) => {
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

    const { mutate: resendOtp, isPending: isResending } = useMutation({
        mutationFn: () => httpClient.post("/auth/forget-password", { email, phone }),
        onSuccess: () => {
            toast.success("OTP resent successfully!");
            setTimeLeft(60);
        },
        onError: (err: any) => {
            toast.error(extractErrorMessage(err, "Failed to resend OTP"));
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
            setServerError(extractErrorMessage(err, "Failed to reset password"));
        },
    });

    const form = useForm({
        defaultValues: { newPassword: "" },
        onSubmit: async ({ value }) => {
            setServerError(null);
            await mutateAsync({ email, otp, newPassword: value.newPassword });
        },
    });

    const otpComplete = otp.length === 6;

    return (
        <div className="min-h-screen flex bg-background">

            {/* ── Left: Brand panel ─────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12 bg-linear-to-br from-primary via-primary/90 to-primary/70">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
                {/* Dot grid */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/">
                        <Image
                            src="/carrerBanglalogo.png"
                            alt="CareerBangla"
                            width={158}
                            height={48}
                            priority
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Center content */}
                <div className="relative z-10 space-y-10">
                    {/* Icon */}
                    <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-xl">
                        <LockKeyholeOpen className="h-8 w-8 text-white" />
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                            Almost there.<br />
                            <span className="text-white/70">You&apos;re one step</span>{" "}
                            <span className="relative inline-block">
                                away
                                <svg className="absolute -bottom-1 left-0 w-full" height="5" viewBox="0 0 80 5" fill="none" preserveAspectRatio="none">
                                    <path d="M0 3.5 Q20 0 40 3.5 Q60 7 80 3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />
                                </svg>
                            </span>.
                        </h1>
                        <p className="text-white/65 text-base leading-relaxed max-w-sm">
                            Enter the 6-digit code we sent to your email along with your new password to complete the reset.
                        </p>
                    </div>

                    {/* Progress steps */}
                    <div className="space-y-4">
                        {[
                            { label: "Requested reset code", done: true },
                            { label: "Verify code & set new password", done: false, active: true },
                            { label: "Sign in with new password", done: false },
                        ].map((step, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="flex flex-col items-center shrink-0">
                                    <div className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all ${step.done
                                        ? "bg-white/30 border-white/50"
                                        : step.active
                                            ? "bg-white/20 border-white/40 ring-2 ring-white/30 ring-offset-1 ring-offset-transparent"
                                            : "bg-white/10 border-white/20"
                                        }`}>
                                        {step.done
                                            ? <CheckCircle2 className="h-4 w-4 text-white" />
                                            : <span className="text-xs font-bold text-white">{i + 1}</span>
                                        }
                                    </div>
                                    {i < 2 && <div className="w-px h-6 bg-white/20 mt-1" />}
                                </div>
                                <div className="pb-4 pt-1">
                                    <p className={`text-sm font-semibold ${step.done || step.active ? "text-white" : "text-white/40"}`}>
                                        {step.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Security note */}
                    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                        <ShieldCheck className="h-4 w-4 text-white/70 shrink-0 mt-0.5" />
                        <p className="text-xs text-white/65 leading-relaxed">
                            Your OTP expires in 1 minutes. Never share it with anyone — CareerBangla will never ask for your OTP.
                        </p>
                    </div>
                </div>

                {/* Bottom */}
                <div className="relative z-10">
                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} CareerBangla · Built for Bangladesh
                    </p>
                </div>
            </div>

            {/* ── Right: Form panel ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 relative">
                {/* Subtle background */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background" />
                <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

                <div className="relative z-10 w-full max-w-105">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <CareerBanglaLogo size="md" withText={true} href="/" isLink={true} />
                    </div>

                    {/* Card */}
                    <div className="backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">

                        {/* Card header */}
                        <div className="px-8 pt-8 pb-6 border-b border-border/40">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <LockKeyholeOpen className="h-4 w-4 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Reset your password</h2>
                            </div>

                            {/* Email badge */}
                            {email && (
                                <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/15 w-fit">
                                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <span className="text-xs font-medium text-primary">{maskEmail(email)}</span>
                                </div>
                            )}

                            {/* Step indicator */}
                            <div className="flex items-center gap-2 mt-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-4 rounded-full bg-primary/40" />
                                    <div className="h-2 w-8 rounded-full bg-primary" />
                                    <div className="h-2 w-4 rounded-full bg-muted" />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">Step 2 of 3</span>
                            </div>
                        </div>

                        {/* Card body */}
                        <div className="px-8 py-6 space-y-6">
                            {/* Server error */}
                            {serverError && (
                                <Alert variant="destructive" className="border-destructive/40 bg-destructive/5">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">{serverError}</AlertDescription>
                                </Alert>
                            )}

                            <form
                                noValidate
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    form.handleSubmit();
                                }}
                                className="space-y-6"
                            >
                                {/* OTP section */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold">Verification Code</Label>
                                        {/* Resend */}
                                        <div className="text-xs">
                                            {timeLeft > 0 ? (
                                                <span className="text-muted-foreground">
                                                    Resend in{" "}
                                                    <span className="font-bold text-primary tabular-nums">
                                                        0:{String(timeLeft).padStart(2, "0")}
                                                    </span>
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => resendOtp(undefined)}
                                                    disabled={isResending}
                                                    className="flex items-center gap-1 text-primary font-semibold hover:underline underline-offset-4 disabled:opacity-50"
                                                >
                                                    <RotateCcw className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`} />
                                                    {isResending ? "Sending…" : "Resend code"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Enter the 6-digit code sent to your email.
                                    </p>

                                    {/* OTP slots */}
                                    <div className="flex justify-center py-2">
                                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                            <InputOTPGroup className="gap-2">
                                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                                    <InputOTPSlot
                                                        key={i}
                                                        index={i}
                                                        className="h-12 w-11 rounded-xl border-2 text-lg font-bold transition-all data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20"
                                                    />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>

                                    {/* OTP status */}
                                    {otpComplete && (
                                        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Code entered
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-border/50" />

                                {/* New password */}
                                <form.Field
                                    name="newPassword"
                                    validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}
                                >
                                    {(field) => {
                                        const pwd = field.state.value;
                                        const s = getPasswordStrength(pwd);
                                        return (
                                            <div className="space-y-3">
                                                <AppField
                                                    field={field}
                                                    label="New Password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Min. 8 characters"
                                                    append={
                                                        <Button
                                                            type="button"
                                                            onClick={() => setShowPassword((v) => !v)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                                        >
                                                            {showPassword
                                                                ? <EyeOff className="h-3.5 w-3.5" />
                                                                : <Eye className="h-3.5 w-3.5" />
                                                            }
                                                        </Button>
                                                    }
                                                />
                                                {/* Password strength meter */}
                                                {pwd.length > 0 && (
                                                    <div className="space-y-1.5">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((level) => (
                                                                <div
                                                                    key={level}
                                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${s.score >= level ? s.color : "bg-muted"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className={`text-xs font-medium ${s.score <= 1 ? "text-red-500"
                                                            : s.score <= 2 ? "text-amber-500"
                                                                : s.score <= 3 ? "text-yellow-600"
                                                                    : "text-emerald-600 dark:text-emerald-400"
                                                            }`}>
                                                            {s.label}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }}
                                </form.Field>

                                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                                    {([canSubmit, isSubmitting]) => (
                                        <AppSubmitButton
                                            isPending={isSubmitting || isPending}
                                            pendingLabel="Resetting…"
                                            disabled={!canSubmit || !otpComplete}
                                            className="w-full gap-2"
                                        >
                                            Reset Password <ArrowRight className="h-4 w-4" />
                                        </AppSubmitButton>
                                    )}
                                </form.Subscribe>
                            </form>
                        </div>

                        {/* Card footer */}
                        <div className="px-8 py-5 bg-muted/30 border-t border-border/40 flex items-center justify-center gap-1.5">
                            <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
                            <Link
                                href="/login"
                                className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Bottom note */}
                    <p className="mt-6 text-center text-xs text-muted-foreground/60">
                        Remembered your password?{" "}
                        <Link href="/login" className="hover:text-primary transition-colors font-medium">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
