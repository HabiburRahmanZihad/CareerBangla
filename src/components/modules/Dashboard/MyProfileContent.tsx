"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import ProfileCompletionBar from "@/components/shared/ProfileCompletionBar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/lib/envConfig";
import { Input } from "@/components/ui/input";
import { updateMyProfile } from "@/services/auth.services";
import { getMyResume } from "@/services/resume.services";
import { UserInfo } from "@/types/user.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Award,
    Briefcase,
    Calendar,
    Camera,
    CheckCircle2,
    Clock,
    Code2,
    Crown,
    FileText,
    Github,
    Globe,
    GraduationCap,
    Languages,
    Linkedin,
    Loader2,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Rocket,
    Shield,
    Sparkles,
    User,
    Users,
    XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface MyProfileContentProps {
    userInfo: UserInfo;
}

// ─── Info row helper ──────────────────────────────────────────────────────────

const InfoRow = ({
    icon: Icon,
    label,
    value,
    href,
}: {
    icon: React.ElementType;
    label: string;
    value?: string | null;
    href?: string;
}) => {
    if (!value) return null;
    const content = href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
            {value}
        </a>
    ) : (
        <span className="break-all">{value}</span>
    );

    return (
        <div className="flex items-start gap-3 p-3 border rounded-lg">
            <Icon className="h-4.5 w-4.5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{content}</p>
            </div>
        </div>
    );
};

// ─── Section helper ───────────────────────────────────────────────────────────

const Section = ({
    icon: Icon,
    title,
    count,
    children,
}: {
    icon: React.ElementType;
    title: string;
    count?: number;
    children: React.ReactNode;
}) => (
    <Card>
        <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="w-4.5 h-4.5 text-primary" />
                {title}
                {count !== undefined && count > 0 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                        {count}
                    </Badge>
                )}
            </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">{children}</CardContent>
    </Card>
);

// ─── Main component ───────────────────────────────────────────────────────────

const MyProfileContent = ({ userInfo }: MyProfileContentProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneValue, setPhoneValue] = useState(userInfo.phone || "");
    const [isSavingPhone, setIsSavingPhone] = useState(false);

    const { data: resumeData, isLoading: resumeLoading } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
    });

    const resume = resumeData?.data;
    const profileCompletion = resume?.profileCompletion ?? 0;

    // Premium status logic
    const isPremium = userInfo.isPremium;
    const premiumUntil = userInfo.premiumUntil;
    const isLifetime = isPremium && !premiumUntil;
    const premiumExpired = premiumUntil ? new Date(premiumUntil) < new Date() : false;
    const premiumActive = isPremium && !premiumExpired;

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }

        setIsUploadingPhoto(true);
        try {
            const formData = new FormData();
            formData.append("photo", file);
            const res = await fetch(`${envConfig.apiBaseUrl}/resumes/upload-photo`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.message || "Failed to upload photo");
            }
            toast.success("Profile photo uploaded!");
            queryClient.invalidateQueries({ queryKey: ["my-resume"] });
        } catch (err: any) {
            toast.error(err.message || "Failed to upload photo");
        } finally {
            setIsUploadingPhoto(false);
            if (photoInputRef.current) photoInputRef.current.value = "";
        }
    };

    const handlePhoneSave = async () => {
        const trimmed = phoneValue.trim();
        if (trimmed && (trimmed.length < 11 || trimmed.length > 14)) {
            toast.error("Phone number must be 11-14 characters");
            return;
        }
        setIsSavingPhone(true);
        try {
            await updateMyProfile({ phone: trimmed || undefined });
            toast.success("Phone number updated!");
            setIsEditingPhone(false);
            router.refresh();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update phone number");
        } finally {
            setIsSavingPhone(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-2xl font-bold">My Profile</h1>

            {/* ── Profile Header with Photo Upload ── */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                        {/* Photo with upload */}
                        <div className="relative group shrink-0">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted">
                                {resume?.profilePhoto || userInfo.image ? (
                                    <Image
                                        src={resume?.profilePhoto || userInfo.image || ""}
                                        alt={userInfo.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <Avatar className="h-24 w-24">
                                        <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                                            {userInfo.name?.charAt(0)?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                            <input
                                ref={photoInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                aria-label="Upload profile photo"
                                onChange={handlePhotoUpload}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md"
                                disabled={isUploadingPhoto}
                                onClick={() => photoInputRef.current?.click()}
                            >
                                {isUploadingPhoto ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Camera className="w-4 h-4" />
                                )}
                            </Button>
                        </div>

                        {/* Name, role, badges */}
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-semibold">{userInfo.name}</h2>
                                <Badge variant="outline" className="capitalize">
                                    {userInfo.role?.toLowerCase().replace("_", " ")}
                                </Badge>
                                {userInfo.emailVerified && (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Verified
                                    </Badge>
                                )}
                                {premiumActive && (
                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs gap-1">
                                        <Sparkles className="w-3 h-3" /> Career Boost
                                    </Badge>
                                )}
                            </div>
                            {resume?.professionalTitle && (
                                <p className="text-sm text-muted-foreground">{resume.professionalTitle}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Mail className="h-3.5 w-3.5" /> {userInfo.email}
                                </span>
                                {(resume?.contactNumber || userInfo.phone) && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="h-3.5 w-3.5" /> {resume?.contactNumber || userInfo.phone}
                                    </span>
                                )}
                                {resume?.address && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" /> {resume.address}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Career Boost / Premium Status ── */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Rocket className="w-4.5 h-4.5 text-amber-500" />
                        Career Boost Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    {premiumActive ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                                    <Crown className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-amber-900 dark:text-amber-200">Career Boost Active</p>
                                    <p className="text-sm text-amber-700 dark:text-amber-400">
                                        {isLifetime
                                            ? "Lifetime access — never expires"
                                            : `Expires on ${format(new Date(premiumUntil!), "MMMM d, yyyy")}`
                                        }
                                    </p>
                                </div>
                            </div>
                            <Badge className="bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200 w-fit">
                                {isLifetime ? "Lifetime" : "Active"}
                            </Badge>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <Crown className="h-6 w-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-semibold">Free Account</p>
                                    <p className="text-sm text-muted-foreground">
                                        Upgrade to Career Boost for unlimited edits, PDF downloads, and more.
                                    </p>
                                </div>
                            </div>
                            <Link href="/dashboard/subscriptions">
                                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-1">
                                    <Sparkles className="w-4 h-4" /> Upgrade
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Profile Completion ── */}
            {resumeLoading ? (
                <Skeleton className="h-16 w-full" />
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <ProfileCompletionBar completion={profileCompletion} />
                    </CardContent>
                </Card>
            )}

            {/* ── Account Details ── */}
            <Section icon={Shield} title="Account Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoRow icon={User} label="Full Name" value={userInfo.name} />
                    <InfoRow icon={Mail} label="Email" value={userInfo.email} />
                    {/* Phone Number - Editable */}
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <Phone className="h-4.5 w-4.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">Phone Number</p>
                            {isEditingPhone ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <Input
                                        type="tel"
                                        value={phoneValue}
                                        onChange={(e) => setPhoneValue(e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className="h-8 text-sm"
                                    />
                                    <Button
                                        size="sm"
                                        className="h-8"
                                        onClick={handlePhoneSave}
                                        disabled={isSavingPhone}
                                    >
                                        {isSavingPhone ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8"
                                        onClick={() => {
                                            setIsEditingPhone(false);
                                            setPhoneValue(userInfo.phone || "");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">
                                        {userInfo.phone || <span className="text-muted-foreground italic">Not set</span>}
                                    </p>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() => setIsEditingPhone(true)}
                                    >
                                        <Pencil className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <InfoRow icon={Shield} label="Role" value={userInfo.role?.toLowerCase().replace("_", " ")} />
                    <InfoRow
                        icon={userInfo.status === "ACTIVE" ? CheckCircle2 : XCircle}
                        label="Account Status"
                        value={userInfo.status?.toLowerCase() || "active"}
                    />
                    {userInfo.referralCode && (
                        <InfoRow icon={Users} label="Referral Code" value={userInfo.referralCode} />
                    )}
                    {userInfo.emailVerified !== undefined && (
                        <InfoRow
                            icon={userInfo.emailVerified ? CheckCircle2 : XCircle}
                            label="Email Verified"
                            value={userInfo.emailVerified ? "Yes" : "No"}
                        />
                    )}
                </div>
            </Section>

            {/* ── Resume Details (loaded from resume data) ── */}
            {resumeLoading ? (
                <Skeleton className="h-40 w-full" />
            ) : resume ? (
                <>
                    {/* Personal Info */}
                    <Section icon={User} title="Personal Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <InfoRow icon={User} label="Full Name" value={resume.fullName} />
                            <InfoRow icon={FileText} label="Professional Title" value={resume.professionalTitle} />
                            <InfoRow icon={Mail} label="Resume Email" value={resume.email} />
                            <InfoRow icon={Phone} label="Contact Number" value={resume.contactNumber} />
                            <InfoRow icon={MapPin} label="Address" value={resume.address} />
                            <InfoRow icon={Globe} label="Nationality" value={resume.nationality} />
                            {resume.dateOfBirth && (
                                <InfoRow
                                    icon={Calendar}
                                    label="Date of Birth"
                                    value={format(new Date(resume.dateOfBirth), "MMMM d, yyyy")}
                                />
                            )}
                            {resume.gender && (
                                <InfoRow icon={User} label="Gender" value={resume.gender?.toLowerCase()} />
                            )}
                        </div>
                    </Section>

                    {/* Social Links */}
                    {(resume.linkedinUrl || resume.githubUrl || resume.portfolioUrl) && (
                        <Section icon={Globe} title="Social Links">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <InfoRow icon={Linkedin} label="LinkedIn" value={resume.linkedinUrl} href={resume.linkedinUrl} />
                                <InfoRow icon={Github} label="GitHub" value={resume.githubUrl} href={resume.githubUrl} />
                                <InfoRow icon={Globe} label="Portfolio" value={resume.portfolioUrl} href={resume.portfolioUrl} />
                            </div>
                        </Section>
                    )}

                    {/* Professional Summary */}
                    {resume.professionalSummary && (
                        <Section icon={FileText} title="Professional Summary">
                            <p className="text-sm text-muted-foreground leading-relaxed">{resume.professionalSummary}</p>
                        </Section>
                    )}

                    {/* Skills */}
                    {(resume.technicalSkills?.length || resume.softSkills?.length || resume.toolsAndTechnologies?.length) ? (
                        <Section icon={Code2} title="Skills">
                            <div className="space-y-4">
                                {resume.technicalSkills && resume.technicalSkills.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Technical Skills</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {resume.technicalSkills.map((skill: string, i: number) => (
                                                <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {resume.softSkills && resume.softSkills.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Soft Skills</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {resume.softSkills.map((skill: string, i: number) => (
                                                <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {resume.toolsAndTechnologies && resume.toolsAndTechnologies.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Tools & Technologies</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {resume.toolsAndTechnologies.map((tool: string, i: number) => (
                                                <Badge key={i} variant="secondary" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">{tool}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Section>
                    ) : null}

                    {/* Work Experience */}
                    {resume.workExperience && resume.workExperience.length > 0 && (
                        <Section icon={Briefcase} title="Work Experience" count={resume.workExperience.length}>
                            <div className="space-y-4">
                                {resume.workExperience.map((exp: any, i: number) => (
                                    <div key={i} className="border rounded-lg p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                                            <h4 className="font-semibold text-sm">{exp.jobTitle}</h4>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {exp.startDate ? format(new Date(exp.startDate), "MMM yyyy") : "N/A"}
                                                {" — "}
                                                {exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : "Present"}
                                            </span>
                                        </div>
                                        {exp.companyName && (
                                            <p className="text-xs text-muted-foreground mt-0.5">{exp.companyName}</p>
                                        )}
                                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                                            <ul className="mt-2 space-y-1">
                                                {exp.responsibilities.map((r: string, j: number) => (
                                                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                                        <span className="text-primary mt-1.5 shrink-0">&#8226;</span> {r}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Education */}
                    {resume.education && resume.education.length > 0 && (
                        <Section icon={GraduationCap} title="Education" count={resume.education.length}>
                            <div className="space-y-3">
                                {resume.education.map((edu: any, i: number) => (
                                    <div key={i} className="border rounded-lg p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                                            <h4 className="font-semibold text-sm">
                                                {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                                            </h4>
                                            <span className="text-xs text-muted-foreground">
                                                {edu.startDate ? format(new Date(edu.startDate), "MMM yyyy") : ""}
                                                {edu.startDate && " — "}
                                                {edu.endDate ? format(new Date(edu.endDate), "MMM yyyy") : "Present"}
                                            </span>
                                        </div>
                                        {edu.institutionName && (
                                            <p className="text-xs text-muted-foreground mt-0.5">{edu.institutionName}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Projects */}
                    {resume.projects && resume.projects.length > 0 && (
                        <Section icon={Code2} title="Projects" count={resume.projects.length}>
                            <div className="space-y-3">
                                {resume.projects.map((proj: any, i: number) => (
                                    <div key={i} className="border rounded-lg p-4">
                                        <h4 className="font-semibold text-sm">{proj.projectName}</h4>
                                        {proj.role && <p className="text-xs text-muted-foreground">{proj.role}</p>}
                                        {proj.description && <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>}
                                        {proj.technologiesUsed && proj.technologiesUsed.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {proj.technologiesUsed.map((t: string, j: number) => (
                                                    <Badge key={j} variant="secondary" className="text-[10px]">{t}</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Certifications */}
                    {resume.certifications && resume.certifications.length > 0 && (
                        <Section icon={Award} title="Certifications" count={resume.certifications.length}>
                            <div className="space-y-2">
                                {resume.certifications.map((cert: any, i: number) => (
                                    <div key={i} className="flex items-baseline justify-between border rounded-lg p-3">
                                        <div>
                                            <p className="text-sm font-medium">{cert.certificationName}</p>
                                            {cert.issuingOrganization && (
                                                <p className="text-xs text-muted-foreground">{cert.issuingOrganization}</p>
                                            )}
                                        </div>
                                        {cert.issueDate && (
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                {format(new Date(cert.issueDate), "MMM yyyy")}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Languages */}
                    {resume.languages && resume.languages.length > 0 && (
                        <Section icon={Languages} title="Languages" count={resume.languages.length}>
                            <div className="flex flex-wrap gap-2">
                                {resume.languages.map((lang: any, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs py-1 px-3">
                                        {lang.language} {lang.proficiencyLevel ? `(${lang.proficiencyLevel})` : ""}
                                    </Badge>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Awards */}
                    {resume.awards && resume.awards.length > 0 && (
                        <Section icon={Award} title="Awards" count={resume.awards.length}>
                            <div className="space-y-2">
                                {resume.awards.map((award: any, i: number) => (
                                    <div key={i} className="flex items-baseline justify-between border rounded-lg p-3">
                                        <div>
                                            <p className="text-sm font-medium">{award.title}</p>
                                            {award.issuer && <p className="text-xs text-muted-foreground">{award.issuer}</p>}
                                        </div>
                                        {award.date && (
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                {format(new Date(award.date), "MMM yyyy")}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* References */}
                    {resume.references && resume.references.length > 0 && (
                        <Section icon={Users} title="References" count={resume.references.length}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {resume.references.map((ref: any, i: number) => (
                                    <div key={i} className="border rounded-lg p-3">
                                        <p className="text-sm font-medium">{ref.name}</p>
                                        {ref.designation && (
                                            <p className="text-xs text-muted-foreground">
                                                {ref.designation}{ref.company ? ` at ${ref.company}` : ""}
                                            </p>
                                        )}
                                        {ref.email && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <Mail className="w-3 h-3" /> {ref.email}
                                            </p>
                                        )}
                                        {ref.phone && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> {ref.phone}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Interests */}
                    {resume.interests && resume.interests.length > 0 && (
                        <Section icon={Sparkles} title="Interests">
                            <div className="flex flex-wrap gap-1.5">
                                {resume.interests.map((interest: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">{interest}</Badge>
                                ))}
                            </div>
                        </Section>
                    )}
                </>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground mb-3">You haven&apos;t created your resume yet.</p>
                        <Link href="/dashboard/my-resume">
                            <Button>Create Resume</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* ── Quick Actions ── */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                        <Link href="/dashboard/my-resume">
                            <Button variant="outline" size="sm">
                                <FileText className="w-4 h-4 mr-2" /> Edit Resume
                            </Button>
                        </Link>
                        <Link href="/dashboard/subscriptions">
                            <Button variant="outline" size="sm">
                                <Shield className="w-4 h-4 mr-2" /> Subscription
                            </Button>
                        </Link>
                        {!premiumActive && (
                            <Link href="/dashboard/subscriptions">
                                <Button variant="outline" size="sm" className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950">
                                    <Crown className="w-4 h-4 mr-2" /> Upgrade to Career Boost
                                </Button>
                            </Link>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyProfileContent;
