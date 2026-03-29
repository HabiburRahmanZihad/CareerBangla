"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IAward, ICertification, IEducation, ILanguage, IProject, IReference, IResume, IWorkExperience } from "@/types/user.types";
import { Award, BookOpen, Briefcase, Code2, ExternalLink, FileText, Globe, Lightbulb, Link as LinkIcon, MessageSquare, PhoneIcon, Trophy, User } from "lucide-react";
import Image from "next/image";

interface ResumeDetailsViewProps {
    resume?: IResume | null;
}

const ResumeDetailsView = ({ resume }: ResumeDetailsViewProps) => {
    if (!resume) {
        return (
            <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                    No resume data available
                </CardContent>
            </Card>
        );
    }

    // Check if resume has any meaningful data
    const hasPersonalInfo = resume.fullName || resume.professionalTitle || resume.contactNumber || resume.dateOfBirth || resume.nationality || resume.address;
    const hasContacts = resume.linkedinUrl || resume.githubUrl || resume.portfolioUrl || resume.websiteUrl;
    const hasSkills = (resume.technicalSkills && resume.technicalSkills.length > 0) ||
        (resume.softSkills && resume.softSkills.length > 0) ||
        (resume.toolsAndTechnologies && resume.toolsAndTechnologies.length > 0) ||
        (resume.skills && resume.skills.length > 0);
    const hasWorkExperience = resume.workExperience && resume.workExperience.length > 0;
    const hasEducation = resume.education && resume.education.length > 0;
    const hasCertifications = resume.certifications && resume.certifications.length > 0;
    const hasProjects = resume.projects && resume.projects.length > 0;
    const hasLanguages = resume.languages && resume.languages.length > 0;
    const hasAwards = resume.awards && resume.awards.length > 0;
    const hasInterests = resume.interests && resume.interests.length > 0;
    const hasReferences = resume.references && resume.references.length > 0;

    const hasAnyData = hasPersonalInfo || hasContacts || hasSkills || hasWorkExperience ||
        hasEducation || hasCertifications || hasProjects || hasLanguages ||
        hasAwards || hasInterests || hasReferences || resume.professionalSummary;

    if (!hasAnyData && !resume.profilePhoto) {
        return (
            <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                    No detailed resume data available
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* PDF Content Wrapper */}
            <div id="resume-pdf-content" className="space-y-6">
                {/* Profile Photo */}
                {resume.profilePhoto && (
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-orange-600/20 rounded-2xl blur-lg" />
                            <Image
                                src={resume.profilePhoto}
                                alt="Profile"
                                width={120}
                                height={120}
                                className="rounded-2xl border-2 border-primary/20 object-cover relative z-10 shadow-lg"
                            />
                        </div>
                    </div>
                )}
                {/* Personal Information */}
                {(resume.fullName || resume.professionalTitle || resume.contactNumber || resume.dateOfBirth || resume.nationality || resume.address) && (
                    <Card className="border-border/40 bg-linear-to-br from-primary/5 to-transparent hover:shadow-lg transition-all">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {resume.fullName && (
                                    <div className="p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</p>
                                        <p className="text-sm font-medium mt-2">{resume.fullName}</p>
                                    </div>
                                )}
                                {resume.professionalTitle && (
                                    <div className="p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Professional Title</p>
                                        <p className="text-sm font-medium mt-2">{resume.professionalTitle}</p>
                                    </div>
                                )}
                                {resume.email && (
                                    <div className="p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</p>
                                        <p className="text-sm font-medium mt-2 break-all text-primary">{resume.email}</p>
                                    </div>
                                )}
                                {resume.contactNumber && (
                                    <div className="p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact Number</p>
                                        <p className="text-sm font-medium mt-2">{resume.contactNumber}</p>
                                    </div>
                                )}
                                {resume.dateOfBirth && (
                                    <div className="p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date of Birth</p>
                                        <p className="text-sm font-medium mt-2">{new Date(resume.dateOfBirth).toLocaleDateString()}</p>
                                    </div>
                                )}
                                {resume.gender && (
                                    <div className="p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Gender</p>
                                        <p className="text-sm font-medium mt-2">{resume.gender}</p>
                                    </div>
                                )}
                                {resume.nationality && (
                                    <div className="p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nationality</p>
                                        <p className="text-sm font-medium mt-2">{resume.nationality}</p>
                                    </div>
                                )}
                                {resume.address && (
                                    <div className="p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Address</p>
                                        <p className="text-sm font-medium mt-2">{resume.address}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Professional Summary */}
                {resume.professionalSummary && (
                    <Card className="border-border/40 bg-linear-to-br from-blue-600/5 to-transparent hover:shadow-lg transition-all">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                Professional Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap bg-muted/30 p-4 rounded-lg border border-border/40">{resume.professionalSummary}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Contact & Social Links */}
                {(resume.linkedinUrl || resume.githubUrl || resume.portfolioUrl || resume.websiteUrl) && (
                    <Card className="border-border/40 bg-linear-to-br from-purple-600/5 to-transparent hover:shadow-lg transition-all">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-purple-600/10 flex items-center justify-center">
                                    <Globe className="h-5 w-5 text-purple-600" />
                                </div>
                                Online Profiles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6">
                            {resume.linkedinUrl && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-purple-600/50 transition-all">
                                    <LinkIcon className="h-4 w-4 text-purple-600 shrink-0" />
                                    <a href={resume.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex-1 truncate">
                                        LinkedIn Profile <ExternalLink className="h-3 w-3 inline ml-1" />
                                    </a>
                                </div>
                            )}
                            {resume.githubUrl && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-purple-600/50 transition-all">
                                    <Code2 className="h-4 w-4 text-purple-600 shrink-0" />
                                    <a href={resume.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex-1 truncate">
                                        GitHub <ExternalLink className="h-3 w-3 inline ml-1" />
                                    </a>
                                </div>
                            )}
                            {resume.portfolioUrl && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-purple-600/50 transition-all">
                                    <Globe className="h-4 w-4 text-purple-600 shrink-0" />
                                    <a href={resume.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex-1 truncate">
                                        Portfolio <ExternalLink className="h-3 w-3 inline ml-1" />
                                    </a>
                                </div>
                            )}
                            {resume.websiteUrl && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-purple-600/50 transition-all">
                                    <Globe className="h-4 w-4 text-purple-600 shrink-0" />
                                    <a href={resume.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex-1 truncate">
                                        Website <ExternalLink className="h-3 w-3 inline ml-1" />
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Skills */}
                {((resume.technicalSkills && resume.technicalSkills.length > 0) ||
                    (resume.softSkills && resume.softSkills.length > 0) ||
                    (resume.toolsAndTechnologies && resume.toolsAndTechnologies.length > 0) ||
                    (resume.skills && resume.skills.length > 0)) && (
                        <Card className="border-border/40 bg-linear-to-br from-green-600/5 to-transparent hover:shadow-lg transition-all">
                            <CardHeader className="border-b border-border/40 pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="h-10 w-10 rounded-lg bg-green-600/10 flex items-center justify-center">
                                        <Code2 className="h-5 w-5 text-green-600" />
                                    </div>
                                    Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                {resume.technicalSkills && resume.technicalSkills.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">📊 Technical Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {resume.technicalSkills.map((skill, i) => (
                                                <Badge key={i} className="bg-green-600/10 text-green-700 border-green-600/30">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {resume.softSkills && resume.softSkills.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">💬 Soft Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {resume.softSkills.map((skill, i) => (
                                                <Badge key={i} className="bg-blue-600/10 text-blue-700 border-blue-600/30">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {resume.toolsAndTechnologies && resume.toolsAndTechnologies.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">🛠️ Tools & Technologies</p>
                                        <div className="flex flex-wrap gap-2">
                                            {resume.toolsAndTechnologies.map((tool, i) => (
                                                <Badge key={i} className="bg-purple-600/10 text-purple-700 border-purple-600/30">{tool}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {resume.skills && resume.skills.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">⭐ General Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {resume.skills.map((skill, i) => (
                                                <Badge key={i} className="bg-primary/10 text-primary border-primary/30">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                {/* Work Experience */}
                {resume.workExperience && resume.workExperience.length > 0 && (
                    <Card className="border-border/40 bg-linear-to-br from-orange-600/5 to-transparent hover:shadow-lg transition-all">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-orange-600/10 flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-orange-600" />
                                </div>
                                Work Experience
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {resume.workExperience.map((exp: IWorkExperience, i) => (
                                <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-2 gap-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm leading-tight">{exp.jobTitle}</p>
                                            <p className="text-sm text-muted-foreground font-medium">{exp.companyName}</p>
                                        </div>
                                        <Badge className="bg-orange-600/10 text-orange-700 border-orange-600/30 text-xs shrink-0">{exp.employmentType || "Employment"}</Badge>
                                    </div>
                                    {exp.location && <p className="text-xs text-muted-foreground">📍 {exp.location}</p>}
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                                        {new Date(exp.startDate).toLocaleDateString()} - {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "N/A"}
                                    </p>
                                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                                        <div className="mt-3 text-xs space-y-1 bg-muted/30 p-3 rounded-lg border border-border/40">
                                            <p className="font-semibold text-foreground">Responsibilities:</p>
                                            {exp.responsibilities.map((resp, j) => (
                                                <p key={j} className="text-muted-foreground">• {resp}</p>
                                            ))}
                                        </div>
                                    )}
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <div className="mt-2 text-xs space-y-1 bg-muted/30 p-3 rounded-lg border border-border/40">
                                            <p className="font-semibold text-foreground">🎯 Achievements:</p>
                                            {exp.achievements.map((ach, j) => (
                                                <p key={j} className="text-muted-foreground">• {ach}</p>
                                            ))}
                                        </div>
                                    )}
                                    {exp.technologiesUsed && exp.technologiesUsed.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {exp.technologiesUsed.map((tech, j) => (
                                                <Badge key={j} variant="outline" className="text-xs">{tech}</Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Education */}
                {resume.education && resume.education.length > 0 && (
                    <Card className="border-border/40 bg-linear-to-br from-blue-600/5 to-transparent hover:shadow-lg transition-all">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                </div>
                                Education
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {resume.education.map((edu: IEducation, i) => (
                                <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-2 gap-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm leading-tight">{edu.degree}</p>
                                            <p className="text-sm text-muted-foreground font-medium">{edu.fieldOfStudy}</p>
                                            <p className="text-xs text-muted-foreground">{edu.institutionName}</p>
                                        </div>
                                        {edu.cgpaOrResult && <Badge className="bg-blue-600/10 text-blue-700 border-blue-600/30 text-xs shrink-0">{edu.cgpaOrResult}</Badge>}
                                    </div>
                                    {edu.location && <p className="text-xs text-muted-foreground">📍 {edu.location}</p>}
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                                        {new Date(edu.startDate).toLocaleDateString()} - {edu.currentlyStudying ? "Present" : edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "N/A"}
                                    </p>
                                    {edu.description && <p className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap bg-muted/30 p-3 rounded-lg border border-border/40">{edu.description}</p>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Certifications */}
                {resume.certifications && resume.certifications.length > 0 && (
                    <Card className="border-border/40 bg-linear-to-br from-yellow-600/5 to-transparent hover:shadow-lg transition-all">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-yellow-600/10 flex items-center justify-center">
                                    <Award className="h-5 w-5 text-yellow-600" />
                                </div>
                                Certifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6">
                            {resume.certifications.map((cert: ICertification, i) => (
                                <div key={i} className="pb-3 border-b last:border-0 last:pb-0 p-3 rounded-lg bg-muted/30 border-l-2 border-l-yellow-600 hover:shadow-md transition-all">
                                    <p className="font-semibold text-sm">{cert.name}</p>
                                    <p className="text-xs text-muted-foreground font-medium">{cert.issuer}</p>
                                    <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                                        <p className="text-xs text-muted-foreground">
                                            📅 Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                        </p>
                                        {cert.expiryDate && (
                                            <p className="text-xs text-muted-foreground">
                                                ⏰ Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    {cert.credentialUrl && (
                                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:text-orange-700 font-medium flex items-center gap-1 mt-2">
                                            🔗 View Credential <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Projects */}
                {resume.projects && resume.projects.length > 0 && (
                    <Card className="border-border/40 bg-linear-to-br from-pink-600/5 to-transparent hover:shadow-lg transition-all">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-pink-600/10 flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-pink-600" />
                                </div>
                                Projects
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {resume.projects.map((proj: IProject, i: number) => (
                                <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-2 gap-2">
                                        <p className="font-semibold text-sm leading-tight">{proj.projectName}</p>
                                        {proj.role && <Badge className="bg-pink-600/10 text-pink-700 border-pink-600/30 text-xs shrink-0">{proj.role}</Badge>}
                                    </div>
                                    {proj.description && <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-lg border border-border/40 mt-2">{proj.description}</p>}
                                    {proj.technologiesUsed && proj.technologiesUsed.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {proj.technologiesUsed.map((tech: string, j: number) => (
                                                <Badge key={j} variant="secondary" className="text-xs">{tech}</Badge>
                                            ))}
                                        </div>
                                    )}
                                    {proj.highlights && proj.highlights.length > 0 && (
                                        <div className="mt-2 text-xs space-y-1 bg-muted/30 p-3 rounded-lg border border-border/40">
                                            <p className="font-semibold text-foreground">✨ Highlights:</p>
                                            {proj.highlights.map((highlight: string, j: number) => (
                                                <p key={j} className="text-muted-foreground">• {highlight}</p>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-3 mt-2">
                                        {proj.liveUrl && (
                                            <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:text-orange-700 font-medium flex items-center gap-1">
                                                🌐 Live Demo <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                        {proj.githubUrl && (
                                            <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:text-orange-700 font-medium flex items-center gap-1">
                                                💻 GitHub <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Languages */}
                {resume.languages && resume.languages.length > 0 && (
                    <Card className="border-border/40 bg-linear-to-br from-cyan-600/5 to-transparent hover:shadow-lg transition-all">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-cyan-600/10 flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5 text-cyan-600" />
                                </div>
                                Languages
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                {resume.languages.map((lang: ILanguage, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/40 hover:border-cyan-600/50 transition-all">
                                        <p className="text-sm font-medium">{lang.language}</p>
                                        <Badge className="bg-cyan-600/10 text-cyan-700 border-cyan-600/30 text-xs">{lang.proficiencyLevel}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Awards */}
                {resume.awards && resume.awards.length > 0 && (
                    <Card className="border-border/40 bg-linear-to-br from-yellow-600/5 to-transparent hover:shadow-lg transition-all">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-yellow-600/10 flex items-center justify-center">
                                    <Trophy className="h-5 w-5 text-yellow-600" />
                                </div>
                                Awards & Honors
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6">
                            {resume.awards.map((award: IAward, i: number) => (
                                <div key={i} className="pb-3 border-b last:border-0 last:pb-0 p-3 rounded-lg bg-muted/30 border-l-2 border-l-yellow-600">
                                    <p className="font-semibold text-sm">{award.title}</p>
                                    <p className="text-xs text-muted-foreground font-medium">{award.issuer}</p>
                                    <p className="text-xs text-muted-foreground">📅 {new Date(award.date).toLocaleDateString()}</p>
                                    {award.description && <p className="text-xs text-muted-foreground mt-1">{award.description}</p>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Interests */}
                {resume.interests && resume.interests.length > 0 && (
                    <Card className="border-border/40 bg-linear-to-br from-red-600/5 to-transparent hover:shadow-lg transition-all">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-red-600/10 flex items-center justify-center">
                                    <Lightbulb className="h-5 w-5 text-red-600" />
                                </div>
                                Interests
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-2">
                                {resume.interests.map((interest, i) => (
                                    <Badge key={i} className="bg-red-600/10 text-red-700 border-red-600/30">{interest}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* References */}
                {resume.references && resume.references.length > 0 && (
                    <Card className="border-border/40 bg-linear-to-br from-indigo-600/5 to-transparent hover:shadow-lg transition-all">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                                    <PhoneIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                References
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6">
                            {resume.references.map((ref: IReference, i: number) => (
                                <div key={i} className="pb-3 border-b last:border-0 last:pb-0 p-3 rounded-lg bg-muted/30 border-l-2 border-l-indigo-600">
                                    <p className="font-semibold text-sm">{ref.name}</p>
                                    {ref.designation && ref.company && (
                                        <p className="text-xs text-muted-foreground font-medium">{ref.designation} at {ref.company}</p>
                                    )}
                                    {ref.email && <p className="text-xs text-primary font-medium mt-1">📧 {ref.email}</p>}
                                    {ref.phone && <p className="text-xs text-muted-foreground">📞 {ref.phone}</p>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Metadata */}
                {(resume.profileCompletion || resume.isPremium || resume.profileCompletedAt) && (
                    <Card className="border-border/40 bg-linear-to-br from-primary/5 via-yellow-600/5 to-transparent">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                Resume Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                            {typeof resume.profileCompletion === 'number' && (
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Profile Completion</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex-1">
                                            <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/40">
                                                {resume.profileCompletion === 100 && <div className="w-full h-full bg-linear-to-r from-primary to-orange-600" />}
                                                {resume.profileCompletion === 75 && <div className="w-3/4 h-full bg-linear-to-r from-primary to-orange-600" />}
                                                {resume.profileCompletion === 50 && <div className="w-1/2 h-full bg-linear-to-r from-primary to-orange-600" />}
                                                {resume.profileCompletion === 25 && <div className="w-1/4 h-full bg-linear-to-r from-primary to-orange-600" />}
                                                {resume.profileCompletion && resume.profileCompletion < 25 && <div className="w-1 h-full bg-linear-to-r from-primary to-orange-600" />}
                                            </div>
                                        </div>
                                        <p className="text-base font-bold text-primary min-w-fit">{resume.profileCompletion}%</p>
                                    </div>
                                </div>
                            )}
                            {resume.isPremium && (
                                <div className="p-4 rounded-lg bg-linear-to-br from-yellow-600/10 to-yellow-600/5 border border-yellow-600/30">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</p>
                                    <Badge className="bg-yellow-600 text-white mt-2">💎 Premium Resume</Badge>
                                </div>
                            )}
                            {resume.profileCompletedAt && (
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Completed</p>
                                    <p className="text-sm font-medium mt-2">{new Date(resume.profileCompletedAt).toLocaleDateString()}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ResumeDetailsView;
