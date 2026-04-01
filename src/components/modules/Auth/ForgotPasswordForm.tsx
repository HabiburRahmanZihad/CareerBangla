"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { httpClient } from "@/lib/axios/httpClient";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { forgotPasswordZodSchema, IForgotPasswordPayload } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    KeyRound,
    LockKeyholeOpen,
    Mail,
    ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// ── Recovery steps shown on the left panel ────────────────────────────────────
const RECOVERY_STEPS = [
    {
        icon: <Mail className="h-4 w-4 text-white/70" />,
        title: "Enter your email",
        desc: "Provide your registered email address",
    },
    {
        icon: <KeyRound className="h-4 w-4 text-white/70" />,
        title: "Receive a one-time code",
        desc: "We'll send a secure OTP to your inbox",
    },
    {
        icon: <LockKeyholeOpen className="h-4 w-4 text-white/70" />,
        title: "Create a new password",
        desc: "Set a strong password and regain access",
    },
];

// ── Component ─────────────────────────────────────────────────────────────────
const ForgotPasswordForm = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IForgotPasswordPayload) =>
            httpClient.post("/auth/forget-password", payload),
        onSuccess: (_, variables) => {
            toast.success("OTP sent to your email!");
            router.push(`/reset-password?email=${encodeURIComponent(variables.email)}&phone=${encodeURIComponent(variables.phone)}`);
        },
        onError: (err: any) => {
            setServerError(getRequestErrorMessage(err, "Failed to send OTP"));
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
                    {/* Shield icon */}
                    <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-xl">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                            Locked out?<br />
                            <span className="text-white/70">We&apos;ve got</span>{" "}
                            <span className="relative inline-block">
                                you covered
                                <svg className="absolute -bottom-1 left-0 w-full" height="5" viewBox="0 0 250 5" fill="none" preserveAspectRatio="none">
                                    <path d="M0 3.5 Q62 0 125 3.5 Q187 7 250 3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />
                                </svg>
                            </span>.
                        </h1>
                        <p className="text-white/65 text-base leading-relaxed max-w-sm">
                            Reset your password in three simple steps. Your account will be secure and ready to use again in minutes.
                        </p>
                    </div>

                    {/* Recovery steps */}
                    <div className="space-y-4">
                        {RECOVERY_STEPS.map((step, i) => (
                            <div key={step.title} className="flex items-start gap-4">
                                {/* Step number + connector */}
                                <div className="flex flex-col items-center shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">{i + 1}</span>
                                    </div>
                                    {i < RECOVERY_STEPS.length - 1 && (
                                        <div className="w-px h-6 bg-white/20 mt-1" />
                                    )}
                                </div>
                                <div className="pb-4">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        {step.icon}
                                        <p className="text-sm font-semibold text-white">{step.title}</p>
                                    </div>
                                    <p className="text-xs text-white/55">{step.desc}</p>
                                </div>
                            </div>
                        ))}
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

                    {/* Card */}
                    <div className="backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">

                        {/* Card header */}
                        <div className="px-8 pt-8 pb-6 border-b border-border/40">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <KeyRound className="h-4 w-4 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Forgot password?</h2>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Enter your email and phone number — we&apos;ll send you a one-time code to reset your password.
                            </p>

                            {/* Step indicator */}
                            <div className="flex items-center gap-2 mt-5">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-8 rounded-full bg-primary" />
                                    <div className="h-2 w-4 rounded-full bg-muted" />
                                    <div className="h-2 w-4 rounded-full bg-muted" />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">Step 1 of 3</span>
                            </div>
                        </div>

                        {/* Card body */}
                        <div className="px-8 py-6 space-y-5">
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
                                className="space-y-4"
                            >
                                <form.Field
                                    name="email"
                                    validators={{ onChange: forgotPasswordZodSchema.shape.email }}
                                >
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Email Address"
                                            type="email"
                                            placeholder="you@example.com"
                                        />
                                    )}
                                </form.Field>

                                <form.Field
                                    name="phone"
                                    validators={{ onChange: forgotPasswordZodSchema.shape.phone }}
                                >
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Phone Number"
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                        />
                                    )}
                                </form.Field>

                                <div className="pt-1">
                                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                                        {([canSubmit, isSubmitting]) => (
                                            <AppSubmitButton
                                                isPending={isSubmitting || isPending}
                                                pendingLabel="Sending OTP…"
                                                disabled={!canSubmit}
                                                className="w-full gap-2"
                                            >
                                                Send Reset Code <ArrowRight className="h-4 w-4" />
                                            </AppSubmitButton>
                                        )}
                                    </form.Subscribe>
                                </div>
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
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="hover:text-primary transition-colors font-medium">
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
