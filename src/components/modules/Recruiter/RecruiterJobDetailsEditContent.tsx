"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateJob } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type RecruiterJobDetailsEditContentProps = {
    job: IJob & { deadline?: string; applicationDeadline?: string };
};

const toMultiline = (items?: string[]): string => (Array.isArray(items) ? items.join("\n") : "");

const fromMultiline = (value: string): string[] =>
    value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

const toInputDate = (value?: string): string => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
};

const RecruiterJobDetailsEditContent = ({ job }: RecruiterJobDetailsEditContentProps) => {
    const router = useRouter();

    const initialDeadline = useMemo(
        () => toInputDate((job as any)?.deadline || (job as any)?.applicationDeadline),
        [job]
    );

    const [formData, setFormData] = useState({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        jobType: (job.jobType as string) || "FULL_TIME",
        description: job.description || "",
        skills: (job.skills || []).join(", "),
        requirements: toMultiline((job as any).requirements),
        responsibilities: toMultiline((job as any).responsibilities),
        benefits: toMultiline((job as any).benefits),
        experience: (job as any).experience || "",
        education: (job as any).education || "",
        salaryMin: (job.salaryMin ?? "") as number | "",
        salaryMax: (job.salaryMax ?? "") as number | "",
        vacancies: ((job as any).vacancies ?? 1) as number,
        deadline: initialDeadline,
    });

    const { mutateAsync: updateMutate, isPending } = useMutation({
        mutationFn: () =>
            updateJob(job.id, {
                title: formData.title,
                company: formData.company,
                location: formData.location,
                jobType: formData.jobType,
                description: formData.description,
                skills: formData.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                requirements: fromMultiline(formData.requirements),
                responsibilities: fromMultiline(formData.responsibilities),
                benefits: fromMultiline(formData.benefits),
                experience: formData.experience || undefined,
                education: formData.education || undefined,
                salaryMin: formData.salaryMin === "" ? undefined : Number(formData.salaryMin),
                salaryMax: formData.salaryMax === "" ? undefined : Number(formData.salaryMax),
                vacancies: Number(formData.vacancies),
                deadline: formData.deadline || undefined,
            }),
        onSuccess: () => {
            toast.success("Job updated successfully. It will be reviewed again by admin.");
            router.push("/recruiter/dashboard/my-jobs/pending");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update job");
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Job Details & Edit</h1>
                    <p className="text-sm text-muted-foreground">Review and update this job post.</p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            </div>

            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    If you edit an approved/rejected job, it will move to pending and require admin approval again.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Job Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Job Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Company</Label>
                            <Input
                                value={formData.company}
                                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Location</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Job Type</Label>
                            <Select
                                value={formData.jobType}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, jobType: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                                    <SelectItem value="CONTRACT">Contract</SelectItem>
                                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                    <SelectItem value="REMOTE">Remote</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Description</Label>
                        <Textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Skills (comma separated)</Label>
                            <Input
                                value={formData.skills}
                                onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Deadline</Label>
                            <Input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Experience</Label>
                            <Input
                                value={formData.experience}
                                onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Education</Label>
                            <Input
                                value={formData.education}
                                onChange={(e) => setFormData((prev) => ({ ...prev, education: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label>Salary Min</Label>
                            <Input
                                type="number"
                                value={formData.salaryMin}
                                onChange={(e) => setFormData((prev) => ({ ...prev, salaryMin: e.target.value === "" ? "" : Number(e.target.value) }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Salary Max</Label>
                            <Input
                                type="number"
                                value={formData.salaryMax}
                                onChange={(e) => setFormData((prev) => ({ ...prev, salaryMax: e.target.value === "" ? "" : Number(e.target.value) }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Vacancies</Label>
                            <Input
                                type="number"
                                value={formData.vacancies}
                                onChange={(e) => setFormData((prev) => ({ ...prev, vacancies: Number(e.target.value || 1) }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Requirements (one per line)</Label>
                        <Textarea
                            rows={4}
                            value={formData.requirements}
                            onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Responsibilities (one per line)</Label>
                        <Textarea
                            rows={4}
                            value={formData.responsibilities}
                            onChange={(e) => setFormData((prev) => ({ ...prev, responsibilities: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Benefits (one per line)</Label>
                        <Textarea
                            rows={4}
                            value={formData.benefits}
                            onChange={(e) => setFormData((prev) => ({ ...prev, benefits: e.target.value }))}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
                        <Button onClick={() => updateMutate()} disabled={isPending}>
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecruiterJobDetailsEditContent;
