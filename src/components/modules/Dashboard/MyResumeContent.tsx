"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import { useState } from "react";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import ProfileCompletionBar from "@/components/shared/ProfileCompletionBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { AlertCircle, Coins, Plus, Trash2 } from "lucide-react";
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
    const isProfileCompleted = !!resume?.profileCompletedAt;
    const form = useForm({
        defaultValues: {
            professionalTitle: resume?.professionalTitle || "",
            professionalSummary: resume?.professionalSummary || "",
            technicalSkills: resume?.technicalSkills?.join(", ") || "",
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

            if (typeof value.technicalSkills === "string") {
                payload.technicalSkills = value.technicalSkills.split(",").map((s: string) => s.trim()).filter(Boolean);
            }

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

            if (isProfileCompleted) {
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
                        <AlertDialogTitle>Confirm Profile Update</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3 pt-2">
                                <p>
                                    Your profile has already been completed. Any further updates will charge <strong>15 coins</strong> from your wallet.
                                </p>
                                <div className="bg-muted p-4 rounded-lg space-y-2 text-foreground">
                                    <div className="flex justify-between">
                                        <span>Current Balance:</span>
                                        <span className="font-semibold">{coins} coins</span>
                                    </div>
                                    <div className="flex justify-between text-destructive">
                                        <span>Update Cost:</span>
                                        <span className="font-semibold">-15 coins</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-bold">
                                        <span>Remaining Balance:</span>
                                        <span className={coins < 15 ? "text-destructive" : ""}>{coins - 15} coins</span>
                                    </div>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmUpdate}
                            disabled={isPending || coins < 15}
                            className={coins < 15 ? "opacity-50 cursor-not-allowed" : ""}
                        >
                            {isPending ? "Updating..." : coins < 15 ? "Insufficient Coins" : "Confirm Update"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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

            {!isProfileCompleted && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Complete your profile to 50% to unlock all features. First completion is free!
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
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <form.Field name="professionalTitle">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Professional Title" placeholder="e.g. Full Stack Developer" />}
                                </form.Field>

                                <form.Field name="contactNumber">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Contact Number" placeholder="+880..." />}
                                </form.Field>

                                <form.Field name="address">
                                    {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Address" placeholder="Dhaka, Bangladesh" />}
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

                            <form.Field name="technicalSkills">
                                {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Technical Skills (comma separated)" placeholder="React, TypeScript, Node.js, ..." />}
                            </form.Field>

                            <form.Field name="professionalSummary">
                                {(field) => <AppField field={field} serverError={serverErrors[field.name]} label="Professional Summary" placeholder="Brief summary of your experience and goals..." />}
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

                        <div className="pt-4">
                            <AppSubmitButton isPending={isPending} pendingLabel="Saving...">
                                {isProfileCompleted ? "Update Resume (15 coins)" : "Save Resume"}
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
