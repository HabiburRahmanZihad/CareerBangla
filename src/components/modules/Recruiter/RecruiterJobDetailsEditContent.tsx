"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateJob } from "@/services/job.services";
import { IJob } from "@/types/user.types";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Briefcase, Building2, Calendar, DollarSign, FileText, GraduationCap, ListTodo, Loader2, MapPin, Save, Target } from "lucide-react";
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

    const initialExperience = (job as any).experience || "";
    const expMatch = initialExperience.match(/(\d+)\s*years?\s*\((.+)\)/i);
    const initialExpYears = expMatch ? expMatch[1] : (Number(initialExperience) ? initialExperience : "0");
    const initialExpLevel = expMatch ? expMatch[2] : "MID";

    const [formData, setFormData] = useState({
        title: job.title || "",
        company: job.company || job.recruiter?.companyName || "",
        location: job.location || "",
        jobType: (job.jobType as string) || "FULL_TIME",
        description: job.description || "",
        skills: (job.skills || []).join(", "),
        requirements: toMultiline((job as any).requirements),
        responsibilities: toMultiline((job as any).responsibilities),
        benefits: toMultiline((job as any).benefits),
        experienceYears: initialExpYears,
        experienceLevel: initialExpLevel,
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
                experience: `${formData.experienceYears} years (${formData.experienceLevel})`,
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
        <div className="space-y-8 pb-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-primary/5 dark:bg-primary/5 p-8 md:p-10 border border-border/50">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl opacity-60" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-sm">
                                <Briefcase className="w-5 h-5 text-white dark:text-primary-foreground" />
                            </div>
                            <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                Editor Mode
                            </span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight mb-2 text-foreground">Job Details & Edit</h1>
                        <p className="text-muted-foreground text-base max-w-xl">
                            Refine and polish your job posting. Keep in mind that updating a live job will return it to a pending state for quick review.
                        </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isPending}
                            className="bg-card hover:bg-muted font-semibold transition-all h-11 px-5 rounded-xl border-border/50"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button
                            onClick={() => updateMutate()}
                            disabled={isPending}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all shadow-md shadow-primary/20 h-11 px-6 rounded-xl"
                        >
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                        </Button>
                    </div>
                </div>
            </div>

            <Alert className="border-primary/20 bg-primary/5 text-foreground rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                <div>
                    <AlertDescription className="text-sm font-medium opacity-90 inline leading-relaxed">
                        <strong className="font-bold mr-1">Status Notice:</strong>
                        If you edit a <strong className="font-bold text-primary">Live</strong> job, it will return to <strong className="font-bold text-primary">Pending</strong> status and require admin approval again before appearing on the job board.
                    </AlertDescription>
                </div>
            </Alert>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Basic Information */}
                    <Card className="border-border/50 shadow-sm overflow-hidden rounded-2xl">
                        <div className="border-b border-border/40 bg-muted/20 px-6 py-5 flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-card border border-border/50 shadow-sm shrink-0">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold">Core Information</CardTitle>
                                <CardDescription className="text-xs">The primary details describing the role</CardDescription>
                            </div>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="font-semibold text-foreground/80">Job Title</Label>
                                <Input
                                    className="bg-card/50 border-muted focus-visible:ring-primary/20 h-11 rounded-xl transition-all"
                                    placeholder="e.g. Senior Frontend Developer"
                                    value={formData.title}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="font-semibold text-foreground/80">Company Name</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            className="pl-10 bg-card/50 border-muted focus-visible:ring-primary/20 h-11 rounded-xl"
                                            placeholder="Company Name"
                                            value={formData.company}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-semibold text-foreground/80">Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            className="pl-10 bg-card/50 border-muted focus-visible:ring-primary/20 h-11 rounded-xl"
                                            placeholder="e.g. Remote, Dhka"
                                            value={formData.location}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-semibold text-foreground/80">Job Type</Label>
                                <Select
                                    value={formData.jobType}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, jobType: value }))}
                                >
                                    <SelectTrigger className="bg-card/50 border-muted focus-visible:ring-primary/20 h-11 rounded-xl">
                                        <SelectValue placeholder="Select job type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border/50">
                                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                                        <SelectItem value="CONTRACT">Contract</SelectItem>
                                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                        <SelectItem value="REMOTE">Remote</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-semibold text-foreground/80">Short Description</Label>
                                <Textarea
                                    rows={4}
                                    className="bg-card/50 border-muted focus-visible:ring-primary/20 rounded-xl resize-none"
                                    placeholder="Brief overview of the role..."
                                    value={formData.description}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Content */}
                    <Card className="border-border/50 shadow-sm overflow-hidden rounded-2xl">
                        <div className="border-b border-border/40 bg-muted/20 px-6 py-5 flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-card border border-border/50 shadow-sm shrink-0">
                                <ListTodo className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold">Deep Specifications</CardTitle>
                                <CardDescription className="text-xs">Provide clear details separated by newlines</CardDescription>
                            </div>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="font-semibold text-foreground/80">Requirements (One per line)</Label>
                                <Textarea
                                    rows={5}
                                    className="bg-card/50 border-muted focus-visible:ring-primary/20 rounded-xl"
                                    placeholder="Minimum 3 years React experience&#10;Strong Typescript knowledge..."
                                    value={formData.requirements}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="font-semibold text-foreground/80">Responsibilities (One per line)</Label>
                                <Textarea
                                    rows={5}
                                    className="bg-card/50 border-muted focus-visible:ring-primary/20 rounded-xl"
                                    placeholder="Maintain and scale frontend architecture&#10;Review pull requests..."
                                    value={formData.responsibilities}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, responsibilities: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="font-semibold text-foreground/80">Benefits & Perks (One per line)</Label>
                                <Textarea
                                    rows={4}
                                    className="bg-card/50 border-muted focus-visible:ring-primary/20 rounded-xl"
                                    placeholder="Health Insurance&#10;Remote working options..."
                                    value={formData.benefits}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, benefits: e.target.value }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Compensation & Setup */}
                <div className="space-y-8">
                    <Card className="border-border/50 shadow-sm overflow-hidden rounded-2xl sticky top-6">
                        <div className="border-b border-border/40 bg-muted/20 px-6 py-5 flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-card border border-border/50 shadow-sm shrink-0">
                                <Target className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold">Logistics & Target</CardTitle>
                                <CardDescription className="text-xs">Setup comp, counts & limits</CardDescription>
                            </div>
                        </div>
                        <CardContent className="p-6 space-y-6">

                            <div className="space-y-4 pt-1">
                                <Label className="font-semibold text-foreground/80 text-sm flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-primary" /> Compensation Range</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <span className="text-[11px] font-medium text-muted-foreground uppercase">Minimum</span>
                                        <Input
                                            type="number"
                                            className="bg-card/50 border-muted focus-visible:ring-primary/20 h-10 rounded-xl"
                                            placeholder="40000"
                                            value={formData.salaryMin}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, salaryMin: e.target.value === "" ? "" : Number(e.target.value) }))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <span className="text-[11px] font-medium text-muted-foreground uppercase">Maximum</span>
                                        <Input
                                            type="number"
                                            className="bg-card/50 border-muted focus-visible:ring-primary/20 h-10 rounded-xl"
                                            placeholder="80000"
                                            value={formData.salaryMax}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, salaryMax: e.target.value === "" ? "" : Number(e.target.value) }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border/40 border-dashed my-2" />

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="font-semibold text-foreground/80 text-sm flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-primary" /> Qualifications</Label>
                                    <span className="text-[11px] text-muted-foreground block mb-2 leading-relaxed">Describe necessary background</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            min="0"
                                            className="bg-card/50 border-muted focus-visible:ring-primary/20 h-10 rounded-xl w-1/2"
                                            placeholder="Years of Experience"
                                            value={formData.experienceYears}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, experienceYears: e.target.value }))}
                                        />
                                        <Select value={formData.experienceLevel} onValueChange={(v) => setFormData((prev) => ({ ...prev, experienceLevel: v }))}>
                                            <SelectTrigger className="bg-card/50 border-muted focus-visible:ring-primary/20 h-10 rounded-xl w-1/2">
                                                <SelectValue placeholder="Level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ENTRY">Entry Level</SelectItem>
                                                <SelectItem value="MID">Mid Level</SelectItem>
                                                <SelectItem value="SENIOR">Senior Level</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Input
                                            className="bg-card/50 border-muted focus-visible:ring-primary/20 h-10 rounded-xl"
                                            placeholder="Education (e.g. Bachelor's CS)"
                                            value={formData.education}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, education: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <Textarea
                                            rows={2}
                                            className="bg-card/50 border-muted focus-visible:ring-primary/20 rounded-xl resize-none text-sm"
                                            placeholder="Key Skills (comma separated)"
                                            value={formData.skills}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border/40 border-dashed my-2" />

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="font-semibold text-foreground/80 text-sm flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> Posting Lifespan</Label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <span className="text-[11px] font-medium text-muted-foreground uppercase">Vacancies</span>
                                        <Input
                                            type="number"
                                            min={1}
                                            className="bg-card/50 border-muted focus-visible:ring-primary/20 h-10 rounded-xl"
                                            value={formData.vacancies}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, vacancies: Number(e.target.value || 1) }))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <span className="text-[11px] font-medium text-muted-foreground uppercase">Deadline</span>
                                        <Input
                                            type="date"
                                            className="bg-card/50 border-muted focus-visible:ring-primary/20 h-10 rounded-xl"
                                            value={formData.deadline}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border/40 border-dashed mt-4 pt-5 pb-2">
                                <Button
                                    onClick={() => updateMutate()}
                                    disabled={isPending}
                                    size="lg"
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md shadow-primary/20"
                                >
                                    {isPending ? <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> Saving...</> : <><Save className="mr-2 w-5 h-5" /> Save All Changes</>}
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RecruiterJobDetailsEditContent;
