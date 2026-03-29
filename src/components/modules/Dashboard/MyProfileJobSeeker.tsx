/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
    Award, Briefcase, Calendar, CheckCircle2, Code2,
    Crown, ExternalLink, FileText, GraduationCap,
    Globe, Languages, MapPin, Mail, Phone,
    Rocket, Sparkles, User, Users,
} from "lucide-react";
import Link from "next/link";
import { completionGradient, completionText, InfoItem, SectionCard, TimelineItem } from "./MyProfileShared";

interface JobSeekerSectionProps {
    resume: any;
    resumeLoading: boolean;
    premiumActive: boolean;
    isLifetime: boolean;
    premiumUntil?: string | null;
    profileCompletion: number;
}

export const JobSeekerSection = ({
    resume,
    resumeLoading,
    premiumActive,
    isLifetime,
    premiumUntil,
    profileCompletion,
}: JobSeekerSectionProps) => {
    return (
        <>
            {/* Career Boost */}
            <SectionCard icon={Rocket} title="Career Boost Status">
                {premiumActive ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                                <Crown className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">Career Boost Active</p>
                                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                                    {isLifetime ? "Lifetime access — never expires"
                                        : `Expires ${format(new Date(premiumUntil!), "MMMM d, yyyy")}`}
                                </p>
                            </div>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs font-semibold self-start sm:self-auto">
                            {isLifetime ? "Lifetime" : "Active"}
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                <Crown className="h-5 w-5 text-muted-foreground/50" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Free Account</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Upgrade for unlimited edits, PDF downloads &amp; ATS boost.</p>
                            </div>
                        </div>
                        <Link href="/dashboard/subscriptions">
                            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 shrink-0 rounded-xl">
                                <Sparkles className="h-3.5 w-3.5" /> Upgrade
                            </Button>
                        </Link>
                    </div>
                )}
            </SectionCard>

            {/* Profile Completion */}
            {resumeLoading ? (
                <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-3 animate-pulse">
                    <div className="flex justify-between">
                        <div className="h-4 w-40 bg-muted rounded-lg" />
                        <div className="h-7 w-12 bg-muted rounded-lg" />
                    </div>
                    <div className="h-2.5 bg-muted rounded-full" />
                </div>
            ) : (
                <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold">Profile Completion</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {profileCompletion >= 60 ? (
                                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Ready to apply for jobs!
                                    </span>
                                ) : `${60 - profileCompletion}% more to unlock job applications`}
                            </p>
                        </div>
                        <Link href="/dashboard/my-resume">
                            <span className={`text-2xl font-extrabold bg-linear-to-r ${completionGradient(profileCompletion)} bg-clip-text text-transparent`}>
                                {profileCompletion}%
                            </span>
                        </Link>
                    </div>
                    <div className="relative h-2.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                            className={`h-full rounded-full bg-linear-to-r ${completionGradient(profileCompletion)} transition-all duration-700`}
                            style={{ width: `${profileCompletion}%` }}
                        />
                        <div className="absolute top-0 bottom-0" style={{ left: "60%" }}>
                            <div className="w-0.5 h-full bg-background/70" />
                        </div>
                    </div>
                    <p className={`text-[10px] font-medium ${completionText(profileCompletion)}`}>
                        {profileCompletion >= 60 ? "✓ Unlocked — you can apply for jobs" : `Unlock at 60% · ${60 - profileCompletion}% remaining`}
                    </p>
                </div>
            )}

            {/* Personal Info */}
            {resumeLoading ? (
                <div className="rounded-2xl border border-border/50 bg-card overflow-hidden animate-pulse">
                    <div className="px-5 py-4 border-b border-border/40 flex gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted" />
                        <div className="h-4 w-40 bg-muted rounded-lg self-center" />
                    </div>
                    <div className="p-5 grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-14 rounded-xl bg-muted" />)}
                    </div>
                </div>
            ) : resume && (resume.fullName || resume.professionalTitle || resume.email || resume.contactNumber || resume.address || resume.nationality || resume.dateOfBirth || resume.gender) ? (
                <SectionCard icon={User} title="Personal Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <InfoItem icon={User} label="Full Name" value={resume.fullName} />
                        <InfoItem icon={FileText} label="Professional Title" value={resume.professionalTitle} />
                        <InfoItem icon={Mail} label="Resume Email" value={resume.email} />
                        <InfoItem icon={Phone} label="Contact Number" value={resume.contactNumber} />
                        <InfoItem icon={MapPin} label="Address" value={resume.address} />
                        <InfoItem icon={Globe} label="Nationality" value={resume.nationality} />
                        {resume.dateOfBirth && (
                            <InfoItem icon={Calendar} label="Date of Birth"
                                value={format(new Date(resume.dateOfBirth), "MMMM d, yyyy")} />
                        )}
                        {resume.gender && <InfoItem icon={User} label="Gender" value={resume.gender?.toLowerCase()} />}
                    </div>
                </SectionCard>
            ) : null}

            {/* Professional Summary */}
            {resume?.professionalSummary && (
                <SectionCard icon={FileText} title="Professional Summary">
                    <p className="text-sm text-muted-foreground leading-relaxed">{resume.professionalSummary}</p>
                </SectionCard>
            )}

            {/* Skills */}
            {(resume?.technicalSkills?.length || resume?.softSkills?.length || resume?.toolsAndTechnologies?.length) ? (
                <SectionCard icon={Code2} title="Skills">
                    <div className="space-y-4">
                        {(resume?.technicalSkills?.length ?? 0) > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Technical Skills</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {resume?.technicalSkills?.map((s: string, i: number) => (
                                        <span key={i} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {(resume?.softSkills?.length ?? 0) > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Soft Skills</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {resume?.softSkills?.map((s: string, i: number) => (
                                        <span key={i} className="px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {(resume?.toolsAndTechnologies?.length ?? 0) > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Tools &amp; Technologies</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {resume?.toolsAndTechnologies?.map((t: string, i: number) => (
                                        <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </SectionCard>
            ) : null}

            {/* Work Experience */}
            {(resume?.workExperience?.length ?? 0) > 0 && (
                <SectionCard icon={Briefcase} title="Work Experience" count={resume?.workExperience?.length}>
                    <div>
                        {resume?.workExperience?.map((exp: any, i: number) => (
                            <TimelineItem key={i}
                                title={exp.jobTitle}
                                subtitle={exp.companyName}
                                date={exp.startDate ? format(new Date(exp.startDate), "MMM yyyy") : undefined}
                                dateEnd={exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : undefined}
                                bullets={exp.responsibilities}
                            />
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* Education */}
            {(resume?.education?.length ?? 0) > 0 && (
                <SectionCard icon={GraduationCap} title="Education" count={resume?.education?.length}>
                    <div>
                        {resume?.education?.map((edu: any, i: number) => (
                            <TimelineItem key={i}
                                title={`${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}`}
                                subtitle={edu.institutionName}
                                date={edu.startDate ? format(new Date(edu.startDate), "MMM yyyy") : undefined}
                                dateEnd={edu.endDate ? format(new Date(edu.endDate), "MMM yyyy") : undefined}
                            />
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* Projects */}
            {(resume?.projects?.length ?? 0) > 0 && (
                <SectionCard icon={Code2} title="Projects" count={resume?.projects?.length}>
                    <div className="space-y-3">
                        {resume?.projects?.map((proj: any, i: number) => (
                            <div key={i} className="rounded-xl border border-border/50 p-4 hover:border-border transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-semibold">{proj.projectName}</h4>
                                    {proj.projectUrl && (
                                        <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer"
                                            title={`View ${proj.projectName}`}
                                            aria-label={`View ${proj.projectName} project`}
                                            className="text-primary hover:opacity-70 shrink-0">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                                {proj.role && <p className="text-xs text-muted-foreground mt-0.5">{proj.role}</p>}
                                {proj.description && <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{proj.description}</p>}
                                {proj.technologiesUsed?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2.5">
                                        {proj.technologiesUsed?.map((t: string, j: number) => (
                                            <span key={j} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium">{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* Certifications */}
            {(resume?.certifications?.length ?? 0) > 0 && (
                <SectionCard icon={Award} title="Certifications" count={resume?.certifications?.length}>
                    <div className="space-y-2">
                        {resume?.certifications?.map((cert: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                <div>
                                    <p className="text-sm font-medium">{cert.certificationName}</p>
                                    {cert.issuingOrganization && <p className="text-xs text-muted-foreground">{cert.issuingOrganization}</p>}
                                </div>
                                {cert.issueDate && (
                                    <span className="text-xs text-muted-foreground shrink-0 ml-3 bg-muted px-2 py-0.5 rounded-md">
                                        {format(new Date(cert.issueDate), "MMM yyyy")}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* Languages */}
            {(resume?.languages?.length ?? 0) > 0 && (
                <SectionCard icon={Languages} title="Languages" count={resume?.languages?.length}>
                    <div className="flex flex-wrap gap-2">
                        {resume?.languages?.map((lang: any, i: number) => (
                            <span key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/50 bg-muted/30 text-sm">
                                <span className="font-medium">{lang.language}</span>
                                {lang.proficiencyLevel && <span className="text-xs text-muted-foreground">({lang.proficiencyLevel})</span>}
                            </span>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* Awards */}
            {(resume?.awards?.length ?? 0) > 0 && (
                <SectionCard icon={Award} title="Awards" count={resume?.awards?.length}>
                    <div className="space-y-2">
                        {resume?.awards?.map((award: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                <div>
                                    <p className="text-sm font-medium">{award.title}</p>
                                    {award.issuer && <p className="text-xs text-muted-foreground">{award.issuer}</p>}
                                </div>
                                {award.date && (
                                    <span className="text-xs text-muted-foreground shrink-0 ml-3 bg-muted px-2 py-0.5 rounded-md">
                                        {format(new Date(award.date), "MMM yyyy")}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* Interests */}
            {(resume?.interests?.length ?? 0) > 0 && (
                <SectionCard icon={Sparkles} title="Interests">
                    <div className="flex flex-wrap gap-1.5">
                        {resume?.interests?.map((interest: string, i: number) => (
                            <span key={i} className="px-3 py-1.5 rounded-xl border border-border/50 bg-muted/30 text-sm">{interest}</span>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* References */}
            {(resume?.references?.length ?? 0) > 0 && (
                <SectionCard icon={Users} title="References" count={resume?.references?.length}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {resume?.references?.map((ref: any, i: number) => (
                            <div key={i} className="rounded-xl border border-border/50 p-4">
                                <p className="text-sm font-semibold">{ref.name}</p>
                                {ref.designation && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {ref.designation}{ref.company ? ` · ${ref.company}` : ""}
                                    </p>
                                )}
                                {ref.email && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5"><Mail className="h-3 w-3 shrink-0" />{ref.email}</p>}
                                {ref.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3 shrink-0" />{ref.phone}</p>}
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* Empty resume state */}
            {!resumeLoading && !resume && (
                <div className="rounded-2xl border border-dashed border-border bg-muted/10 py-16 flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
                        <FileText className="h-7 w-7 opacity-40" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-sm">No resume yet</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">Create your resume to start applying for jobs</p>
                    </div>
                    <Link href="/dashboard/my-resume">
                        <Button size="sm" className="gap-1.5 rounded-xl mt-1">
                            <FileText className="h-3.5 w-3.5" /> Create Resume
                        </Button>
                    </Link>
                </div>
            )}
        </>
    );
};
