/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    CalendarDays,
    CheckCircle2,
    Pencil,
    Rocket,
    Zap
} from "lucide-react";
import { STYLES, getTimelineInfo } from "./subscriptions.utils";

/* ── Plan card ────────────────────────────────────────────────────────────── */

export const PlanCard = ({
    plan,
    onEdit,
}: {
    plan: any;
    onEdit: (plan: any) => void;
}) => {
    const s = plan.recruiterOnly ? STYLES.recruiter : STYLES.user;
    const timeline = getTimelineInfo(plan.durationDays);
    const features: string[] = Array.isArray(plan.features) ? plan.features : [];

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-border/80 dark:hover:border-border">
            {/* linear background overlay */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-transparent via-transparent to-muted/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Top color strip */}
            <div className={`h-1.5 w-full ${s.strip}`} />

            <div className="relative p-6 space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${s.iconBg} ${s.iconBorder} transition-transform duration-300 group-hover:scale-110`}
                        >
                            {plan.recruiterOnly ? (
                                <Briefcase className={`h-6 w-6 ${s.iconText}`} />
                            ) : (
                                <Rocket className={`h-6 w-6 ${s.iconText}`} />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-lg font-bold leading-tight">
                                {plan.name}
                            </h3>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                <Badge className={`text-[11px] font-semibold px-2.5 py-0.5 ${s.badge}`}>
                                    {plan.recruiterOnly ? "Recruiter" : "User"} Plan
                                </Badge>
                                <span className="rounded-md border border-border/50 bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                                    {plan.planKey}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 shrink-0 gap-1.5 border-border/60 text-xs opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:bg-muted/80"
                        onClick={() => onEdit(plan)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                    </Button>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-linear-to-r from-border/0 via-border/50 to-border/0" />

                {/* Price + Timeline */}
                <div
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl p-4 ${s.priceBg} transition-all duration-300 group-hover:shadow-md`}
                >
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                            Price
                        </p>
                        <div className="flex items-baseline gap-1.5">
                            <span className={`text-3xl sm:text-4xl font-extrabold tabular-nums ${s.priceText}`}>
                                &#2547;{plan.amount.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">one-time</span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            BDT — Bangladeshi Taka
                        </p>
                    </div>
                    <div className={`flex flex-col items-center gap-1.5 rounded-lg px-4 py-2.5 ${s.timelineBg} transition-transform duration-300 group-hover:scale-105`}>
                        <div className="flex items-center gap-1.5">
                            <CalendarDays className={`h-4 w-4 ${s.iconText}`} />
                            <span className="text-xs font-bold leading-tight">
                                {timeline.label}
                            </span>
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground">
                            {timeline.sub}
                        </span>
                    </div>
                </div>

                {/* Description */}
                {plan.description && (
                    <>
                        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                            {plan.description}
                        </p>
                    </>
                )}

                {/* Features */}
                {features.length > 0 && (
                    <div className="space-y-3 border-t border-border/50 pt-4">
                        <div className="flex items-center gap-2">
                            <Zap className={`h-4 w-4 ${s.iconText}`} />
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Includes {features.length} {features.length === 1 ? "feature" : "features"}
                            </p>
                        </div>
                        <ul className="space-y-2">
                            {features.slice(0, 4).map((feat, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                                >
                                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${s.iconText}`} />
                                    <span>{feat}</span>
                                </li>
                            ))}
                            {features.length > 4 && (
                                <li className="text-xs font-medium text-muted-foreground pt-1">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${s.badge}`}>
                                        +{features.length - 4} more
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
