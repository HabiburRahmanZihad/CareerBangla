"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IAward, ICertification, IEducation, ILanguage, IProject, IReference, IResume, IWorkExperience } from "@/types/user.types";
import { ExternalLink } from "lucide-react";

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

    return (
        <div className="space-y-6">
            {/* Personal Information */}
            {(resume.fullName || resume.professionalTitle || resume.contactNumber || resume.dateOfBirth || resume.nationality || resume.address) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {resume.fullName && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Full Name</p>
                                    <p className="text-sm">{resume.fullName}</p>
                                </div>
                            )}
                            {resume.professionalTitle && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Professional Title</p>
                                    <p className="text-sm">{resume.professionalTitle}</p>
                                </div>
                            )}
                            {resume.email && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Email</p>
                                    <p className="text-sm break-all">{resume.email}</p>
                                </div>
                            )}
                            {resume.contactNumber && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Contact Number</p>
                                    <p className="text-sm">{resume.contactNumber}</p>
                                </div>
                            )}
                            {resume.dateOfBirth && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Date of Birth</p>
                                    <p className="text-sm">{new Date(resume.dateOfBirth).toLocaleDateString()}</p>
                                </div>
                            )}
                            {resume.gender && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Gender</p>
                                    <p className="text-sm">{resume.gender}</p>
                                </div>
                            )}
                            {resume.nationality && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Nationality</p>
                                    <p className="text-sm">{resume.nationality}</p>
                                </div>
                            )}
                            {resume.address && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Address</p>
                                    <p className="text-sm">{resume.address}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Professional Summary */}
            {resume.professionalSummary && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Professional Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{resume.professionalSummary}</p>
                    </CardContent>
                </Card>
            )}

            {/* Contact & Social Links */}
            {(resume.linkedinUrl || resume.githubUrl || resume.portfolioUrl || resume.websiteUrl) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Online Profiles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {resume.linkedinUrl && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground w-20">LinkedIn:</span>
                                <a href={resume.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                    {resume.linkedinUrl} <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                        {resume.githubUrl && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground w-20">GitHub:</span>
                                <a href={resume.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                    {resume.githubUrl} <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                        {resume.portfolioUrl && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground w-20">Portfolio:</span>
                                <a href={resume.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                    {resume.portfolioUrl} <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                        {resume.websiteUrl && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground w-20">Website:</span>
                                <a href={resume.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                    {resume.websiteUrl} <ExternalLink className="h-3 w-3" />
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Skills</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {resume.technicalSkills && resume.technicalSkills.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-2">Technical Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.technicalSkills.map((skill, i) => (
                                            <Badge key={i} variant="secondary">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {resume.softSkills && resume.softSkills.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-2">Soft Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.softSkills.map((skill, i) => (
                                            <Badge key={i} variant="outline">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {resume.toolsAndTechnologies && resume.toolsAndTechnologies.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-2">Tools & Technologies</p>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.toolsAndTechnologies.map((tool, i) => (
                                            <Badge key={i} variant="secondary">{tool}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {resume.skills && resume.skills.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.skills.map((skill, i) => (
                                            <Badge key={i}>{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

            {/* Work Experience */}
            {resume.workExperience && resume.workExperience.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Work Experience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {resume.workExperience.map((exp: IWorkExperience, i) => (
                            <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-sm">{exp.jobTitle}</p>
                                        <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                                    </div>
                                    <Badge variant="outline">{exp.employmentType || "Employment"}</Badge>
                                </div>
                                {exp.location && <p className="text-xs text-muted-foreground">📍 {exp.location}</p>}
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(exp.startDate).toLocaleDateString()} - {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "N/A"}
                                </p>
                                {exp.responsibilities && exp.responsibilities.length > 0 && (
                                    <div className="mt-2 text-xs space-y-1">
                                        {exp.responsibilities.map((resp, j) => (
                                            <p key={j} className="text-muted-foreground">• {resp}</p>
                                        ))}
                                    </div>
                                )}
                                {exp.achievements && exp.achievements.length > 0 && (
                                    <div className="mt-2 text-xs space-y-1">
                                        <p className="font-semibold text-muted-foreground">Achievements:</p>
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
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Education</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {resume.education.map((edu: IEducation, i) => (
                            <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-sm">{edu.degree}</p>
                                        <p className="text-sm text-muted-foreground">{edu.fieldOfStudy}</p>
                                        <p className="text-xs text-muted-foreground">{edu.institutionName}</p>
                                    </div>
                                    {edu.cgpaOrResult && <Badge variant="outline">{edu.cgpaOrResult}</Badge>}
                                </div>
                                {edu.location && <p className="text-xs text-muted-foreground">📍 {edu.location}</p>}
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(edu.startDate).toLocaleDateString()} - {edu.currentlyStudying ? "Present" : edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "N/A"}
                                </p>
                                {edu.description && <p className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">{edu.description}</p>}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Certifications */}
            {resume.certifications && resume.certifications.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Certifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {resume.certifications.map((cert: ICertification, i) => (
                            <div key={i} className="pb-3 border-b last:border-0 last:pb-0">
                                <p className="font-semibold text-sm">{cert.name}</p>
                                <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-muted-foreground">
                                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                    </p>
                                    {cert.expiryDate && (
                                        <p className="text-xs text-muted-foreground">
                                            Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                {cert.credentialUrl && (
                                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                        View Credential <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {resume.projects.map((proj: IProject, i: number) => (
                            <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                                <div className="flex items-start justify-between mb-2">
                                    <p className="font-semibold text-sm">{proj.projectName}</p>
                                    {proj.role && <Badge variant="outline" className="text-xs">{proj.role}</Badge>}
                                </div>
                                {proj.description && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{proj.description}</p>}
                                {proj.technologiesUsed && proj.technologiesUsed.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {proj.technologiesUsed.map((tech: string, j: number) => (
                                            <Badge key={j} variant="secondary" className="text-xs">{tech}</Badge>
                                        ))}
                                    </div>
                                )}
                                {proj.highlights && proj.highlights.length > 0 && (
                                    <div className="mt-2 text-xs space-y-1">
                                        <p className="font-semibold text-muted-foreground">Highlights:</p>
                                        {proj.highlights.map((highlight: string, j: number) => (
                                            <p key={j} className="text-muted-foreground">• {highlight}</p>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                    {proj.liveUrl && (
                                        <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                            Live Demo <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                    {proj.githubUrl && (
                                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                            GitHub <ExternalLink className="h-3 w-3" />
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
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Languages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {resume.languages.map((lang: ILanguage, i: number) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <p>{lang.language}</p>
                                    <Badge variant="outline">{lang.proficiencyLevel}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Awards */}
            {resume.awards && resume.awards.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Awards & Honors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {resume.awards.map((award: IAward, i: number) => (
                            <div key={i} className="pb-3 border-b last:border-0 last:pb-0">
                                <p className="font-semibold text-sm">{award.title}</p>
                                <p className="text-xs text-muted-foreground">{award.issuer}</p>
                                <p className="text-xs text-muted-foreground">{new Date(award.date).toLocaleDateString()}</p>
                                {award.description && <p className="text-xs text-muted-foreground mt-1">{award.description}</p>}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Interests */}
            {resume.interests && resume.interests.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {resume.interests.map((interest, i) => (
                                <Badge key={i} variant="outline">{interest}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* References */}
            {resume.references && resume.references.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">References</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {resume.references.map((ref: IReference, i: number) => (
                            <div key={i} className="pb-3 border-b last:border-0 last:pb-0">
                                <p className="font-semibold text-sm">{ref.name}</p>
                                {ref.designation && ref.company && (
                                    <p className="text-xs text-muted-foreground">{ref.designation} at {ref.company}</p>
                                )}
                                {ref.email && <p className="text-xs text-blue-600">{ref.email}</p>}
                                {ref.phone && <p className="text-xs text-muted-foreground">{ref.phone}</p>}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Metadata */}
            {(resume.profileCompletion || resume.isPremium || resume.profileCompletedAt) && (
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Resume Info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {typeof resume.profileCompletion === 'number' && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">Profile Completion</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${resume.profileCompletion}%` }} />
                                    </div>
                                    <p className="text-sm font-semibold">{resume.profileCompletion}%</p>
                                </div>
                            </div>
                        )}
                        {resume.isPremium && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">Status</p>
                                <Badge className="bg-yellow-600 mt-1">Premium Resume</Badge>
                            </div>
                        )}
                        {resume.profileCompletedAt && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">Completed</p>
                                <p className="text-sm mt-1">{new Date(resume.profileCompletedAt).toLocaleDateString()}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ResumeDetailsView;
