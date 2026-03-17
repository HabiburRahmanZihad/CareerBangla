"use client";

import { cn } from "@/lib/utils";

interface ProfileCompletionBarProps {
    completion: number;
    className?: string;
    showLabel?: boolean;
}

const ProfileCompletionBar = ({ completion, className, showLabel = true }: ProfileCompletionBarProps) => {
    const getColor = () => {
        if (completion >= 100) return "bg-green-500";
        if (completion >= 70) return "bg-blue-500";
        if (completion >= 40) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className={cn("space-y-1.5", className)}>
            {showLabel && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Profile Completion</span>
                    <span className="font-medium">{completion}%</span>
                </div>
            )}
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", getColor())}
                    style={{ width: `${Math.min(completion, 100)}%` }}
                />
            </div>
            {completion < 100 && showLabel && (
                <p className="text-xs text-muted-foreground">
                    Complete your profile to unlock all features
                </p>
            )}
        </div>
    );
};

export default ProfileCompletionBar;
