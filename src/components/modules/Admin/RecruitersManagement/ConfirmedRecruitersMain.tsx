/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { swalConfirm } from "@/lib/swal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { changeUserStatus } from "@/services/admin.services";
import { getAllRecruiters } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Grid3x3, List, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmedRecruitersDetailsPage from "./ConfirmedRecruitersDetailsPage";

const RECRUITERS_PER_PAGE = 16;

const ConfirmedRecruitersMain = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRecruiter, setSelectedRecruiter] = useState<IRecruiterProfile | null>(null);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["all-recruiters"],
        queryFn: () => getAllRecruiters({ limit: "1000" }),
    });

    const { mutateAsync: doUpdateStatus } = useMutation({
        mutationFn: ({ userId, status }: { userId: string; status: string }) =>
            changeUserStatus({ userId, status }),
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: Error) => {
            const errorMessage = err instanceof Error && "message" in err ? (err as any).response?.data?.message : "Failed to update status";
            toast.error(errorMessage || "Failed to update status");
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

    // Filter confirmed/approved recruiters
    let recruiters: IRecruiterProfile[] = data?.data || [];
    recruiters = recruiters.filter((r: IRecruiterProfile) => r.status === "APPROVED");

    // Apply search and status filters
    recruiters = recruiters.filter((recruiter: IRecruiterProfile) => {
        const matchesSearch = recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = userStatusFilter === "all" || recruiter.user?.status === userStatusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(recruiters.length / RECRUITERS_PER_PAGE);
    const startIdx = (currentPage - 1) * RECRUITERS_PER_PAGE;
    const endIdx = startIdx + RECRUITERS_PER_PAGE;
    const paginatedRecruiters = recruiters.slice(startIdx, endIdx);

    // If recruiter detail page is open
    if (selectedRecruiter) {
        return <ConfirmedRecruitersDetailsPage recruiter={selectedRecruiter} onBack={() => setSelectedRecruiter(null)} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-bold">Confirmed Recruiters</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="default">{recruiters.length} confirmed</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="icon"
                        onClick={() => {
                            setViewMode("list");
                            setCurrentPage(1);
                        }}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="icon"
                        onClick={() => {
                            setViewMode("grid");
                            setCurrentPage(1);
                        }}
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                <Input
                    placeholder="Search by name, email, or company..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full sm:w-64"
                />
                <Select value={userStatusFilter} onValueChange={(val) => {
                    setUserStatusFilter(val);
                    setCurrentPage(1);
                }}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                </Select>
                {(searchTerm || userStatusFilter !== "all") && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSearchTerm("");
                            setUserStatusFilter("all");
                            setCurrentPage(1);
                        }}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Recruiters Display */}
            {paginatedRecruiters.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        {recruiters.length === 0 ? "No confirmed recruiters yet." : "No recruiters found matching your filters."}
                    </CardContent>
                </Card>
            ) : viewMode === "list" ? (
                <div className="space-y-3">
                    {paginatedRecruiters.map((recruiter) => {
                        const userStatus = recruiter.user?.status || "ACTIVE";
                        return (
                            <Card key={recruiter.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                                        {/* Recruiter Info */}
                                        <div>
                                            <p className="font-semibold text-sm">{recruiter.name}</p>
                                            <p className="text-xs text-muted-foreground">{recruiter.email}</p>
                                            {recruiter.companyName && <p className="text-xs text-muted-foreground">{recruiter.companyName}</p>}
                                        </div>

                                        {/* Status Badges */}
                                        <div className="flex flex-wrap gap-1">
                                            <Badge variant="default">Approved</Badge>
                                            <Badge variant={userStatus === "ACTIVE" ? "default" : "destructive"}>
                                                {userStatus}
                                            </Badge>
                                            {recruiter.isVerified && <Badge variant="secondary">Verified</Badge>}
                                        </div>

                                        {/* Company Info */}
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">Industry</p>
                                            <p className="font-medium">{recruiter.industry || "N/A"}</p>
                                        </div>

                                        {/* Approved Date */}
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">Approved</p>
                                            <p className="font-medium">{recruiter.updatedAt ? new Date(recruiter.updatedAt).toLocaleDateString() : "N/A"}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1 flex-wrap justify-end">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedRecruiter(recruiter)}
                                            >
                                                <Eye className="h-3.5 w-3.5 mr-1" />
                                                Details
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={userStatus === "ACTIVE" ? "destructive" : "default"}
                                                onClick={async () => {
                                                    const newStatus = userStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
                                                    const r = await swalConfirm({
                                                        title: "Change Recruiter Status",
                                                        text: `Change this recruiter's account status to ${newStatus}?`,
                                                        confirmText: "Confirm",
                                                    });
                                                    if (r.isConfirmed) doUpdateStatus({ userId: recruiter.userId, status: newStatus });
                                                }}
                                            >
                                                {userStatus === "ACTIVE" ? "Block" : "Unblock"}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paginatedRecruiters.map((recruiter) => {
                        const userStatus = recruiter.user?.status || "ACTIVE";
                        return (
                            <Card key={recruiter.id} className="hover:shadow-lg transition-shadow hover:scale-105 cursor-pointer">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between mb-2">
                                        {recruiter.profilePhoto ? (
                                            <img
                                                src={recruiter.profilePhoto}
                                                alt={recruiter.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                                                {recruiter.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <Badge variant="default" className="text-xs">Approved</Badge>
                                    </div>
                                    <CardTitle className="text-sm line-clamp-1">{recruiter.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground truncate">{recruiter.email}</p>
                                    {recruiter.companyName && <p className="text-xs text-muted-foreground">{recruiter.companyName}</p>}
                                </CardHeader>
                                <CardContent className="pb-3">
                                    <div className="space-y-2 mb-3">
                                        <div className="flex flex-wrap gap-1">
                                            <Badge variant={userStatus === "ACTIVE" ? "default" : "destructive"} className="text-xs">
                                                {userStatus}
                                            </Badge>
                                            {recruiter.isVerified && <Badge className="bg-green-600 text-xs">Verified</Badge>}
                                            {recruiter.industry && <Badge variant="outline" className="text-xs">{recruiter.industry}</Badge>}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Approved: {recruiter.updatedAt ? new Date(recruiter.updatedAt).toLocaleDateString() : "N/A"}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setSelectedRecruiter(recruiter)}
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={userStatus === "ACTIVE" ? "destructive" : "default"}
                                            className="flex-1"
                                            onClick={() => setStatusConfirmId({
                                                recruiterId: recruiter.userId,
                                                newStatus: userStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE"
                                            })}
                                        >
                                            {userStatus === "ACTIVE" ? "Block" : "Unblock"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {startIdx + 1} to {Math.min(endIdx, recruiters.length)} of {recruiters.length}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Button
                                    key={i + 1}
                                    size="sm"
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ConfirmedRecruitersMain;
