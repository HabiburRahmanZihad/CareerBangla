"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import { useState } from "react";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import ProfileCompletionBar from "@/components/shared/ProfileCompletionBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyResume, updateMyResume } from "@/services/resume.services";
import { getMyWallet } from "@/services/wallet.services";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Coins, Plus, Trash2, Info } from "lucide-react";
import { toast } from "sonner";

const MyResumeForm = ({ resume, coins }: { resume: any, coins: number }) => {
    const queryClient = useQueryClient();

    const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
    const [pendingPayload, setPendingPayload] = useState<Record<string, unknown> | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: Record<string, unknown>) => updateMyResume(payload),
        onSuccess: (response: any) => {
            if (response && response.success === false) {
                const newErrors: Record<string, string> = {};
                if (response.errorSources) {
                    response.errorSources.forEach((source: any) => {
                        const parts = source.path.split(" => ");
                        const formattedPath = parts.reduce((acc: string, curr: string) => {
                            if (!isNaN(Number(curr))) return `${acc}[${curr}]`;
                            return acc ? `${acc}.${curr}` : curr;
                        }, "");
                        newErrors[formattedPath] = source.message;
                    });
                    setServerErrors(newErrors);
                    toast.error("Please fix the specific field errors marked below.");
                } else {
                    toast.error(response.message || "Failed to update resume");
                }
            } else {
                setServerErrors({});
                toast.success("Resume updated successfully!");
                queryClient.invalidateQueries({ queryKey: ["my-resume"] });
            }
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update resume");
        },
    });

    const profileCompletion = resume?.profileCompletion ?? 0;

    // Charge 10 coins if profile is 100% OR any of the 4 chargeable sections is already filled
    const isSectionChargeable = profileCompletion === 100 || !!(
        resume?.fullName ||
        resume?.contactNumber ||
        resume?.professionalTitle ||
        resume?.linkedinUrl ||
        resume?.githubUrl ||
        resume?.portfolioUrl ||
        resume?.professionalSummary ||
        (resume?.technicalSkills?.length ?? 0) > 0 ||
        (resume?.softSkills?.length ?? 0) > 0 ||
        (resume?.education?.length ?? 0) > 0
    );

    const form = useForm({
        defaultValues: {
            fullName: resume?.fullName || "",
            email: resume?.email || "",
            professionalTitle: resume?.professionalTitle || "",
            professionalSummary: resume?.professionalSummary || "",
            nationality: resume?.nationality || "",
            technicalSkills: resume?.technicalSkills?.join(", ") || "",
            softSkills: resume?.softSkills?.join(", ") || "",
            toolsAndTechnologies: resume?.toolsAndTechnologies?.join(", ") || "",
            interests: resume?.interests?.join(", ") || "",
            contactNumber: resume?.contactNumber || "",
            address: resume?.address || "",
            dateOfBirth: resume?.dateOfBirth ? resume.dateOfBirth.split("T")[0] : "",
            gender: resume?.gender || "",
            linkedinUrl: resume?.linkedinUrl || "",
            githubUrl: resume?.githubUrl || "",
            portfolioUrl: resume?.portfolioUrl || "",
            workExperience: (resume?.workExperience?.map((exp: any) => ({
                jobTitle: exp.jobTitle || "",
                companyName: exp.companyName || "",
                startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
                endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
                responsibilities: exp.responsibilities?.join(", ") || "",
            })) || []) as any[],
            education: (resume?.education?.map((edu: any) => ({
                degree: edu.degree || "",
                institutionName: edu.institutionName || "",
                fieldOfStudy: edu.fieldOfStudy || "",
                startDate: edu.startDate ? edu.startDate.split("T")[0] : "",
                endDate: edu.endDate ? edu.endDate.split("T")[0] : "",
            })) || []) as any[],
            certifications: (resume?.certifications?.map((cert: any) => ({
                certificationName: cert.certificationName || "",
                issuingOrganization: cert.issuingOrganization || "",
                issueDate: cert.issueDate ? cert.issueDate.split("T")[0] : "",
            })) || []) as any[],
            projects: (resume?.projects?.map((proj: any) => ({
                projectName: proj.projectName || "",
                role: proj.role || "",
                description: proj.description || "",
                technologiesUsed: proj.technologiesUsed?.join(", ") || "",
                liveUrl: proj.liveUrl || "",
                githubUrl: proj.githubUrl || "",
                startDate: proj.startDate ? proj.startDate.split("T")[0] : "",
                endDate: proj.endDate ? proj.endDate.split("T")[0] : "",
                highlights: proj.highlights?.join(", ") || "",
            })) || []) as any[],
            languages: (resume?.languages?.map((lang: any) => ({
                language: lang.language || "",
                proficiencyLevel: lang.proficiencyLevel || "",
            })) || []) as any[],
            awards: (resume?.awards?.map((award: any) => ({
                title: award.title || "",
                issuer: award.issuer || "",
                date: award.date ? award.date.split("T")[0] : "",
                description: award.description || "",
            })) || []) as any[],
            references: (resume?.references?.map((ref: any) => ({
                name: ref.name || "",
                designation: ref.designation || "",
                company: ref.company || "",
                email: ref.email || "",
                phone: ref.phone || "",
                relationship: ref.relationship || "",
            })) || []) as any[],
        },
        onSubmit: async ({ value }) => {
            const payload: Record<string, unknown> = { ...value };

            // Sanitize URLs to prevent Zod 400 Validation errors on empty inputs or missing protocol
            const urlFields = ["linkedinUrl", "githubUrl", "portfolioUrl"];
            urlFields.forEach((field) => {
                if (typeof payload[field] === "string") {
                    let trimmed = (payload[field] as string).trim();
                    if (!trimmed) {
                        delete payload[field];
                    } else {
                        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
                            trimmed = "https://" + trimmed;
                        }
                        payload[field] = trimmed;
                    }
                }
            });

            if (!payload.gender) {
                delete payload.gender;
            }

            const arrayFields = ["technicalSkills", "softSkills", "toolsAndTechnologies", "interests"];
            arrayFields.forEach(field => {
                const val = (value as Record<string, unknown>)[field];
                if (typeof val === "string") {
                    payload[field] = val.split(",").map((s: string) => s.trim()).filter(Boolean);
                }
            });

            if (Array.isArray(value.workExperience)) {
                payload.workExperience = value.workExperience.map((exp: any) => ({
                    ...exp,
                    responsibilities: typeof exp.responsibilities === "string"
                        ? exp.responsibilities.split(",").map((s: string) => s.trim()).filter(Boolean)
                        : exp.responsibilities,
                    startDate: exp.startDate ? new Date(exp.startDate).toISOString() : new Date().toISOString(),
                    endDate: exp.endDate ? new Date(exp.endDate).toISOString() : undefined,
                }));
            }
            if (Array.isArray(value.education)) {
                payload.education = value.education.map((edu: any) => ({
                    ...edu,
                    startDate: edu.startDate ? new Date(edu.startDate).toISOString() : new Date().toISOString(),
                    endDate: edu.endDate ? new Date(edu.endDate).toISOString() : undefined,
                }));
            }
            if (Array.isArray(value.certifications)) {
                payload.certifications = value.certifications.map((cert: any) => ({
                    ...cert,
                    issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString() : new Date().toISOString(),
                }));
            }
            if (Array.isArray(value.projects)) {
                payload.projects = value.projects.map((proj: any) => ({
                    ...proj,
                    technologiesUsed: typeof proj.technologiesUsed === "string" ? proj.technologiesUsed.split(",").map((s: string) => s.trim()).filter(Boolean) : proj.technologiesUsed,
                    highlights: typeof proj.highlights === "string" ? proj.highlights.split(",").map((s: string) => s.trim()).filter(Boolean) : proj.highlights,
                    startDate: proj.startDate ? new Date(proj.startDate).toISOString() : undefined,
                    endDate: proj.endDate ? new Date(proj.endDate).toISOString() : undefined,
                }));
            }
            if (Array.isArray(value.awards)) {
                payload.awards = value.awards.map((award: any) => ({
                    ...award,
                    date: award.date ? new Date(award.date).toISOString() : new Date().toISOString(),
                }));
            }

            if (isSectionChargeable) {
                setPendingPayload(payload);
            } else {
                await mutateAsync(payload);
            }
        },
    });

    const confirmUpdate = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (pendingPayload) {
            await mutateAsync(pendingPayload);
            setPendingPayload(null);
        }
    };
    return (
        <div className="space-y-6">
            <AlertDialog open={!!pendingPayload} onOpenChange={(open) => !open && setPendingPayload(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Section Update — 10 Coins</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3 pt-2">
                                <p>
                                    You are updating sections that were already filled (<strong>Basic Information</strong>, <strong>Social Profiles</strong>, <strong>Skills &amp; Summary</strong>, or <strong>Education</strong>). This will cost <strong>10 coins</strong>.
                                </p>
                                <div className="bg-muted p-4 rounded-lg space-y-2 text-foreground">
                                    <div className="flex justify-between">
                                        <span>Current Balance:</span>
                                        <span className="font-semibold">{coins} coins</span>
                                    </div>
                                    <div className="flex justify-between text-red-600 dark:text-red-400 font-medium">
                                        <span>Cost</span>
                                        <span className="font-semibold">-10 coins</span>
                                    </div>
                                    <div className="flex justify-between border-t border-border pt-2 font-bold">
                                        <span>Remaining</span>
                                        <span className={coins < 10 ? "text-destructive" : ""}>{coins - 10} coins</span>
                                    </div>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmUpdate}
                            disabled={isPending || coins < 10}
                            className={coins < 10 ? "opacity-50 cursor-not-allowed" : ""}
                        >
                            {isPending ? "Updating..." : coins < 10 ? "Insufficient Coins" : "Confirm Update"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Resume</h1>
                <Link href="/dashboard/profile-completion-guide">
                    <Button variant="outline" size="sm">
                        <Info className="w-4 h-4 mr-2" /> ATS Scoring Guide
                    </Button>
                </Link>
            </div>

            <ProfileCompletionBar completion={profileCompletion} />

            {isSectionChargeable ? (
                <div className="flex items-center gap-3 rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-800 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-300">
                    <Coins className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                    <span>
                        Updating <strong>Basic Information</strong>, <strong>Social Profiles</strong>, <strong>Skills &amp; Summary</strong>, or <strong>Education</strong> costs <strong>10 coins</strong> per save.
                    </span>
                </div>
            ) : (
                <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 px-4 py-3 text-sm text-blue-800 dark:text-blue-300">
                    <AlertCircle className="h-5 w-5 shrink-0 text-blue-500" />
                    <span>
                        Fill in your profile sections for the first time — it&apos;s <strong>free</strong>! Updates to already-filled sections cost <strong>10 coins</strong>.
                    </span>
                </div>
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
                        className="space-y-8"
                    >
                        {/* BASIC INFORMATION */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center justify-between">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <form.Field name="fullName">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Full Name" placeholder="John Doe" />}
                                </form.Field>

                                <form.Field name="email">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Email" type="email" placeholder="john@example.com" />}
                                </form.Field>

                                <form.Field name="professionalTitle">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Professional Title" placeholder="e.g. Full Stack Developer" />}
                                </form.Field>

                                <form.Field name="contactNumber">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Contact Number" placeholder="+880..." />}
                                </form.Field>

                                <form.Field name="address">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Address" placeholder="Dhaka, Bangladesh" />}
                                </form.Field>

                                <form.Field name="nationality">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Nationality" placeholder="e.g. Bangladeshi" />}
                                </form.Field>

                                <form.Field name="dateOfBirth">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Date of Birth" type="date" />}
                                </form.Field>

                                <form.Field name="gender">
                                    {(field) => {
                                        const error = field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : null;
                                        const serverErr = serverErrors[field.name];
                                        const finalError = error || serverErr;
                                        const errorMsg = typeof finalError === "string" ? finalError : (finalError as any)?.message || String(finalError || "");
                                        return (
                                            <div className="space-y-1.5">
                                                <Label htmlFor={field.name} className={error ? "text-destructive" : ""}>Gender</Label>
                                                <Select
                                                    value={(field.state.value as string) || undefined}
                                                    onValueChange={(value) => field.handleChange(value)}
                                                >
                                                    <SelectTrigger id={field.name} className={error ? "border-destructive focus:ring-destructive" : ""}>
                                                        <SelectValue placeholder="Select Gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="MALE">Male</SelectItem>
                                                        <SelectItem value="FEMALE">Female</SelectItem>
                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {error && <p className="text-sm text-destructive">{errorMsg}</p>}
                                            </div>
                                        )
                                    }}
                                </form.Field>
                            </div>
                        </div>

                        {/* SOCIAL PROFILES */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center justify-between">Social Profiles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <form.Field name="linkedinUrl">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="LinkedIn URL" placeholder="https://linkedin.com/in/..." />}
                                </form.Field>

                                <form.Field name="githubUrl">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="GitHub URL" placeholder="https://github.com/..." />}
                                </form.Field>

                                <form.Field name="portfolioUrl">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Portfolio URL" placeholder="https://..." />}
                                </form.Field>
                            </div>
                        </div>

                        {/* SKILLS & SUMMARY */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center justify-between">Skills & Summary</h3>
                            <form.Field name="technicalSkills">
                                {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Technical Skills (comma separated)" placeholder="React, TypeScript, Node.js, ..." />}
                            </form.Field>
                            <form.Field name="softSkills">
                                {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Soft Skills (comma separated)" placeholder="Communication, Teamwork, Leadership, ..." />}
                            </form.Field>
                            <form.Field name="toolsAndTechnologies">
                                {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Tools & Technologies (comma separated)" placeholder="Git, Docker, VS Code, ..." />}
                            </form.Field>
                            <form.Field name="interests">
                                {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Interests (comma separated)" placeholder="Reading, Traveling, Open Source, ..." />}
                            </form.Field>

                            <form.Field name="professionalSummary">
                                {(field) => (
                                    <div className="space-y-1">
                                        <AppField field={field} serverError={serverErrors[field.name]} label="Professional Summary" placeholder="Brief summary of your experience and goals..." />
                                        <p className="text-xs text-muted-foreground mt-1">A brief description will significantly boost your ATS Profile Completion score.</p>
                                    </div>
                                )}
                            </form.Field>
                        </div>

                        {/* WORK EXPERIENCE */}
                        <form.Field name="workExperience" mode="array">
                            {(field) => (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center justify-between">
                                        Work Experience
                                        <Button type="button" variant="outline" size="sm" onClick={() => field.pushValue({ jobTitle: "", companyName: "", startDate: "", endDate: "", responsibilities: "" })}>
                                            <Plus className="w-4 h-4 mr-2" /> Add
                                        </Button>
                                    </h3>
                                    {field.state.value.map((_: any, i: number) => (
                                        <Card key={i} className="relative bg-muted/30">
                                            <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 text-destructive" onClick={() => field.removeValue(i)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <form.Field name={`workExperience[${i}].jobTitle`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Job Title" placeholder="Software Engineer" />}
                                                </form.Field>
                                                <form.Field name={`workExperience[${i}].companyName`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Company Name" placeholder="Google" />}
                                                </form.Field>
                                                <form.Field name={`workExperience[${i}].startDate`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Start Date" type="date" />}
                                                </form.Field>
                                                <form.Field name={`workExperience[${i}].endDate`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="End Date" type="date" />}
                                                </form.Field>
                                                <div className="md:col-span-2">
                                                    <form.Field name={`workExperience[${i}].responsibilities`}>
                                                        {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Responsibilities (comma separated)" />}
                                                    </form.Field>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </form.Field>

                        {/* EDUCATION */}
                        <form.Field name="education" mode="array">
                            {(field) => (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center justify-between">
                                        Education
                                        <Button type="button" variant="outline" size="sm" onClick={() => field.pushValue({ degree: "", institutionName: "", fieldOfStudy: "", startDate: "", endDate: "" })}>
                                            <Plus className="w-4 h-4 mr-2" /> Add
                                        </Button>
                                    </h3>
                                    {field.state.value.map((_: any, i: number) => (
                                        <Card key={i} className="relative bg-muted/30">
                                            <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 text-destructive" onClick={() => field.removeValue(i)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <form.Field name={`education[${i}].degree`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Degree" placeholder="BSc in Computer Science" />}
                                                </form.Field>
                                                <form.Field name={`education[${i}].institutionName`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Institution" placeholder="University Name" />}
                                                </form.Field>
                                                <form.Field name={`education[${i}].fieldOfStudy`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Field of Study" placeholder="Computer Science" />}
                                                </form.Field>
                                                <form.Field name={`education[${i}].startDate`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Start Date" type="date" />}
                                                </form.Field>
                                                <form.Field name={`education[${i}].endDate`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="End Date" type="date" />}
                                                </form.Field>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </form.Field>

                        {/* CERTIFICATIONS */}
                        <form.Field name="certifications" mode="array">
                            {(field) => (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center justify-between">
                                        Certifications
                                        <Button type="button" variant="outline" size="sm" onClick={() => field.pushValue({ certificationName: "", issuingOrganization: "", issueDate: "" })}>
                                            <Plus className="w-4 h-4 mr-2" /> Add
                                        </Button>
                                    </h3>
                                    {field.state.value.map((_: any, i: number) => (
                                        <Card key={i} className="relative bg-muted/30">
                                            <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 text-destructive" onClick={() => field.removeValue(i)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <form.Field name={`certifications[${i}].certificationName`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Certification Name" placeholder="AWS Certified Solutions Architect" />}
                                                </form.Field>
                                                <form.Field name={`certifications[${i}].issuingOrganization`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Issuing Organization" placeholder="Amazon Web Services" />}
                                                </form.Field>
                                                <form.Field name={`certifications[${i}].issueDate`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Issue Date" type="date" />}
                                                </form.Field>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </form.Field>

                        {/* PROJECTS */}
                        <form.Field name="projects" mode="array">
                            {(field) => (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center justify-between">
                                        Projects
                                        <Button type="button" variant="outline" size="sm" onClick={() => field.pushValue({ projectName: "", role: "", description: "", technologiesUsed: "", liveUrl: "", githubUrl: "", startDate: "", endDate: "", highlights: "" })}>
                                            <Plus className="w-4 h-4 mr-2" /> Add
                                        </Button>
                                    </h3>
                                    {field.state.value.map((_: any, i: number) => (
                                        <Card key={i} className="relative bg-muted/30">
                                            <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 text-destructive" onClick={() => field.removeValue(i)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <form.Field name={`projects[${i}].projectName`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Project Name" placeholder="E-commerce Platform" />}
                                                </form.Field>
                                                <form.Field name={`projects[${i}].role`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Role" placeholder="Lead Developer" />}
                                                </form.Field>
                                                <div className="md:col-span-2">
                                                    <form.Field name={`projects[${i}].description`}>
                                                        {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Description" placeholder="Project summary..." />}
                                                    </form.Field>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <form.Field name={`projects[${i}].technologiesUsed`}>
                                                        {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Technologies Used (comma separated)" placeholder="React, Node.js..." />}
                                                    </form.Field>
                                                </div>
                                                <form.Field name={`projects[${i}].liveUrl`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Live URL" placeholder="https://..." />}
                                                </form.Field>
                                                <form.Field name={`projects[${i}].githubUrl`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="GitHub URL" placeholder="https://github.com/..." />}
                                                </form.Field>
                                                <form.Field name={`projects[${i}].startDate`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Start Date" type="date" />}
                                                </form.Field>
                                                <form.Field name={`projects[${i}].endDate`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="End Date" type="date" />}
                                                </form.Field>
                                                <div className="md:col-span-2">
                                                    <form.Field name={`projects[${i}].highlights`}>
                                                        {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Highlights (comma separated)" placeholder="Increased performance by 50%..." />}
                                                    </form.Field>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </form.Field>

                        {/* LANGUAGES */}
                        <form.Field name="languages" mode="array">
                            {(field) => (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center justify-between">
                                        Languages
                                        <Button type="button" variant="outline" size="sm" onClick={() => field.pushValue({ language: "", proficiencyLevel: "" })}>
                                            <Plus className="w-4 h-4 mr-2" /> Add
                                        </Button>
                                    </h3>
                                    {field.state.value.map((_: any, i: number) => (
                                        <Card key={i} className="relative bg-muted/30">
                                            <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 text-destructive" onClick={() => field.removeValue(i)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <form.Field name={`languages[${i}].language`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Language" placeholder="English" />}
                                                </form.Field>
                                                <form.Field name={`languages[${i}].proficiencyLevel`}>
                                                    {(subField) => {
                                                        const error = subField.state.meta.isTouched && subField.state.meta.errors.length > 0 ? subField.state.meta.errors[0] : null;
                                                        const serverErr = serverErrors[subField.name];
                                                        const finalError = error || serverErr;
                                                        const errorMsg = typeof finalError === "string" ? finalError : (finalError as any)?.message || String(finalError || "");
                                                        return (
                                                            <div className="space-y-1.5">
                                                                <Label htmlFor={subField.name} className={errorMsg ? "text-destructive" : ""}>Proficiency Level</Label>
                                                                <Select
                                                                    value={(subField.state.value as string) || undefined}
                                                                    onValueChange={(value) => subField.handleChange(value)}
                                                                >
                                                                    <SelectTrigger id={subField.name} className={errorMsg ? "border-destructive focus:ring-destructive" : ""}>
                                                                        <SelectValue placeholder="Select Proficiency" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Native">Native</SelectItem>
                                                                        <SelectItem value="Fluent">Fluent</SelectItem>
                                                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
                                                            </div>
                                                        )
                                                    }}
                                                </form.Field>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </form.Field>

                        {/* AWARDS */}
                        <form.Field name="awards" mode="array">
                            {(field) => (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center justify-between">
                                        Awards
                                        <Button type="button" variant="outline" size="sm" onClick={() => field.pushValue({ title: "", issuer: "", date: "", description: "" })}>
                                            <Plus className="w-4 h-4 mr-2" /> Add
                                        </Button>
                                    </h3>
                                    {field.state.value.map((_: any, i: number) => (
                                        <Card key={i} className="relative bg-muted/30">
                                            <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 text-destructive" onClick={() => field.removeValue(i)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <form.Field name={`awards[${i}].title`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Title" placeholder="Employee of the Month" />}
                                                </form.Field>
                                                <form.Field name={`awards[${i}].issuer`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Issuer" placeholder="Google" />}
                                                </form.Field>
                                                <form.Field name={`awards[${i}].date`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Date" type="date" />}
                                                </form.Field>
                                                <div className="md:col-span-2">
                                                    <form.Field name={`awards[${i}].description`}>
                                                        {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Description" />}
                                                    </form.Field>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </form.Field>

                        {/* REFERENCES */}
                        <form.Field name="references" mode="array">
                            {(field) => (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center justify-between">
                                        References
                                        <Button type="button" variant="outline" size="sm" onClick={() => field.pushValue({ name: "", designation: "", company: "", email: "", phone: "", relationship: "" })}>
                                            <Plus className="w-4 h-4 mr-2" /> Add
                                        </Button>
                                    </h3>
                                    {field.state.value.map((_: any, i: number) => (
                                        <Card key={i} className="relative bg-muted/30">
                                            <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 text-destructive" onClick={() => field.removeValue(i)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <form.Field name={`references[${i}].name`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Name" placeholder="Jane Doe" />}
                                                </form.Field>
                                                <form.Field name={`references[${i}].designation`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Designation" placeholder="Manager" />}
                                                </form.Field>
                                                <form.Field name={`references[${i}].company`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Company" placeholder="Google" />}
                                                </form.Field>
                                                <form.Field name={`references[${i}].email`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Email" type="email" placeholder="jane@example.com" />}
                                                </form.Field>
                                                <form.Field name={`references[${i}].phone`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Phone" placeholder="+1..." />}
                                                </form.Field>
                                                <form.Field name={`references[${i}].relationship`}>
                                                    {(subField) => <AppField field={subField as any} serverError={serverErrors[subField.name]} label="Relationship" placeholder="Manager" />}
                                                </form.Field>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </form.Field>

                        <div className="pt-4">
                            <AppSubmitButton isPending={isPending} pendingLabel="Saving...">
                                {isSectionChargeable ? "Update Resume (10 coins)" : "Save Resume"}
                            </AppSubmitButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

const MyResumeContent = () => {
    const { data, isLoading: isResumeLoading } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
    });

    const { data: walletRes, isLoading: isWalletLoading } = useQuery({
        queryKey: ["my-wallet"],
        queryFn: () => getMyWallet(),
    });

    if (isResumeLoading || isWalletLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return <MyResumeForm resume={data?.data} coins={walletRes?.data?.balance || 0} />;
};

export default MyResumeContent;
