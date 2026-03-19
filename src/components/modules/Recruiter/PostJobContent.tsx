"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createJob, getJobCategories } from "@/services/job.services";
import { getMyRecruiterProfile } from "@/services/recruiter.services";
import { createJobZodSchema } from "@/zod/job.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, Coins, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const PostJobContent = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const { data: categoriesData } = useQuery({
        queryKey: ["job-categories"],
        queryFn: () => getJobCategories(),
    });

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ["my-recruiter-profile"],
        queryFn: () => getMyRecruiterProfile(),
    });

    const isVerified = profileData?.data?.isVerified ?? false;
    const profileCompletion = profileData?.data?.profileCompletion ?? 0;
    const isProfileComplete = profileCompletion >= 100;
    const canPost = isVerified && isProfileComplete;
    const isGuardLoading = profileLoading;

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: Record<string, unknown>) => createJob(data),
        onSuccess: () => {
            toast.success("Job posted successfully!");
            router.push("/recruiter/dashboard/my-jobs");
        },
        onError: (err: any) => {
            setServerError(err?.response?.data?.message || "Failed to post job");
        },
    });

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            company: "",
            location: "",
            locationType: "ONSITE",
            jobType: "FULL_TIME",
            experienceLevel: "MID",
            skills: "",
            salaryMin: "",
            salaryMax: "",
            applicationDeadline: "",
            categoryId: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            const payload: Record<string, unknown> = {
                ...value,
                skills: value.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
                salaryMin: value.salaryMin ? Number(value.salaryMin) : undefined,
                salaryMax: value.salaryMax ? Number(value.salaryMax) : undefined,
                applicationDeadline: value.applicationDeadline || undefined,
                categoryId: value.categoryId || undefined,
            };
            await mutateAsync(payload);
        },
    });

    const categories = categoriesData?.data || [];

    return (
        <div className="space-y-6 max-w-3xl">
            <h1 className="text-2xl font-bold">Post a New Job</h1>

            {/* Guard Alerts */}
            {isGuardLoading ? (
                <Skeleton className="h-16 w-full" />
            ) : (
                <>
                    {!isVerified && (
                        <Alert variant="destructive">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertDescription>
                                Your account is not verified yet. You cannot post jobs until an admin verifies your profile.
                            </AlertDescription>
                        </Alert>
                    )}
                    {!isProfileComplete && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Your profile is {profileCompletion}% complete. You must complete your profile to 100% before posting jobs.
                            </AlertDescription>
                        </Alert>
                    )}
                </>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
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
                        <form.Field name="title" validators={{ onChange: createJobZodSchema.shape.title }}>
                            {(field) => <AppField field={field} label="Job Title" placeholder="e.g. Senior React Developer" />}
                        </form.Field>

                        <form.Field name="company" validators={{ onChange: createJobZodSchema.shape.company }}>
                            {(field) => <AppField field={field} label="Company Name" placeholder="Your company name" />}
                        </form.Field>

                        <form.Field name="description" validators={{ onChange: createJobZodSchema.shape.description }}>
                            {(field) => <AppField field={field} label="Job Description" placeholder="Describe the role, responsibilities, and requirements..." />}
                        </form.Field>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <form.Field name="location" validators={{ onChange: createJobZodSchema.shape.location }}>
                                {(field) => <AppField field={field} label="Location" placeholder="e.g. Dhaka, Bangladesh" />}
                            </form.Field>

                            <div className="space-y-1.5">
                                <Label>Location Type</Label>
                                <form.Field name="locationType">
                                    {(field) => (
                                        <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ONSITE">On-site</SelectItem>
                                                <SelectItem value="REMOTE">Remote</SelectItem>
                                                <SelectItem value="HYBRID">Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </form.Field>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Job Type</Label>
                                <form.Field name="jobType">
                                    {(field) => (
                                        <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                                <SelectItem value="PART_TIME">Part Time</SelectItem>
                                                <SelectItem value="CONTRACT">Contract</SelectItem>
                                                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                                <SelectItem value="FREELANCE">Freelance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </form.Field>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Experience Level</Label>
                                <form.Field name="experienceLevel">
                                    {(field) => (
                                        <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ENTRY">Entry Level</SelectItem>
                                                <SelectItem value="MID">Mid Level</SelectItem>
                                                <SelectItem value="SENIOR">Senior Level</SelectItem>
                                                <SelectItem value="LEAD">Lead</SelectItem>
                                                <SelectItem value="EXECUTIVE">Executive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </form.Field>
                            </div>

                            <form.Field name="salaryMin">
                                {(field) => <AppField field={field} label="Min Salary (BDT)" type="number" placeholder="e.g. 30000" />}
                            </form.Field>

                            <form.Field name="salaryMax">
                                {(field) => <AppField field={field} label="Max Salary (BDT)" type="number" placeholder="e.g. 60000" />}
                            </form.Field>

                            <form.Field name="applicationDeadline">
                                {(field) => <AppField field={field} label="Application Deadline" type="date" />}
                            </form.Field>

                            {categories.length > 0 && (
                                <div className="space-y-1.5">
                                    <Label>Category</Label>
                                    <form.Field name="categoryId">
                                        {(field) => (
                                            <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </form.Field>
                                </div>
                            )}
                        </div>

                        <form.Field name="skills" validators={{ onChange: createJobZodSchema.shape.skills }}>
                            {(field) => <AppField field={field} label="Required Skills (comma separated)" placeholder="React, TypeScript, Node.js, ..." />}
                        </form.Field>

                        {serverError && (
                            <Alert variant="destructive">
                                <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                        )}

                        <AppSubmitButton isPending={isPending} pendingLabel="Posting Job..." disabled={!canPost || isGuardLoading}>
                            Post Job
                        </AppSubmitButton>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostJobContent;
