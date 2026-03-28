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
import { Skeleton } from "@/components/ui/skeleton";
import { approveRecruiter, deleteRecruiter, getAllRecruiters } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, CheckCircle, ChevronDown, ChevronUp, RefreshCw, Trash2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const RejectedRecruitersContent = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [reApproveId, setReApproveId] = useState<string | null>(null);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["all-recruiters"],
        queryFn: () => getAllRecruiters({ limit: "200" }),
    });

    const { mutateAsync: doDelete, isPending: deleting } = useMutation({
        mutationFn: (id: string) => deleteRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter permanently deleted");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
            setDeleteId(null);
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete"),
    });

    const { mutateAsync: doApprove, isPending: approving } = useMutation({
        mutationFn: (id: string) => approveRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter re-approved and verification email sent");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
            setReApproveId(null);
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to approve"),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-lg" />
                ))}
            </div>
        );
    }

    const allRecruiters: IRecruiterProfile[] = data?.data || [];
    let rejected = allRecruiters.filter((r) => r.status === "REJECTED");

    if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        rejected = rejected.filter(
            (r) =>
                r.name.toLowerCase().includes(q) ||
                r.email.toLowerCase().includes(q) ||
                r.companyName?.toLowerCase().includes(q)
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard/recruiters-management">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold">Rejected Recruiters</h2>
                        <p className="text-sm text-muted-foreground">
                            View rejected applications — re-approve or permanently delete
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="destructive">{rejected.length} rejected</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="flex gap-2">
                <Input
                    placeholder="Search by name, email, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-96"
                />
                {searchTerm && (
                    <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                        Clear
                    </Button>
                )}
            </div>

            {/* List */}
            {rejected.length === 0 ? (
                <Card>
                    <CardContent className="py-14 text-center text-muted-foreground">
                        {allRecruiters.filter((r) => r.status === "REJECTED").length === 0
                            ? "No rejected recruiters."
                            : "No results match your search."}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {rejected.map((recruiter) => (
                        <div key={recruiter.id}>
                            <Card className="border-red-200 dark:border-red-900">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                        {/* Avatar + info */}
                                        <div className="flex items-center gap-3">
                                            {recruiter.profilePhoto ? (
                                                <Image
                                                    src={recruiter.profilePhoto}
                                                    alt={recruiter.name}
                                                    width={44}
                                                    height={44}
                                                    className="rounded-full border object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-11 h-11 rounded-full border bg-muted flex items-center justify-center shrink-0">
                                                    <User className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div>
                                                <CardTitle className="text-base">{recruiter.name}</CardTitle>
                                                <p className="text-sm text-muted-foreground">{recruiter.email}</p>
                                                {recruiter.companyName && (
                                                    <p className="text-sm font-medium flex items-center gap-1 mt-0.5">
                                                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {recruiter.companyName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant="destructive">REJECTED</Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0 space-y-4">
                                    {/* Meta */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        {recruiter.industry && (
                                            <div>
                                                <p className="text-muted-foreground text-xs">Industry</p>
                                                <p className="font-medium">{recruiter.industry}</p>
                                            </div>
                                        )}
                                        {recruiter.designation && (
                                            <div>
                                                <p className="text-muted-foreground text-xs">Designation</p>
                                                <p className="font-medium">{recruiter.designation}</p>
                                            </div>
                                        )}
                                        {recruiter.contactNumber && (
                                            <div>
                                                <p className="text-muted-foreground text-xs">Contact</p>
                                                <p className="font-medium">{recruiter.contactNumber}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-muted-foreground text-xs">Applied</p>
                                            <p className="font-medium">
                                                {recruiter.createdAt
                                                    ? new Date(recruiter.createdAt).toLocaleDateString()
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                setExpandedId(expandedId === recruiter.id ? null : recruiter.id)
                                            }
                                        >
                                            {expandedId === recruiter.id ? (
                                                <><ChevronUp className="h-3.5 w-3.5 mr-1" /> Hide Details</>
                                            ) : (
                                                <><ChevronDown className="h-3.5 w-3.5 mr-1" /> View Details</>
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => setReApproveId(recruiter.id)}
                                        >
                                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                            Re-Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setDeleteId(recruiter.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                                            Delete Permanently
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Expanded details */}
                            {expandedId === recruiter.id && (
                                <Card className="mt-2 border-l-4 border-l-red-500">
                                    <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Profile photo */}
                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold text-muted-foreground">Profile Photo</p>
                                            {recruiter.profilePhoto ? (
                                                <Image
                                                    src={recruiter.profilePhoto}
                                                    alt={recruiter.name}
                                                    width={120}
                                                    height={120}
                                                    className="rounded-lg border object-cover"
                                                />
                                            ) : (
                                                <div className="w-[120px] h-[120px] rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
                                                    <User className="h-10 w-10" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Company logo */}
                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold text-muted-foreground">Company Logo</p>
                                            {recruiter.companyLogo ? (
                                                <Image
                                                    src={recruiter.companyLogo}
                                                    alt="Company Logo"
                                                    width={120}
                                                    height={120}
                                                    className="rounded-lg border object-cover"
                                                />
                                            ) : (
                                                <div className="w-[120px] h-[120px] rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
                                                    <Building2 className="h-10 w-10" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Company info */}
                                        {recruiter.companyAddress && (
                                            <div>
                                                <p className="text-xs text-muted-foreground">Company Address</p>
                                                <p className="text-sm font-medium">{recruiter.companyAddress}</p>
                                            </div>
                                        )}
                                        {recruiter.companyWebsite && (
                                            <div>
                                                <p className="text-xs text-muted-foreground">Company Website</p>
                                                <a
                                                    href={recruiter.companyWebsite}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-primary hover:underline break-all"
                                                >
                                                    {recruiter.companyWebsite}
                                                </a>
                                            </div>
                                        )}
                                        {recruiter.description && (
                                            <div className="md:col-span-2">
                                                <p className="text-xs text-muted-foreground">About Company</p>
                                                <p className="text-sm mt-0.5">{recruiter.description}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Delete confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Permanently Delete Recruiter?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the recruiter and all associated data from the database.
                            This action <strong>cannot be undone</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && doDelete(deleteId)}
                            disabled={deleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {deleting ? "Deleting..." : "Delete Permanently"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Re-approve confirmation */}
            <AlertDialog open={!!reApproveId} onOpenChange={(open) => !open && setReApproveId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Re-Approve Recruiter?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will approve the recruiter account and send them a verification email.
                            They will be able to log in and post jobs immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => reApproveId && doApprove(reApproveId)}
                            disabled={approving}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {approving ? "Approving..." : "Re-Approve"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default RejectedRecruitersContent;
