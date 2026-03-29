"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, BookOpen, Briefcase, Calendar, Code, ExternalLink, FileText, Globe, Loader2, Lock, Mail, Phone, Star, StickyNote, User } from "lucide-react";
import Image from "next/image";
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
                                <Select value="" onValueChange={(s: string) => onStatusChange(app.id, s)} disabled={isUpdating}>
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
