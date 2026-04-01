"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginAction } from "@/app/(authLayout)/login/_action";
import { verifyEmailAction } from "@/app/(authLayout)/verify-email/_action";
import CareerBanglaLogo from "@/components/shared/CareerBanglaLogo";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { httpClient } from "@/lib/axios/httpClient";
import { useMutation } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Mail,
    RotateCcw,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface VerifyEmailFormProps {
    email: string;
}

interface VerificationStep {
    label: string;
    done?: boolean;
    active?: boolean;
}

const maskEmail = (value: string) => {
    const [user, domain] = value.split("@");
    if (!domain || user.length <= 2) return value;
    return `${user[0]}${"*".repeat(Math.min(user.length - 2, 4))}${user[user.length - 1]}@${domain}`;
};

const VERIFICATION_STEPS: VerificationStep[] = [
    { label: "Create your account", done: true },
    { label: "Verify your email", active: true },
    { label: "Access your dashboard" },
];

const TRUST_POINTS = [
    "6-digit OTP for secure account activation",
    "Resend flow built in if the first email is delayed",
    "Automatic sign-in after successful verification",
] as const;

const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);

    const otpComplete = otp.length === 6;
    const maskedEmail = useMemo(() => (email ? maskEmail(email) : ""), [email]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    const { mutateAsync: resendOtp, isPending: isResending } = useMutation({
        mutationFn: () => httpClient.post("/auth/resend-verify-email", { email }),
        onSuccess: () => {
            toast.success("Verification code resent successfully.");
            setTimeLeft(60);
            setError(null);
        },
        onError: (err: any) => {
            toast.error(getRequestErrorMessage(err, "Failed to resend OTP"));
        },
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => verifyEmailAction(email, otp),
        onSuccess: async (result) => {
            if (!result.success) {
                setError(result.message);
                return;
            }

            setError(null);
            toast.success("Email verified successfully.");

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

            window.location.href = "/login";
        },
        onError: (err: any) => {
            setError(getRequestErrorMessage(err, "Verification failed"));
        },
    });

    return (
        <div className="min-h-screen flex bg-background">
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12 bg-linear-to-br from-primary via-primary/90 to-primary/70">
                <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />

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

                <div className="relative z-10 space-y-10">
                    <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-xl">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5 text-white/80" />
                            <span className="text-xs font-semibold text-white/90">Secure account activation</span>
                        </div>

                        <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                            Confirm your email.<br />
                            <span className="text-white/70">Your account is almost</span>{" "}
                            <span className="relative inline-block">
                                ready
                                <svg className="absolute -bottom-1 left-0 w-full" height="5" viewBox="0 0 120 5" fill="none" preserveAspectRatio="none">
                                    <path d="M0 3.5 Q30 0 60 3.5 Q90 7 120 3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />
                                </svg>
                            </span>.
                        </h1>

                        <p className="text-white/65 text-base leading-relaxed max-w-sm">
                            Enter the 6-digit verification code we sent to your inbox to activate your CareerBangla account and continue into the platform.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {VERIFICATION_STEPS.map((step, index) => (
                            <div key={step.label} className="flex items-start gap-4">
                                <div className="flex flex-col items-center shrink-0">
                                    <div
                                        className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all ${step.done
                                            ? "bg-white/30 border-white/50"
                                            : step.active
                                                ? "bg-white/20 border-white/40 ring-2 ring-white/30 ring-offset-1 ring-offset-transparent"
                                                : "bg-white/10 border-white/20"
                                            }`}
                                    >
                                        {step.done ? (
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                        ) : (
                                            <span className="text-xs font-bold text-white">{index + 1}</span>
                                        )}
                                    </div>
                                    {index < VERIFICATION_STEPS.length - 1 && <div className="w-px h-6 bg-white/20 mt-1" />}
                                </div>
                                <div className="pb-4 pt-1">
                                    <p className={`text-sm font-semibold ${step.done || step.active ? "text-white" : "text-white/40"}`}>
                                        {step.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {TRUST_POINTS.map((point) => (
                            <div key={point} className="flex items-center gap-3">
                                <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-sm text-white/80">{point}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                        <Mail className="h-4 w-4 text-white/70 shrink-0 mt-0.5" />
                        <p className="text-xs text-white/65 leading-relaxed">
                            Check spam or promotions if the email does not appear immediately. CareerBangla will never ask you to share this OTP with anyone.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} CareerBangla · Built for Bangladesh
                    </p>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 relative">
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background" />
                <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

                <div className="relative z-10 w-full max-w-105">
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <CareerBanglaLogo size="md" withText={true} href="/" isLink={true} />
                    </div>

                    <div className="backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
                        <div className="px-8 pt-8 pb-6 border-b border-border/40">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Verify your email</h2>
                            </div>

                            <p className="text-sm text-muted-foreground mt-2">
                                Confirm your account with the one-time code sent during registration.
                            </p>

                            {email ? (
                                <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2">
                                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <span className="text-xs font-medium text-primary break-all">{maskedEmail}</span>
                                </div>
                            ) : (
                                <Alert className="mt-4 border-amber-300/60 bg-amber-50/80 dark:bg-amber-950/20">
                                    <AlertDescription className="text-xs text-amber-700 dark:text-amber-300">
                                        Email address missing. Return to registration and request a new verification email.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex items-center gap-2 mt-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-4 rounded-full bg-primary/40" />
                                    <div className="h-2 w-8 rounded-full bg-primary" />
                                    <div className="h-2 w-4 rounded-full bg-muted" />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">Step 2 of 3</span>
                            </div>
                        </div>

                        <div className="px-8 py-6 space-y-6">
                            {error && (
                                <Alert variant="destructive" className="border-destructive/40 bg-destructive/5">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">{error}</AlertDescription>
                                </Alert>
                            )}

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!email) {
                                        setError("Email address is required for verification.");
                                        return;
                                    }
                                    if (otpComplete) {
                                        setError(null);
                                        void mutateAsync();
                                    }
                                }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <Label className="text-sm font-semibold">Verification Code</Label>
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
                                                    onClick={() => {
                                                        void resendOtp();
                                                    }}
                                                    disabled={isResending || !email}
                                                    className="flex items-center gap-1 text-primary font-semibold hover:underline underline-offset-4 disabled:opacity-50"
                                                >
                                                    <RotateCcw className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`} />
                                                    {isResending ? "Sending…" : "Resend code"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Enter the 6-digit OTP we sent to {email ? "your inbox" : "your email address"}.
                                    </p>

                                    <div className="flex justify-center py-2">
                                        <InputOTP
                                            maxLength={6}
                                            value={otp}
                                            onChange={(value) => {
                                                setOtp(value);
                                                if (error) setError(null);
                                            }}
                                        >
                                            <InputOTPGroup className="gap-2">
                                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                                    <InputOTPSlot
                                                        key={index}
                                                        index={index}
                                                        className="h-12 w-11 rounded-xl border-2 text-lg font-bold transition-all data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20"
                                                    />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>

                                    {otpComplete && (
                                        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Code entered successfully
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Verification keeps your account protected</p>
                                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                                We use this step to confirm ownership of the email before unlocking your dashboard, applications, and profile setup.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <AppSubmitButton
                                    isPending={isPending}
                                    pendingLabel="Verifying…"
                                    disabled={!otpComplete || !email}
                                    className="w-full gap-2"
                                >
                                    Verify Email <ArrowRight className="h-4 w-4" />
                                </AppSubmitButton>
                            </form>
                        </div>

                        <div className="px-8 py-5 bg-muted/30 border-t border-border/40 flex items-center justify-center gap-1.5">
                            <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
                            <Link
                                href="/register"
                                className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
                            >
                                Back to registration
                            </Link>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-muted-foreground/60">
                        Already verified?{" "}
                        <Link href="/login" className="hover:text-primary transition-colors font-medium">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailForm;
