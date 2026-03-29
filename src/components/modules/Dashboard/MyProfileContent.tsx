"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import envConfig from "@/lib/envConfig";
import { deleteMyAccount, updateMyProfile } from "@/services/auth.services";
import { getMyRecruiterProfile } from "@/services/recruiter.services";
import { getMyResume } from "@/services/resume.services";
import { IApplication, UserInfo } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Award,
    Briefcase,
    Building2,
    Calendar,
    Camera,
    CheckCircle2,
    Clock,
    Code2,
    Crown,
    ExternalLink,
    FileText,
    GithubIcon,
    Globe,
    GraduationCap,
    Languages,
    LinkedinIcon,
    Loader2,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Rocket,
    Shield,
    ShieldCheck,
    Sparkles,
    Trash2,
    User,
    Users,
    X,
    XCircle,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────
interface MyProfileContentProps { userInfo: UserInfo; }

// ── Helpers ───────────────────────────────────────────────────────────────────
const completionGradient = (n: number) =>
    n >= 80 ? "from-green-500 to-emerald-400"
    : n >= 60 ? "from-blue-500 to-cyan-400"
    : n >= 40 ? "from-yellow-500 to-amber-400"
    : "from-orange-500 to-red-400";

const completionText = (n: number) =>
    n >= 80 ? "text-green-600 dark:text-green-400"
    : n >= 60 ? "text-blue-600 dark:text-blue-400"
    : n >= 40 ? "text-yellow-600 dark:text-yellow-400"
    : "text-orange-600 dark:text-orange-400";

// ── Sub-components ────────────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, count, children }: {
    icon: React.ElementType; title: string;
    count?: number; children: React.ReactNode;
}) => (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold">{title}</h3>
            {count !== undefined && count > 0 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 ml-auto">{count}</Badge>
            )}
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const InfoItem = ({ icon: Icon, label, value, href }: {
    icon: React.ElementType; label: string;
    value?: string | null; href?: string;
}) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1 break-all">
                        {value} <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                ) : (
                    <p className="text-sm font-medium break-all capitalize">{value}</p>
                )}
            </div>
        </div>
    );
};

const TimelineItem = ({ title, subtitle, date, dateEnd, bullets, tags }: {
    title: string; subtitle?: string;
    date?: string; dateEnd?: string;
    bullets?: string[]; tags?: string[];
}) => (
    <div className="relative pl-6 pb-5 last:pb-0">
        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary/20 border-2 border-primary/40" />
        <div className="absolute left-1.25 top-4 bottom-0 w-px bg-border last:hidden" />
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 mb-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            {(date || dateEnd) && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="h-3 w-3" />
                    {date}{dateEnd ? ` — ${dateEnd}` : " — Present"}
                </span>
            )}
        </div>
        {subtitle && <p className="text-xs text-muted-foreground mb-1.5">{subtitle}</p>}
        {bullets && bullets.length > 0 && (
            <ul className="space-y-1 mb-2">
                {bullets.map((b, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary mt-1 shrink-0">•</span>{b}
                    </li>
                ))}
            </ul>
        )}
        {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
                {tags.map((t, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5">{t}</Badge>
                ))}
            </div>
        )}
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const MyProfileContent = ({ userInfo }: MyProfileContentProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneValue, setPhoneValue] = useState(userInfo.phone || "");
    const [isSavingPhone, setIsSavingPhone] = useState(false);

    const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
        mutationFn: () => deleteMyAccount(),
        onSuccess: () => { toast.success("Account deleted"); router.push("/login"); },
        onError: () => toast.error("Failed to delete account"),
    });

    const isRecruiter = userInfo.role === "RECRUITER";
    const isAdmin = userInfo.role === "ADMIN" || userInfo.role === "SUPER_ADMIN";
    const isJobSeeker = !isRecruiter && !isAdmin;

    const { data: resumeData, isLoading: resumeLoading } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
        enabled: isJobSeeker,
    });

    const { data: recruiterData, isLoading: recruiterLoading } = useQuery({
        queryKey: ["my-recruiter-profile"],
        queryFn: () => getMyRecruiterProfile(),
        enabled: isRecruiter,
    });

    const resume = resumeData?.data;
    const recruiter = recruiterData?.data;
    const profileCompletion = resume?.profileCompletion ?? 0;

    const isPremium = userInfo.isPremium;
    const premiumUntil = userInfo.premiumUntil;
    const isLifetime = isPremium && !premiumUntil;
    const premiumExpired = premiumUntil ? new Date(premiumUntil) < new Date() : false;
    const premiumActive = isPremium && !premiumExpired;
    const isHired = userInfo.applications?.some((app: IApplication) => app.status === "HIRED");

    const avatarSrc = isRecruiter
        ? recruiter?.profilePhoto || userInfo.image
        : resume?.profilePhoto || userInfo.image;

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }
        setIsUploadingPhoto(true);
        try {
            const fd = new FormData();
            fd.append("photo", file);
            const res = await fetch(`${envConfig.apiBaseUrl}/resumes/upload-photo`, {
                method: "POST", credentials: "include", body: fd,
            });
            if (!res.ok) { const e = await res.json().catch(() => null); throw new Error(e?.message || "Upload failed"); }
            toast.success("Profile photo updated!");
            queryClient.invalidateQueries({ queryKey: ["my-resume"] });
        } catch (err: any) {
            toast.error(err.message || "Upload failed");
        } finally {
            setIsUploadingPhoto(false);
            if (photoInputRef.current) photoInputRef.current.value = "";
        }
    };

    const handlePhoneSave = async () => {
        const trimmed = phoneValue.trim();
        if (trimmed && (trimmed.length < 11 || trimmed.length > 14)) {
            toast.error("Phone number must be 11-14 characters"); return;
        }
        setIsSavingPhone(true);
        try {
            await updateMyProfile({ phone: trimmed || undefined });
            toast.success("Phone number updated!");
            setIsEditingPhone(false);
            await queryClient.invalidateQueries({ queryKey: ["my-resume"] });
            router.refresh();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update phone");
        } finally { setIsSavingPhone(false); }
    };

    const roleCfg: Record<string, { label: string; bg: string; text: string }> = {
        JOB_SEEKER:  { label: "Job Seeker",  bg: "bg-primary/10",      text: "text-primary" },
        RECRUITER:   { label: "Recruiter",   bg: "bg-blue-500/10",     text: "text-blue-600 dark:text-blue-400" },
        ADMIN:       { label: "Admin",       bg: "bg-red-500/10",      text: "text-red-600 dark:text-red-400" },
        SUPER_ADMIN: { label: "Super Admin", bg: "bg-purple-500/10",   text: "text-purple-600 dark:text-purple-400" },
    };
    const role = roleCfg[userInfo.role] ?? roleCfg.JOB_SEEKER;

    const subtitle = isRecruiter && recruiter?.companyName
        ? `${recruiter.designation ? recruiter.designation + " · " : ""}${recruiter.companyName}`
        : !isRecruiter && resume?.professionalTitle
        ? resume.professionalTitle
        : "";

    const coverGradient = isAdmin
        ? "from-red-600 via-red-500 to-orange-500"
        : isRecruiter
        ? "from-blue-600 via-blue-500 to-cyan-500"
        : "from-primary via-primary/90 to-primary/75";

    return (
        <div className="space-y-6 max-w-5xl pb-10">

            {/* ── Page heading ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">My Profile</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Manage your account and personal information</p>
                </div>
                {isJobSeeker && (
                    <Link href="/dashboard/my-resume">
                        <Button size="sm" variant="outline" className="gap-1.5 rounded-xl">
                            <Pencil className="h-3.5 w-3.5" /> Edit Resume
                        </Button>
                    </Link>
                )}
            </div>

            {/* ── Hero card ────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                {/* Cover */}
                <div className={`relative h-28 sm:h-36 bg-linear-to-br ${coverGradient}`}>
                    <div className="pointer-events-none absolute inset-0 opacity-20"
                        style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
                    <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                    {isJobSeeker && (
                        <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            disabled={isUploadingPhoto}
                            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/25 backdrop-blur hover:bg-black/35 transition text-white text-xs font-medium"
                        >
                            {isUploadingPhoto
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Camera className="h-3.5 w-3.5" />}
                            {isUploadingPhoto ? "Uploading…" : "Change Photo"}
                        </button>
                    )}
                    <input ref={photoInputRef} type="file" accept="image/*"
                        className="hidden" aria-label="Upload profile photo" onChange={handlePhotoUpload} />
                </div>

                {/* Avatar + info row */}
                <div className="px-5 sm:px-7 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-4 border-background overflow-hidden bg-muted shadow-lg">
                                {avatarSrc ? (
                                    <Image src={avatarSrc} alt={userInfo.name} fill className="object-cover" />
                                ) : (
                                    <div className={`h-full w-full flex items-center justify-center text-3xl font-extrabold ${
                                        isAdmin ? "bg-red-50 dark:bg-red-950/30 text-red-600"
                                        : isRecruiter ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600"
                                        : "bg-primary/10 text-primary"
                                    }`}>
                                        {userInfo.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            {isRecruiter && recruiter?.companyLogo && (
                                <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-xl border-2 border-background overflow-hidden bg-white shadow">
                                    <Image src={recruiter.companyLogo} alt="logo" fill className="object-contain p-0.5" />
                                </div>
                            )}
                        </div>

                        {/* Name + badges */}
                        <div className="flex-1 min-w-0 sm:pb-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{userInfo.name}</h2>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${role.bg} ${role.text}`}>
                                    {role.label}
                                </span>
                                {userInfo.emailVerified && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                                        <ShieldCheck className="h-3 w-3" /> Verified
                                    </span>
                                )}
                                {premiumActive && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                                        <Sparkles className="h-3 w-3" /> Career Boost
                                    </span>
                                )}
                                {isHired && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                                        <CheckCircle2 className="h-3 w-3" /> Hired
                                    </span>
                                )}
                                {isRecruiter && recruiter?.status && recruiter.status !== "APPROVED" && (
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                        recruiter.status === "PENDING"
                                            ? "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400"
                                            : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                                    }`}>
                                        {recruiter.status === "PENDING" ? "Pending Approval" : "Rejected"}
                                    </span>
                                )}
                            </div>
                            {subtitle && <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 shrink-0" />{userInfo.email}</span>
                                {(isRecruiter ? recruiter?.contactNumber : (resume?.contactNumber || userInfo.phone)) && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="h-3.5 w-3.5 shrink-0" />
                                        {isRecruiter ? recruiter?.contactNumber : (resume?.contactNumber || userInfo.phone)}
                                    </span>
                                )}
                                {(isRecruiter ? recruiter?.companyAddress : resume?.address) && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                        {isRecruiter ? recruiter?.companyAddress : resume?.address}
                                    </span>
                                )}
                                {isRecruiter && recruiter?.companyWebsite && (
                                    <a href={recruiter.companyWebsite} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-primary hover:underline">
                                        <Globe className="h-3.5 w-3.5 shrink-0" />
                                        {recruiter.companyWebsite.replace(/^https?:\/\//, "")}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Two-column layout ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ══ LEFT SIDEBAR ═══════════════════════════════════════════ */}
                <div className="lg:col-span-1 space-y-4">

                    {/* Account Details */}
                    <SectionCard icon={Shield} title="Account Details">
                        <div className="space-y-2">
                            <InfoItem icon={User} label="Full Name" value={userInfo.name} />
                            <InfoItem icon={Mail} label="Email Address" value={userInfo.email} />

                            {/* Phone — editable */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <Phone className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Phone Number</p>
                                    {isEditingPhone ? (
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Input
                                                autoFocus
                                                type="tel"
                                                value={phoneValue}
                                                onChange={(e) => setPhoneValue(e.target.value)}
                                                placeholder="01XXXXXXXXX"
                                                className="h-7 text-xs rounded-lg px-2"
                                            />
                                            <button
                                                type="button"
                                                title="Save phone number"
                                                onClick={handlePhoneSave}
                                                disabled={isSavingPhone}
                                                className="h-7 px-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition disabled:opacity-50 shrink-0"
                                            >
                                                {isSavingPhone ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                                            </button>
                                            <button
                                                type="button"
                                                title="Cancel editing"
                                                onClick={() => { setIsEditingPhone(false); setPhoneValue(userInfo.phone || ""); }}
                                                className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition shrink-0"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between gap-2 mt-0.5">
                                            <p className="text-sm font-medium">
                                                {phoneValue || <span className="text-muted-foreground/50 italic text-xs">Not set</span>}
                                            </p>
                                            <button
                                                type="button"
                                                title="Edit phone number"
                                                onClick={() => setIsEditingPhone(true)}
                                                className="h-6 w-6 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition shrink-0"
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <InfoItem icon={Shield} label="Role" value={userInfo.role?.replace("_", " ").toLowerCase()} />
                            <InfoItem
                                icon={userInfo.status === "ACTIVE" ? CheckCircle2 : XCircle}
                                label="Account Status"
                                value={userInfo.status?.toLowerCase() || "active"}
                            />
                            {userInfo.referralCode && (
                                <InfoItem icon={Users} label="Referral Code" value={userInfo.referralCode} />
                            )}
                            <InfoItem
                                icon={userInfo.emailVerified ? CheckCircle2 : XCircle}
                                label="Email Verified"
                                value={userInfo.emailVerified ? "Yes" : "No"}
                            />
                        </div>
                    </SectionCard>

                    {/* Quick Actions — Job Seeker */}
                    {isJobSeeker && (
                        <SectionCard icon={Zap} title="Quick Actions">
                            <div className="space-y-1.5">
                                {[
                                    { href: "/dashboard/my-resume", icon: FileText, label: "Edit Resume", cls: "hover:bg-primary/5" },
                                    { href: "/dashboard/my-applications", icon: Briefcase, label: "My Applications", cls: "hover:bg-blue-50 dark:hover:bg-blue-950/20" },
                                    { href: "/dashboard/subscriptions", icon: Crown, label: premiumActive ? "Manage Subscription" : "Upgrade to Career Boost", cls: "hover:bg-amber-50 dark:hover:bg-amber-950/20" },
                                ].map(({ href, icon: Icon, label, cls }) => (
                                    <Link key={href} href={href}>
                                        <div className={`flex items-center gap-3 p-3 rounded-xl bg-muted/30 ${cls} border border-transparent transition cursor-pointer`}>
                                            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon className="h-3.5 w-3.5 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">{label}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {/* Social Links — Job Seeker */}
                    {isJobSeeker && (resume?.linkedinUrl || resume?.githubUrl || resume?.portfolioUrl) && (
                        <SectionCard icon={Globe} title="Social Links">
                            <div className="space-y-1.5">
                                {resume.linkedinUrl && (
                                    <a href={resume.linkedinUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition group">
                                        <div className="h-7 w-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                            <LinkedinIcon className="h-3.5 w-3.5 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground truncate flex-1">LinkedIn</span>
                                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                                    </a>
                                )}
                                {resume.githubUrl && (
                                    <a href={resume.githubUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition group">
                                        <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                            <GithubIcon className="h-3.5 w-3.5 text-foreground" />
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground truncate flex-1">GitHub</span>
                                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                                    </a>
                                )}
                                {resume.portfolioUrl && (
                                    <a href={resume.portfolioUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-green-50 dark:hover:bg-green-950/20 transition group">
                                        <div className="h-7 w-7 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                            <Globe className="h-3.5 w-3.5 text-green-600" />
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground truncate flex-1">Portfolio</span>
                                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                                    </a>
                                )}
                            </div>
                        </SectionCard>
                    )}
                </div>

                {/* ══ MAIN CONTENT ════════════════════════════════════════════ */}
                <div className="lg:col-span-2 space-y-4">

                    {/* ── JOB SEEKER ── */}
                    {isJobSeeker && (
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
                                        {[1,2,3,4,5,6].map(i => <div key={i} className="h-14 rounded-xl bg-muted" />)}
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
                                        {resume.technicalSkills?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Technical Skills</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {resume.technicalSkills.map((s: string, i: number) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {resume.softSkills?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Soft Skills</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {resume.softSkills.map((s: string, i: number) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {resume.toolsAndTechnologies?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Tools &amp; Technologies</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {resume.toolsAndTechnologies.map((t: string, i: number) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </SectionCard>
                            ) : null}

                            {/* Work Experience */}
                            {resume?.workExperience?.length > 0 && (
                                <SectionCard icon={Briefcase} title="Work Experience" count={resume.workExperience.length}>
                                    <div>
                                        {resume.workExperience.map((exp: any, i: number) => (
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
                            {resume?.education?.length > 0 && (
                                <SectionCard icon={GraduationCap} title="Education" count={resume.education.length}>
                                    <div>
                                        {resume.education.map((edu: any, i: number) => (
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
                            {resume?.projects?.length > 0 && (
                                <SectionCard icon={Code2} title="Projects" count={resume.projects.length}>
                                    <div className="space-y-3">
                                        {resume.projects.map((proj: any, i: number) => (
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
                                                        {proj.technologiesUsed.map((t: string, j: number) => (
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
                            {resume?.certifications?.length > 0 && (
                                <SectionCard icon={Award} title="Certifications" count={resume.certifications.length}>
                                    <div className="space-y-2">
                                        {resume.certifications.map((cert: any, i: number) => (
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
                            {resume?.languages?.length > 0 && (
                                <SectionCard icon={Languages} title="Languages" count={resume.languages.length}>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.languages.map((lang: any, i: number) => (
                                            <span key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/50 bg-muted/30 text-sm">
                                                <span className="font-medium">{lang.language}</span>
                                                {lang.proficiencyLevel && <span className="text-xs text-muted-foreground">({lang.proficiencyLevel})</span>}
                                            </span>
                                        ))}
                                    </div>
                                </SectionCard>
                            )}

                            {/* Awards */}
                            {resume?.awards?.length > 0 && (
                                <SectionCard icon={Award} title="Awards" count={resume.awards.length}>
                                    <div className="space-y-2">
                                        {resume.awards.map((award: any, i: number) => (
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
                            {resume?.interests?.length > 0 && (
                                <SectionCard icon={Sparkles} title="Interests">
                                    <div className="flex flex-wrap gap-1.5">
                                        {resume.interests.map((interest: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 rounded-xl border border-border/50 bg-muted/30 text-sm">{interest}</span>
                                        ))}
                                    </div>
                                </SectionCard>
                            )}

                            {/* References */}
                            {resume?.references?.length > 0 && (
                                <SectionCard icon={Users} title="References" count={resume.references.length}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {resume.references.map((ref: any, i: number) => (
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
                    )}

                    {/* ── RECRUITER ── */}
                    {isRecruiter && (
                        <>
                            {recruiterLoading ? (
                                <div className="space-y-4">
                                    {[0, 1].map(i => (
                                        <div key={i} className="rounded-2xl border border-border/50 bg-card overflow-hidden animate-pulse">
                                            <div className="px-5 py-4 border-b border-border/40 flex gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-muted" />
                                                <div className="h-4 w-40 bg-muted rounded-lg self-center" />
                                            </div>
                                            <div className="p-5 grid grid-cols-2 gap-2">
                                                {[1,2,3,4].map(j => <div key={j} className="h-14 rounded-xl bg-muted" />)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : recruiter ? (
                                <>
                                    {recruiter.status && recruiter.status !== "APPROVED" && (
                                        <div className={`rounded-2xl border p-4 flex items-start gap-3 ${
                                            recruiter.status === "PENDING"
                                                ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                                                : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                                        }`}>
                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                                                recruiter.status === "PENDING" ? "bg-yellow-100 dark:bg-yellow-900/40" : "bg-red-100 dark:bg-red-900/40"
                                            }`}>
                                                {recruiter.status === "PENDING"
                                                    ? <Clock className="h-4 w-4 text-yellow-600" />
                                                    : <XCircle className="h-4 w-4 text-red-600" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold ${recruiter.status === "PENDING" ? "text-yellow-800 dark:text-yellow-300" : "text-red-800 dark:text-red-300"}`}>
                                                    {recruiter.status === "PENDING" ? "Account Pending Approval" : "Account Rejected"}
                                                </p>
                                                <p className={`text-xs mt-0.5 ${recruiter.status === "PENDING" ? "text-yellow-700 dark:text-yellow-400" : "text-red-700 dark:text-red-400"}`}>
                                                    {recruiter.status === "PENDING"
                                                        ? "Your account is awaiting admin approval. You will be notified once approved."
                                                        : "Your account was rejected. Please contact support for more information."}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <SectionCard icon={Building2} title="Company Information">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <InfoItem icon={Building2} label="Company Name" value={recruiter.companyName} />
                                            <InfoItem icon={Globe} label="Website" value={recruiter.companyWebsite} href={recruiter.companyWebsite} />
                                            <InfoItem icon={MapPin} label="Address" value={recruiter.companyAddress} />
                                            <InfoItem icon={Users} label="Company Size" value={recruiter.companySize} />
                                            <InfoItem icon={Briefcase} label="Industry" value={recruiter.industry} />
                                        </div>
                                    </SectionCard>

                                    <SectionCard icon={Shield} title="Recruiter Details">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <InfoItem icon={User} label="Full Name" value={recruiter.name} />
                                            <InfoItem icon={Briefcase} label="Designation" value={recruiter.designation} />
                                            <InfoItem icon={Mail} label="Email" value={recruiter.email} />
                                            <InfoItem icon={Phone} label="Contact" value={recruiter.contactNumber} />
                                        </div>
                                    </SectionCard>

                                    {recruiter.description && (
                                        <SectionCard icon={FileText} title="About Company">
                                            <p className="text-sm text-muted-foreground leading-relaxed">{recruiter.description}</p>
                                        </SectionCard>
                                    )}

                                    {recruiter.companyLogo && (
                                        <SectionCard icon={Building2} title="Company Branding">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-20 w-20 rounded-xl border border-border/50 overflow-hidden bg-muted/30 shrink-0">
                                                    <Image src={recruiter.companyLogo} alt={recruiter.companyName || "Logo"}
                                                        fill className="object-contain p-2" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{recruiter.companyName}</p>
                                                    {recruiter.industry && <p className="text-xs text-muted-foreground mt-0.5">{recruiter.industry}</p>}
                                                    {recruiter.companySize && <p className="text-xs text-muted-foreground">{recruiter.companySize}</p>}
                                                </div>
                                            </div>
                                        </SectionCard>
                                    )}

                                    <div className="rounded-2xl border border-border/50 bg-card p-5">
                                        <p className="text-sm font-semibold mb-3">Quick Actions</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Link href="/recruiter/dashboard/my-jobs">
                                                <Button variant="outline" size="sm" className="gap-1.5 rounded-xl text-xs">
                                                    <Briefcase className="h-3.5 w-3.5" /> My Jobs
                                                </Button>
                                            </Link>
                                            <Link href="/recruiter/dashboard/post-job">
                                                <Button size="sm" className="gap-1.5 rounded-xl text-xs">
                                                    <Sparkles className="h-3.5 w-3.5" /> Post a Job
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-border py-16 flex flex-col items-center gap-3 text-muted-foreground">
                                    <Building2 className="h-10 w-10 opacity-30" />
                                    <p className="text-sm">No recruiter profile data found.</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── ADMIN / SUPER ADMIN ── */}
                    {isAdmin && (
                        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                            <div className="px-5 py-4 border-b border-border/40 bg-red-50 dark:bg-red-950/20">
                                <p className="text-sm font-bold flex items-center gap-2 text-red-700 dark:text-red-400">
                                    <ShieldCheck className="h-4 w-4" /> Admin Privileges
                                </p>
                            </div>
                            <div className="p-5 space-y-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    You have <span className="font-semibold text-foreground">
                                        {userInfo.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                                    </span> privileges on this platform. Manage users, jobs, recruiters, and platform settings from the admin dashboard.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Link href="/admin/dashboard">
                                        <Button size="sm" className="gap-1.5 rounded-xl text-xs">
                                            <Shield className="h-3.5 w-3.5" /> Admin Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/admin/dashboard/users">
                                        <Button variant="outline" size="sm" className="gap-1.5 rounded-xl text-xs">
                                            <Users className="h-3.5 w-3.5" /> Manage Users
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Danger Zone (not for SUPER_ADMIN) ── */}
                    {userInfo.role !== "SUPER_ADMIN" && (
                        <div className="rounded-2xl border border-destructive/30 bg-card overflow-hidden">
                            <div className="px-5 py-4 border-b border-destructive/20 bg-destructive/5">
                                <p className="text-sm font-bold text-destructive flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" /> Danger Zone
                                </p>
                            </div>
                            <div className="p-5">
                                <p className="text-sm text-muted-foreground mb-4">
                                    Permanently delete your account and all associated data.{" "}
                                    <span className="font-semibold text-destructive">This action cannot be undone.</span>
                                </p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled={isDeleting} className="gap-1.5 rounded-xl">
                                            {isDeleting
                                                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Deleting…</>
                                                : <><Trash2 className="h-3.5 w-3.5" /> Delete Account</>
                                            }
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete your account, profile, resume, applications, and all data.
                                                This action <strong>cannot be undone</strong>.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => deleteAccount()}
                                                className="bg-destructive text-white hover:bg-destructive/90 rounded-xl"
                                            >
                                                Yes, delete my account
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfileContent;
