"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { updateJob } from "@/services/admin.services";
import { getJobById } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AdminJobEditContentProps {
    jobId: string;
}

const AdminJobEditContent = ({ jobId }: AdminJobEditContentProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [draftForm, setDraftForm] = useState<Partial<IJob> | null>(null);

    const { data: jobData, isLoading } = useQuery({
        queryKey: ["job-details", jobId],
        queryFn: () => getJobById(jobId),
    });

    const { mutateAsync: editMutate, isPending: isEditing } = useMutation({
        mutationFn: (formData: Partial<IJob>) =>
            updateJob(jobId, {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                locationType: formData.locationType,
                jobType: formData.jobType,
                experienceLevel: formData.experienceLevel,
                skills: formData.skills,
                salaryMin: formData.salaryMin,
                salaryMax: formData.salaryMax,
                requirements: formData.requirements,
                responsibilities: formData.responsibilities,
                benefits: formData.benefits,
                vacancies: formData.vacancies,
                experience: formData.experience,
                education: formData.education,
                applicationDeadline: formData.applicationDeadline,
            }),
        onSuccess: () => {
            toast.success("Job updated successfully");
            queryClient.invalidateQueries({ queryKey: ["job-details", jobId] });
            queryClient.invalidateQueries({ queryKey: ["admin-all-jobs"] });
            router.push("/admin/dashboard/jobs-management");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update job");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await editMutate(draftForm ?? jobData?.data ?? {});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDraftForm((prev) => {
            const base = prev ?? jobData?.data ?? {};
            return {
                ...base,
                [name]: name.includes("salary") || name === "vacancies" ? Number(value) || value : value,
            };
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setDraftForm((prev) => {
            const base = prev ?? jobData?.data ?? {};
            return {
                ...base,
                [name]: value,
            };
        });
    };

    const handleArrayChange = (name: string, value: string) => {
        setDraftForm((prev) => {
            const base = prev ?? jobData?.data ?? {};
            return {
                ...base,
                [name]: value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
            };
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
            </div>
        );
    }

    const job = jobData?.data;

    if (!job) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                    Job not found
                </CardContent>
            </Card>
        );
    }

    const formData = draftForm ?? job;
    const isChanged = draftForm !== null && JSON.stringify(formData) !== JSON.stringify(job);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/dashboard/jobs-management">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Edit Job</h1>
                    <p className="text-sm text-muted-foreground">{job.title} at {job.company}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Job Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Job Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description || ""}
                                onChange={handleInputChange}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="locationType">Location Type *</Label>
                                <Select value={formData.locationType || ""} onValueChange={(value) => handleSelectChange("locationType", value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="REMOTE">Remote</SelectItem>
                                        <SelectItem value="ONSITE">On-site</SelectItem>
                                        <SelectItem value="HYBRID">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="jobType">Job Type *</Label>
                                <Select value={formData.jobType || ""} onValueChange={(value) => handleSelectChange("jobType", value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                                        <SelectItem value="CONTRACT">Contract</SelectItem>
                                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                        <SelectItem value="FREELANCE">Freelance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="experienceLevel">Experience Level *</Label>
                                <Select value={formData.experienceLevel || ""} onValueChange={(value) => handleSelectChange("experienceLevel", value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ENTRY">Entry Level</SelectItem>
                                        <SelectItem value="MID">Mid Level</SelectItem>
                                        <SelectItem value="SENIOR">Senior</SelectItem>
                                        <SelectItem value="LEAD">Lead</SelectItem>
                                        <SelectItem value="EXECUTIVE">Executive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="vacancies">Number of Vacancies</Label>
                                <Input
                                    id="vacancies"
                                    name="vacancies"
                                    type="number"
                                    value={formData.vacancies || ""}
                                    onChange={handleInputChange}
                                    min="1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Compensation & Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="salaryMin">Minimum Salary</Label>
                                <Input
                                    id="salaryMin"
                                    name="salaryMin"
                                    type="number"
                                    value={formData.salaryMin || ""}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 50000"
                                />
                            </div>
                            <div>
                                <Label htmlFor="salaryMax">Maximum Salary</Label>
                                <Input
                                    id="salaryMax"
                                    name="salaryMax"
                                    type="number"
                                    value={formData.salaryMax || ""}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 80000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="experience">Experience Required</Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    value={formData.experience || ""}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 3+ years"
                                />
                            </div>
                            <div>
                                <Label htmlFor="education">Education Required</Label>
                                <Input
                                    id="education"
                                    name="education"
                                    value={formData.education || ""}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Bachelor's Degree"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="applicationDeadline">Application Deadline</Label>
                            <Input
                                id="applicationDeadline"
                                name="applicationDeadline"
                                type="date"
                                value={formData.applicationDeadline ? formData.applicationDeadline.split("T")[0] : ""}
                                onChange={handleInputChange}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Skills & Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                            <Textarea
                                id="skills"
                                rows={3}
                                value={formData.skills?.join(", ") || ""}
                                onChange={(e) => handleArrayChange("skills", e.target.value)}
                                placeholder="e.g., React, TypeScript, Node.js"
                            />
                        </div>

                        <div>
                            <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                            <Textarea
                                id="requirements"
                                rows={3}
                                value={formData.requirements?.join(", ") || ""}
                                onChange={(e) => handleArrayChange("requirements", e.target.value)}
                                placeholder="e.g., Requirement 1, Requirement 2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="responsibilities">Responsibilities (comma-separated)</Label>
                            <Textarea
                                id="responsibilities"
                                rows={3}
                                value={formData.responsibilities?.join(", ") || ""}
                                onChange={(e) => handleArrayChange("responsibilities", e.target.value)}
                                placeholder="e.g., Task 1, Task 2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                            <Textarea
                                id="benefits"
                                rows={3}
                                value={formData.benefits?.join(", ") || ""}
                                onChange={(e) => handleArrayChange("benefits", e.target.value)}
                                placeholder="e.g., Health Insurance, 401k, Remote Work"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-3">
                    <Link href="/admin/dashboard/jobs-management" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isEditing || !isChanged} className="flex-1">
                        {isEditing && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminJobEditContent;
