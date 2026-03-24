"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import ProfileCompletionBar from "@/components/shared/ProfileCompletionBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import envConfig from "@/lib/envConfig";
import { getMyResume, updateMyResume } from "@/services/resume.services";
import Link from "next/link";
import { useState } from "react";
import { ResumeSkeleton } from "./resume-form-helpers";
import {
    AwardsSection,
    BasicInfoSection,
    CertificationsSection,
    EducationSection,
    InterestsSection,
    LanguagesSection,
    ProjectsSection,
    ReferencesSection,
    SkillsSummarySection,
    SocialProfilesSection,
    WorkExperienceSection,
} from "./ResumeFormSections";
import ResumeTwoPageLayout from "./ResumeTwoPageLayout";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowDownToLine,
    Crown,
    FileText,
    Loader2,
    Lock,
} from "lucide-react";
import { toast } from "sonner";

// ─── Profile completion calculator ───────────────────────────────────────────

const calculateProfileCompletion = (formValue: any) => {
    const checklist: Record<string, boolean> = {
        fullName: !!formValue?.fullName?.trim(),
        email: !!formValue?.email?.trim(),
        professionalTitle: !!formValue?.professionalTitle?.trim(),
        professionalSummary: !!formValue?.professionalSummary?.trim(),
        technicalSkills: !!formValue?.technicalSkills?.trim(),
        softSkills: !!formValue?.softSkills?.trim(),
        toolsAndTechnologies: !!formValue?.toolsAndTechnologies?.trim(),
        contactNumber: !!formValue?.contactNumber?.trim(),
        address: !!formValue?.address?.trim(),
        dateOfBirth: !!formValue?.dateOfBirth?.trim(),
        gender: !!formValue?.gender?.trim(),
        linkedinUrl: !!formValue?.linkedinUrl?.trim(),
        githubUrl: !!formValue?.githubUrl?.trim(),
        portfolioUrl: !!formValue?.portfolioUrl?.trim(),
        hasEducation: (formValue?.education || []).some((edu: any) => edu.degree?.trim()),
        hasWorkExperience: (formValue?.workExperience || []).some((we: any) => we.jobTitle?.trim()),
        hasProjects: (formValue?.projects || []).some((proj: any) => proj.projectName?.trim()),
        hasLanguages: (formValue?.languages || []).some((lang: any) => lang.language?.trim()),
    };

    const completedFields = Object.values(checklist).filter(Boolean).length;
    const totalFields = Object.keys(checklist).length;
    return Math.round((completedFields / totalFields) * 100);
};

// ─── Submit payload builder ──────────────────────────────────────────────────

const buildSubmitPayload = (value: any): Record<string, unknown> => {
    const payload: Record<string, unknown> = { ...value };

    // Sanitize URL fields
    const urlFields = ["linkedinUrl", "githubUrl", "portfolioUrl"];
    urlFields.forEach((f) => {
        if (typeof payload[f] === "string") {
            let trimmed = (payload[f] as string).trim();
            if (!trimmed) {
                delete payload[f];
            } else {
                if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
                    trimmed = "https://" + trimmed;
                }
                payload[f] = trimmed;
            }
        }
    });

    if (!payload.gender) delete payload.gender;

    const csvFields = ["technicalSkills", "softSkills", "toolsAndTechnologies", "interests"];
    csvFields.forEach((f) => {
        const val = value[f];
        if (typeof val === "string") {
            payload[f] = val.split(",").map((s: string) => s.trim()).filter(Boolean);
        }
    });

    const csvArr = (s: string | string[]) =>
        typeof s === "string" ? s.split(",").map((x) => x.trim()).filter(Boolean) : s;

    if (Array.isArray(value.workExperience)) {
        payload.workExperience = value.workExperience.map((exp: any) => ({
            ...exp,
            responsibilities: csvArr(exp.responsibilities),
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
            technologiesUsed: csvArr(proj.technologiesUsed),
            highlights: csvArr(proj.highlights),
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

    return payload;
};

// ─── Main form ───────────────────────────────────────────────────────────────

const MyResumeForm = ({ resume, isPremium }: { resume: any; isPremium: boolean }) => {
    const queryClient = useQueryClient();
    const [isDownloading, setIsDownloading] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

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
                    toast.error("Please fix the field errors marked below.");
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
            await mutateAsync(buildSubmitPayload(value));
        },
    });

    const handleDownloadPdf = async () => {
        if (!isPremium) return;
        setIsDownloading(true);
        try {
            const res = await fetch(`${envConfig.apiBaseUrl}/resumes/download-pdf`, { credentials: "include" });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.message || "Failed to download PDF");
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${form.store.state.values.fullName || "Resume"}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success("Resume PDF downloaded!");
        } catch (err: any) {
            toast.error(err.message || "Failed to download PDF");
        } finally {
            setIsDownloading(false);
        }
    };

    const se = serverErrors;

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Resume</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Build your ATS-optimised resume
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {isPremium ? (
                        <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isDownloading}>
                            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowDownToLine className="w-4 h-4 mr-2" />}
                            {isDownloading ? "Downloading…" : "Download PDF"}
                        </Button>
                    ) : (
                        <Link href="/dashboard/subscriptions">
                            <Button variant="outline" size="sm" className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950">
                                <Crown className="w-4 h-4 mr-2" /> Download PDF
                                <Badge variant="secondary" className="ml-2 text-[10px] py-0 px-1.5">PRO</Badge>
                            </Button>
                        </Link>
                    )}
                    <Link href="/dashboard/profile-completion-guide">
                        <Button variant="outline" size="sm">
                            <AlertCircle className="w-4 h-4 mr-2" /> ATS Guide
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ── Profile completion bar ── */}
            <form.Subscribe selector={(s) => s.values}>
                {(values) => {
                    const computedCompl = calculateProfileCompletion(values);
                    const profileComp = computedCompl > 0 ? computedCompl : (resume?.profileCompletion ?? 0);
                    const isLockedStatus = !isPremium && profileComp === 100;

                    return (
                        <>
                            <ProfileCompletionBar completion={profileComp} />

                            {/* ── Status banner ── */}
                            {isPremium ? (
                                <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                                    <Crown className="h-5 w-5 shrink-0 text-amber-500" />
                                    <span>You have <strong>Career Boost</strong> — unlimited updates & professional ATS PDF downloads.</span>
                                </div>
                            ) : isLockedStatus ? (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-300">
                                    <div className="flex items-center gap-3">
                                        <Lock className="h-5 w-5 shrink-0 text-red-500" />
                                        <span>Your profile is 100% complete and <strong>locked</strong>. Upgrade to keep editing.</span>
                                    </div>
                                    <Link href="/dashboard/subscriptions">
                                        <Button size="sm" variant="destructive">Upgrade Now</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 px-4 py-3 text-sm text-blue-800 dark:text-blue-300">
                                    <AlertCircle className="h-5 w-5 shrink-0 text-blue-500" />
                                    <span>Fill in all sections to reach 100%. Editing is disabled at 100% on the Free tier.</span>
                                </div>
                            )}
                        </>
                    );
                }}
            </form.Subscribe>

            {/* ── Side-by-side layout ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* ─── LEFT: Form ─── */}
                <div>
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form.Subscribe selector={(s) => s.values}>
                                {(values) => {
                                    const computedIsLocked = !isPremium && calculateProfileCompletion(values) === 100;
                                    const workExpLocked = !isPremium && !!(resume?.workExperience?.length);
                                    const educationLocked = !isPremium && !!(resume?.education?.length);

                                    return (
                                        <form
                                            noValidate
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                form.handleSubmit();
                                                setTimeout(() => {
                                                    const errorCount = Object.values(form.state.fieldMeta).filter(
                                                        (m: any) => m.errors?.length > 0,
                                                    ).length;
                                                    if (errorCount > 0) {
                                                        toast.error(`Please fix ${errorCount} error${errorCount > 1 ? "s" : ""} highlighted in the form.`);
                                                    }
                                                }, 50);
                                            }}
                                            className="space-y-6"
                                        >
                                            <BasicInfoSection form={form} se={se} computedIsLocked={computedIsLocked} isPremium={isPremium} resume={resume} />
                                            <hr className="border-border/60" />
                                            <SocialProfilesSection form={form} se={se} />
                                            <hr className="border-border/60" />
                                            <SkillsSummarySection form={form} se={se} computedIsLocked={computedIsLocked} isPremium={isPremium} resume={resume} />
                                            <hr className="border-border/60" />
                                            <WorkExperienceSection form={form} se={se} computedIsLocked={computedIsLocked} workExpLocked={workExpLocked} />
                                            <hr className="border-border/60" />
                                            <EducationSection form={form} se={se} computedIsLocked={computedIsLocked} educationLocked={educationLocked} />
                                            <hr className="border-border/60" />
                                            <CertificationsSection form={form} se={se} computedIsLocked={computedIsLocked} />
                                            <hr className="border-border/60" />
                                            <ProjectsSection form={form} se={se} computedIsLocked={computedIsLocked} />
                                            <hr className="border-border/60" />
                                            <LanguagesSection form={form} se={se} computedIsLocked={computedIsLocked} />
                                            <hr className="border-border/60" />
                                            <AwardsSection form={form} se={se} computedIsLocked={computedIsLocked} />
                                            <hr className="border-border/60" />
                                            <ReferencesSection form={form} se={se} computedIsLocked={computedIsLocked} />
                                            <hr className="border-border/60" />
                                            <InterestsSection form={form} se={se} />

                                            {/* ── Submit ── */}
                                            <div className="pt-2 sticky bottom-0 bg-card pb-2">
                                                <AppSubmitButton isPending={isPending} disabled={computedIsLocked} pendingLabel="Saving…">
                                                    {computedIsLocked ? (
                                                        <><Lock className="w-4 h-4 mr-2" /> Profile Locked</>
                                                    ) : "Save Resume"}
                                                </AppSubmitButton>
                                                {computedIsLocked && (
                                                    <p className="text-xs text-center text-muted-foreground mt-2">
                                                        <Link href="/dashboard/subscriptions" className="underline font-medium">Upgrade to Career Boost</Link> to continue editing.
                                                    </p>
                                                )}
                                            </div>
                                        </form>
                                    );
                                }}
                            </form.Subscribe>
                        </CardContent>
                    </Card>
                </div>

                {/* ─── RIGHT: Live Preview ─── */}
                <div className="hidden xl:block">
                    <div className="sticky top-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" /> Live Preview
                            </h3>
                            <Badge variant="outline" className="text-xs">Auto-updates</Badge>
                        </div>
                        <div className="max-h-[calc(100vh-140px)] overflow-y-auto rounded-lg border border-gray-200 shadow-sm bg-white px-6 pt-8 pb-6">
                            <form.Subscribe selector={(s) => s.values}>
                                {(values) => <ResumeTwoPageLayout values={values} />}
                            </form.Subscribe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Root component ──────────────────────────────────────────────────────────

const MyResumeContent = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
    });

    if (isLoading) return <ResumeSkeleton />;

    return (
        <MyResumeForm
            resume={data?.data}
            isPremium={data?.data?.isPremium || false}
        />
    );
};

export default MyResumeContent;
