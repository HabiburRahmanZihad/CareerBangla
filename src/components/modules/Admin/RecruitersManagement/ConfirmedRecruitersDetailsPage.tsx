/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { cn } from "@/lib/utils";
import { updateRecruiterData } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, CheckCircle, Clock, Edit2, FileText, Globe, Mail, MapPin, Phone, Save, Users, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface ConfirmedRecruitersDetailsPageProps {
    recruiter: IRecruiterProfile;
    onBack: () => void;
}

const ConfirmedRecruitersDetailsPage = ({ recruiter, onBack }: ConfirmedRecruitersDetailsPageProps) => {
    const queryClient = useQueryClient();
    const [isEditMode, setIsEditMode] = useState(false);
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
            toast.error(getRequestErrorMessage(err, "Failed to update recruiter"));
        },
    });

    const handleSaveChanges = async () => {
        await doUpdateRecruiter(editData);
    };

    return (
        <div className="space-y-6">
            {/* ── Premium Header ────────────────────────────────────────────── */}
            <div className="space-y-4 py-2">
                <div className="flex items-center gap-3 mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="hover:bg-muted rounded-lg"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        {recruiter.name}
                    </h1>
                    <p className="text-base text-muted-foreground">
                        {recruiter.companyName ? `${recruiter.companyName} • ${recruiter.designation || "Recruiter"}` : "Recruiter Profile"}
                    </p>
                </div>
            </div>

            {/* ── Status Badges ────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-2 items-center">
                <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/30 text-sm px-3 py-1.5">
                    ✓ Verified
                </Badge>
                <Badge className={cn(
                    "text-sm px-3 py-1.5 border",
                    recruiter.user?.status === "ACTIVE"
                        ? "bg-green-600/10 text-green-600 border-green-600/30"
                        : "bg-destructive/10 text-destructive border-destructive/30"
                )}>
                    {recruiter.user?.status || "ACTIVE"}
                </Badge>
                {recruiter.isVerified && (
                    <Badge className="bg-primary/10 text-primary border-primary/30 text-sm px-3 py-1.5">
                        KYC Complete
                    </Badge>
                )}
            </div>

            {/* ── Edit/Save Controls ────────────────────────────────────────── */}
            {isEditMode && (
                <div className="flex gap-2 flex-wrap border-b border-border/40 pb-4">
                    <Button
                        onClick={handleSaveChanges}
                        disabled={isUpdating}
                        className="rounded-lg bg-primary hover:bg-orange-700"
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
                        className="rounded-lg"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                </div>
            )}
            {!isEditMode && (
                <div className="flex justify-end border-b border-border/40 pb-4">
                    <Button
                        variant="outline"
                        onClick={() => setIsEditMode(true)}
                        className="rounded-lg"
                    >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>
            )}

            {/* ── Profile Media Grid ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recruiter.profilePhoto && (
                    <Card className="border-border/40 overflow-hidden hover:shadow-lg transition-all">
                        <CardHeader className="pb-3 bg-linear-to-br from-muted/50 to-transparent">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                <CardTitle className="text-base">Profile Photo</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex justify-center py-6">
                            <Image
                                src={recruiter.profilePhoto}
                                alt="Profile"
                                width={160}
                                height={160}
                                className="rounded-xl border border-border/40 object-cover shadow-md"
                            />
                        </CardContent>
                    </Card>
                )}
                {recruiter.companyLogo && (
                    <Card className="border-border/40 overflow-hidden hover:shadow-lg transition-all">
                        <CardHeader className="pb-3 bg-linear-to-br from-muted/50 to-transparent">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Building2 className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-base">Company Logo</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex justify-center py-6">
                            <Image
                                src={recruiter.companyLogo}
                                alt="Company Logo"
                                width={160}
                                height={160}
                                className="rounded-xl border border-border/40 object-cover shadow-md"
                            />
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* ── Personal Information ────────────────────────────────────────– */}
            <Card className="border-border/40 overflow-hidden">
                <CardHeader className="pb-3 bg-linear-to-br from-muted/50 to-transparent">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                            <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Name</Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="rounded-lg border-border/40 focus:border-blue-600/50 focus:shadow-lg focus:shadow-blue-600/5 transition-all"
                                />
                            ) : (
                                <p className="text-sm font-semibold mt-1">{editData.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email</Label>
                            {isEditMode ? (
                                <Input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    className="rounded-lg border-border/40 focus:border-blue-600/50 focus:shadow-lg focus:shadow-blue-600/5 transition-all"
                                />
                            ) : (
                                <p className="text-sm font-semibold mt-1 break-all">{editData.email}</p>
                            )}
                        </div>

                        {/* Contact Number Field */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                Contact Number
                            </Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.contactNumber}
                                    onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
                                    className="rounded-lg border-border/40 focus:border-blue-600/50 focus:shadow-lg focus:shadow-blue-600/5 transition-all"
                                />
                            ) : (
                                <p className="text-sm font-semibold mt-1">{editData.contactNumber || "—"}</p>
                            )}
                        </div>

                        {/* Designation Field */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Designation</Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.designation}
                                    onChange={(e) => setEditData({ ...editData, designation: e.target.value })}
                                    className="rounded-lg border-border/40 focus:border-blue-600/50 focus:shadow-lg focus:shadow-blue-600/5 transition-all"
                                />
                            ) : (
                                <p className="text-sm font-semibold mt-1">{editData.designation || "—"}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Company Information ────────────────────────────────────────── */}
            <Card className="border-border/40 overflow-hidden">
                <CardHeader className="pb-3 bg-linear-to-br from-muted/50 to-transparent">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Company Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Company Name */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Company Name</Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.companyName}
                                    onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                                    className="rounded-lg border-border/40 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5 transition-all"
                                />
                            ) : (
                                <p className="text-sm font-semibold mt-1">{editData.companyName || "—"}</p>
                            )}
                        </div>

                        {/* Company Website */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                Website
                            </Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.companyWebsite}
                                    onChange={(e) => setEditData({ ...editData, companyWebsite: e.target.value })}
                                    className="rounded-lg border-border/40 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5 transition-all"
                                />
                            ) : (
                                <p className="text-sm font-semibold mt-1 break-all text-primary hover:underline cursor-pointer">
                                    {editData.companyWebsite ? (
                                        <a href={editData.companyWebsite} target="_blank" rel="noopener noreferrer">
                                            {editData.companyWebsite}
                                        </a>
                                    ) : (
                                        "—"
                                    )}
                                </p>
                            )}
                        </div>

                        {/* Industry */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Industry</Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.industry}
                                    onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                                    className="rounded-lg border-border/40 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5 transition-all"
                                />
                            ) : (
                                <p className="text-sm font-semibold mt-1">{editData.industry || "—"}</p>
                            )}
                        </div>

                        {/* Company Size */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                Company Size
                            </Label>
                            {isEditMode ? (
                                <Input
                                    value={editData.companySize}
                                    onChange={(e) => setEditData({ ...editData, companySize: e.target.value })}
                                    className="rounded-lg border-border/40 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5 transition-all"
                                />
                            ) : (
                                <p className="text-sm font-semibold mt-1">{editData.companySize || "—"}</p>
                            )}
                        </div>
                    </div>

                    {/* Company Address - Full Width */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            Company Address
                        </Label>
                        {isEditMode ? (
                            <Input
                                value={editData.companyAddress}
                                onChange={(e) => setEditData({ ...editData, companyAddress: e.target.value })}
                                className="rounded-lg border-border/40 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5 transition-all"
                            />
                        ) : (
                            <p className="text-sm font-semibold mt-1">{editData.companyAddress || "—"}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ── About Company ────────────────────────────────────────────── */}
            <Card className="border-border/40 overflow-hidden">
                <CardHeader className="pb-3 bg-linear-to-br from-muted/50 to-transparent">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-orange-600/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-orange-600" />
                        </div>
                        <CardTitle className="text-lg">About Company</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="py-4">
                    {isEditMode ? (
                        <Textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            rows={5}
                            className="rounded-lg border-border/40 focus:border-orange-600/50 focus:shadow-lg focus:shadow-orange-600/5 transition-all resize-none"
                            placeholder="Enter company description..."
                        />
                    ) : (
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {editData.description || "No description provided"}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* ── Account Timeline ────────────────────────────────────────── */}
            <Card className="border-border/40 overflow-hidden">
                <CardHeader className="pb-3 bg-linear-to-br from-muted/50 to-transparent">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-green-600/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">Account Timeline</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="py-4">
                    <div className="space-y-4">
                        {/* Application Submitted */}
                        <div className="flex gap-4 items-start">
                            <div className="relative flex flex-col items-center">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600/10 border-2 border-blue-600/20">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="w-0.5 h-12 bg-border/40 my-2" />
                            </div>
                            <div className="pt-1">
                                <p className="text-sm font-bold">Application Submitted</p>
                                <p className="text-xs text-muted-foreground">
                                    {recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleString() : "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Approved & Verified */}
                        <div className="flex gap-4 items-start">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600/10 border-2 border-green-600/20">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="pt-1">
                                <p className="text-sm font-bold">Approved & Verified</p>
                                <p className="text-xs text-muted-foreground">
                                    {recruiter.updatedAt ? new Date(recruiter.updatedAt).toLocaleString() : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ConfirmedRecruitersDetailsPage;
