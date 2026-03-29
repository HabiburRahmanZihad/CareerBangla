"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, BookOpen, Briefcase, Calendar, CheckCircle, ChevronRight, Code, Download, ExternalLink, FileText, Loader2, Lock, Mail, Phone, Star, StickyNote, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { statusColors, terminalStatuses, validTransitions } from "./applicationsConstants";

interface ApplicationDetailViewProps {
    app: any;
    isPremiumRecruiter: boolean;
    isUpdating: boolean;
    downloadingCv: string | null;
    onBack: () => void;
    onStatusChange: (appId: string, status: string) => void;
    onDownloadCv: (userId: string, userName: string, applicationId?: string) => void;
}

export const ApplicationDetailView = ({ app, isPremiumRecruiter, isUpdating, downloadingCv, onBack, onStatusChange, onDownloadCv }: ApplicationDetailViewProps) => {
    const nextStatuses = validTransitions[app.status] || [];
    const isTerminal = terminalStatuses.includes(app.status);
    const resume = app.user?.resume;

    return (
        <div className="space-y-6 pb-10">
            {/* Hero Header with Gradient */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary to-primary/70 text-primary-foreground p-6 md:p-10 shadow-xl border border-primary/20">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white/10 blur-3xl opacity-50" />
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="text-primary-foreground hover:bg-white/10"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Application Details</h1>
                            <p className="text-primary-foreground/80 text-sm">Review comprehensive candidate information</p>
                        </div>
                    </div>
                    <Badge className={`${statusColors[app.status] || ""} text-sm px-4 py-2`}>{app.status}</Badge>
                </div>
            </div>

            {/* Candidate Profile Hero Card */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden">
                <CardHeader className="pb-6 relative">
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-start gap-6 flex-1">
                            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-linear-to-br from-primary/20 to-primary/10 border-2 border-primary/20 shrink-0">
                                {resume?.profilePhoto || app.user?.image ? (
                                    <Image
                                        src={resume?.profilePhoto || app.user.image}
                                        alt={app.user?.name || ""}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/10">
                                        <User className="w-10 h-10 text-primary" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{app.user?.name || "Unknown"}</h2>
                                        {resume?.professionalTitle && (
                                            <p className="text-primary font-semibold text-sm">{resume.professionalTitle}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pt-2">
                                        {isPremiumRecruiter ? (
                                            <>
                                                {app.user?.email && (
                                                    <span className="flex items-center gap-2 hover:text-foreground transition-colors">
                                                        <Mail className="w-4 h-4 text-primary" /> {app.user.email}
                                                    </span>
                                                )}
                                                {resume?.contactNumber && (
                                                    <span className="flex items-center gap-2 hover:text-foreground transition-colors">
                                                        <Phone className="w-4 h-4 text-primary" /> {resume.contactNumber}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="flex items-center gap-2 text-xs bg-yellow-100/30 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full border border-yellow-200/50 dark:border-yellow-500/30">
                                                <Lock className="w-3 h-3" /> Contact info hidden — upgrade to Career Boost
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            {!isTerminal && nextStatuses.length > 0 && (
                                <Select value="" onValueChange={(s: string) => onStatusChange(app.id, s)} disabled={isUpdating}>
                                    <SelectTrigger className="w-full md:w-56 h-10 bg-primary/10 border-primary/20 hover:bg-primary/20 font-semibold">
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
                                    size="lg"
                                    className="gap-2 font-semibold"
                                    disabled={downloadingCv === app.user?.id}
                                    onClick={() => onDownloadCv(app.user?.id, app.user?.name || "Applicant", app.id)}
                                >
                                    {downloadingCv === app.user?.id ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Downloading...</>
                                    ) : (
                                        <><Download className="w-4 h-4" /> Download CV</>
                                    )}
                                </Button>
                            ) : (
                                <Button size="lg" variant="outline" className="opacity-50 cursor-not-allowed" disabled>
                                    <Lock className="w-4 h-4 mr-2" /> CV (Career Boost)
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Status Timeline */}
            {(app.status === "INTERVIEW" || app.status === "HIRED") && (
                <Card className="border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {app.status === "INTERVIEW" && app.interviewDate && (
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-500/30">
                                    <div className="p-3 rounded-lg bg-blue-500/20 shrink-0">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Interview Scheduled</h3>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">
                                            {new Date(app.interviewDate).toLocaleDateString("en-US", {
                                                weekday: "long", year: "numeric", month: "long", day: "numeric",
                                            })}
                                        </p>
                                        {app.interviewNote && (
                                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 flex items-start gap-2">
                                                <StickyNote className="w-4 h-4 mt-0.5 shrink-0" /> {app.interviewNote}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {app.status === "HIRED" && (
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-500/30">
                                    <div className="p-3 rounded-lg bg-green-500/20 shrink-0">
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-green-700 dark:text-green-300 mb-1">Hired</h3>
                                        {app.hiredCompany && <p className="text-sm text-green-700 dark:text-green-400">Company: <span className="font-semibold">{app.hiredCompany}</span></p>}
                                        {app.hiredDesignation && <p className="text-sm text-green-600 dark:text-green-400 mt-1">Designation: <span className="font-semibold">{app.hiredDesignation}</span></p>}
                                        {app.hiredDate && <p className="text-xs text-green-500 mt-2">Hired on {new Date(app.hiredDate).toLocaleDateString()}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Cover Letter & Summary */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Cover Letter */}
                    {app.coverLetter && (
                        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" /> Cover Letter
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{app.coverLetter}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Professional Summary */}
                    {resume?.professionalSummary && (
                        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" /> Professional Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">{resume.professionalSummary}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Skills */}
                    {(resume?.technicalSkills?.length > 0 || resume?.softSkills?.length > 0 || resume?.skills?.length > 0) && (
                        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Code className="w-5 h-5 text-primary" /> Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {resume?.technicalSkills?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Technical Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {resume.technicalSkills.map((skill: string) => (
                                                <Badge key={skill} className="bg-primary/10 text-primary border border-primary/20">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {resume?.softSkills?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Soft Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {resume.softSkills.map((skill: string) => (
                                                <Badge key={skill} variant="outline" className="border-muted-foreground/20">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {!resume?.technicalSkills?.length && resume?.skills?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {resume.skills.map((skill: string) => (
                                            <Badge key={skill} className="bg-primary/10 text-primary border border-primary/20">{skill}</Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Experience & Education */}
                <div className="space-y-6">
                    {/* Work Experience */}
                    {resume?.workExperience?.length > 0 && (
                        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-primary" /> Work Experience
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {resume.workExperience.slice(0, 3).map((exp: any) => (
                                    <div key={exp.id} className="pb-3 border-b border-border/50 last:border-0 last:pb-0">
                                        <p className="font-semibold text-sm text-foreground">{exp.jobTitle}</p>
                                        <p className="text-xs text-muted-foreground">{exp.companyName}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} • {exp.currentlyWorking ? "Present" : "Past"}
                                        </p>
                                    </div>
                                ))}
                                {resume.workExperience.length > 3 && (
                                    <p className="text-xs text-primary font-semibold flex items-center gap-1">
                                        +{resume.workExperience.length - 3} more <ChevronRight className="w-3 h-3" />
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Education */}
                    {resume?.education?.length > 0 && (
                        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" /> Education
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {resume.education.slice(0, 2).map((edu: any) => (
                                    <div key={edu.id} className="pb-3 border-b border-border/50 last:border-0 last:pb-0">
                                        <p className="font-semibold text-sm text-foreground">{edu.degree}</p>
                                        <p className="text-xs text-muted-foreground">{edu.institutionName}</p>
                                        {edu.cgpaOrResult && <p className="text-xs text-muted-foreground mt-1">Score: {edu.cgpaOrResult}</p>}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Certifications */}
                    {resume?.certifications?.length > 0 && (
                        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Star className="w-5 h-5 text-primary" /> Certifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {resume.certifications.slice(0, 2).map((cert: any) => (
                                    <div key={cert.id} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-foreground text-xs flex items-center gap-1">
                                                {cert.certificationName}
                                                {cert.credentialUrl && (
                                                    <Link href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Link>
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{cert.issuingOrganization}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Application Info */}
                    <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Application Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                                <span className="text-muted-foreground">Applied</span>
                                <span className="font-semibold">{app.createdAt ? formatDistanceToNow(new Date(app.createdAt), { addSuffix: true }) : "—"}</span>
                            </div>
                            {resume?.nationality && (
                                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                                    <span className="text-muted-foreground">Nationality</span>
                                    <span className="font-semibold">{resume.nationality}</span>
                                </div>
                            )}
                            {resume?.address && (
                                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                                    <span className="text-muted-foreground">Location</span>
                                    <span className="font-semibold text-xs">{resume.address}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
