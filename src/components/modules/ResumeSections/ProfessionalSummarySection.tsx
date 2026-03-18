"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { IUpdateResumePayload } from "@/zod/resume.validation";
import { UseFormReturn } from "react-hook-form";

interface ProfessionalSummarySectionProps {
    form: UseFormReturn<IUpdateResumePayload>;
}

export default function ProfessionalSummarySection({ form }: ProfessionalSummarySectionProps) {
    const summaryValue = form.watch("professionalSummary") || "";

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="professionalSummary"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Professional Summary</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Write a compelling summary of your professional background, skills, and career goals. Tailor it to the types of positions you're pursuing."
                                className="min-h-32"
                                {...field}
                            />
                        </FormControl>
                        <div className="text-xs text-muted-foreground text-right">
                            {summaryValue.length} / 1000
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                <p className="font-semibold mb-2">Tips for a strong summary:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Keep it concise (2-4 sentences)</li>
                    <li>Highlight key achievements and unique skills</li>
                    <li>Include relevant keywords for ATS optimization</li>
                    <li>Tailor it to the roles you're targeting</li>
                </ul>
            </div>
        </div>
    );
}
