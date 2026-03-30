/* ── Types ────────────────────────────────────────────────────────────────── */

export type TimelinePreset =
    | "LIFETIME"
    | "MONTHLY"
    | "THREE_MONTHS"
    | "SIX_MONTHS"
    | "YEARLY"
    | "CUSTOM";

export interface PlanFormState {
    amount: string;
    description: string;
    timelinePreset: TimelinePreset;
    customDays: string;
    featuresText: string;
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

export const getTimelinePresetFromDays = (durationDays?: number | null): TimelinePreset => {
    if (durationDays === null || durationDays === undefined) return "LIFETIME";
    if (durationDays === 30) return "MONTHLY";
    if (durationDays === 90) return "THREE_MONTHS";
    if (durationDays === 180) return "SIX_MONTHS";
    if (durationDays === 365) return "YEARLY";
    return "CUSTOM";
};

export const getTimelineInfo = (durationDays?: number | null) => {
    if (durationDays === null || durationDays === undefined)
        return { label: "Lifetime", sub: "No expiry" };
    if (durationDays === 30) return { label: "Monthly", sub: "30 days" };
    if (durationDays === 90) return { label: "3 Months", sub: "90 days" };
    if (durationDays === 180) return { label: "6 Months", sub: "180 days" };
    if (durationDays === 365) return { label: "Yearly", sub: "365 days" };
    return { label: `${durationDays} Days`, sub: "Custom" };
};

/* ── Style maps ──────────────────────────────────────────────────────────── */

export const STYLES = {
    user: {
        strip: "bg-emerald-500",
        iconBg: "bg-emerald-500/10",
        iconBorder: "border-emerald-200 dark:border-emerald-800",
        iconText: "text-emerald-600 dark:text-emerald-400",
        badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
        priceBg:
            "bg-emerald-500/5 border border-emerald-200/60 dark:border-emerald-800/60",
        priceText: "text-emerald-700 dark:text-emerald-300",
        timelineBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        sectionGrad: "from-emerald-500/10 via-emerald-500/5 to-transparent",
        sectionBorder: "border-emerald-200 dark:border-emerald-800",
        sectionIcon: "text-emerald-600 dark:text-emerald-400",
    },
    recruiter: {
        strip: "bg-violet-500",
        iconBg: "bg-violet-500/10",
        iconBorder: "border-violet-200 dark:border-violet-800",
        iconText: "text-violet-600 dark:text-violet-400",
        badge: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800",
        priceBg:
            "bg-violet-500/5 border border-violet-200/60 dark:border-violet-800/60",
        priceText: "text-violet-700 dark:text-violet-300",
        timelineBg: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
        sectionGrad: "from-violet-500/10 via-violet-500/5 to-transparent",
        sectionBorder: "border-violet-200 dark:border-violet-800",
        sectionIcon: "text-violet-600 dark:text-violet-400",
    },
};
