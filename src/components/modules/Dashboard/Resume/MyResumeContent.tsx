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
                const newCompletion = response?.data?.profileCompletion ?? 0;
                if (!isPremium && newCompletion === 100) {
                    toast.success(
                        "Your profile is 100% complete! Upgrade to Career Boost to make future updates and download your ATS-optimised PDF.",
                        { duration: 6000 },
                    );
                } else {
                    toast.success("Resume updated successfully!");
                }
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
        <div className="w-full container mx-auto space-y-6 lg:space-y-8 pb-10">
            {/* ── Header ── */}
            <div className="relative rounded-3xl border border-border/40 bg-card overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5" />
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <FileText className="w-48 h-48 -rotate-12" />
                </div>

                <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-2 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-2">
                            <Crown className="w-4 h-4" /> Career Builder
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                            My Resume
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
                            Build, preview, and download your beautifully formatted, ATS-optimised resume directly from your profile.
                        </p>
                    </div>
                    <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        {isPremium ? (
                            <Button
                                onClick={handleDownloadPdf}
                                disabled={isDownloading}
                                className="rounded-xl px-6 h-12 font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform gap-2 w-full sm:w-auto"
                            >
                                {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowDownToLine className="w-5 h-5" />}
                                {isDownloading ? "Generating…" : "Download PDF"}
                            </Button>
                        ) : (
                            <Link href="/dashboard/subscriptions" className="w-full sm:w-auto">
                                <Button
                                    className="w-full rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 h-12 font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-transform gap-2 border-0"
                                >
                                    <Crown className="w-5 h-5" /> Download PDF
                                    <Badge variant="secondary" className="ml-1 text-[10px] py-0.5 px-2 bg-white/20 hover:bg-white/30 text-white border-0 shadow-none">PRO</Badge>
                                </Button>
                            </Link>
                        )}
                        <Link href="/dashboard/profile-completion-guide" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full rounded-xl px-6 h-12 font-bold border-border/50 hover:bg-muted/40 shadow-sm gap-2">
                                <AlertCircle className="w-5 h-5" /> ATS Guide
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Profile completion bar (updates only after save) ── */}
            <div className="px-1">
                <ProfileCompletionBar completion={resume?.profileCompletion ?? 0} />
            </div>

            {/* ── Status banner ── */}
            {isPremium ? (
                <div className="flex items-center gap-3 rounded-2xl border border-amber-300/60 bg-amber-500/5 dark:bg-amber-950/20 dark:border-amber-800/50 px-5 py-4 text-sm text-amber-800 dark:text-amber-300/90 shadow-sm transition-all hover:bg-amber-500/10">
                    <Crown className="h-5 w-5 shrink-0 text-amber-500" />
                    <span>You have <strong>Career Boost</strong> — unlimited updates & professional ATS PDF downloads enabled.</span>
                </div>
            ) : (!isPremium && (resume?.profileCompletion ?? 0) === 100) ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-rose-300/60 bg-rose-500/5 dark:bg-rose-950/20 dark:border-rose-800/50 px-5 py-4 text-sm text-rose-800 dark:text-rose-300/90 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 shrink-0 text-rose-500" />
                        <span>Your profile is 100% complete and <strong>locked</strong>. Upgrade to Career Boost to keep editing.</span>
                    </div>
                    <Link href="/dashboard/subscriptions">
                        <Button size="sm" variant="destructive" className="rounded-xl font-semibold shadow-md shadow-rose-500/20 w-full sm:w-auto">Upgrade Now</Button>
                    </Link>
                </div>
            ) : null}

            {/* ── Side-by-side layout ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">

                {/* ─── LEFT: Form ─── */}
                <div>
                    <Card className="rounded-3xl border border-border/40 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="pb-4 bg-muted/20 border-b border-border/40 px-6 py-5">
                            <CardTitle className="flex items-center gap-2.5 text-lg">
                                <FileText className="w-5 h-5 text-primary" />
                                Profile Information Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {(() => {
                                const savedIsLocked = !isPremium && (resume?.profileCompletion ?? 0) === 100;
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
                                        <BasicInfoSection form={form} se={se} computedIsLocked={savedIsLocked} isPremium={isPremium} resume={resume} />
                                        <hr className="border-border/60" />
                                        <SocialProfilesSection form={form} se={se} />
                                        <hr className="border-border/60" />
                                        <SkillsSummarySection form={form} se={se} computedIsLocked={savedIsLocked} isPremium={isPremium} resume={resume} />
                                        <hr className="border-border/60" />
                                        <WorkExperienceSection form={form} se={se} computedIsLocked={savedIsLocked} workExpLocked={workExpLocked} />
                                        <hr className="border-border/60" />
                                        <EducationSection form={form} se={se} computedIsLocked={savedIsLocked} educationLocked={educationLocked} />
                                        <hr className="border-border/60" />
                                        <CertificationsSection form={form} se={se} computedIsLocked={savedIsLocked} />
                                        <hr className="border-border/60" />
                                        <ProjectsSection form={form} se={se} computedIsLocked={savedIsLocked} />
                                        <hr className="border-border/60" />
                                        <LanguagesSection form={form} se={se} computedIsLocked={savedIsLocked} />
                                        <hr className="border-border/60" />
                                        <AwardsSection form={form} se={se} computedIsLocked={savedIsLocked} />
                                        <hr className="border-border/60" />
                                        <ReferencesSection form={form} se={se} computedIsLocked={savedIsLocked} />
                                        <hr className="border-border/60" />
                                        <InterestsSection form={form} se={se} />

                                        {/* ── Submit ── */}
                                        <div className="mt-8 sticky bottom-0 bg-card/90 backdrop-blur-xl py-5 border-t border-border/40 z-20 w-[calc(100%+3rem)] -ml-6 px-6 shadow-[0_-15px_15px_-10px_rgba(0,0,0,0.05)]">
                                            <AppSubmitButton isPending={isPending} disabled={savedIsLocked} pendingLabel="Saving…" className="w-full sm:w-auto min-w-50 h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform">
                                                {savedIsLocked ? (
                                                    <><Lock className="w-4 h-4 mr-2" /> Profile Locked</>
                                                ) : "Save Resume Changes"}
                                            </AppSubmitButton>
                                            {savedIsLocked && (
                                                <p className="text-xs sm:text-sm text-center sm:text-left text-muted-foreground mt-3">
                                                    <Link href="/dashboard/subscriptions" className="font-semibold text-primary hover:underline underline-offset-4">Upgrade to Career Boost</Link> to continue editing.
                                                </p>
                                            )}
                                        </div>
                                    </form>
                                );
                            })()}
                        </CardContent>
                    </Card>
                </div>

                {/* ─── RIGHT: Live Preview ─── */}
                <div className="hidden xl:block relative">
                    <div className="sticky top-6">
                        <div className="flex items-center justify-between mb-4 bg-muted/30 px-5 py-3 rounded-2xl border border-border/40">
                            <h3 className="text-base font-bold flex items-center gap-2 relative z-10 text-foreground">
                                <FileText className="w-4 h-4 text-primary" /> Live Document Preview
                            </h3>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-accent rounded-lg">Auto-syncing</Badge>
                        </div>
                        <div className="max-h-[calc(100vh-140px)] overflow-y-auto rounded-3xl border border-border/40 shadow-2xl shadow-primary/5 bg-background scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
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
            isPremium={data?.data?.user?.isPremium || false}
        />
    );
};

export default MyResumeContent;
