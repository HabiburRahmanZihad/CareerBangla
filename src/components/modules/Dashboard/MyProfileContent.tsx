"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import envConfig from "@/lib/envConfig";
import { deleteMyAccount, updateMyProfile } from "@/services/auth.services";
import { getMyRecruiterProfile } from "@/services/recruiter.services";
import { getMyResume } from "@/services/resume.services";
import { IApplication, UserInfo } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Briefcase, Building2, Camera, CheckCircle2, Clock,
    FileText, GithubIcon, Globe,
    LinkedinIcon, Loader2, Mail, MapPin,
    Pencil, Phone, Shield, ShieldCheck,
    Sparkles, Trash2, User, Users,
    X, XCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { JobSeekerSection } from "./MyProfileJobSeeker";
import { InfoItem, SectionCard } from "./MyProfileShared";

// ── Types ─────────────────────────────────────────────────────────────────────
interface MyProfileContentProps { userInfo: UserInfo; }

// ── Role config ───────────────────────────────────────────────────────────────
const ROLE_CFG: Record<string, { label: string; bg: string; text: string }> = {
    JOB_SEEKER: { label: "Job Seeker", bg: "bg-primary/10", text: "text-primary" },
    RECRUITER: { label: "Recruiter", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
    ADMIN: { label: "Admin", bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
    SUPER_ADMIN: { label: "Super Admin", bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
};

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
        queryFn: getMyResume,
        enabled: isJobSeeker,
    });

    const { data: recruiterData, isLoading: recruiterLoading } = useQuery({
        queryKey: ["my-recruiter-profile"],
        queryFn: getMyRecruiterProfile,
        enabled: isRecruiter,
    });

    const resume = resumeData?.data;
    const recruiter = recruiterData?.data;
    const profileCompletion = resume?.profileCompletion ?? 0;

    const isPremium = userInfo.isPremium;
    const premiumUntil = userInfo.premiumUntil;
    const isLifetime = !!(isPremium && !premiumUntil);
    const premiumExpired = premiumUntil ? new Date(premiumUntil) < new Date() : false;
    const premiumActive = !!(isPremium && !premiumExpired);
    const isHired = userInfo.applications?.some((app: IApplication) => app.status === "HIRED");

    const avatarSrc = isRecruiter
        ? recruiter?.profilePhoto || userInfo.image
        : resume?.profilePhoto || userInfo.image;

    const roleCfg = ROLE_CFG[userInfo.role] ?? ROLE_CFG.JOB_SEEKER;

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

    // ── Photo upload ─────────────────────────────────────────────────────────
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
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.message || "Upload failed");
            }
            toast.success("Profile photo updated!");
            queryClient.invalidateQueries({ queryKey: ["my-resume"] });
        } catch (err: any) {
            toast.error(err.message || "Upload failed");
        } finally {
            setIsUploadingPhoto(false);
            if (photoInputRef.current) photoInputRef.current.value = "";
        }
    };

    // ── Phone save ───────────────────────────────────────────────────────────
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
        } finally {
            setIsSavingPhone(false);
        }
    };

    return (
        <div className="space-y-6 w-full pb-10 px-0 sm:px-2 md:px-4">

            {/* ── Hero card ────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                {/* Cover gradient */}
                <div className={`relative h-44 sm:h-52 bg-linear-to-br ${coverGradient}`}>
                    <div className="pointer-events-none absolute inset-0 opacity-20"
                        style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
                    {/* Floating orbs */}
                    <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-4 -left-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
                    {isJobSeeker && (
                        <button type="button" onClick={() => photoInputRef.current?.click()}
                            disabled={isUploadingPhoto}
                            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/25 backdrop-blur-sm hover:bg-black/35 transition text-white text-xs font-semibold border border-white/20 shadow-sm">
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
                <div className="px-5 sm:px-7 pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-11 sm:-mt-13">
                        {/* Avatar with gradient ring */}
                        <div className="relative shrink-0">
                            <div className={`h-22 w-22 sm:h-26 sm:w-26 rounded-2xl p-0.75 bg-linear-to-br ${coverGradient} shadow-lg`}>
                                <div className="h-full w-full rounded-[11px] sm:rounded-[13px] overflow-hidden bg-muted">
                                    {avatarSrc ? (
                                        <Image src={avatarSrc} alt={userInfo.name} fill className="object-cover" />
                                    ) : (
                                        <div className={`h-full w-full flex items-center justify-center text-3xl font-extrabold ${isAdmin ? "bg-red-50 dark:bg-red-950/30 text-red-600"
                                                : isRecruiter ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600"
                                                    : "bg-primary/10 text-primary"
                                            }`}>
                                            {userInfo.name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isRecruiter && recruiter?.companyLogo && (
                                <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-xl border-2 border-background overflow-hidden bg-white shadow">
                                    <Image src={recruiter.companyLogo} alt="logo" fill className="object-contain p-0.5" />
                                </div>
                            )}
                        </div>

                        {/* Name + badges */}
                        <div className="flex-1 min-w-0 sm:pb-4 pt-2 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight">{userInfo.name}</h2>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${roleCfg.bg} ${roleCfg.text}`}>
                                    {roleCfg.label}
                                </span>
                                {userInfo.emailVerified && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                                        <ShieldCheck className="h-3 w-3" /> Verified
                                    </span>
                                )}
                                {premiumActive && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
                                        <Sparkles className="h-3 w-3" /> Career Boost
                                    </span>
                                )}
                                {isHired && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                                        <CheckCircle2 className="h-3 w-3" /> Hired
                                    </span>
                                )}
                                {isRecruiter && recruiter?.status && recruiter.status !== "APPROVED" && (
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${recruiter.status === "PENDING"
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

                {/* Stats strip — job seekers only */}
                {isJobSeeker && (
                    <div className="border-t border-border/30 grid grid-cols-3 divide-x divide-border/30 mt-4">
                        {[
                            { label: "Applied", value: userInfo.applications?.length ?? 0 },
                            { label: "Hired", value: isHired ? "Yes ✓" : "—" },
                            { label: "Score", value: `${profileCompletion}%` },
                        ].map(({ label, value }) => (
                            <div key={label} className="py-3.5 flex flex-col items-center gap-0.5 hover:bg-muted/20 transition-colors cursor-default">
                                <span className="text-lg font-black">{value}</span>
                                <span className="text-[10px] font-semibold text-muted-foreground tracking-wide">{label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Two-column layout ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">

                {/* ══ LEFT SIDEBAR ═══════════════════════════════════════════ */}
                <div className="lg:col-span-1 space-y-4">

                    {/* Account Details */}
                    <SectionCard icon={Shield} title="Account Details">
                        {/* Status pills */}
                        <div className="flex flex-wrap gap-1.5 pb-4 mb-2 border-b border-border/20">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${userInfo.status === "ACTIVE"
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                }`}>
                                {userInfo.status === "ACTIVE"
                                    ? <CheckCircle2 className="h-3 w-3" />
                                    : <XCircle className="h-3 w-3" />}
                                {userInfo.status?.toLowerCase() || "active"}
                            </span>
                            {userInfo.emailVerified && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                    <ShieldCheck className="h-3 w-3" /> Verified
                                </span>
                            )}
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${roleCfg.bg} ${roleCfg.text}`}>
                                {roleCfg.label}
                            </span>
                        </div>

                        <InfoItem icon={User} label="Full Name" value={userInfo.name} />
                        <InfoItem icon={Mail} label="Email Address" value={userInfo.email} />

                        {/* Phone — editable inline */}
                        <div className="flex items-start gap-2.5 py-2.5 border-b border-border/20 last:border-0">
                            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                <Phone className="h-3 w-3 text-primary/80" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Phone Number</p>
                                {isEditingPhone ? (
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Input autoFocus type="tel" value={phoneValue}
                                            onChange={(e) => setPhoneValue(e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                            className="h-7 text-xs rounded-lg px-2" />
                                        <button type="button" title="Save phone number"
                                            onClick={handlePhoneSave} disabled={isSavingPhone}
                                            className="h-7 px-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition disabled:opacity-50 shrink-0">
                                            {isSavingPhone ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                                        </button>
                                        <button type="button" title="Cancel editing"
                                            onClick={() => { setIsEditingPhone(false); setPhoneValue(userInfo.phone || ""); }}
                                            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition shrink-0">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between gap-2 mt-0.5">
                                        <p className="text-sm font-medium">
                                            {phoneValue || <span className="text-muted-foreground/50 italic text-xs">Not set</span>}
                                        </p>
                                        <button type="button" title="Edit phone number"
                                            onClick={() => setIsEditingPhone(true)}
                                            className="h-6 w-6 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition shrink-0">
                                            <Pencil className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {userInfo.referralCode && (
                            <InfoItem icon={Users} label="Referral Code" value={userInfo.referralCode} />
                        )}
                    </SectionCard>

                    {/* Social Links — Job Seeker */}
                    {isJobSeeker && (resume?.linkedinUrl || resume?.githubUrl || resume?.portfolioUrl) && (
                        <SectionCard icon={Globe} title="Social Links">
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { url: resume?.linkedinUrl, label: "LinkedIn", icon: LinkedinIcon, cls: "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20 hover:bg-[#0A66C2]/20" },
                                    { url: resume?.githubUrl, label: "GitHub", icon: GithubIcon, cls: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700" },
                                    { url: resume?.portfolioUrl, label: "Portfolio", icon: Globe, cls: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50" },
                                ].filter(l => l.url).map(({ url, label, icon: Icon, cls }) => (
                                    <a key={label} href={url!} target="_blank" rel="noopener noreferrer"
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors ${cls}`}>
                                        <Icon className="h-5 w-5" />
                                        <span className="text-[10px] font-bold">{label}</span>
                                    </a>
                                ))}
                            </div>
                        </SectionCard>
                    )}
                </div>

                {/* ══ MAIN CONTENT ════════════════════════════════════════════ */}
                <div className="sm:col-span-2 lg:col-span-2 space-y-4">

                    {/* ── JOB SEEKER ── */}
                    {isJobSeeker && (
                        <JobSeekerSection
                            resume={resume}
                            resumeLoading={resumeLoading}
                            premiumActive={premiumActive}
                            isLifetime={isLifetime}
                            premiumUntil={premiumUntil}
                            profileCompletion={profileCompletion}
                        />
                    )}

                    {/* ── RECRUITER ── */}
                    {isRecruiter && (
                        <>
                            {recruiterLoading ? (
                                <div className="space-y-4">
                                    {[0, 1].map(i => (
                                        <div key={i} className="rounded-2xl border border-border/40 bg-card overflow-hidden animate-pulse">
                                            <div className="px-5 py-3.5 border-b border-border/30 flex gap-3">
                                                <div className="h-4 w-4 rounded bg-muted" />
                                                <div className="h-4 w-40 bg-muted rounded-lg self-center" />
                                            </div>
                                            <div className="p-5 grid grid-cols-2 gap-2">
                                                {[1, 2, 3, 4].map(j => <div key={j} className="h-14 rounded-xl bg-muted" />)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : recruiter ? (
                                <>
                                    {/* Approval status banner */}
                                    {recruiter.status && recruiter.status !== "APPROVED" && (
                                        <div className={`rounded-2xl border p-4 flex items-start gap-3 ${recruiter.status === "PENDING"
                                                ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                                                : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                                            }`}>
                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${recruiter.status === "PENDING" ? "bg-yellow-100 dark:bg-yellow-900/40" : "bg-red-100 dark:bg-red-900/40"
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
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                                            <InfoItem icon={Building2} label="Company Name" value={recruiter.companyName} />
                                            <InfoItem icon={Globe} label="Website" value={recruiter.companyWebsite} href={recruiter.companyWebsite} />
                                            <InfoItem icon={MapPin} label="Address" value={recruiter.companyAddress} />
                                            <InfoItem icon={Users} label="Company Size" value={recruiter.companySize} />
                                            <InfoItem icon={Briefcase} label="Industry" value={recruiter.industry} />
                                        </div>
                                    </SectionCard>

                                    <SectionCard icon={Shield} title="Recruiter Details">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
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

                                    {/* Quick Actions */}
                                    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden relative hover:border-border/60 transition-colors duration-200">
                                        <div className="absolute left-0 inset-y-0 w-0.75 bg-linear-to-b from-primary to-primary/10" />
                                        <div className="px-5 py-3.5 border-b border-border/30 bg-muted/10">
                                            <p className="text-sm font-semibold tracking-tight">Quick Actions</p>
                                        </div>
                                        <div className="p-5">
                                            <div className="grid grid-cols-2 gap-3">
                                                <Link href="/recruiter/dashboard/my-jobs">
                                                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 hover:border-border/70 hover:bg-muted/20 transition-colors cursor-pointer">
                                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                            <Briefcase className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <span className="text-xs font-bold">My Jobs</span>
                                                    </div>
                                                </Link>
                                                <Link href="/recruiter/dashboard/post-job">
                                                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-colors cursor-pointer">
                                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                            <Sparkles className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <span className="text-xs font-bold">Post a Job</span>
                                                    </div>
                                                </Link>
                                            </div>
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
                                    </span> privileges. Manage users, jobs, recruiters, and platform settings from the admin dashboard.
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
                                            <AlertDialogAction onClick={() => deleteAccount()}
                                                className="bg-destructive text-white hover:bg-destructive/90 rounded-xl">
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
