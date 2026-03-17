"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import ProfileCompletionBar from "@/components/shared/ProfileCompletionBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyResume, updateMyResume } from "@/services/resume.services";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Coins } from "lucide-react";
import { toast } from "sonner";

const MyResumeContent = () => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: Record<string, unknown>) => updateMyResume(payload),
        onSuccess: () => {
            toast.success("Resume updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["my-resume"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update resume");
        },
    });

    const resume = data?.data;
    const profileCompletion = resume?.profileCompletion ?? 0;
    const isProfileCompleted = !!resume?.profileCompletedAt;

    const form = useForm({
        defaultValues: {
            title: resume?.title || "",
            summary: resume?.summary || "",
            skills: resume?.skills?.join(", ") || "",
            contactNumber: resume?.contactNumber || "",
            address: resume?.address || "",
            dateOfBirth: resume?.dateOfBirth ? resume.dateOfBirth.split("T")[0] : "",
            gender: resume?.gender || "",
            linkedinUrl: resume?.linkedinUrl || "",
            githubUrl: resume?.githubUrl || "",
            portfolioUrl: resume?.portfolioUrl || "",
        },
        onSubmit: async ({ value }) => {
            const payload: Record<string, unknown> = { ...value };
            if (typeof value.skills === "string") {
                payload.skills = value.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
            }
            await mutateAsync(payload);
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Resume</h1>

            <ProfileCompletionBar completion={profileCompletion} />

            {isProfileCompleted && (
                <Alert>
                    <Coins className="h-4 w-4" />
                    <AlertDescription>
                        Your profile has been completed before. Updates will cost <strong>15 coins</strong>.
                    </AlertDescription>
                </Alert>
            )}

            {profileCompletion < 100 && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Complete your profile to 100% to unlock all features. First completion is free!
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <form.Field name="title">
                                {(field) => (
                                    <AppField field={field} label="Professional Title" placeholder="e.g. Full Stack Developer" />
                                )}
                            </form.Field>

                            <form.Field name="contactNumber">
                                {(field) => (
                                    <AppField field={field} label="Contact Number" placeholder="+880..." />
                                )}
                            </form.Field>

                            <form.Field name="address">
                                {(field) => (
                                    <AppField field={field} label="Address" placeholder="Dhaka, Bangladesh" />
                                )}
                            </form.Field>

                            <form.Field name="dateOfBirth">
                                {(field) => (
                                    <AppField field={field} label="Date of Birth" type="date" />
                                )}
                            </form.Field>

                            <form.Field name="gender">
                                {(field) => (
                                    <AppField field={field} label="Gender" placeholder="Male / Female / Other" />
                                )}
                            </form.Field>

                            <form.Field name="linkedinUrl">
                                {(field) => (
                                    <AppField field={field} label="LinkedIn URL" placeholder="https://linkedin.com/in/..." />
                                )}
                            </form.Field>

                            <form.Field name="githubUrl">
                                {(field) => (
                                    <AppField field={field} label="GitHub URL" placeholder="https://github.com/..." />
                                )}
                            </form.Field>

                            <form.Field name="portfolioUrl">
                                {(field) => (
                                    <AppField field={field} label="Portfolio URL" placeholder="https://..." />
                                )}
                            </form.Field>
                        </div>

                        <form.Field name="skills">
                            {(field) => (
                                <AppField field={field} label="Skills (comma separated)" placeholder="React, TypeScript, Node.js, ..." />
                            )}
                        </form.Field>

                        <form.Field name="summary">
                            {(field) => (
                                <AppField field={field} label="Professional Summary" placeholder="Brief summary of your experience and goals..." />
                            )}
                        </form.Field>

                        <AppSubmitButton isPending={isPending} pendingLabel="Saving...">
                            {isProfileCompleted ? "Update Resume (15 coins)" : "Save Resume"}
                        </AppSubmitButton>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyResumeContent;
