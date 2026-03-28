"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginAction } from "@/app/(authLayout)/login/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import envConfig from "@/lib/envConfig";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  LogIn,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const DEVICE_LIMIT_LOGIN_CONTEXT_KEY = "device-limit-login-context";

const oauthErrorMessages: Record<string, string> = {
  oauth_failed: "Google sign-in failed. Please try again or use email login.",
  no_session_found: "Could not establish a session. Please try again.",
  no_user_found: "No user account found. Please register first.",
  invalid_client: "Google OAuth is not configured. Please use email login.",
};

const BRAND_FEATURES = [
  "Browse thousands of curated job listings",
  "Connect directly with top recruiters",
  "Track all your applications in one place",
];

// ── Google icon ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// ── Props ─────────────────────────────────────────────────────────────────────
interface LoginFormProps {
  redirectPath?: string;
  oauthError?: string;
  forceLogoutMode?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
const LoginForm = ({ redirectPath, oauthError, forceLogoutMode = false }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(
    oauthError ? (oauthErrorMessages[oauthError] || "Authentication failed. Please try again.") : null
  );
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ payload, forceLogout }: { payload: ILoginPayload; forceLogout?: boolean }) =>
      loginAction(payload, redirectPath, forceLogout),
  });

  const form = useForm({
    defaultValues: { identifier: "", password: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync({ payload: value, forceLogout: forceLogoutMode }) as any;

        if (!result.success) {
          if (result.code === "DEVICE_LIMIT_EXCEEDED") {
            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(
                DEVICE_LIMIT_LOGIN_CONTEXT_KEY,
                JSON.stringify({ payload: value, redirectPath })
              );
            }
            const deviceLimitPath = `/login/device-limit${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`;
            window.location.href = deviceLimitPath;
            return;
          }
          setServerError(result.message || "Login failed");
          return;
        }

        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(DEVICE_LIMIT_LOGIN_CONTEXT_KEY);
        }
        window.location.href = result.redirectPath || "/dashboard";
      } catch (error: any) {
        setServerError(`Login failed: ${error.message}`);
      }
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
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <span className="text-5xl font-extrabold text-white tracking-tight">CareerBangla</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-white/80" />
              <span className="text-xs font-semibold text-white/90">Bangladesh&apos;s #1 Job Platform</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Welcome back.<br />
              <span className="text-white/70">Let&apos;s find your</span>{" "}
              <span className="relative inline-block">
                next opportunity
                <svg className="absolute -bottom-1 left-0 w-full" height="5" viewBox="0 0 300 5" fill="none" preserveAspectRatio="none">
                  <path d="M0 3.5 Q75 0 150 3.5 Q225 7 300 3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </span>.
            </h1>
            <p className="text-white/65 text-base leading-relaxed max-w-sm">
              Sign in to access your personalized dashboard, applications, and thousands of job listings.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {BRAND_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-white/80">{f}</span>
              </li>
            ))}
          </ul>

          {/* Stats */}
          <div className="flex items-center gap-6 pt-2">
            {[
              { value: "10K+", label: "Job Seekers" },
              { value: "500+", label: "Companies" },
              { value: "50K+", label: "Jobs Posted" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-4">
                {i > 0 && <div className="w-px h-8 bg-white/20" />}
                <div>
                  <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.label}</p>
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
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-extrabold text-primary">CareerBangla</span>
          </div>

          {/* Card */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">

            {/* Card header */}
            <div className="px-8 pt-8 pb-6 border-b border-border/40">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <LogIn className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Sign in</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Enter your credentials to access your account.
              </p>
            </div>

            {/* Card body */}
            <div className="px-8 py-6 space-y-5">

              {/* Force logout banner */}
              {forceLogoutMode && (
                <Alert className="border-amber-300/60 bg-amber-50/80 dark:bg-amber-950/20">
                  <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-700 dark:text-amber-300 text-xs">
                    Signing in will log out your other devices.
                  </AlertDescription>
                </Alert>
              )}

              {/* Server error */}
              {serverError && (
                <Alert variant="destructive" className="border-destructive/40 bg-destructive/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{serverError}</AlertDescription>
                </Alert>
              )}

              {/* Form */}
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
                  name="identifier"
                  validators={{ onChange: loginZodSchema.shape.identifier }}
                >
                  {(field) => (
                    <AppField
                      field={field}
                      label="Email or Phone"
                      type="text"
                      placeholder="you@example.com"
                    />
                  )}
                </form.Field>

                <div className="space-y-1">
                  <form.Field
                    name="password"
                    validators={{ onChange: loginZodSchema.shape.password }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        append={
                          <Button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                        }
                      />
                    )}
                  </form.Field>
                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline underline-offset-4 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                  {([canSubmit, isSubmitting]) => (
                    <AppSubmitButton
                      isPending={isSubmitting || isPending}
                      pendingLabel="Signing in…"
                      disabled={!canSubmit}
                      className="w-full gap-2"
                    >
                      Sign In <ArrowRight className="h-4 w-4" />
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
                  window.location.href = `${envConfig.apiBaseUrl}/auth/login/google`;
                }}
              >
                <GoogleIcon />
                Continue with Google
              </Button>
            </div>

            {/* Card footer */}
            <div className="px-8 py-5 bg-muted/30 border-t border-border/40 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary font-semibold hover:underline underline-offset-4"
                >
                  Create one free
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom note */}
          <p className="mt-6 text-center text-xs text-muted-foreground/60">
            By signing in you agree to our{" "}
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
