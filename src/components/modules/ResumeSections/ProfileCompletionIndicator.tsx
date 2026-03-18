"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProfileCompletionIndicatorProps {
    profileCompletion: number;
}

export default function ProfileCompletionIndicator({ profileCompletion }: ProfileCompletionIndicatorProps) {
    const getCompletionColor = (completion: number) => {
        if (completion >= 80) return "text-green-600";
        if (completion >= 60) return "text-blue-600";
        if (completion >= 40) return "text-yellow-600";
        return "text-orange-600";
    };

    const getCompletionMessage = (completion: number) => {
        if (completion === 100) return "🎉 Your resume is complete!";
        if (completion >= 80) return "Almost there! Fill in more sections to stand out.";
        if (completion >= 60) return "Good progress! Continue adding more details.";
        if (completion >= 40) return "You're making progress. Add more information.";
        return "Get started by filling in your basic information.";
    };

    return (
        <Card className="p-6 bg-linear-to-r from-muted/50 to-muted/20">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Profile Completion</h3>
                    <span className={`text-2xl font-bold ${getCompletionColor(profileCompletion)}`}>
                        {profileCompletion}%
                    </span>
                </div>

                <Progress value={profileCompletion} className="h-2" />

                <p className="text-sm text-muted-foreground">
                    {getCompletionMessage(profileCompletion)}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
                    <div className="text-center">
                        <div className="font-semibold">Personal</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold">Summary</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold">Skills</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold">Experience</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold">Education</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold">More</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
