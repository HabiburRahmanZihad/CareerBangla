/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
    Award, Briefcase, Calendar, Code2,
    Crown, ExternalLink, FileText,
    Globe,
    GraduationCap,
    Languages,
    Mail,
    MapPin,
    Phone,
    Rocket, Sparkles, TrendingUp, User, Users,
} from "lucide-react";
import Link from "next/link";
import { completionColor, InfoItem, SectionCard, TimelineItem } from "./MyProfileShared";

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
    // Dynamic styles - ESLint disabled due to runtime-computed values from props
    
    const conicGradientStyle = {
        background: `conic-gradient(${completionColor(profileCompletion)} ${profileCompletion * 3.6}deg, transparent ${profileCompletion * 3.6}deg)`,
    };

    const completionTextStyle = {
        color: completionColor(profileCompletion),
    };
    
    const progressBarStyle = {
        width: `${profileCompletion}%`,
        background: `linear-gradient(to right, ${completionColor(profileCompletion)}, ${completionColor(profileCompletion)}99)`,
    };
    
    const unlockedMarkerStyle = {
        left: "60%",
    };
    
    const unlockedTextStyle = {
        color: completionColor(profileCompletion),
    };

    return (
        <>
            {/* Career Boost */}
            <SectionCard icon={Rocket} title="Career Boost Status">
                {premiumActive ? (
                    <div className="relative rounded-2xl p-0.5 bg-linear-to-br from-amber-400 via-yellow-300 to-amber-500 shadow-lg shadow-amber-500/20">
                        <div className="rounded-[14px] bg-card p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/30">
                                            <Crown className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
                                            <span className="text-[7px] text-white font-black">✓</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-black text-amber-700 dark:text-amber-300 text-sm tracking-tight">Career Boost Active</p>
                                        <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5 font-medium">
                                            {isLifetime ? "✦ Lifetime access — never expires"
                                                : `Expires ${format(new Date(premiumUntil!), "MMMM d, yyyy")}`}
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-400 to-orange-400 text-white text-xs font-black shadow-sm self-start sm:self-auto">
                                    <Sparkles className="h-3 w-3" /> {isLifetime ? "Lifetime" : "Active"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-border/40 bg-card p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                    <Crown className="h-6 w-6 text-muted-foreground/40" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Free Plan</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Unlock unlimited edits, PDF export &amp; ATS boost</p>
                                </div>
                            </div>
                            <Link href="/dashboard/subscriptions">
                                <Button size="sm" className="bg-linear-to-r from-amber-500 to-orange-500 text-white border-0 hover:opacity-90 gap-1.5 shrink-0 rounded-xl shadow-sm shadow-amber-500/30">
                                    <Sparkles className="h-3.5 w-3.5" /> Upgrade Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* Profile Completion */}
            {resumeLoading ? (
                <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-3 animate-pulse">
                    <div className="flex justify-between">
                        <div className="h-4 w-40 bg-muted rounded-lg" />
                        <div className="h-7 w-12 bg-muted rounded-lg" />
                    </div>
                    <div className="h-2.5 bg-muted rounded-full" />
                </div>
            ) : (
                <div className="rounded-2xl border border-border/40 bg-card overflow-hidden relative">
                    <div className="absolute left-0 inset-y-0 w-0.75 bg-linear-to-b from-primary to-primary/10" />
                    <div className="px-5 py-3.5 border-b border-border/30 flex items-center gap-2.5 bg-muted/10">
                        <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm font-semibold tracking-tight">Profile Completion</span>
                    </div>
                    <div className="p-5 flex items-center gap-5">
                        {/* Circular conic-gradient ring */}
                        <Link href="/dashboard/my-resume" className="shrink-0">
                            <div className="relative h-22 w-22">
                                {/* Track */}
                                <div className="absolute inset-0 rounded-full bg-muted/60" />
                                {/* Progress */}
                                { }
                                <div className="absolute inset-0 rounded-full" style={conicGradientStyle} />
                                {/* Center cutout */}
                                <div className="absolute inset-2.5 rounded-full bg-card flex flex-col items-center justify-center shadow-sm">
                                    { }
                                    <span className="text-xl font-black leading-none" style={completionTextStyle}>{profileCompletion}</span>
                                    <span className="text-[9px] font-bold text-muted-foreground/70">%</span>
                                </div>
                            </div>
                        </Link>
                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-2.5">
                            <div>
                                <p className="text-sm font-bold">
                                    {profileCompletion >= 60 ? "Applications Unlocked!" : `${60 - profileCompletion}% to unlock applying`}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {profileCompletion >= 80
                                        ? "Outstanding profile — recruiters will notice you"
                                        : profileCompletion >= 60
                                            ? "You can apply for jobs now. Keep improving!"
                                            : "Complete your resume to start applying for jobs"}
                                </p>
                            </div>
                            {/* Progress bar */}
                            <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                                { }
                                <div className="h-full rounded-full transition-all duration-700 ease-out" style={progressBarStyle} />
                                {/* 60% unlock marker */}
                                { }
                                <div className="absolute inset-y-0 w-0.5 bg-background/80" style={unlockedMarkerStyle} />
                            </div>
                            { }
                            <p className="text-[10px] font-bold" style={unlockedTextStyle}>
                                {profileCompletion >= 60 ? "✓ Unlocked — apply freely" : `Unlock at 60% · ${60 - profileCompletion}% remaining`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Personal Info */}
            {resumeLoading ? (
                <div className="rounded-2xl border border-border/40 bg-card overflow-hidden animate-pulse">
                    <div className="px-5 py-3.5 border-b border-border/30 flex gap-3">
                        <div className="h-4 w-4 rounded bg-muted" />
                        <div className="h-4 w-40 bg-muted rounded-lg self-center" />
                    </div>
                    <div className="p-5 grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-14 rounded-xl bg-muted" />)}
                    </div>
                </div>
            ) : resume && (resume.fullName || resume.professionalTitle || resume.email || resume.contactNumber || resume.address || resume.nationality || resume.dateOfBirth || resume.gender) ? (
                <SectionCard icon={User} title="Personal Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
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
                            <div key={i} className="rounded-xl border border-border/40 p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors">
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
                                            <span key={j} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold border border-primary/15">{t}</span>
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
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/30 hover:border-border/60 transition-colors bg-card">
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
                            <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors">
                                <span className="text-sm font-medium">{lang.language}</span>
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
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/30 hover:border-border/60 transition-colors bg-card">
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

            {/* References */}
            {(resume?.references?.length ?? 0) > 0 && (
                <SectionCard icon={Users} title="References" count={resume?.references?.length}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {resume?.references?.map((ref: any, i: number) => (
                            <div key={i} className="rounded-xl border border-border/40 p-4 hover:border-border/70 transition-colors">
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
