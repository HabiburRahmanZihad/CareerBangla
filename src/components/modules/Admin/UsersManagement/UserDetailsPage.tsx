"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadPdfFromElement } from "@/lib/pdfUtils";
import { swalConfirm, swalDanger } from "@/lib/swal";
import { changeUserStatus, updateUser, updateUserHiredStatus } from "@/services/admin.services";
import { IResume, IUserWithDetails } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Award, Briefcase, Calendar, CheckCircle2, Clock, Download, Edit2, FileText, Flag, Lock, Mail, MapPin, Phone, Save, ShieldCheck, Unlock, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import PremiumManagementModal from "./PremiumManagementModal";
import ResumeDetailsView from "./ResumeDetailsView";
import { ResumeEditModal } from "./ResumeEditModal";

interface UserDetailsPageProps {
    user: IUserWithDetails;
    onBack: () => void;
}

const UserDetailsPage = ({ user, onBack }: UserDetailsPageProps) => {
    const queryClient = useQueryClient();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [isResumeEditModalOpen, setIsResumeEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        country: user.country || "",
    });
    const [isDownloadingCV, setIsDownloadingCV] = useState(false);

    const { mutateAsync: doUpdateUser, isPending: isUpdating } = useMutation({
        mutationFn: (data: any) => updateUser(user.id, data),
        onSuccess: (updatedUser: any) => {
            // Update local state immediately
            setEditData({
                name: updatedUser.name || editData.name,
                email: updatedUser.email || editData.email,
                phone: updatedUser.phone || editData.phone,
                country: updatedUser.country || editData.country,
            });
            toast.success("User updated successfully");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
            queryClient.invalidateQueries({ queryKey: ["user", user.id] });
            setIsEditMode(false);
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update user"),
    });

    const { mutateAsync: doUpdateResume, isPending: isUpdatingResume } = useMutation({
        mutationFn: (resumeData: Partial<IResume>) => updateUser(user.id, { resume: resumeData }),
        onSuccess: () => {
            toast.success("Resume updated successfully");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
            queryClient.invalidateQueries({ queryKey: ["user", user.id] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update resume"),
    });

    const { mutateAsync: doChangeStatus } = useMutation({
        mutationFn: (status: string) => changeUserStatus({ userId: user.id, status }),
        onSuccess: () => {
            toast.success("User status updated");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
            queryClient.invalidateQueries({ queryKey: ["user", user.id] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update status"),
    });

    const { mutateAsync: doUpdateHiredStatus, isPending: isUpdatingHired } = useMutation({
        mutationFn: (isHired: boolean) => updateUserHiredStatus(user.id, isHired),
        onSuccess: () => {
            toast.success("Hired status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
            queryClient.invalidateQueries({ queryKey: ["user", user.id] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update hired status"),
    });

    const handleSaveChanges = async () => {
        await doUpdateUser(editData);
    };

    const handleDownloadCV = async () => {
        if (!user.resume) return;
        try {
            setIsDownloadingCV(true);
            const element = document.getElementById("resume-pdf-content");
            if (!element) {
                toast.error("Resume content not found");
                return;
            }
            const fullName = user.resume?.fullName || user.name || "Resume";
            await downloadPdfFromElement("resume-pdf-content", `${fullName}-Resume`);
            toast.success("Resume downloaded successfully");
        } catch (error) {
            console.error("Failed to download PDF:", error);
            toast.error("Failed to download CV");
        } finally {
            setIsDownloadingCV(false);
        }
    };

    const handleUpdateResume = async (resumeData: Partial<IResume>) => {
        await doUpdateResume(resumeData);
    };

    // Calculate jobs applied and shortlisted count
    const jobsApplied = user.applications?.length || 0;
    const jobsShortlisted = user.applications?.filter(app => app.status === "SHORTLISTED" || app.status === "INTERVIEW" || app.status === "HIRED").length || 0;

    return (
        <div className="space-y-6 pb-12">
            {/* ── Premium Header ────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="rounded-lg hover:bg-muted/50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Users
                </Button>
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={user.status === "ACTIVE" ? "bg-green-600/10 text-green-600 border-green-600/30 text-xs" : "bg-destructive/10 text-destructive border-destructive/30 text-xs"}>
                        {user.status === "ACTIVE" ? "✓ Active" : "✕ Blocked"}
                    </Badge>
                    {user.isPremium && <Badge className="bg-yellow-600/10 text-yellow-600 border-yellow-600/30 text-xs">💎 Premium</Badge>}
                    {user.isHired && <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/30 text-xs">🎉 Hired</Badge>}
                    {user.emailVerified && <Badge className="bg-emerald-600/10 text-emerald-600 border-emerald-600/30 text-xs">✓ Verified</Badge>}
                </div>
            </div>

            {/* ── Premium Profile Card ────────────────────────────────────────── */}
            <Card className="border-border/40 overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="h-32 bg-linear-to-br from-primary/20 via-orange-600/10 to-transparent relative overflow-hidden" />


                <CardHeader className="pb-6 -mt-12 relative z-10">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <div className="h-24 w-24 rounded-2xl bg-background border-2 border-border/40 overflow-hidden flex items-center justify-center shadow-lg">
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        width={96}
                                        height={96}
                                        className="h-24 w-24 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="h-24 w-24 rounded-2xl bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-3xl">
                                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between flex-wrap gap-2">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-black text-foreground">{user.name}</h1>
                                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                            <Mail className="h-3.5 w-3.5" />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {user.phone && (
                                        <div className="text-xs flex items-center gap-1 text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
                                            <Phone className="h-3 w-3" />
                                            {user.phone}
                                        </div>
                                    )}
                                    {user.country && (
                                        <div className="text-xs flex items-center gap-1 text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
                                            <MapPin className="h-3 w-3" />
                                            {user.country}
                                        </div>
                                    )}
                                    <div className="text-xs flex items-center gap-1 text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
                                        <Calendar className="h-3 w-3" />
                                        Joined {new Date(user.createdAt || "").toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant={isEditMode ? "destructive" : "default"}
                            className="rounded-lg"
                            onClick={() => setIsEditMode(!isEditMode)}
                        >
                            {isEditMode ? (
                                <>
                                    <X className="h-4 w-4 mr-1.5" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Edit2 className="h-4 w-4 mr-1.5" />
                                    Edit Profile
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>

                {isEditMode && (
                    <CardContent className="space-y-4 border-t border-border/40">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-semibold uppercase tracking-wide">Name</Label>
                                <Input
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="mt-2 rounded-lg border-border/40"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold uppercase tracking-wide">Email</Label>
                                <Input
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    className="mt-2 rounded-lg border-border/40"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold uppercase tracking-wide">Phone</Label>
                                <Input
                                    value={editData.phone}
                                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                    className="mt-2 rounded-lg border-border/40"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold uppercase tracking-wide">Country</Label>
                                <Input
                                    value={editData.country}
                                    onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                                    className="mt-2 rounded-lg border-border/40"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleSaveChanges}
                            disabled={isUpdating}
                            className="rounded-lg w-full sm:w-auto"
                        >
                            <Save className="h-4 w-4 mr-1.5" />
                            Save Changes
                        </Button>
                    </CardContent>
                )}
            </Card>

            {/* ── Quick Stats Grid ────────────────────────────────────────────– */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border/40 bg-linear-to-br from-primary/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jobs Applied</p>
                                <p className="text-3xl font-bold text-primary mt-1">{jobsApplied}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-linear-to-br from-purple-600/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Shortlisted</p>
                                <p className="text-3xl font-bold text-purple-600 mt-1">{jobsShortlisted}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-purple-600/10 flex items-center justify-center">
                                <Award className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-linear-to-br from-yellow-600/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Premium Member</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">{user.isPremium ? "💎" : "—"}</p>
                                {user.isPremium && user.premiumUntil && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Until {new Date(user.premiumUntil).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-yellow-600/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-linear-to-br from-blue-600/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hired Status</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">{user.isHired ? "🎉" : "⏳"}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Premium Tabs ─────────────────────────────────────────────── */}
            <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg border border-border/40">
                    <TabsTrigger value="details" className="rounded-md">📋 Details</TabsTrigger>
                    <TabsTrigger value="resume" className="rounded-md">📄 Resume</TabsTrigger>
                    <TabsTrigger value="actions" className="rounded-md">⚙️ Actions</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                    <Card className="border-border/40">
                        <CardHeader className="border-b border-border/40">
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                Account Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">User ID</p>
                                    <p className="font-mono text-sm mt-2 break-all text-foreground">{user.id}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</p>
                                    <Badge className={user.status === "ACTIVE" ? "bg-green-600/10 text-green-600 border-green-600/30 mt-2" : "bg-destructive/10 text-destructive border-destructive/30 mt-2"}>
                                        {user.status === "ACTIVE" ? "✓ Active" : "✕ Blocked"}
                                    </Badge>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email Verified</p>
                                    <Badge className={user.emailVerified ? "bg-emerald-600/10 text-emerald-600 border-emerald-600/30 mt-2" : "bg-muted border-border/40 mt-2"}>
                                        {user.emailVerified ? "✓ Verified" : "⏳ Pending"}
                                    </Badge>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Created Date</p>
                                    <p className="mt-2 text-sm font-medium">{new Date(user.createdAt || "").toLocaleDateString()}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Premium Status</p>
                                    <Badge className={user.isPremium ? "bg-yellow-600/10 text-yellow-600 border-yellow-600/30 mt-2" : "bg-muted border-border/40 mt-2"}>
                                        {user.isPremium ? "💎 Premium" : "📦 Free"}
                                    </Badge>
                                    {user.isPremium && user.premiumUntil && (
                                        <p className="text-xs text-muted-foreground mt-1.5">
                                            Until {new Date(user.premiumUntil).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/40 hover:border-primary/50 transition-all">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hired Status</p>
                                    {user.isHired ? (
                                        <Badge className="bg-blue-600 text-white border-blue-600 mt-2 font-medium">
                                            🎉 Hired
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/50 mt-2 font-medium">
                                            ⏳ Not Hired
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    {(user.phone || user.country) && (
                        <Card className="border-border/40">
                            <CardHeader className="border-b border-border/40">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Flag className="h-5 w-5 text-primary" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {user.phone && (
                                        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                                            <Phone className="h-4 w-4 text-primary mt-1 shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</p>
                                                <p className="text-sm font-medium mt-1">{user.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    {user.country && (
                                        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                                            <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Country</p>
                                                <p className="text-sm font-medium mt-1">{user.country}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Resume Tab */}
                <TabsContent value="resume" className="space-y-4">
                    <Card className="border-border/40">
                        <CardHeader className="border-b border-border/40 flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Resume
                            </CardTitle>
                            {user.resume && (
                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-lg"
                                        onClick={() => setIsResumeEditModalOpen(true)}
                                    >
                                        <Edit2 className="h-4 w-4 mr-1.5" />
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="rounded-lg"
                                        onClick={handleDownloadCV}
                                        disabled={isDownloadingCV}
                                    >
                                        <Download className="h-4 w-4 mr-1.5" />
                                        Download CV
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="pt-6">
                            {user.resume ? (
                                <div id="resume-pdf-content">
                                    <ResumeDetailsView resume={user.resume} />
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground font-medium">No resume uploaded yet</p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">User hasn&apos;t uploaded their resume</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Actions Tab */}
                <TabsContent value="actions" className="space-y-4">
                    <Card className="border-border/40">
                        <CardHeader className="border-b border-border/40">
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                Account Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {/* Premium Management */}
                            <div className="p-4 rounded-lg border border-border/40 bg-yellow-600/5 hover:border-yellow-600/50 transition-all">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <h3 className="font-semibold flex items-center gap-2 mb-1">
                                            <Award className="h-4 w-4 text-yellow-600" />
                                            Premium Membership
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {user.isPremium ? "✓ User is a premium member" : "User is not a premium member"}
                                        </p>
                                        {user.premiumUntil && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Expires: {new Date(user.premiumUntil).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => setIsPremiumModalOpen(true)}
                                        className="rounded-lg whitespace-nowrap"
                                    >
                                        {user.isPremium ? "Manage" : "Grant"} Premium
                                    </Button>
                                </div>
                            </div>

                            {/* Account Status */}
                            <div className="p-4 rounded-lg border border-border/40 bg-red-600/5 hover:border-red-600/50 transition-all">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <h3 className="font-semibold flex items-center gap-2 mb-2">
                                            {user.status === "ACTIVE" ? (
                                                <>
                                                    <Lock className="h-4 w-4 text-red-600" />
                                                    Ban Account
                                                </>
                                            ) : (
                                                <>
                                                    <Unlock className="h-4 w-4 text-green-600" />
                                                    Unban Account
                                                </>
                                            )}
                                        </h3>
                                        <Badge className={user.status === "ACTIVE" ? "bg-green-600/10 text-green-600 border-green-600/30" : "bg-destructive/10 text-destructive border-destructive/30"}>
                                            {user.status === "ACTIVE" ? "✓ Active" : "✕ Blocked"}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {user.status === "ACTIVE"
                                                ? "Prevent user from accessing the platform"
                                                : "Restore user access to the platform"}
                                        </p>
                                    </div>
                                    <Button
                                        variant={user.status === "ACTIVE" ? "destructive" : "default"}
                                        className="rounded-lg whitespace-nowrap"
                                        onClick={async () => {
                                            const isBanning = user.status === "ACTIVE";
                                            const r = isBanning
                                                ? await swalDanger({ title: "Ban User?", text: "This will block the user from accessing the platform.", confirmText: "Ban User" })
                                                : await swalConfirm({ title: "Unban User?", text: "This will restore user access to the platform.", confirmText: "Unban User", icon: "question" });
                                            if (r.isConfirmed) doChangeStatus(isBanning ? "BLOCKED" : "ACTIVE");
                                        }}
                                    >
                                        {user.status === "ACTIVE" ? (
                                            <>
                                                <Lock className="h-3.5 w-3.5 mr-1.5" />
                                                Ban User
                                            </>
                                        ) : (
                                            <>
                                                <Unlock className="h-3.5 w-3.5 mr-1.5" />
                                                Unban User
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Hired Status */}
                            <div className="p-4 rounded-lg border border-border/40 bg-blue-600/5 hover:border-blue-600/50 transition-all">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <h3 className="font-semibold flex items-center gap-2 mb-2">
                                            <Briefcase className="h-4 w-4 text-blue-600" />
                                            Hired Status
                                        </h3>
                                        <Badge className={user.isHired ? "bg-blue-600/10 text-blue-600 border-blue-600/30" : "bg-muted border-border/40"}>
                                            {user.isHired ? "🎉 Hired" : "⏳ Not Hired"}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {user.isHired
                                                ? "User has been marked as hired"
                                                : "User has not been hired yet"}
                                        </p>
                                    </div>
                                    <Button
                                        variant={user.isHired ? "outline" : "default"}
                                        className="rounded-lg whitespace-nowrap"
                                        disabled={isUpdatingHired}
                                        onClick={async () => {
                                            const newValue = !user.isHired;
                                            const r = await swalConfirm({
                                                title: newValue ? "Mark as Hired?" : "Mark as Not Hired?",
                                                text: newValue ? "Update user's latest application to HIRED." : "Revert user's hired status.",
                                                confirmText: "Confirm",
                                                icon: "question",
                                            });
                                            if (r.isConfirmed) doUpdateHiredStatus(newValue);
                                        }}
                                    >
                                        {user.isHired ? "Mark as Not Hired" : "Mark as Hired"}
                                    </Button>
                                </div>
                            </div>

                            {/* Resume Management */}
                            {user.resume && (
                                <div className="p-4 rounded-lg border border-border/40 bg-primary/5 hover:border-primary/50 transition-all">
                                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                                        <FileText className="h-4 w-4 text-primary" />
                                        Resume Management
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Resume information is displayed and can be edited in the Resume tab above.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Premium Management Modal */}
            <PremiumManagementModal
                isOpen={isPremiumModalOpen}
                onClose={() => setIsPremiumModalOpen(false)}
                user={user}
            />

            {/* Resume Edit Modal */}
            <ResumeEditModal
                open={isResumeEditModalOpen}
                onOpenChange={setIsResumeEditModalOpen}
                resume={user.resume}
                onSave={handleUpdateResume}
                isLoading={isUpdatingResume}
            />
        </div>
    );
};

export default UserDetailsPage;
