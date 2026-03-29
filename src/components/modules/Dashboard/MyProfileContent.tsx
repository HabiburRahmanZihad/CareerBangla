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
import { UserInfo } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Building2, Camera, CheckCircle2, Edit2, FileText,
    GithubIcon, Globe, LayoutDashboard, LinkedinIcon,
    Loader2, Mail, MapPin, Phone, ShieldCheck, Trash2, User, Users, X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { JobSeekerSection } from "./MyProfileJobSeeker";
import { InfoItem, SectionCard } from "./MyProfileShared";

interface MyProfileContentProps { userInfo: UserInfo; }

const ROLE_CFG: Record<string, { label: string; bg: string; text: string }> = {
    JOB_SEEKER: { label: "Job Seeker", bg: "bg-primary/10", text: "text-primary" },
    RECRUITER: { label: "Recruiter", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
    ADMIN: { label: "Admin", bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
    SUPER_ADMIN: { label: "Super Admin", bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
};

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

    const { data: recruiterData } = useQuery({
        queryKey: ["my-recruiter-profile"],
        queryFn: getMyRecruiterProfile,
        enabled: isRecruiter,
    });

    const resume = resumeData?.data;
    const recruiter = recruiterData?.data;
    const profileCompletion = resume?.profileCompletion ?? 0;

    const isPremium = userInfo.isPremium ?? false;
    const premiumExpired = userInfo.premiumUntil ? new Date(userInfo.premiumUntil) < new Date() : false;
    const premiumActive = !!(isPremium && !premiumExpired);
    const isLifetime = !!(isPremium && !userInfo.premiumUntil);

    const avatarSrc = isRecruiter
        ? recruiter?.profilePhoto || userInfo.image
        : resume?.profilePhoto || userInfo.image;

    const roleCfg = ROLE_CFG[userInfo.role] ?? ROLE_CFG.JOB_SEEKER;

    const subtitle = isRecruiter && recruiter?.companyName
        ? `${recruiter.designation ? recruiter.designation + " · " : ""}${recruiter.companyName}`
        : isJobSeeker && resume?.professionalTitle
            ? resume.professionalTitle
            : "";

    const coverGradient = isAdmin
        ? "from-red-600 via-rose-500 to-red-700"
        : isRecruiter
            ? "from-blue-600 via-indigo-500 to-blue-700"
            : "from-primary via-orange-500 to-orange-700";

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
        <div className="w-full pb-12 space-y-5">

            {/* ══════════════════════════════════════════════════════════════════ */}
            {/* HERO CARD                                                         */}
            {/* ══════════════════════════════════════════════════════════════════ */}
            <div className="rounded-3xl border border-border/40 bg-card overflow-hidden shadow-xl shadow-black/5">

                {/* Cover strip */}
                <div className={`relative h-40 sm:h-48 bg-linear-to-br ${coverGradient} overflow-hidden`}>
                    {/* Dot grid */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }}
                    />
                    {/* Ambient blobs */}
                    <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

                    {/* Photo upload button */}
                    <button
                        type="button"
                        title="Change profile photo"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="absolute top-4 right-4 flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/25 backdrop-blur-md hover:bg-black/40 text-white text-xs font-bold border border-white/20 shadow-lg transition-all duration-150 disabled:opacity-60"
                    >
                        {isUploadingPhoto
                            ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</>
                            : <><Camera className="h-3.5 w-3.5" /> Change Photo</>
                        }
                    </button>
                    <input
                        title="Upload Photo"
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                    />
                </div>

                {/* Info area */}
                <div className="relative px-6 sm:px-8">
                    {/* Avatar — overlaps cover */}
                    <div className="-mt-12 sm:-mt-16 mb-5 w-fit relative">
                        <div className={`p-0.75 rounded-2xl bg-linear-to-br ${coverGradient} shadow-2xl`}>
                            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-xl overflow-hidden bg-card border-2 border-card">
                                {avatarSrc ? (
                                    <Image src={avatarSrc} alt={userInfo.name} fill className="object-cover" />
                                ) : (
                                    <div className={`h-full w-full flex items-center justify-center text-4xl sm:text-5xl font-black ${isAdmin ? "bg-red-100 dark:bg-red-950/50 text-red-600"
                                            : isRecruiter ? "bg-blue-100 dark:bg-blue-950/50 text-blue-600"
                                                : "bg-orange-100 dark:bg-orange-950/50 text-orange-600"
                                        }`}>
                                        {userInfo.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                        </div>
                        {userInfo.emailVerified && (
                            <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-green-500 border-[3px] border-card flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Name · role · subtitle · email */}
                    <div className="pb-6 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{userInfo.name}</h1>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${roleCfg.bg} ${roleCfg.text}`}>
                                {roleCfg.label}
                            </span>
                        </div>
                        {subtitle && (
                            <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
                        )}
                        <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
                            <Mail className="h-3 w-3 shrink-0" />
                            {userInfo.email}
                        </p>
                    </div>
                </div>

            </div>

            {/* ══════════════════════════════════════════════════════════════════ */}
            {/* MAIN GRID                                                         */}
            {/* ══════════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
                <div className="space-y-4">

                    {/* Account Details */}
                    <SectionCard icon={User} title="Account Details">

                        {/* Status pills */}
                        <div className="flex flex-wrap gap-1.5 pb-3.5 border-b border-border/20 mb-0.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${userInfo.status === "ACTIVE"
                                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                                }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${userInfo.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`} />
                                {userInfo.status === "ACTIVE" ? "Active" : (userInfo.status ?? "Unknown")}
                            </span>
                            {userInfo.emailVerified && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <ShieldCheck className="h-3 w-3" />
                                    Verified
                                </span>
                            )}
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${roleCfg.bg} ${roleCfg.text}`}>
                                {roleCfg.label}
                            </span>
                        </div>

                        {/* Name + Email */}
                        <InfoItem icon={User} label="Full Name" value={userInfo.name} />
                        <InfoItem icon={Mail} label="Email Address" value={userInfo.email} />

                        {/* Phone — inline editable */}
                        <div className="flex items-start gap-2.5 py-2.5 border-b border-border/20">
                            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                <Phone className="h-3 w-3 text-primary/80" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Phone Number</p>
                                {isEditingPhone ? (
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Input
                                            autoFocus
                                            type="tel"
                                            value={phoneValue}
                                            onChange={(e) => setPhoneValue(e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                            className="h-7 text-xs rounded-lg flex-1 min-w-0"
                                        />
                                        <button
                                            type="button"
                                            title="Save phone number"
                                            onClick={handlePhoneSave}
                                            disabled={isSavingPhone}
                                            className="h-7 px-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-50 shrink-0 flex items-center"
                                        >
                                            {isSavingPhone ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            title="Cancel editing"
                                            onClick={() => { setIsEditingPhone(false); setPhoneValue(userInfo.phone || ""); }}
                                            className="h-7 w-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground shrink-0"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between mt-0.5">
                                        <p className="text-sm font-medium">
                                            {phoneValue || <span className="text-muted-foreground/50 italic text-xs">Not set</span>}
                                        </p>
                                        <button
                                            type="button"
                                            title="Edit phone number"
                                            onClick={() => setIsEditingPhone(true)}
                                            className="h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center ml-1 shrink-0"
                                        >
                                            <Edit2 className="h-3 w-3 text-muted-foreground" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Referral code */}
                        {userInfo.referralCode && (
                            <InfoItem icon={Users} label="Referral Code" value={userInfo.referralCode} />
                        )}
                    </SectionCard>

                    {/* Social Links — job seeker only */}
                    {isJobSeeker && (resume?.linkedinUrl || resume?.githubUrl || resume?.portfolioUrl) && (
                        <SectionCard icon={Globe} title="Social Links">
                            <div className="grid grid-cols-3 gap-2">
                                {resume?.linkedinUrl ? (
                                    <a
                                        href={resume.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="LinkedIn Profile"
                                        aria-label="LinkedIn Profile"
                                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border/40 bg-muted/20 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
                                    >
                                        <LinkedinIcon className="h-5 w-5 text-[#0A66C2] group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold text-muted-foreground">LinkedIn</span>
                                    </a>
                                ) : <div />}
                                {resume?.githubUrl ? (
                                    <a
                                        href={resume.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="GitHub Profile"
                                        aria-label="GitHub Profile"
                                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/50 hover:border-border/60 transition-colors group"
                                    >
                                        <GithubIcon className="h-5 w-5 text-foreground group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold text-muted-foreground">GitHub</span>
                                    </a>
                                ) : <div />}
                                {resume?.portfolioUrl ? (
                                    <a
                                        href={resume.portfolioUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Portfolio Website"
                                        aria-label="Portfolio Website"
                                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border/40 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                                    >
                                        <Globe className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold text-muted-foreground">Portfolio</span>
                                    </a>
                                ) : <div />}
                            </div>
                        </SectionCard>
                    )}

                    {/* Danger Zone */}
                    <div className="relative rounded-2xl border border-destructive/25 bg-destructive/5 overflow-hidden">
                        <div className="absolute left-0 inset-y-0 w-0.75 bg-linear-to-b from-destructive to-destructive/10" />
                        <div className="px-5 py-3.5 border-b border-destructive/20 flex items-center gap-2.5 bg-destructive/10">
                            <Trash2 className="h-4 w-4 text-destructive shrink-0" />
                            <h3 className="text-sm font-semibold tracking-tight text-destructive">Danger Zone</h3>
                        </div>
                        <div className="p-5 space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Permanently delete your account and all data.{" "}
                                <span className="font-semibold text-destructive">This cannot be undone.</span>
                            </p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" disabled={isDeleting} className="gap-2">
                                        {isDeleting
                                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting…</>
                                            : <><Trash2 className="h-4 w-4" /> Delete Account</>
                                        }
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-2xl">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete your account, profile, resume, and all data.
                                            This action <strong>cannot be undone</strong>.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => deleteAccount()}
                                            className="bg-destructive text-white hover:bg-destructive/90 rounded-lg"
                                        >
                                            Yes, delete my account
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN (2 / 3) ─────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-4">

                    {/* ── Job Seeker ── */}
                    {isJobSeeker && (
                        <JobSeekerSection
                            resume={resume}
                            resumeLoading={resumeLoading}
                            premiumActive={premiumActive}
                            isLifetime={isLifetime}
                            premiumUntil={userInfo.premiumUntil}
                            profileCompletion={profileCompletion}
                        />
                    )}

                    {/* ── Recruiter ── */}
                    {isRecruiter && (
                        <>
                            <SectionCard icon={Building2} title="Company Information">
                                <InfoItem icon={Building2} label="Company Name" value={recruiter?.companyName} />
                                <InfoItem icon={Globe} label="Website" value={recruiter?.companyWebsite} href={recruiter?.companyWebsite} />
                                <InfoItem icon={MapPin} label="Address" value={recruiter?.companyAddress} />
                                <InfoItem icon={Users} label="Company Size" value={recruiter?.companySize} />
                                <InfoItem icon={FileText} label="Industry" value={recruiter?.industry} />
                                {!recruiter && (
                                    <p className="text-sm text-muted-foreground italic">No company data found.</p>
                                )}
                            </SectionCard>

                            <SectionCard icon={User} title="Recruiter Details">
                                <InfoItem icon={User} label="Full Name" value={recruiter?.name} />
                                <InfoItem icon={FileText} label="Designation" value={recruiter?.designation} />
                                <InfoItem icon={Mail} label="Contact Email" value={recruiter?.email} />
                                <InfoItem icon={Phone} label="Contact Number" value={recruiter?.contactNumber} />
                            </SectionCard>

                            {recruiter?.description && (
                                <SectionCard icon={FileText} title="About Company">
                                    <p className="text-sm text-muted-foreground leading-relaxed">{recruiter.description}</p>
                                </SectionCard>
                            )}

                            {recruiter?.companyLogo && (
                                <SectionCard icon={Building2} title="Company Logo">
                                    <div className="relative h-24 w-24 rounded-xl overflow-hidden border border-border/40 bg-muted/30">
                                        <Image src={recruiter.companyLogo} alt={recruiter.companyName || "Company Logo"} fill className="object-contain p-2" />
                                    </div>
                                </SectionCard>
                            )}

                            {recruiter?.status && recruiter.status !== "APPROVED" && (
                                <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4 flex items-start gap-3">
                                    <div className="h-7 w-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                        <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-amber-900 dark:text-amber-100">Account Under Review</p>
                                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                                            Your recruiter profile is <strong>{recruiter.status}</strong>. You will be notified once approved.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── Admin ── */}
                    {isAdmin && (
                        <SectionCard icon={ShieldCheck} title="Admin Privileges">
                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    You have{" "}
                                    <span className="font-bold text-foreground">
                                        {userInfo.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                                    </span>{" "}
                                    privileges on this platform.
                                </p>
                                <Link href="/admin/dashboard">
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Admin Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </SectionCard>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfileContent;
