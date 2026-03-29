/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { swalConfirm, swalDanger } from "@/lib/swal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { approveRecruiter, getAllRecruiters, rejectRecruiter, updateRecruiterData } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp, Edit2, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import RecruiterDetailsView from "./RecruiterDetailsView";
import RecruiterEditModal from "./RecruiterEditModal";

const RecruiterApplicationsContent = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [editingRecruiter, setEditingRecruiter] = useState<IRecruiterProfile | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["all-recruiters"],
        queryFn: () => getAllRecruiters({ limit: "100" }),
    });

    const { mutateAsync: approve } = useMutation({
        mutationFn: (id: string) => approveRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter approved successfully");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: Error) => {
            const errorMessage = err instanceof Error && "message" in err ? (err as any).response?.data?.message : "Failed to approve";
            toast.error(errorMessage || "Failed to approve");
        },
    });

    const { mutateAsync: reject } = useMutation({
        mutationFn: (id: string) => rejectRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter rejected successfully");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: Error) => {
            const errorMessage = err instanceof Error && "message" in err ? (err as any).response?.data?.message : "Failed to reject";
            toast.error(errorMessage || "Failed to reject");
        },
    });

    const { mutateAsync: doUpdateRecruiterData } = useMutation({
        mutationFn: ({ recruiterId, data }: { recruiterId: string; data: Record<string, unknown> }) =>
            updateRecruiterData(recruiterId, data),
        onSuccess: () => {
            toast.success("Recruiter data updated successfully");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
            setIsEditModalOpen(false);
            setEditingRecruiter(null);
        },
        onError: (err: Error) => {
            const errorMessage = err instanceof Error && "message" in err ? (err as any).response?.data?.message : "Failed to update recruiter";
            toast.error(errorMessage || "Failed to update recruiter");
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
            </div>
        );
    }

    let recruiters: IRecruiterProfile[] = data?.data || [];

    // Filter PENDING recruiters only
    recruiters = recruiters.filter((recruiter: IRecruiterProfile) => recruiter.status === "PENDING");

    // Apply search filter
    recruiters = recruiters.filter((recruiter: IRecruiterProfile) => {
        const matchesSearch = recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard/recruiters-management">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold">Recruiter Applications</h2>
                        <p className="text-sm text-muted-foreground">Review and approve/reject pending recruiter applications</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{recruiters.length} pending</Badge>
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchTerm("")}
                    >
                        Clear
                    </Button>
                )}
            </div>

            {recruiters.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        {data?.data?.length === 0 ? "No recruiter applications yet." : "No pending applications found."}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {recruiters.map((recruiter: IRecruiterProfile) => (
                        <div key={recruiter.id}>
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-base">{recruiter.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{recruiter.email}</p>
                                            {recruiter.companyName && (
                                                <p className="text-sm font-medium">{recruiter.companyName}</p>
                                            )}
                                            {recruiter.designation && (
                                                <p className="text-sm text-muted-foreground">{recruiter.designation}</p>
                                            )}
                                        </div>
                                        <Badge variant="secondary">PENDING</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {recruiter.industry && (
                                            <div className="text-sm">
                                                <p className="text-muted-foreground">Industry</p>
                                                <p>{recruiter.industry}</p>
                                            </div>
                                        )}
                                        {recruiter.companySize && (
                                            <div className="text-sm">
                                                <p className="text-muted-foreground">Company Size</p>
                                                <p>{recruiter.companySize}</p>
                                            </div>
                                        )}
                                        {recruiter.contactNumber && (
                                            <div className="text-sm">
                                                <p className="text-muted-foreground">Contact Number</p>
                                                <p>{recruiter.contactNumber}</p>
                                            </div>
                                        )}
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">Applied On</p>
                                            <p>{recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingRecruiter(recruiter);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            <Edit2 className="mr-1 h-3.5 w-3.5" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={expandedDetailsId === recruiter.id ? "default" : "outline"}
                                            onClick={() => setExpandedDetailsId(expandedDetailsId === recruiter.id ? null : recruiter.id)}
                                        >
                                            {expandedDetailsId === recruiter.id ? (
                                                <>
                                                    <ChevronUp className="mr-1 h-3.5 w-3.5" />
                                                    Hide Details
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="mr-1 h-3.5 w-3.5" />
                                                    View Details
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={async () => {
                                                const r = await swalConfirm({
                                                    title: "Approve Recruiter?",
                                                    text: "This will approve the recruiter account and send them a verification email. They will be able to post jobs immediately.",
                                                    confirmText: "Approve",
                                                    icon: "question",
                                                });
                                                if (r.isConfirmed) approve(recruiter.id);
                                            }}
                                        >
                                            <CheckCircle className="mr-1 h-3.5 w-3.5" />
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={async () => {
                                                const r = await swalDanger({
                                                    title: "Reject Recruiter?",
                                                    text: "This will reject the recruiter application. They will be notified and cannot log in.",
                                                    confirmText: "Reject",
                                                });
                                                if (r.isConfirmed) reject(recruiter.id);
                                            }}
                                        >
                                            <XCircle className="mr-1 h-3.5 w-3.5" />
                                            Reject
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            {expandedDetailsId === recruiter.id && (
                                <Card className="mt-2 border-l-4 border-l-blue-600">
                                    <CardHeader>
                                        <CardTitle className="text-base">Application Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <RecruiterDetailsView recruiter={recruiter} />
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {editingRecruiter && (
                <RecruiterEditModal
                    recruiter={editingRecruiter}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingRecruiter(null);
                    }}
                    onSave={(updatedData: any) => doUpdateRecruiterData({ recruiterId: editingRecruiter.id, data: updatedData })}
                />
            )}
        </div>
    );
};

export default RecruiterApplicationsContent;
