"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { changeUserStatus } from "@/services/admin.services";
import { approveRecruiter, deleteRecruiter, getAllRecruiters, rejectRecruiter, updateRecruiterData } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, ChevronDown, ChevronUp, Edit2, RefreshCw, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import RecruiterDetailsView from "./RecruiterDetailsView";
import RecruiterEditModal from "./RecruiterEditModal";

const RecruitersManagementContent = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all-status");
    const [editingRecruiter, setEditingRecruiter] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["all-recruiters"],
        queryFn: () => getAllRecruiters({ limit: "100" }),
    });

    const { mutateAsync: approve } = useMutation({
        mutationFn: (id: string) => approveRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter approved");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed"),
    });

    const { mutateAsync: reject } = useMutation({
        mutationFn: (id: string) => rejectRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter rejected");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed"),
    });

    const { mutateAsync: updateStatus } = useMutation({
        mutationFn: ({ userId, status }: { userId: string; status: string }) =>
            changeUserStatus({ userId, status }),
        onSuccess: () => {
            toast.success("Status updated");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed"),
    });

    const { mutateAsync: deleteMutate } = useMutation({
        mutationFn: (id: string) => deleteRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter deleted");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed"),
    });

    const { mutateAsync: doUpdateRecruiterData } = useMutation({
        mutationFn: ({ recruiterId, data }: { recruiterId: string; data: any }) =>
            updateRecruiterData(recruiterId, data),
        onSuccess: () => {
            toast.success("Recruiter data updated successfully");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
            setIsEditModalOpen(false);
            setEditingRecruiter(null);
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update recruiter"),
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

    // Filter recruiters
    recruiters = recruiters.filter((recruiter: any) => {
        const matchesSearch = recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || recruiter.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeVariant = (status?: string) => {
        switch (status) {
            case "APPROVED": return "default";
            case "PENDING": return "secondary";
            case "REJECTED": return "destructive";
            default: return "secondary";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Recruiters Management</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{recruiters.length} recruiters</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                <Input
                    placeholder="Search by name, email, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-status">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                </Select>
                {(searchTerm || statusFilter !== "all-status") && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all-status");
                        }}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            {recruiters.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No recruiters found.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {recruiters.map((recruiter: any) => {
                        const userStatus = recruiter.user?.status || "ACTIVE";
                        return (
                            <div key={recruiter.id}>
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-base">{recruiter.name}</CardTitle>
                                                <p className="text-sm text-muted-foreground">{recruiter.email}</p>
                                                {recruiter.companyName && (
                                                    <p className="text-sm text-muted-foreground font-medium">{recruiter.companyName}</p>
                                                )}
                                                {recruiter.designation && (
                                                    <p className="text-sm text-muted-foreground">{recruiter.designation}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                                <Badge variant={getStatusBadgeVariant(recruiter.status)}>
                                                    {recruiter.status || "PENDING"}
                                                </Badge>
                                                <Badge variant={recruiter.isVerified ? "default" : "destructive"}>
                                                    {recruiter.isVerified ? "Verified" : "Unverified"}
                                                </Badge>
                                            </div>
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
                                                <p className="text-muted-foreground">Created At</p>
                                                <p>{new Date(recruiter.createdAt).toLocaleDateString()}</p>
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
                                            {recruiter.status === "PENDING" && (
                                                <>
                                                    <Button size="sm" variant="default" onClick={() => approve(recruiter.id)}>
                                                        <CheckCircle className="mr-1 h-3.5 w-3.5" />
                                                        Approve
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => reject(recruiter.id)}>
                                                        <XCircle className="mr-1 h-3.5 w-3.5" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            <Select
                                                defaultValue={userStatus}
                                                onValueChange={(status) => updateStatus({ userId: recruiter.userId, status })}
                                            >
                                                <SelectTrigger className="w-32 h-8 text-xs">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive h-8 w-8"
                                                onClick={() => {
                                                    if (confirm("Delete this recruiter? This action cannot be undone."))
                                                        deleteMutate(recruiter.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                {expandedDetailsId === recruiter.id && (
                                    <Card className="mt-2 border-l-4 border-l-green-600">
                                        <CardHeader>
                                            <CardTitle className="text-base">Recruiter Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <RecruiterDetailsView recruiter={recruiter} />
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        );
                    })}
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

export default RecruitersManagementContent;
