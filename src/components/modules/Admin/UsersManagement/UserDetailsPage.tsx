"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadPdfFromElement } from "@/lib/pdfUtils";
import { changeUserStatus, updateUser } from "@/services/admin.services";
import { IResume, IUserWithDetails } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, Edit2, Lock, Save, Unlock, X } from "lucide-react";
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
    const [banConfirmOpen, setBanConfirmOpen] = useState(false);
    const [editData, setEditData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        country: user.country || "",
    });
    const [isDownloadingCV, setIsDownloadingCV] = useState(false);

    const { mutateAsync: doUpdateUser, isPending: isUpdating } = useMutation({
        mutationFn: (data: any) => updateUser(user.id, data),
        onSuccess: () => {
            toast.success("User updated successfully");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
            setIsEditMode(false);
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update user"),
    });

    const { mutateAsync: doUpdateResume, isPending: isUpdatingResume } = useMutation({
        mutationFn: (resumeData: Partial<IResume>) => updateUser(user.id, { resume: resumeData }),
        onSuccess: () => {
            toast.success("Resume updated successfully");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update resume"),
    });

    const { mutateAsync: doChangeStatus } = useMutation({
        mutationFn: (status: string) => changeUserStatus({ userId: user.id, status }),
        onSuccess: () => {
            toast.success("User status updated");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
            setBanConfirmOpen(false);
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update status"),
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
    const jobsShortlisted = user.applications?.filter(app => app.status === "SHORTLISTED" || app.status === "ACCEPTED" || app.status === "REVIEWED").length || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Users
                </Button>
                <div className="flex items-center gap-2">
                    <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                        {user.status}
                    </Badge>
                    {user.isPremium && <Badge className="bg-yellow-600">Premium</Badge>}
                    {user.isHired && <Badge className="bg-green-600">Hired</Badge>}
                </div>
            </div>

            {/* User Info Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden flex items-center justify-center">
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        className="h-20 w-20 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="h-20 w-20 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{user.name}</CardTitle>
                                <p className="text-muted-foreground">{user.email}</p>
                                {user.phone && <p className="text-muted-foreground">{user.phone}</p>}
                                {user.country && <p className="text-muted-foreground">{user.country}</p>}
                                <p className="text-sm text-muted-foreground mt-1">
                                    Joined: {new Date(user.createdAt || "").toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditMode(!isEditMode)}
                            >
                                {isEditMode ? (
                                    <>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {isEditMode && (
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Input
                                    value={editData.phone}
                                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Country</Label>
                                <Input
                                    value={editData.country}
                                    onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleSaveChanges}
                                disabled={isUpdating}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="py-6 text-center">
                        <p className="text-3xl font-bold">{jobsApplied}</p>
                        <p className="text-sm text-muted-foreground">Jobs Applied</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-6 text-center">
                        <p className="text-3xl font-bold">{jobsShortlisted}</p>
                        <p className="text-sm text-muted-foreground">Jobs Shortlisted</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-6 text-center">
                        <p className="text-3xl font-bold">{user.isPremium ? "Yes" : "No"}</p>
                        <p className="text-sm text-muted-foreground">Premium Member</p>
                        {user.isPremium && user.premiumUntil && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Until: {new Date(user.premiumUntil).toLocaleDateString()}
                            </p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-6 text-center">
                        <p className="text-3xl font-bold">{user.isHired ? "Yes" : "No"}</p>
                        <p className="text-sm text-muted-foreground">Hired Status</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="resume">Resume</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">User ID</Label>
                                    <p className="font-mono text-sm">{user.id}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                                        {user.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Email Verified</Label>
                                    <p>{user.emailVerified ? "✓ Yes" : "✗ No"}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Created Date</Label>
                                    <p>{new Date(user.createdAt || "").toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Premium Status</Label>
                                    {user.isPremium ? (
                                        <div>
                                            <Badge className="bg-yellow-600">Premium</Badge>
                                            {user.premiumUntil && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Expires: {new Date(user.premiumUntil).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <Badge variant="outline">Free</Badge>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Hired</Label>
                                    <Badge variant={user.isHired ? "default" : "outline"}>
                                        {user.isHired ? "Yes" : "No"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Resume Tab */}
                <TabsContent value="resume" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Resume</CardTitle>
                            {user.resume && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setIsResumeEditModalOpen(true)}
                                    >
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit Resume
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleDownloadCV}
                                        disabled={isDownloadingCV}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download CV
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            {user.resume ? (
                                <div id="resume-pdf-content">
                                    <ResumeDetailsView resume={user.resume} />
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <p>No resume has been uploaded by this user yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Actions Tab */}
                <TabsContent value="actions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Premium Management */}
                            <div className="border-b pb-4 space-y-3">
                                <h3 className="font-semibold">Premium Membership</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm">
                                            {user.isPremium ? "User is a premium member" : "User is not a premium member"}
                                        </p>
                                        {user.premiumUntil && (
                                            <p className="text-xs text-muted-foreground">
                                                Expires: {new Date(user.premiumUntil).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <Button onClick={() => setIsPremiumModalOpen(true)}>
                                        {user.isPremium ? "Manage" : "Grant"} Premium
                                    </Button>
                                </div>
                            </div>

                            {/* Ban/Unban */}
                            <div className="border-b pb-4 space-y-3">
                                <h3 className="font-semibold">Account Status</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                                            {user.status === "ACTIVE" ? "Active" : "Blocked"}
                                        </Badge>
                                    </div>
                                    <Button
                                        variant={user.status === "ACTIVE" ? "destructive" : "default"}
                                        onClick={() => setBanConfirmOpen(true)}
                                    >
                                        {user.status === "ACTIVE" ? (
                                            <>
                                                <Lock className="h-4 w-4 mr-2" />
                                                Ban User
                                            </>
                                        ) : (
                                            <>
                                                <Unlock className="h-4 w-4 mr-2" />
                                                Unban User
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Delete Resume Fields */}
                            {user.resume && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold">Resume Management</h3>
                                    <p className="text-sm text-muted-foreground">Resume information is displayed and can be edited in the Resume tab above.</p>
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

            {/* Ban Confirmation */}
            <AlertDialog open={banConfirmOpen} onOpenChange={setBanConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {user.status === "ACTIVE" ? "Ban User?" : "Unban User?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {user.status === "ACTIVE"
                                ? "This will block the user from accessing the platform. They will not be able to login or use any services."
                                : "This will reactivate the user account and they will regain access to the platform."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => doChangeStatus(user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE")}
                        className={user.status === "ACTIVE" ? "bg-destructive hover:bg-destructive/90" : ""}
                    >
                        {user.status === "ACTIVE" ? "Ban User" : "Unban User"}
                    </AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>

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
