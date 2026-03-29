"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { changePassword } from "@/services/auth.services";
import { changePasswordFormZodSchema, IChangePasswordPayload } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
    AlertTriangle, CheckCircle2, Eye, EyeOff,
    KeyRound, RefreshCw, ShieldCheck,
    ShieldOff, Smartphone, XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Strength helpers ──────────────────────────────────────────────────────────
const getScore = (pwd: string): number => {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8)           s++;
    if (pwd.length >= 12)          s++;
    if (/[A-Z]/.test(pwd))         s++;
    if (/[a-z]/.test(pwd))         s++;
    if (/[0-9]/.test(pwd))         s++;
    if (/[^A-Za-z0-9]/.test(pwd))  s++;
    return s;
};

const STRENGTH = [
    { label: "Too Short",   color: "#94a3b8", pct:  6 },
    { label: "Very Weak",   color: "#ef4444", pct: 18 },
    { label: "Weak",        color: "#f97316", pct: 35 },
    { label: "Fair",        color: "#eab308", pct: 55 },
    { label: "Good",        color: "#22c55e", pct: 72 },
    { label: "Strong",      color: "#10b981", pct: 88 },
    { label: "Very Strong", color: "#10b981", pct:100 },
] as const;

const REQUIREMENTS = [
    { label: "At least 8 characters",  test: (p: string) => p.length >= 8 },
    { label: "Uppercase letter (A–Z)", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Lowercase letter (a–z)", test: (p: string) => /[a-z]/.test(p) },
    { label: "Number (0–9)",           test: (p: string) => /[0-9]/.test(p) },
];

const TIPS = [
    { icon: RefreshCw,   text: "Change your password regularly, at least every 6 months." },
    { icon: ShieldOff,   text: "Never reuse passwords from other websites or services." },
    { icon: Smartphone,  text: "Enable two-factor authentication for extra protection." },
    { icon: ShieldCheck, text: "Use a password manager to generate and store strong passwords." },
];

// ── Inline password field ─────────────────────────────────────────────────────
interface PwdFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    onBlur: () => void;
    show: boolean;
    onToggle: () => void;
    placeholder: string;
    error?: string | null;
}

const PwdField = ({ label, value, onChange, onBlur, show, onToggle, placeholder, error }: PwdFieldProps) => (
    <div className="space-y-1.5">
        <Label className={cn("text-sm font-medium", error && "text-destructive")}>{label}</Label>
        <div className="relative">
            <Input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder={placeholder}
                aria-invalid={!!error}
                className={cn(
                    "pr-10 h-10",
                    error && "border-destructive focus-visible:ring-destructive/20"
                )}
            />
            <button
                type="button"
                onClick={onToggle}
                title={show ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
);

// ── Error message helper ──────────────────────────────────────────────────────
const getMsg = (errors: unknown[]): string | null => {
    if (!errors.length) return null;
    const e = errors[0];
    if (typeof e === "string") return e;
    if (e && typeof e === "object" && "message" in e) return String((e as any).message);
    return String(e);
};

// ── Main component ─────────────────────────────────────────────────────────────
const ChangePasswordContent = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success,     setSuccess]     = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew,     setShowNew]     = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IChangePasswordPayload) => changePassword(payload),
        onSuccess: () => {
            toast.success("Password changed successfully!");
            setSuccess(true);
            form.reset();
        },
        onError: (err: any) => {
            setServerError(err?.response?.data?.message || "Failed to change password");
        },
    });

    const form = useForm({
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccess(false);
            await mutateAsync({ currentPassword: value.currentPassword, newPassword: value.newPassword });
        },
    });

    return (
        <div className="w-full space-y-5">

            {/* Page heading */}
            <div>
                <h1 className="text-2xl font-black tracking-tight">Change Password</h1>
                <p className="text-sm text-muted-foreground mt-1">Update your credentials to keep your account secure.</p>
            </div>

            {/* Card */}
            <div className="relative rounded-3xl border border-border/40 bg-card overflow-hidden shadow-xl shadow-black/5">

                {/* Left accent */}
                <div className="absolute left-0 inset-y-0 w-0.75 bg-linear-to-b from-primary to-primary/10" />

                {/* Card header */}
                <div className="px-6 sm:px-8 py-5 border-b border-border/30 bg-linear-to-br from-primary/5 via-muted/10 to-transparent flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                        <KeyRound className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-black text-sm tracking-tight">Security Update</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Your password is encrypted end-to-end</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                </div>

                {/* Two-column body */}
                <div className="grid grid-cols-1 lg:grid-cols-5">

                    {/* LEFT — form */}
                    <div className="lg:col-span-3 px-6 sm:px-8 py-7 lg:border-r border-border/30">
                        <form
                            noValidate
                            onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
                            className="space-y-5"
                        >
                            {/* Current Password */}
                            <form.Field
                                name="currentPassword"
                                validators={{ onChange: changePasswordFormZodSchema.shape.currentPassword }}
                            >
                                {(field) => (
                                    <PwdField
                                        label="Current Password"
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        onBlur={field.handleBlur}
                                        show={showCurrent}
                                        onToggle={() => setShowCurrent(v => !v)}
                                        placeholder="Enter your current password"
                                        error={field.state.meta.isTouched ? getMsg(field.state.meta.errors) : null}
                                    />
                                )}
                            </form.Field>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border/30" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-card px-3 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                                        New Credentials
                                    </span>
                                </div>
                            </div>

                            {/* New Password + strength + requirements */}
                            <form.Field
                                name="newPassword"
                                validators={{ onChange: changePasswordFormZodSchema.shape.newPassword }}
                            >
                                {(field) => {
                                    const pwd = field.state.value;
                                    const str = STRENGTH[Math.min(getScore(pwd), STRENGTH.length - 1)];
                                    return (
                                        <div className="space-y-3">
                                            <PwdField
                                                label="New Password"
                                                value={pwd}
                                                onChange={field.handleChange}
                                                onBlur={field.handleBlur}
                                                show={showNew}
                                                onToggle={() => setShowNew(v => !v)}
                                                placeholder="Create a strong new password"
                                                error={field.state.meta.isTouched ? getMsg(field.state.meta.errors) : null}
                                            />

                                            {/* Strength bar */}
                                            {pwd && (
                                                <div className="space-y-1.5 px-0.5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-bold text-muted-foreground/60">Strength</span>
                                                        <span className="text-[11px] font-black" style={{ color: str.color }}>{str.label}</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4].map((seg) => {
                                                            const filled = str.pct >= seg * 25;
                                                            return (
                                                                <div
                                                                    key={seg}
                                                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${filled ? "" : "bg-muted"}`}
                                                                    style={filled ? { backgroundColor: str.color } : undefined}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Requirements */}
                                            {pwd && (
                                                <div className="rounded-xl border border-border/30 bg-muted/20 p-4">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3">
                                                        Requirements
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {REQUIREMENTS.map(({ label, test }) => {
                                                            const met = test(pwd);
                                                            return (
                                                                <div key={label} className="flex items-center gap-2">
                                                                    <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${met ? "bg-green-500/15" : "bg-muted"}`}>
                                                                        {met
                                                                            ? <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                                            : <XCircle className="h-3 w-3 text-muted-foreground/30" />
                                                                        }
                                                                    </div>
                                                                    <span className={`text-xs font-medium transition-colors duration-200 ${met ? "text-green-700 dark:text-green-400" : "text-muted-foreground/60"}`}>
                                                                        {label}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }}
                            </form.Field>

                            {/* Confirm Password */}
                            <form.Field
                                name="confirmPassword"
                                validators={{ onChange: changePasswordFormZodSchema.shape.confirmPassword }}
                            >
                                {(field) => (
                                    <PwdField
                                        label="Confirm New Password"
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        onBlur={field.handleBlur}
                                        show={showConfirm}
                                        onToggle={() => setShowConfirm(v => !v)}
                                        placeholder="Re-enter your new password"
                                        error={field.state.meta.isTouched ? getMsg(field.state.meta.errors) : null}
                                    />
                                )}
                            </form.Field>

                            {/* Server error */}
                            {serverError && (
                                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                                    <div className="h-6 w-6 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0 mt-0.5">
                                        <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <p className="text-sm text-red-700 dark:text-red-400 font-medium leading-relaxed">{serverError}</p>
                                </div>
                            )}

                            {/* Success */}
                            {success && (
                                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                                    <div className="h-6 w-6 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0 mt-0.5">
                                        <ShieldCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <p className="text-sm text-green-700 dark:text-green-400 font-medium leading-relaxed">
                                        Password updated successfully! Your account is now more secure.
                                    </p>
                                </div>
                            )}

                            {/* Submit */}
                            <AppSubmitButton isPending={isPending} pendingLabel="Updating…">
                                Update Password
                            </AppSubmitButton>
                        </form>
                    </div>

                    {/* RIGHT — security tips */}
                    <div className="lg:col-span-2 px-6 sm:px-8 lg:px-7 py-7 bg-muted/10 border-t border-border/30 lg:border-t-0 space-y-6">

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-4">Security Tips</p>
                            <div className="space-y-4">
                                {TIPS.map(({ icon: Icon, text }, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <Icon className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ideal password card */}
                        <div className="rounded-2xl border border-border/40 bg-card p-4 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                Ideal Password
                            </p>
                            <div className="space-y-2">
                                {[
                                    { label: "12+ characters long",        color: "bg-primary/10 text-primary" },
                                    { label: "Mix of A–Z, a–z, 0–9",       color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
                                    { label: "Special symbols (!@#$...)",  color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
                                    { label: "Unique to this site only",   color: "bg-green-500/10 text-green-600 dark:text-green-400" },
                                ].map(({ label, color }) => (
                                    <div key={label} className="flex items-center gap-2.5">
                                        <span className={`inline-flex items-center justify-center h-4 w-4 rounded-full shrink-0 ${color}`}>
                                            <CheckCircle2 className="h-3 w-3" />
                                        </span>
                                        <span className="text-xs text-muted-foreground font-medium">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-[11px] text-muted-foreground/40 font-medium leading-relaxed">
                            Never share your password with anyone, including CareerBangla support staff.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordContent;
