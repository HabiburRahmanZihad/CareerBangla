"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IUpdateResumePayload } from "@/zod/resume.validation";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface InterestsSectionProps {
    form: UseFormReturn<IUpdateResumePayload>;
}

export default function InterestsSection({ form }: InterestsSectionProps) {
    const [currentInterest, setCurrentInterest] = useState("");
    const interests = form.watch("interests") || [];

    const addInterest = () => {
        if (!currentInterest.trim()) return;
        const trimmed = currentInterest.trim();
        if (!interests.includes(trimmed)) {
            form.setValue("interests", [...interests, trimmed]);
        }
        setCurrentInterest("");
    };

    const removeInterest = (index: number) => {
        form.setValue("interests", interests.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="e.g., Machine Learning, Open Source..."
                    value={currentInterest}
                    onChange={(e) => setCurrentInterest(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addInterest();
                        }
                    }}
                />
                <Button
                    type="button"
                    onClick={addInterest}
                    disabled={!currentInterest.trim()}
                    size="sm"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                {interests.length > 0 ? (
                    interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                            {interest}
                            <button
                            title ='Remove'
                                type="button"
                                onClick={() => removeInterest(index)}
                                className="ml-2 hover:opacity-70"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground italic">
                        No interests added yet
                    </p>
                )}
            </div>

            <FormDescription>
                Add your professional interests and hobbies to make your profile more interesting
            </FormDescription>
        </div>
    );
}
