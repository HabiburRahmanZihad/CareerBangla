"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { downloadCvForRecruiter, getApplicationsByJob, updateApplicationStatus } from "@/services/application.services";
import { getMyJobs } from "@/services/job.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, BookOpen, Briefcase, Calendar, Code, Crown, ExternalLink, FileText, Globe, Loader2, Lock, Mail, Phone, StickyNote, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SHORTLISTED: "bg-indigo-100 text-indigo-800",
    INTERVIEW: "bg-blue-100 text-blue-800",
    HIRED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
};

const terminalStatuses = ["HIRED", "REJECTED", "INTERVIEW"];

// Recruiter can only move forward: PENDING → SHORTLISTED → INTERVIEW
// HIRED is set by Admin only after final verification
const validTransitions: Record<string, string[]> = {
    PENDING: ["SHORTLISTED"],
    SHORTLISTED: ["INTERVIEW"],
    INTERVIEW: [],
    HIRED: [],
    REJECTED: [],
};

const toPdfBlob = (payload: unknown): Blob => {
    if (payload instanceof Blob) {
        return payload;
    }

    if (payload instanceof ArrayBuffer) {
        return new Blob([payload], { type: "application/pdf" });
    }

    if (ArrayBuffer.isView(payload)) {
        const view = payload as ArrayBufferView;
        const bytes = new Uint8Array(view.buffer, view.byteOffset || 0, view.byteLength || 0);
        return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    }

    if (payload && typeof payload === "object" && "type" in payload && "data" in payload) {
        const maybeBuffer = payload as { type?: unknown; data?: unknown };
        if (maybeBuffer.type === "Buffer" && Array.isArray(maybeBuffer.data)) {
            return new Blob([new Uint8Array(maybeBuffer.data)], { type: "application/pdf" });
        }
    }

    return new Blob([payload as BlobPart], { type: "application/pdf" });
};

interface ApplicationDetailViewProps {
    app: any;
    isPremiumRecruiter: boolean;
    isUpdating: boolean;
    downloadingCv: string | null;
    onBack: () => void;
    onStatusChange: (appId: string, status: string) => void;
    onDownloadCv: (userId: string, userName: string, applicationId?: string) => void;
}

const ApplicationDetailView = ({ app, isPremiumRecruiter, isUpdating, downloadingCv, onBack, onStatusChange, onDownloadCv }: ApplicationDetailViewProps) => {
    const nextStatuses = validTransitions[app.status] || [];
    const isTerminal = terminalStatuses.includes(app.status);
    const resume = app.user?.resume;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Applications
                </Button>
                <Badge className={statusColors[app.status] || ""}>{app.status}</Badge>
            </div>

            {/* Candidate Profile Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                            {resume?.profilePhoto || app.user?.image ? (
                                <Image
                                    src={resume?.profilePhoto || app.user.image}
                                    alt={app.user?.name || ""}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold">{app.user?.name || "Unknown"}</h2>
                            {resume?.professionalTitle && (
                                <p className="text-muted-foreground">{resume.professionalTitle}</p>
                            )}
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                {isPremiumRecruiter ? (
                                    <>
                                        {app.user?.email && (
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3.5 h-3.5" /> {app.user.email}
                                            </span>
                                        )}
                                        {resume?.contactNumber && (
                                            <span className="flex items-center gap-1">
                                                <Phone className="w-3.5 h-3.5" /> {resume.contactNumber}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs">
                                        <Lock className="w-3 h-3" /> Contact info hidden — upgrade to Career Boost
                                    </span>
                                )}
                                {resume?.linkedinUrl && (
                                    <a href={resume.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                                        <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
                                    </a>
                                )}
                                {resume?.githubUrl && (
                                    <a href={resume.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                                        <Globe className="w-3.5 h-3.5" /> GitHub
                                    </a>
                                )}
                                {resume?.portfolioUrl && (
                                    <a href={resume.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                                        <Globe className="w-3.5 h-3.5" /> Portfolio
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                            {!isTerminal && nextStatuses.length > 0 && (
                                <Select value="" onValueChange={(s) => onStatusChange(app.id, s)} disabled={isUpdating}>
                                    <SelectTrigger className="w-44 h-8 text-xs">
                                        <SelectValue placeholder="Change status..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {nextStatuses.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s.charAt(0) + s.slice(1).toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            {isPremiumRecruiter ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    disabled={downloadingCv === app.user?.id}
                                    onClick={() => onDownloadCv(app.user?.id, app.user?.name || "Applicant", app.id)}
                                >
                                    {downloadingCv === app.user?.id ? (
                                        <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Downloading...</>
                                    ) : (
                                        <><FileText className="w-3.5 h-3.5 mr-1" /> Download CV</>
                                    )}
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" className="text-xs opacity-50 cursor-not-allowed" disabled>
                                    <Lock className="w-3.5 h-3.5 mr-1" /> CV (Career Boost)
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Application Status Banner */}
            {app.status === "INTERVIEW" && app.interviewDate && (
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800">
                    <CardContent className="pt-4 pb-4">
                        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Interview Scheduled
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            {new Date(app.interviewDate).toLocaleDateString("en-US", {
                                weekday: "long", year: "numeric", month: "long", day: "numeric",
                            })}
                        </p>
                        {app.interviewNote && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                                <StickyNote className="w-3.5 h-3.5" /> {app.interviewNote}
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {app.status === "HIRED" && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800">
                    <CardContent className="pt-4 pb-4">
                        <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Hired</h3>
                        {app.hiredCompany && <p className="text-sm text-green-700 dark:text-green-300">Company: {app.hiredCompany}</p>}
                        {app.hiredDesignation && <p className="text-sm text-green-600 dark:text-green-400">Designation: {app.hiredDesignation}</p>}
                        {app.hiredDate && <p className="text-xs text-green-500 mt-1">Hired on {new Date(app.hiredDate).toLocaleDateString()}</p>}
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Letter */}
                {app.coverLetter && (
                    <Card className="md:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Cover Letter
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{app.coverLetter}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Professional Summary */}
                {resume?.professionalSummary && (
                    <Card className="md:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="w-4 h-4" /> Professional Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{resume.professionalSummary}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Skills */}
                {(resume?.technicalSkills?.length > 0 || resume?.skills?.length > 0) && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Code className="w-4 h-4" /> Skills
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {resume?.technicalSkills?.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Technical</p>
                                    <div className="flex flex-wrap gap-1">
                                        {resume.technicalSkills.map((skill: string) => (
                                            <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {resume?.softSkills?.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Soft Skills</p>
                                    <div className="flex flex-wrap gap-1">
                                        {resume.softSkills.map((skill: string) => (
                                            <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {!resume?.technicalSkills?.length && resume?.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {resume.skills.map((skill: string) => (
                                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Work Experience */}
                {resume?.workExperience?.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Work Experience
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {resume.workExperience.map((exp: any) => (
                                <div key={exp.id} className="border-l-2 border-muted pl-3">
                                    <p className="font-medium text-sm">{exp.jobTitle}</p>
                                    <p className="text-xs text-muted-foreground">{exp.companyName}{exp.location ? ` · ${exp.location}` : ""}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                        {" — "}
                                        {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                                    </p>
                                    {exp.responsibilities?.length > 0 && (
                                        <ul className="mt-1 space-y-0.5">
                                            {exp.responsibilities.slice(0, 3).map((r: string, i: number) => (
                                                <li key={i} className="text-xs text-muted-foreground flex gap-1"><span>•</span>{r}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Education */}
                {resume?.education?.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> Education
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {resume.education.map((edu: any) => (
                                <div key={edu.id} className="border-l-2 border-muted pl-3">
                                    <p className="font-medium text-sm">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</p>
                                    <p className="text-xs text-muted-foreground">{edu.institutionName}{edu.location ? ` · ${edu.location}` : ""}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(edu.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                        {" — "}
                                        {edu.currentlyStudying ? "Present" : edu.endDate ? new Date(edu.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                                    </p>
                                    {edu.cgpaOrResult && <p className="text-xs text-muted-foreground">Result: {edu.cgpaOrResult}</p>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Certifications */}
                {resume?.certifications?.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Star className="w-4 h-4" /> Certifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {resume.certifications.map((cert: any) => (
                                <div key={cert.id} className="border-l-2 border-muted pl-3">
                                    <p className="font-medium text-sm">{cert.certificationName}</p>
                                    <p className="text-xs text-muted-foreground">{cert.issuingOrganization}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                                    {cert.credentialUrl && (
                                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-0.5">
                                            <ExternalLink className="w-3 h-3" /> View Credential
                                        </a>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Application Info */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Application Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Applied</span>
                            <span>{app.createdAt ? formatDistanceToNow(new Date(app.createdAt), { addSuffix: true }) : "—"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge className={statusColors[app.status] || ""}>{app.status}</Badge>
                        </div>
                        {resume?.nationality && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nationality</span>
                                <span>{resume.nationality}</span>
                            </div>
                        )}
                        {resume?.address && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Location</span>
                                <span>{resume.address}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const RecruiterApplicationsContent = () => {
    const queryClient = useQueryClient();
    const [selectedJobId, setSelectedJobId] = useState<string>("");
    const [interviewModal, setInterviewModal] = useState<{
        appId: string;
        date: string;
        note: string;
    } | null>(null);
    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [downloadingCv, setDownloadingCv] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [skillsFilter, setSkillsFilter] = useState("");
    const [educationFilter, setEducationFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const { data: jobsData, isLoading: jobsLoading } = useQuery({
        queryKey: ["my-jobs"],
        queryFn: () => getMyJobs({ limit: "100" }),
    });

    const { data: applicationsData, isLoading: applicationsLoading } = useQuery({
        queryKey: ["job-applications", selectedJobId, { searchTerm, skillsFilter, educationFilter, statusFilter }],
        queryFn: () => getApplicationsByJob(selectedJobId, {
            search: searchTerm || undefined,
            skills: skillsFilter || undefined,
            education: educationFilter || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
        }),
        enabled: !!selectedJobId,
    });

    const { mutateAsync: changeStatus, isPending: isUpdating } = useMutation({
        mutationFn: (payload: { id: string; status: string; interviewDate?: string; interviewNote?: string }) =>
            updateApplicationStatus(payload.id, {
                status: payload.status,
                interviewDate: payload.interviewDate,
                interviewNote: payload.interviewNote,
            }),
        onSuccess: () => {
            toast.success("Application status updated");
            queryClient.invalidateQueries({ queryKey: ["job-applications", selectedJobId] });
            setInterviewModal(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update status");
        },
    });

    const handleStatusChange = (appId: string, newStatus: string) => {
        if (newStatus === "INTERVIEW") {
            setInterviewModal({ appId, date: "", note: "" });
        } else {
            changeStatus({ id: appId, status: newStatus });
        }
    };

    const handleInterviewSubmit = () => {
        if (!interviewModal) return;
        changeStatus({
            id: interviewModal.appId,
            status: "INTERVIEW",
            interviewDate: interviewModal.date || undefined,
            interviewNote: interviewModal.note || undefined,
        });
    };

    const handleDownloadCv = async (userId: string, userName: string, applicationId?: string) => {
        setDownloadingCv(userId);
        try {
            const response = await downloadCvForRecruiter(userId, applicationId);
            const rawPayload = (response as any)?.data ?? response;
            const blob = toPdfBlob(rawPayload);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${userName.replace(/\s+/g, "-")}-CV.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success("CV downloaded successfully");
        } catch (err: any) {
            toast.error(err?.message || "Failed to download CV");
        } finally {
            setDownloadingCv(null);
        }
    };

    const jobs = jobsData?.data || [];
    const rawData = applicationsData?.data;
    const applications = (rawData && 'applications' in rawData ? rawData.applications : rawData) || [];
    const isPremiumRecruiter: boolean = (rawData && 'isPremiumRecruiter' in rawData ? rawData.isPremiumRecruiter : false) ?? false;

    // Show detail view when an application is selected
    if (selectedApp) {
        return (
            <ApplicationDetailView
                app={selectedApp}
                isPremiumRecruiter={isPremiumRecruiter}
                isUpdating={isUpdating}
                downloadingCv={downloadingCv}
                onBack={() => setSelectedApp(null)}
                onStatusChange={handleStatusChange}
                onDownloadCv={handleDownloadCv}
            />
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Applications</h1>

            {jobsLoading ? (
                <Skeleton className="h-10 w-64" />
            ) : (
                <div>
                    <div className="max-w-sm mb-4">
                        <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a job to view applications" />
                            </SelectTrigger>
                            <SelectContent>
                                {jobs.map((job: any) => (
                                    <SelectItem key={job.id} value={job.id}>
                                        {job.title} ({job._count?.applications || 0} apps)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filters */}
                    {selectedJobId && (
                        <Card className="bg-muted/50">
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                    <Input
                                        placeholder="Search name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="text-xs"
                                    />
                                    <Input
                                        placeholder="Skills (comma separated)"
                                        value={skillsFilter}
                                        onChange={(e) => setSkillsFilter(e.target.value)}
                                        className="text-xs"
                                    />
                                    <Input
                                        placeholder="Education"
                                        value={educationFilter}
                                        onChange={(e) => setEducationFilter(e.target.value)}
                                        className="text-xs"
                                    />
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="text-xs">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                                            <SelectItem value="INTERVIEW">Interview</SelectItem>
                                            <SelectItem value="HIRED">Hired</SelectItem>
                                            <SelectItem value="REJECTED">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Premium upsell banner for free recruiters */}
            {selectedJobId && !applicationsLoading && !isPremiumRecruiter && applications.length > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-800 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-300">
                    <div className="flex items-center gap-3">
                        <Crown className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                        <span>
                            Upgrade to <strong>Career Boost</strong> to see full applicant details (email, phone) and download their CVs.
                        </span>
                    </div>
                    <Link href="/recruiter/dashboard/subscriptions">
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                            Upgrade
                        </Button>
                    </Link>
                </div>
            )}

            {!selectedJobId ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Select a job above to view its applications
                    </CardContent>
                </Card>
            ) : applicationsLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                </div>
            ) : applications.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No applications for this job yet.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {applications.map((app: any) => {
                        const nextStatuses = validTransitions[app.status] || [];
                        const isTerminal = terminalStatuses.includes(app.status);

                        return (
                            <Card key={app.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                                                {app.user?.image || app.user?.resume?.profilePhoto ? (
                                                    <Image
                                                        src={app.user.resume?.profilePhoto || app.user.image}
                                                        alt={app.user?.name || ""}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{app.user?.name || "Unknown User"}</CardTitle>
                                                {/* Professional title - premium only */}
                                                {isPremiumRecruiter && app.user?.resume?.professionalTitle && (
                                                    <p className="text-xs text-muted-foreground">{app.user.resume.professionalTitle}</p>
                                                )}
                                                {/* Contact info - premium only */}
                                                {isPremiumRecruiter ? (
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                                                        {app.user?.email && (
                                                            <span className="flex items-center gap-1">
                                                                <Mail className="w-3.5 h-3.5" /> {app.user.email}
                                                            </span>
                                                        )}
                                                        {app.user?.resume?.contactNumber && (
                                                            <span className="flex items-center gap-1">
                                                                <Phone className="w-3.5 h-3.5" /> {app.user.resume.contactNumber}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                        <Lock className="w-3 h-3" /> Contact info hidden &mdash; upgrade to Career Boost
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Badge className={statusColors[app.status] || ""}>{app.status}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {app.coverLetter && (
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{app.coverLetter}</p>
                                    )}

                                    {/* Interview details if scheduled */}
                                    {app.status === "INTERVIEW" && app.interviewDate && (
                                        <div className="flex items-center gap-4 mb-3 text-sm bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md px-3 py-2">
                                            <span className="flex items-center gap-1 text-blue-700 dark:text-blue-300">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Interview: {new Date(app.interviewDate).toLocaleDateString("en-US", {
                                                    weekday: "short", year: "numeric", month: "short", day: "numeric"
                                                })}
                                            </span>
                                            {app.interviewNote && (
                                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                                    <StickyNote className="w-3.5 h-3.5" /> {app.interviewNote}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Hired details if hired */}
                                    {app.status === "HIRED" && (
                                        <div className="flex items-center gap-4 mb-3 text-sm bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
                                            {app.hiredCompany && (
                                                <span className="flex items-center gap-1 text-green-700 dark:text-green-300">
                                                    <span className="font-semibold">Company:</span> {app.hiredCompany}
                                                </span>
                                            )}
                                            {app.hiredDesignation && (
                                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                    <span className="font-semibold">Designation:</span> {app.hiredDesignation}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-xs text-muted-foreground">
                                            Applied {app.createdAt && formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                                        </p>
                                        <div className="ml-auto flex items-center gap-2">
                                            {/* View Details button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-xs"
                                                onClick={() => setSelectedApp(app)}
                                            >
                                                <FileText className="w-3.5 h-3.5 mr-1" /> View Details
                                            </Button>

                                            {/* Status transition dropdown */}
                                            {!isTerminal && nextStatuses.length > 0 && (
                                                <Select
                                                    value=""
                                                    onValueChange={(status) => handleStatusChange(app.id, status)}
                                                >
                                                    <SelectTrigger className="w-40 h-8 text-xs">
                                                        <SelectValue placeholder="Change status..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {nextStatuses.map((s) => (
                                                            <SelectItem key={s} value={s}>
                                                                {s.charAt(0) + s.slice(1).toLowerCase()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}

                                            {/* Download CV button - premium only */}
                                            {isPremiumRecruiter ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs"
                                                    disabled={downloadingCv === app.user?.id}
                                                    onClick={() => handleDownloadCv(app.user?.id, app.user?.name || "Applicant", app.id)}
                                                >
                                                    {downloadingCv === app.user?.id ? (
                                                        <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Downloading...</>
                                                    ) : (
                                                        <><FileText className="w-3.5 h-3.5 mr-1" /> Download CV</>
                                                    )}
                                                </Button>
                                            ) : (
                                                <Button variant="outline" size="sm" className="text-xs opacity-50 cursor-not-allowed" disabled>
                                                    <Lock className="w-3.5 h-3.5 mr-1" /> CV (Career Boost)
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Interview scheduling modal */}
            {interviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle>Schedule Interview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="interview-date">Interview Date</Label>
                                <Input
                                    id="interview-date"
                                    type="date"
                                    value={interviewModal.date}
                                    onChange={(e) => setInterviewModal({ ...interviewModal, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="interview-note">Note (optional)</Label>
                                <Textarea
                                    id="interview-note"
                                    placeholder="e.g. Google Meet link, office address..."
                                    value={interviewModal.note}
                                    onChange={(e) => setInterviewModal({ ...interviewModal, note: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setInterviewModal(null)}>Cancel</Button>
                                <Button onClick={handleInterviewSubmit} disabled={isUpdating}>
                                    {isUpdating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scheduling...</> : "Schedule Interview"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

        </div>
    );
};

export default RecruiterApplicationsContent;
