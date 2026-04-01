"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { changeUserStatus, getAllUsersWithDetails, updateUser } from "@/services/admin.services";
import { IUserWithDetails } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Edit2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ResumeDetailsView from "./ResumeDetailsView";
import UserEditModal from "./UserEditModal";

const UsersManagementContent = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all-status");
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedResumeId, setExpandedResumeId] = useState<string | null>(null);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["users-with-details"],
        queryFn: () => getAllUsersWithDetails({ limit: "100" }),
    });

    const { mutateAsync: updateStatus } = useMutation({
        mutationFn: ({ userId, status }: { userId: string; status: string }) =>
            changeUserStatus({ userId, status }),
        onSuccess: () => {
            toast.success("User status updated");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
        },
        onError: (err: any) => toast.error(getRequestErrorMessage(err, "Failed to update status")),
    });

    const { mutateAsync: doUpdateUser } = useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: any }) =>
            updateUser(userId, data),
        onSuccess: () => {
            toast.success("User updated successfully");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
            setIsEditModalOpen(false);
            setEditingUser(null);
        },
        onError: (err: any) => toast.error(getRequestErrorMessage(err, "Failed to update user")),
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

    let users: IUserWithDetails[] = data?.data || [];

    // Filter users
    users = users.filter((user: any) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Users Management</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{users.length} users</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                <Input
                    placeholder="Search by name or email..."
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
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
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

            {users.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No users found.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {users.map((user: any) => (
                        <div key={user.id}>
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-base">{user.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                            {user.phone && (
                                                <p className="text-sm text-muted-foreground">{user.phone}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap justify-end">
                                            <Badge variant="outline">{user.role}</Badge>
                                            <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                                                {user.status}
                                            </Badge>
                                            {user.emailVerified && (
                                                <Badge variant="secondary">Verified</Badge>
                                            )}
                                            {user.isPremium && (
                                                <Badge className="bg-yellow-600">Premium</Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">Created At</p>
                                            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {user.resume?.id && (
                                            <div className="text-sm">
                                                <p className="text-muted-foreground">Resume</p>
                                                <Badge variant="secondary">Available</Badge>
                                            </div>
                                        )}
                                        {user.recruiter && (
                                            <div className="text-sm">
                                                <p className="text-muted-foreground">Company</p>
                                                <p>{user.recruiter.companyName}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingUser(user);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            <Edit2 className="mr-1 h-3.5 w-3.5" />
                                            Edit
                                        </Button>
                                        <Select
                                            defaultValue={user.status || "ACTIVE"}
                                            onValueChange={(status) => updateStatus({ userId: user.id, status })}
                                        >
                                            <SelectTrigger className="w-32 h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="BLOCKED">Blocked</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            size="sm"
                                            variant={expandedResumeId === user.id ? "default" : "outline"}
                                            onClick={() => setExpandedResumeId(expandedResumeId === user.id ? null : user.id)}
                                            disabled={!user.resume}
                                        >
                                            {expandedResumeId === user.id ? (
                                                <>
                                                    <ChevronUp className="mr-1 h-3.5 w-3.5" />
                                                    Hide Resume
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="mr-1 h-3.5 w-3.5" />
                                                    {user.resume ? "View Resume" : "No Resume"}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            {expandedResumeId === user.id && (
                                <Card className="mt-2 border-l-4 border-l-blue-600">
                                    <CardHeader>
                                        <CardTitle className="text-base">Resume Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        {user.resume ? (
                                            <ResumeDetailsView resume={user.resume} />
                                        ) : (
                                            <div className="py-8 text-center text-muted-foreground">
                                                <p>No resume data available for this user</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {editingUser && (
                <UserEditModal
                    user={editingUser}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingUser(null);
                    }}
                    onSave={(updatedData) => doUpdateUser({ userId: editingUser.id, data: updatedData })}
                />
            )}
        </div>
    );
};

export default UsersManagementContent;
