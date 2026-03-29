/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { swalConfirm, swalDanger } from "@/lib/swal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { approveRecruiter, getAllRecruiters, rejectRecruiter, updateRecruiterData } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Building2, CheckCircle, ChevronDown, ChevronUp, Edit2, Mail, RefreshCw, Search, XCircle } from "lucide-react";
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
        <div className="space-y-7">
            {/* ── Premium Header ────────────────────────────────────────────── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard/recruiters-management">
                            <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                                Pending Applications
                            </h1>
                            <p className="text-sm text-muted-foreground">Review and approve/reject recruiter applications</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="rounded-xl"
                        title="Refresh"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-primary/10 text-primary border-primary/30 text-sm px-3 py-1.5">
                        {recruiters.length} Pending
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {data?.data?.length} Total Applications
                    </Badge>
                </div>
            </div>

            {/* ── Search & Filters ────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 rounded-xl border-border/40 bg-muted/30"
                    />
                </div>
                {searchTerm && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchTerm("")}
                        className="rounded-lg"
                    >
                        Clear
                    </Button>
                )}
            </div>

            {/* ── Empty State ────────────────────────────────────────────────── */}
            {recruiters.length === 0 ? (
                <Card className="border-border/40 bg-linear-to-br from-muted/30 to-transparent">
                    <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-bold text-muted-foreground">{data?.data?.length === 0 ? "No applications yet" : "No pending applications"}</p>
                        <p className="text-sm text-muted-foreground/60 max-w-xs">
                            {data?.data?.length === 0 ? "Recruiters haven't submitted any applications yet." : "All pending applications have been reviewed."}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                {/* ── Pending Applications Grid ────────────────────────────────────── */ }
                < div className="space-y-3">
            {recruiters.map((recruiter: IRecruiterProfile) => (
                <Card
                    key={recruiter.id}
                    className="border-border/40 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group overflow-hidden"
                >
                    <CardHeader className="pb-3 space-y-3 bg-linear-to-br from-muted/50 to-transparent">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                                    <h3 className="font-bold text-lg leading-tight truncate">{recruiter.name}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5 shrink-0" />
                                    {recruiter.email}
                                </p>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/30 font-bold">PENDING</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {recruiter.companyName && (
                                <div className="text-sm">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Company</p>
                                    <p className="font-semibold truncate">{recruiter.companyName}</p>
                                </div>
                            )}
                            {recruiter.designation && (
                                <div className="text-sm">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Position</p>
                                    <p className="font-semibold truncate">{recruiter.designation}</p>
                                </div>
                            )}
                            {recruiter.industry && (
                                <div className="text-sm">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Industry</p>
                                    <p className="font-semibold truncate">{recruiter.industry}</p>
                                </div>
                            )}
                            {recruiter.companySize && (
                                <div className="text-sm">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Company Size</p>
                                    <p className="font-semibold truncate">{recruiter.companySize}</p>
                                </div>
                            )}
                            {recruiter.contactNumber && (
                                <div className="text-sm">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</p>
                                    <p className="font-semibold truncate">{recruiter.contactNumber}</p>
                                </div>
                            )}
                            {recruiter.createdAt && (
                                <div className="text-sm">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Applied</p>
                                    <p className="font-semibold truncate">{new Date(recruiter.createdAt).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>

                        {/* Expandable Details */}
                        {expandedDetailsId === recruiter.id && (
                            <div className="border-t border-border/40 pt-4 space-y-2">
                                <RecruiterDetailsView recruiter={recruiter} />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setEditingRecruiter(recruiter);
                                    setIsEditModalOpen(true);
                                }}
                                className="rounded-lg"
                            >
                                <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                variant={expandedDetailsId === recruiter.id ? "default" : "outline"}
                                onClick={() => setExpandedDetailsId(expandedDetailsId === recruiter.id ? null : recruiter.id)}
                                className="rounded-lg"
                            >
                                {expandedDetailsId === recruiter.id ? (
                                    <>
                                        <ChevronUp className="mr-1.5 h-3.5 w-3.5" />
                                        Hide
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="mr-1.5 h-3.5 w-3.5" />
                                        View
                                    </>
                                )}
                            </Button>
                            <Button
                                size="sm"
                                className="rounded-lg bg-primary hover:bg-orange-700 text-primary-foreground ms-auto"
                                onClick={async () => {
                                    const r = await swalConfirm({
                                        title: "Approve Recruiter?",
                                        text: "This will activate their account and send a verification email.",
                                        confirmText: "Approve",
                                        icon: "question",
                                    });
                                    if (r.isConfirmed) approve(recruiter.id);
                                }}
                            >
                                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={async () => {
                                    const r = await swalDanger({
                                        title: "Reject This Application?",
                                        text: "The recruiter will be notified about the rejection.",
                                        confirmText: "Reject",
                                    });
                                    if (r.isConfirmed) reject(recruiter.id);
                                }}
                                className="rounded-lg"
                            >
                                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                                Reject
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
                    ))}
                </div >
            )}

{
    editingRecruiter && (
        <RecruiterEditModal
            recruiter={editingRecruiter}
            isOpen={isEditModalOpen}
            onClose={() => {
                setIsEditModalOpen(false);
                setEditingRecruiter(null);
            }}
            onSave={(updatedData: any) => doUpdateRecruiterData({ recruiterId: editingRecruiter.id, data: updatedData })}
        />
    )
}
        </div >
    );
};

export default RecruiterApplicationsContent;
