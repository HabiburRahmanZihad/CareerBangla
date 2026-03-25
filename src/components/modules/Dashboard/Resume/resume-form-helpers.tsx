"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Lock, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ─── Shared types ────────────────────────────────────────────────────────────

export interface ResumeSectionProps {
    form: any;
    se: Record<string, string>;
    computedIsLocked: boolean;
}

// ─── Reusable helpers ────────────────────────────────────────────────────────

/** Inline Select wired to a TanStack form field */
export const SelectField = ({
    field,
    label,
    placeholder,
    options,
    serverErrors,
    disabled = false,
}: {
    field: any;
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    serverErrors: Record<string, string>;
    disabled?: boolean;
}) => {
    const error =
        field.state.meta.isTouched && field.state.meta.errors.length > 0
            ? field.state.meta.errors[0]
            : null;
    const serverErr = serverErrors[field.name];
    const finalError = error || serverErr;
    const errorMsg =
        typeof finalError === "string"
            ? finalError
            : (finalError as any)?.message || String(finalError || "");

    return (
        <div className="space-y-1.5">
            <Label htmlFor={field.name} className={error ? "text-destructive" : ""}>
                {label}
            </Label>
            <Select
                value={(field.state.value as string) || undefined}
                onValueChange={(v) => field.handleChange(v)}
                disabled={disabled}
            >
                <SelectTrigger
                    id={field.name}
                    className={error ? "border-destructive focus:ring-destructive" : ""}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
        </div>
    );
};

/** Collapsible section wrapper with icon, title, count badge, and Add button */
export const FormSection = ({
    icon: Icon,
    title,
    count,
    onAdd,
    children,
    defaultOpen = true,
    isLocked = false,
}: {
    icon: React.ElementType;
    title: string;
    count?: number;
    onAdd?: () => void;
    children: React.ReactNode;
    defaultOpen?: boolean;
    isLocked?: boolean;
}) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-left hover:bg-muted/40 transition-colors"
            >
                <span className="flex items-center gap-2 text-base font-semibold">
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    {title}
                    {count !== undefined && count > 0 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                            {count}
                        </Badge>
                    )}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <div className="space-y-3">
                    {onAdd && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed"
                            onClick={onAdd}
                            disabled={isLocked}
                            title={isLocked ? "Profile is locked - unable to add" : ""}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add {title}
                        </Button>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
};

/** Textarea field wired to TanStack form */
export const TextareaField = ({
    field,
    label,
    placeholder,
    hint,
    serverErrors,
    disabled = false,
}: {
    field: any;
    label: string;
    placeholder?: string;
    hint?: string;
    serverErrors: Record<string, string>;
    disabled?: boolean;
}) => {
    const error =
        field.state.meta.isTouched && field.state.meta.errors.length > 0
            ? field.state.meta.errors[0]
            : null;
    const serverErr = serverErrors[field.name];
    const finalError = error || serverErr;
    const errorMsg =
        typeof finalError === "string"
            ? finalError
            : (finalError as any)?.message || String(finalError || "");

    return (
        <div className="space-y-1.5">
            <Label htmlFor={field.name} className={errorMsg ? "text-destructive" : ""}>
                {label}
            </Label>
            <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value as string}
                placeholder={placeholder}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={disabled}
                className={errorMsg ? "border-destructive focus-visible:ring-destructive/20 min-h-20" : "min-h-20"}
            />
            {hint && !errorMsg && <p className="text-xs text-muted-foreground">{hint}</p>}
            {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
        </div>
    );
};

/** Card for array items with delete button */
export const ItemCard = ({ index, onRemove, children, isLocked }: { index: number; onRemove: () => void; children: React.ReactNode; isLocked?: boolean }) => (
    <Card className="relative bg-muted/20 border-border/60">
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onRemove}
            disabled={isLocked}
            aria-label={`Remove item ${index + 1}`}
            title={isLocked ? "Profile is locked - unable to delete" : "Delete"}
        >
            <Trash2 className="w-3.5 h-3.5" />
        </Button>
        <CardContent className="pt-5 pb-4 pr-10">
            {children}
        </CardContent>
    </Card>
);

export const EmptyState = ({ label }: { label: string }) => (
    <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-lg">
        No {label} added yet. Click &ldquo;Add {label}&rdquo; above.
    </p>
);

/** Locked-section banner shown when a free-tier user has already saved a section */
export const LockedBanner = () => (
    <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-3 py-2 text-xs text-amber-700 dark:text-amber-300 mb-3">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        <span>This section is locked. <Link href="/dashboard/subscriptions" className="underline font-medium">Upgrade</Link> to edit again.</span>
    </div>
);

/** Loading skeleton for the resume page */
export const ResumeSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
            </div>
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-150 w-full rounded-xl" />
    </div>
);
