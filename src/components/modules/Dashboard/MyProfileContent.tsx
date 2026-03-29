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
    Camera, CheckCircle2, Edit2, ExternalLink, GithubIcon,
    Globe, LinkedinIcon, Loader2, Mail,
    Shield, ShieldCheck, Trash2, User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface MyProfileContentProps { userInfo: UserInfo; }

const ROLE_CFG: Record<string, { label: string; bg: string; text: string }> = {
    JOB_SEEKER: { label: "Job Seeker", bg: "bg-orange-100 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400" },
    RECRUITER: { label: "Recruiter", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
    ADMIN: { label: "Admin", bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400" },
    SUPER_ADMIN: { label: "Super Admin", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
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

    const { data: resumeData } = useQuery({
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
        ? "from-red-600 via-red-500 to-red-400"
        : "from-orange-500 via-orange-600 to-orange-700";

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
        <div className="w-full pb-10 space-y-6">
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* HERO SECTION */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div className="rounded-3xl border border-white/20 bg-linear-to-br bg-card overflow-hidden shadow-2xl">
                {/* Cover Background */}
                <div className={`relative h-48 sm:h-56 lg:h-64 bg-linear-to-br ${coverGradient} overflow-hidden`}>
                    {/* Animated linear orbs */}
                    <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

                    {/* Photo Upload Button */}
                    <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white text-sm font-semibold border border-white/30 shadow-lg transition"
                    >
                        {isUploadingPhoto ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                        ) : (
                            <><Camera className="h-4 w-4" /> Change Photo</>
                        )}
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

                {/* Profile Info */}
                <div className="relative px-6 sm:px-8 pb-8">
                    {/* Avatar */}
                    <div className="relative -mt-20 sm:-mt-24 mb-6 w-fit">
                        <div className={`relative h-32 w-32 sm:h-40 sm:w-40 rounded-2xl p-1 bg-linear-to-br ${coverGradient} shadow-2xl`}>
                            <div className="h-full w-full rounded-xl overflow-hidden bg-muted border-4 border-card">
                                {avatarSrc ? (
                                    <Image
                                        src={avatarSrc}
                                        alt={userInfo.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className={`h-full w-full flex items-center justify-center text-5xl sm:text-6xl font-black ${isAdmin ? "bg-red-100 dark:bg-red-950/50 text-red-600"
                                        : "bg-orange-100 dark:bg-orange-950/50 text-orange-600"
                                        }`}>
                                        {userInfo.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                        </div>
                        {userInfo.emailVerified && (
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 border-4 border-card flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Name & Details */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">{userInfo.name}</h1>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${roleCfg.bg} ${roleCfg.text}`}>
                                {roleCfg.label}
                            </span>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50">
                                    <Mail className="h-4 w-4" />
                                    <span>{userInfo.email}</span>
                                </div>
                            </div>
                            {subtitle && (
                                <p className="text-base font-medium text-foreground">{subtitle}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* MAIN CONTENT GRID */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ─────────────────────────── LEFT COLUMN ────────────────────── */}
                <div className="space-y-6">

                    {/* Personal Info Card */}
                    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-border/80 transition-colors">
                        <div className="px-6 py-4 border-b border-border/30 bg-linear-to-r from-orange-50 to-orange-50/30 dark:from-orange-950/20 dark:to-transparent">
                            <p className="font-semibold text-foreground flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Personal Information
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Account Status */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Account Status</p>
                                <div className="flex items-center gap-2">
                                    {userInfo.status === "ACTIVE" ? (
                                        <>
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <span className="text-sm font-medium text-green-700 dark:text-green-400">Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <span className="text-sm font-medium text-red-700 dark:text-red-400">Inactive</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Full Name */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Full Name</p>
                                <p className="text-sm font-medium">{userInfo.name}</p>
                            </div>

                            {/* Email */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Email Address</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium break-all">{userInfo.email}</p>
                                    {userInfo.emailVerified && (
                                        <ShieldCheck className="h-4 w-4 text-green-600 shrink-0 ml-2" />
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Phone Number</p>
                                {isEditingPhone ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            autoFocus
                                            type="tel"
                                            value={phoneValue}
                                            onChange={(e) => setPhoneValue(e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                            className="h-8 text-sm rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={handlePhoneSave}
                                            disabled={isSavingPhone}
                                            className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {isSavingPhone ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingPhone(false);
                                                setPhoneValue(userInfo.phone || "");
                                            }}
                                            className="h-8 w-8 rounded-lg hover:bg-muted"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">
                                            {phoneValue || <span className="text-muted-foreground italic">Not set</span>}
                                        </p>
                                        <button
                                            title="Edit"
                                            type="button"
                                            onClick={() => setIsEditingPhone(true)}
                                            className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center"
                                        >
                                            <Edit2 className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Social Links Card */}
                    {isJobSeeker && (resume?.linkedinUrl || resume?.githubUrl || resume?.portfolioUrl) && (
                        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-border/80 transition-colors">
                            <div className="px-6 py-4 border-b border-border/30 bg-linear-to-r from-emerald-50 to-emerald-50/30 dark:from-emerald-950/20 dark:to-transparent">
                                <p className="font-semibold text-foreground flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    Social Links
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-3">
                                    {resume?.linkedinUrl && (
                                        <a
                                            href={resume.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/40 transition group"
                                        >
                                            <LinkedinIcon className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0" />
                                            <span className="flex-1 text-sm font-medium">LinkedIn</span>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                                        </a>
                                    )}
                                    {resume?.githubUrl && (
                                        <a
                                            href={resume.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg border border-muted dark:border-border bg-muted/50 dark:bg-muted/30 hover:bg-muted dark:hover:bg-muted/50 transition group"
                                        >
                                            <GithubIcon className="h-5 w-5 text-foreground/60 shrink-0" />
                                            <span className="flex-1 text-sm font-medium">GitHub</span>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                                        </a>
                                    )}
                                    {resume?.portfolioUrl && (
                                        <a
                                            href={resume.portfolioUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/40 transition group"
                                        >
                                            <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0" />
                                            <span className="flex-1 text-sm font-medium">Portfolio</span>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─────────────────────────── RIGHT COLUMN (2/3) ────────────── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Profile Completion Card */}
                    {isJobSeeker && (
                        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-border/80 transition-colors">
                            <div className="px-6 py-4 border-b border-border/30 bg-linear-to-r from-orange-50 to-orange-50/30 dark:from-orange-950/20 dark:to-transparent">
                                <p className="font-semibold text-foreground">Profile Completion</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-end gap-4">
                                    {/* Circular Progress */}
                                    <div className="relative h-32 w-32 shrink-0">
                                        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                                            {/* Background circle */}
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="54"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                className="text-muted"
                                            />
                                            {/* Progress circle */}
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="54"
                                                fill="none"
                                                stroke="url(#progress)"
                                                strokeWidth="8"
                                                strokeDasharray={Math.PI * 2 * 54}
                                                strokeDashoffset={Math.PI * 2 * 54 * (1 - profileCompletion / 100)}
                                                className="transition-all duration-500"
                                            />
                                            <defs>
                                                <linearGradient id="progress" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#f97316" />
                                                    <stop offset="100%" stopColor="#ea580c" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-3xl font-black text-foreground">{profileCompletion}%</p>
                                                <p className="text-xs font-bold text-muted-foreground">Complete</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex-1 space-y-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-lg bg-muted/50 p-3">
                                                <p className="text-xs font-bold text-muted-foreground">Applied</p>
                                                <p className="text-2xl font-black mt-1">{userInfo.applications?.length ?? 0}</p>
                                            </div>
                                            <div className="rounded-lg bg-muted/50 p-3">
                                                <p className="text-xs font-bold text-muted-foreground">Status</p>
                                                <p className="text-2xl font-black mt-1 text-green-600">{isHired ? "✓" : "—"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-muted-foreground">Overall Progress</p>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                                            style={{ width: `${profileCompletion}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Security Card */}
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-destructive/20 bg-destructive/10">
                            <p className="font-semibold text-destructive flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Account Settings
                            </p>
                        </div>
                        <div className="p-6 space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all associated data. <span className="font-semibold text-destructive">This action cannot be undone.</span>
                            </p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" disabled={isDeleting} className="gap-2">
                                        {isDeleting ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Deleting...</>
                                        ) : (
                                            <><Trash2 className="h-4 w-4" /> Delete Account</>
                                        )}
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

                    {/* Recruiter Section */}
                    {isRecruiter && (
                        <div className="rounded-2xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 overflow-hidden">
                            <div className="px-6 py-4 border-b border-orange-200 dark:border-orange-800 bg-orange-100 dark:bg-orange-900/30">
                                <p className="font-semibold text-orange-900 dark:text-orange-100">Recruiter Profile</p>
                            </div>
                            <div className="p-6 space-y-3 text-orange-900 dark:text-orange-100">
                                {recruiter ? (
                                    <>
                                        <div>
                                            <p className="text-xs font-bold uppercase mb-1">Company</p>
                                            <p className="font-medium">{recruiter.companyName}</p>
                                        </div>
                                        {recruiter.designation && (
                                            <div>
                                                <p className="text-xs font-bold uppercase mb-1">Designation</p>
                                                <p className="font-medium">{recruiter.designation}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm">No recruiter profile data found.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Admin Section */}
                    {isAdmin && (
                        <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 overflow-hidden">
                            <div className="px-6 py-4 border-b border-red-200 dark:border-red-800 bg-red-100 dark:bg-red-900/30">
                                <p className="font-semibold text-red-900 dark:text-red-100">Admin Privileges</p>
                            </div>
                            <div className="p-6 space-y-4 text-red-900 dark:text-red-100">
                                <p className="text-sm">
                                    You have <span className="font-semibold">{userInfo.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</span> privileges.
                                </p>
                                <div className="flex gap-2">
                                    <Link href="/admin/dashboard">
                                        <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-100 dark:border-red-800">
                                            Admin Dashboard
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfileContent;
