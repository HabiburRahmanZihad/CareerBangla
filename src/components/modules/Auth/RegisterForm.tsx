"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerAction } from "@/app/(authLayout)/register/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import envConfig from "@/lib/envConfig";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowRight,
    Building2,
    CheckCircle2,
    Eye,
    EyeOff,
    Rocket,
    Sparkles,
    UserCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ── Password strength ─────────────────────────────────────────────────────────
const getPasswordStrength = (pwd: string) => {
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

// ── Google icon ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const SEEKER_PERKS = [
    "Access thousands of verified job listings",
    "Get discovered by top recruiters",
    "Track every application in one dashboard",
    "Free forever — no hidden fees",
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface RegisterFormProps {
    referralCode?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
const RegisterForm = ({ referralCode }: RegisterFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IRegisterPayload) => registerAction(payload),
    });

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            referralCode: referralCode || "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                sessionStorage.setItem(
                    "pendingVerification",
                    JSON.stringify({ email: value.email, password: value.password })
                );
                const result = (await mutateAsync(value)) as any;
                if (!result.success) {
                    sessionStorage.removeItem("pendingVerification");
                    setServerError(result.message || "Registration failed");
                }
            } catch (error: any) {
                sessionStorage.removeItem("pendingVerification");
                setServerError(getRequestErrorMessage(error, "Registration failed"));
            }
        },
    });

    return (
        <div className="min-h-screen flex bg-background">

            {/* ── Left: Brand panel ─────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12 bg-linear-to-br from-primary via-primary/90 to-primary/70">
                <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
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

                {/* Center */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
                            <Rocket className="h-3.5 w-3.5 text-white/80" />
                            <span className="text-xs font-semibold text-white/90">Join 10,000+ job seekers</span>
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                            Your career<br />
                            <span className="text-white/70">journey starts</span>{" "}
                            <span className="relative inline-block">
                                here
                                <svg className="absolute -bottom-1 left-0 w-full" height="5" viewBox="0 0 80 5" fill="none" preserveAspectRatio="none">
                                    <path d="M0 3.5 Q20 0 40 3.5 Q60 7 80 3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />
                                </svg>
                            </span>.
                        </h1>
                        <p className="text-white/65 text-base leading-relaxed max-w-sm">
                            Create a free account and get matched with jobs that fit your skills and aspirations.
                        </p>
                    </div>

                    {/* Perks */}
                    <ul className="space-y-3">
                        {SEEKER_PERKS.map((p) => (
                            <li key={p} className="flex items-center gap-3">
                                <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-sm text-white/80">{p}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Role switch prompt */}
                    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                        <Building2 className="h-4 w-4 text-white/70 shrink-0 mt-0.5" />
                        <p className="text-xs text-white/65 leading-relaxed">
                            Looking to hire?{" "}
                            <Link href="/register/recruiter" className="text-white font-semibold hover:underline underline-offset-2">
                                Register as a Recruiter →
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-xs text-white/40">© {new Date().getFullYear()} CareerBangla · Built for Bangladesh</p>
                </div>
            </div>

            {/* ── Right: Form panel ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 relative overflow-y-auto">
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

                    {/* Role toggle */}
                    <div className="flex rounded-xl border bg-muted/50 p-1 mb-6 gap-1">
                        <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-background shadow-sm border text-sm font-semibold text-primary">
                            <UserCheck className="h-4 w-4" /> Job Seeker
                        </div>
                        <Link href="/register/recruiter" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <Building2 className="h-4 w-4" /> Recruiter
                        </Link>
                    </div>

                    {/* Card */}
                    <div className="backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">

                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 border-b border-border/40">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Create your account</h2>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Free forever · No credit card required
                            </p>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-6 space-y-5">
                            {serverError && (
                                <Alert variant="destructive" className="border-destructive/40 bg-destructive/5">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">{serverError}</AlertDescription>
                                </Alert>
                            )}

                            <form
                                method="POST"
                                action="#"
                                noValidate
                                onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
                                className="space-y-4"
                            >
                                <form.Field name="name" validators={{ onChange: registerZodSchema.shape.name }}>
                                    {(field) => (
                                        <AppField field={field} label="Full Name" type="text" placeholder="Your full name" />
                                    )}
                                </form.Field>

                                <form.Field name="email" validators={{ onChange: registerZodSchema.shape.email }}>
                                    {(field) => (
                                        <AppField field={field} label="Email Address" type="email" placeholder="you@example.com" />
                                    )}
                                </form.Field>

                                <form.Field name="phone" validators={{ onChange: registerZodSchema.shape.phone }}>
                                    {(field) => (
                                        <AppField field={field} label="Phone Number" type="tel" placeholder="01XXXXXXXXX" />
                                    )}
                                </form.Field>

                                <form.Field name="password" validators={{ onChange: registerZodSchema.shape.password }}>
                                    {(field) => {
                                        const s = getPasswordStrength(field.state.value);
                                        return (
                                            <div className="space-y-2">
                                                <AppField
                                                    field={field}
                                                    label="Password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Min. 8 characters"
                                                    append={
                                                        <Button
                                                            type="button"
                                                            onClick={() => setShowPassword((v) => !v)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                        >
                                                            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                        </Button>
                                                    }
                                                />
                                                {field.state.value.length > 0 && (
                                                    <div className="space-y-1">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((l) => (
                                                                <div key={l} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s.score >= l ? s.color : "bg-muted"}`} />
                                                            ))}
                                                        </div>
                                                        <p className={`text-xs font-medium ${s.score <= 1 ? "text-red-500" : s.score <= 2 ? "text-amber-500" : s.score <= 3 ? "text-yellow-600" : "text-emerald-600"}`}>
                                                            {s.label}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }}
                                </form.Field>

                                <form.Field name="referralCode">
                                    {(field) => (
                                        <AppField field={field} label="Referral Code (Optional)" type="text" placeholder="Enter referral code" />
                                    )}
                                </form.Field>

                                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                                    {([canSubmit, isSubmitting]) => (
                                        <AppSubmitButton
                                            isPending={isSubmitting || isPending}
                                            pendingLabel="Creating account…"
                                            disabled={!canSubmit}
                                            className="w-full gap-2 mt-1"
                                        >
                                            Create Free Account <ArrowRight className="h-4 w-4" />
                                        </AppSubmitButton>
                                    )}
                                </form.Subscribe>
                            </form>

                            {/* Divider */}
                            <div className="relative flex items-center gap-3">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-xs text-muted-foreground font-medium">or</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>

                            {/* Google */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full gap-2.5 border-border/70 hover:border-primary/40 hover:bg-primary/5 transition-all"
                                onClick={() => {
                                    const currentRef = form.getFieldValue("referralCode");
                                    const url = currentRef
                                        ? `${envConfig.apiBaseUrl}/auth/login/google?ref=${encodeURIComponent(currentRef)}`
                                        : `${envConfig.apiBaseUrl}/auth/login/google`;
                                    window.location.href = url;
                                }}
                            >
                                <GoogleIcon />
                                Continue with Google
                            </Button>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 bg-muted/30 border-t border-border/40 text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary font-semibold hover:underline underline-offset-4">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-xs text-muted-foreground/60">
                        By signing up you agree to our{" "}
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
