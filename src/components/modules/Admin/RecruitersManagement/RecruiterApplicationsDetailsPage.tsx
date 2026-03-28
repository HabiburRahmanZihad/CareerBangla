/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { approveRecruiter, rejectRecruiter, updateRecruiterData } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, Edit2, Save, User, X, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface RecruiterApplicationsDetailsPageProps {
    recruiter: IRecruiterProfile;
    onBack: () => void;
}

const RecruiterApplicationsDetailsPage = ({ recruiter, onBack }: RecruiterApplicationsDetailsPageProps) => {
    const queryClient = useQueryClient();
    const [isEditMode, setIsEditMode] = useState(false);
    const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
    const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
    const [editData, setEditData] = useState({
        name: recruiter.name,
        email: recruiter.email,
        designation: recruiter.designation || "",
        companyName: recruiter.companyName || "",
        companyWebsite: recruiter.companyWebsite || "",
        companyAddress: recruiter.companyAddress || "",
        contactNumber: recruiter.contactNumber || "",
        industry: recruiter.industry || "",
        companySize: recruiter.companySize || "",
        description: recruiter.description || "",
    });

    const { mutateAsync: doUpdateRecruiter, isPending: isUpdating } = useMutation({
        mutationFn: (data: Record<string, unknown>) => updateRecruiterData(recruiter.id, data),
        onSuccess: () => {
            toast.success("Recruiter updated successfully");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
            setIsEditMode(false);
        },
        onError: (err: Error) => {
            const errorMessage = err instanceof Error && "message" in err ? (err as any).response?.data?.message : "Failed to update";
            toast.error(errorMessage || "Failed to update recruiter");
        },
    });

    const { mutateAsync: doApproveRecruiter } = useMutation({
        mutationFn: () => approveRecruiter(recruiter.id),
        onSuccess: () => {
            toast.success("Recruiter approved successfully and verification email sent");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
            setApproveConfirmOpen(false);
            setTimeout(() => onBack(), 1000);
        },
        onError: (err: Error) => {
            const errorMessage = err instanceof Error && "message" in err ? (err as any).response?.data?.message : "Failed to approve";
            toast.error(errorMessage || "Failed to approve recruiter");
        },
    });

    const { mutateAsync: doRejectRecruiter } = useMutation({
        mutationFn: () => rejectRecruiter(recruiter.id),
        onSuccess: () => {
            toast.success("Recruiter rejected successfully");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
            setRejectConfirmOpen(false);
            setTimeout(() => onBack(), 1000);
        },
        onError: (err: Error) => {
            const errorMessage = err instanceof Error && "message" in err ? (err as any).response?.data?.message : "Failed to reject";
            toast.error(errorMessage || "Failed to reject recruiter");
        },
    });

    const handleSaveChanges = async () => {
        await doUpdateRecruiter(editData);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Recruiter Application</h1>
                        <p className="text-sm text-muted-foreground">Review and manage this recruiter's application</p>
                    </div>
                </div>
                {!isEditMode && (
                    <Button
                        variant="outline"
                        onClick={() => setIsEditMode(true)}
                    >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </div>

            {/* Edit Mode Toggle Buttons */}
            {isEditMode && (
                <div className="flex gap-2">
                    <Button
                        onClick={handleSaveChanges}
                        disabled={isUpdating}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsEditMode(false);
                            setEditData({
                                name: recruiter.name,
                                email: recruiter.email,
                                designation: recruiter.designation || "",
                                companyName: recruiter.companyName || "",
                                companyWebsite: recruiter.companyWebsite || "",
                                companyAddress: recruiter.companyAddress || "",
                                contactNumber: recruiter.contactNumber || "",
                                industry: recruiter.industry || "",
                                companySize: recruiter.companySize || "",
                                description: recruiter.description || "",
                            });
                        }}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                </div>
            )}

            {/* Status Badges */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Application Status</Badge>
                        <Badge variant="secondary">Pending Review</Badge>
                        {recruiter.isVerified && <Badge variant="default">Verified</Badge>}
                    </div>
                </CardContent>
            </Card>

            {/* Profile Photo and Company Logo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Photo — always shown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Profile Photo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        {(recruiter.profilePhoto || recruiter.user?.image) ? (
                            <Image
                                src={(recruiter.profilePhoto || recruiter.user?.image) as string}
                                alt={recruiter.name}
                                width={150}
                                height={150}
                                className="rounded-lg border object-cover"
                            />
                        ) : (
                            <div className="w-37.5 h-37.5 rounded-lg border bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <User className="h-12 w-12" />
                                <span className="text-xs">No photo</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Company Logo — always shown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Company Logo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        {recruiter.companyLogo ? (
                            <Image
                                src={recruiter.companyLogo}
                                alt="Company Logo"
                                width={150}
                                height={150}
                                className="rounded-lg border object-cover"
                            />
                        ) : (
                            <div className="w-37.5 h-37.5 rounded-lg border bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <User className="h-12 w-12" />
                                <span className="text-xs">No logo</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-semibold text-muted-foreground">Name</Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="text-sm font-medium mt-1">{editData.name}</p>
                            )}
                        </div>
                        <div>
                            <Label className="text-xs font-semibold text-muted-foreground">Email</Label>
                            {isEditMode ? (
                                <Input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="text-sm font-medium mt-1 break-all">{editData.email}</p>
                            )}
                        </div>
                        <div>
                            <Label className="text-xs font-semibold text-muted-foreground">Contact Number</Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.contactNumber}
                                    onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="text-sm font-medium mt-1">{editData.contactNumber || "N/A"}</p>
                            )}
                        </div>
                        <div>
                            <Label className="text-xs font-semibold text-muted-foreground">Designation</Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.designation}
                                    onChange={(e) => setEditData({ ...editData, designation: e.target.value })}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="text-sm font-medium mt-1">{editData.designation || "N/A"}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-semibold text-muted-foreground">Company Name</Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.companyName}
                                    onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="text-sm font-medium mt-1">{editData.companyName || "N/A"}</p>
                            )}
                        </div>
                        <div>
                            <Label className="text-xs font-semibold text-muted-foreground">Company Website</Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.companyWebsite}
                                    onChange={(e) => setEditData({ ...editData, companyWebsite: e.target.value })}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="text-sm font-medium mt-1 break-all">{editData.companyWebsite || "N/A"}</p>
                            )}
                        </div>
                        <div>
                            <Label className="text-xs font-semibold text-muted-foreground">Industry</Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.industry}
                                    onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="text-sm font-medium mt-1">{editData.industry || "N/A"}</p>
                            )}
                        </div>
                        <div>
                            <Label className="text-xs font-semibold text-muted-foreground">Company Size</Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.companySize}
                                    onChange={(e) => setEditData({ ...editData, companySize: e.target.value })}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="text-sm font-medium mt-1">{editData.companySize || "N/A"}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-muted-foreground">Company Address</Label>
                        {isEditMode ? (
                            <Input
                                value={editData.companyAddress}
                                onChange={(e) => setEditData({ ...editData, companyAddress: e.target.value })}
                                className="mt-1"
                            />
                        ) : (
                            <p className="text-sm font-medium mt-1">{editData.companyAddress || "N/A"}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Description */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">About Company</CardTitle>
                </CardHeader>
                <CardContent>
                    {isEditMode ? (
                        <Textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            rows={4}
                        />
                    ) : (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{editData.description || "No description provided"}</p>
                    )}
                </CardContent>
            </Card>

            {/* Application Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Application Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <div>
                            <p className="text-sm font-medium">Application Submitted</p>
                            <p className="text-xs text-muted-foreground">{recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleString() : "N/A"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            {!isEditMode && (
                <Card>
                    <CardContent className="py-6">
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => setApproveConfirmOpen(true)}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Application
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setRejectConfirmOpen(true)}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Application
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Approve Confirmation Dialog */}
            <AlertDialog open={approveConfirmOpen} onOpenChange={setApproveConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Recruiter Application</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will approve the recruiter account and send them a verification email. They will be able to post jobs immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => doApproveRecruiter()}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            Approve
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Confirmation Dialog */}
            <AlertDialog open={rejectConfirmOpen} onOpenChange={setRejectConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Recruiter Application</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will reject the recruiter application. They will not be able to use the platform with this account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => doRejectRecruiter()}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Reject
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default RecruiterApplicationsDetailsPage;
