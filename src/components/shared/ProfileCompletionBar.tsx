"use client";

import { cn } from "@/lib/utils";

interface ProfileCompletionBarProps {
    completion: number;
    className?: string;
    showLabel?: boolean;
}

const ProfileCompletionBar = ({ completion, className, showLabel = true }: ProfileCompletionBarProps) => {
    const getColor = () => {
        if (completion >= 100) return "bg-gradient-to-r from-emerald-400 to-emerald-600";
        if (completion >= 70) return "bg-gradient-to-r from-blue-400 to-indigo-500";
        if (completion >= 40) return "bg-gradient-to-r from-yellow-400 to-amber-500";
        return "bg-gradient-to-r from-rose-400 to-red-500";
    };

    return (
        <div className={cn("space-y-2 p-4 rounded-2xl border border-border/40 bg-card/40 shadow-sm", className)}>
            {showLabel && (
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-tight text-foreground/80">Profile Completion Status</span>
                    <span className={cn("inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black text-white shadow-sm", getColor())}>
                        {completion}%
                    </span>
                </div>
            )}
            <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden shadow-inner">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", getColor())}
                    style={{ width: `${Math.min(completion, 100)}%` }}
                />
            </div>
            {completion < 100 && showLabel && (
                <p className="text-[11px] font-medium text-muted-foreground pt-1">
                    Complete your profile to unlock all ATS formatting features and career opportunities.
                </p>
            )}
        </div>
    );
};

export default ProfileCompletionBar;
