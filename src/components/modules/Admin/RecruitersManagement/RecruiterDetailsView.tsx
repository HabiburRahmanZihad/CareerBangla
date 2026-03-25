"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IRecruiterProfile } from "@/types/user.types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface RecruiterDetailsViewProps {
    recruiter?: IRecruiterProfile | null;
}

const RecruiterDetailsView = ({ recruiter }: RecruiterDetailsViewProps) => {
    if (!recruiter) {
        return (
            <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                    No recruiter data available
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Profile Photo */}
            {recruiter.profilePhoto && (
                <div className="flex justify-center">
                    <Image
                        src={recruiter.profilePhoto}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="rounded-lg border object-cover"
                    />
                </div>
            )}

            {/* Company Logo */}
            {recruiter.companyLogo && (
                <div className="flex justify-center">
                    <Image
                        src={recruiter.companyLogo}
                        alt="Company Logo"
                        width={120}
                        height={120}
                        className="rounded-lg border object-cover"
                    />
                </div>
            )}

            {/* Personal Information */}
            {(recruiter.name || recruiter.email || recruiter.contactNumber || recruiter.designation) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recruiter.name && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Name</p>
                                    <p className="text-sm">{recruiter.name}</p>
                                </div>
                            )}
                            {recruiter.email && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Email</p>
                                    <p className="text-sm break-all">{recruiter.email}</p>
                                </div>
                            )}
                            {recruiter.contactNumber && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Contact Number</p>
                                    <p className="text-sm">{recruiter.contactNumber}</p>
                                </div>
                            )}
                            {recruiter.designation && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Designation</p>
                                    <p className="text-sm">{recruiter.designation}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Company Information */}
            {(recruiter.companyName || recruiter.companyWebsite || recruiter.companyAddress || recruiter.industry || recruiter.companySize) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recruiter.companyName && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Company Name</p>
                                    <p className="text-sm">{recruiter.companyName}</p>
                                </div>
                            )}
                            {recruiter.industry && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Industry</p>
                                    <p className="text-sm">{recruiter.industry}</p>
                                </div>
                            )}
                            {recruiter.companySize && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Company Size</p>
                                    <p className="text-sm">{recruiter.companySize}</p>
                                </div>
                            )}
                            {recruiter.companyAddress && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Address</p>
                                    <p className="text-sm">{recruiter.companyAddress}</p>
                                </div>
                            )}
                            {recruiter.companyWebsite && (
                                <div className="md:col-span-2">
                                    <p className="text-xs font-semibold text-muted-foreground">Website</p>
                                    <a
                                        href={recruiter.companyWebsite}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        {recruiter.companyWebsite} <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Description */}
            {recruiter.description && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">About Company</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{recruiter.description}</p>
                    </CardContent>
                </Card>
            )}

            {/* Verification & Status */}
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-lg">Verification Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Verification Status</p>
                            <Badge variant={recruiter.isVerified ? "default" : "destructive"}>
                                {recruiter.isVerified ? "✓ Verified" : "✗ Unverified"}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Application Status</p>
                            <Badge variant={
                                recruiter.status === "APPROVED" ? "default" :
                                    recruiter.status === "REJECTED" ? "destructive" :
                                        "secondary"
                            }>
                                {recruiter.status || "PENDING"}
                            </Badge>
                        </div>
                        {typeof recruiter.profileCompletion === 'number' && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Profile Completion</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${recruiter.profileCompletion}%` }}
                                        />
                                    </div>
                                    <p className="text-xs font-semibold">{recruiter.profileCompletion}%</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Time Information */}
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-lg">Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recruiter.createdAt && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">Created At</p>
                                <p className="text-sm">{new Date(recruiter.createdAt).toLocaleDateString()} at {new Date(recruiter.createdAt).toLocaleTimeString()}</p>
                            </div>
                        )}
                        {recruiter.updatedAt && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">Last Updated</p>
                                <p className="text-sm">{new Date(recruiter.updatedAt).toLocaleDateString()} at {new Date(recruiter.updatedAt).toLocaleTimeString()}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecruiterDetailsView;
