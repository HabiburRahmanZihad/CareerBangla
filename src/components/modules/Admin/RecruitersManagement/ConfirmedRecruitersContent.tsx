/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { swalConfirm } from "@/lib/swal";
import { changeUserStatus } from "@/services/admin.services";
import { getAllRecruiters, updateRecruiterData } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ChevronDown, ChevronLeft, ChevronUp, Edit2, Mail, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import RecruiterDetailsView from "./RecruiterDetailsView";
import RecruiterEditModal from "./RecruiterEditModal";

const ConfirmedRecruitersContent = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
    const [editingRecruiter, setEditingRecruiter] = useState<IRecruiterProfile | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["all-recruiters"],
        queryFn: () => getAllRecruiters({ limit: "100" }),
    });

    const { mutateAsync: updateStatus } = useMutation({
        mutationFn: ({ userId, status }: { userId: string; status: string }) =>
            changeUserStatus({ userId, status }),
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: Error) => {
            toast.error(getRequestErrorMessage(err, "Failed to update status"));
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
            toast.error(getRequestErrorMessage(err, "Failed to update recruiter"));
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

    // Filter APPROVED recruiters only
    recruiters = recruiters.filter((recruiter: IRecruiterProfile) => recruiter.status === "APPROVED");

    // Apply search filter
    recruiters = recruiters.filter((recruiter: IRecruiterProfile) => {
        const matchesSearch = recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUserStatus = userStatusFilter === "all" || recruiter.user?.status === userStatusFilter;
        return matchesSearch && matchesUserStatus;
    });

    return (
        <div className="space-y-6">
            {/* ── Premium Header ────────────────────────────────────────────── */}
            <div className="space-y-2 py-2">
                <div className="flex items-center gap-2 mb-4">
                    <Link href="/admin/dashboard/recruiters-management">
                        <Button variant="ghost" size="icon" className="hover:bg-muted rounded-lg">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Verified Recruiter Partners
                </h1>
                <p className="text-base text-muted-foreground">
                    Manage approved and active recruiter accounts
                </p>
            </div>

            {/* ── Stats Bar ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="border-border/40 bg-linear-to-br from-blue-600/5 to-transparent">
                    <CardContent className="pt-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Verified</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{recruiters.length}</p>
                    </CardContent>
                </Card>
                <Card className="border-border/40 bg-linear-to-br from-green-600/5 to-transparent">
                    <CardContent className="pt-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Users</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {recruiters.filter((r) => r.user?.status === "ACTIVE").length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-border/40 bg-linear-to-br from-destructive/5 to-transparent">
                    <CardContent className="pt-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Blocked Accounts</p>
                        <p className="text-2xl font-bold text-destructive mt-1">
                            {recruiters.filter((r) => r.user?.status === "BLOCKED").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Search and Filters ────────────────────────────────────────── */}
            <div className="flex gap-3 flex-wrap items-center">
                <div className="relative flex-1 min-w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search name, email, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 rounded-lg border-border/40 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5 transition-all bg-background/50"
                    />
                </div>
                <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                    <SelectTrigger className="w-48 rounded-lg border-border/40 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5 transition-all bg-background/50">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                </Select>
                {(searchTerm || userStatusFilter !== "all") && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSearchTerm("");
                            setUserStatusFilter("all");
                        }}
                        className="rounded-lg text-muted-foreground hover:text-foreground"
                    >
                        Clear
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="rounded-lg border-border/40 hover:bg-muted/50"
                >
                    <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {/* ── Empty State ────────────────────────────────────────────────── */}
            {recruiters.length === 0 ? (
                <Card className="border-border/40 bg-linear-to-br from-muted/30 to-transparent">
                    <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="font-bold text-muted-foreground">
                            {data?.data?.length === 0 ? "No verified recruiters yet" : "No recruiters match your filters"}
                        </p>
                        <p className="text-sm text-muted-foreground/60 max-w-xs">
                            {userStatusFilter !== "all" && "Try adjusting your status filter"}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {recruiters.map((recruiter: IRecruiterProfile) => {
                        const userStatus = recruiter.user?.status || "ACTIVE";
                        return (
                            <Card
                                key={recruiter.id}
                                className="border-border/40 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/5 transition-all group overflow-hidden"
                            >
                                <CardHeader className="pb-3 space-y-3 bg-linear-to-br from-muted/50 to-transparent">
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg leading-tight truncate">{recruiter.name}</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                                {recruiter.email}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                            <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/30">VERIFIED</Badge>
                                            <Badge
                                                className={
                                                    userStatus === "ACTIVE"
                                                        ? "bg-green-600/10 text-green-600 border-green-600/30"
                                                        : "bg-destructive/10 text-destructive border-destructive/30"
                                                }
                                            >
                                                {userStatus}
                                            </Badge>
                                        </div>
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
                                        {recruiter.updatedAt && (
                                            <div className="text-sm">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Verified</p>
                                                <p className="font-semibold truncate">{new Date(recruiter.updatedAt).toLocaleDateString()}</p>
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
                                        <Select
                                            defaultValue={userStatus}
                                            onValueChange={async (status) => {
                                                const r = await swalConfirm({
                                                    title: "Change Account Status",
                                                    text: `Confirm changing account to ${status}?`,
                                                    confirmText: "Confirm",
                                                    icon: "question",
                                                });
                                                if (r.isConfirmed) updateStatus({ userId: recruiter.userId, status });
                                            }}
                                        >
                                            <SelectTrigger className="w-32 h-9 rounded-lg border-border/40 text-sm">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="BLOCKED">Blocked</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
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

export default ConfirmedRecruitersContent;
