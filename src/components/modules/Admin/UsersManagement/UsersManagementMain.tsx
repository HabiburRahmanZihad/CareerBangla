"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteUser, getAllUsersWithDetails } from "@/services/admin.services";
import { IUserWithDetails } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Grid3x3, List, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UserDetailsPage from "./UserDetailsPage";

const USERS_PER_PAGE = 16;

const UsersManagementMain = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all-status");
    const [premiumFilter, setPremiumFilter] = useState<string>("all-premium");
    const [countryFilter, setCountryFilter] = useState<string>("all-country");
    const [hiredFilter, setHiredFilter] = useState<string>("all-hired");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<IUserWithDetails | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["users-with-details"],
        queryFn: () => getAllUsersWithDetails({ limit: "1000" }),
    });

    const { mutateAsync: doDeleteUser } = useMutation({
        mutationFn: (userId: string) => deleteUser(userId),
        onSuccess: () => {
            toast.success("User deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
            setDeleteConfirmId(null);
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete user"),
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

    // Filter users
    let users: IUserWithDetails[] = data?.data || [];

    const uniqueCountries = [...new Set(users.map(u => u.country).filter(Boolean))].sort() as string[];

    users = users.filter((user: any) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.country && user.country.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === "all-status" || user.status === statusFilter;
        const matchesPremium = premiumFilter === "all-premium" ||
            (premiumFilter === "premium" ? user.isPremium : !user.isPremium);
        const matchesCountry = countryFilter === "all-country" || user.country === countryFilter;
        const matchesHired = hiredFilter === "all-hired" ||
            (hiredFilter === "hired" ? user.isHired : !user.isHired);

        return matchesSearch && matchesStatus && matchesPremium && matchesCountry && matchesHired;
    });

    // Pagination
    const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
    const startIdx = (currentPage - 1) * USERS_PER_PAGE;
    const endIdx = startIdx + USERS_PER_PAGE;
    const paginatedUsers = users.slice(startIdx, endIdx);

    // If user detail page is open
    if (selectedUser) {
        return <UserDetailsPage user={selectedUser} onBack={() => setSelectedUser(null)} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-bold">Users Management</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{users.length} users</Badge>
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
            <div className="space-y-4">
                <Input
                    placeholder="Search by name, email, or country..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                    <Select value={statusFilter} onValueChange={(val) => {
                        setStatusFilter(val);
                        setCurrentPage(1);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="BLOCKED">Blocked</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={premiumFilter} onValueChange={(val) => {
                        setPremiumFilter(val);
                        setCurrentPage(1);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by premium" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-premium">All Premium Status</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="free">Free</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={countryFilter} onValueChange={(val) => {
                        setCountryFilter(val);
                        setCurrentPage(1);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-country">All Countries</SelectItem>
                            {uniqueCountries.map(country => (
                                <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={hiredFilter} onValueChange={(val) => {
                        setHiredFilter(val);
                        setCurrentPage(1);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by hired" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-hired">All Hired Status</SelectItem>
                            <SelectItem value="hired">Hired</SelectItem>
                            <SelectItem value="not-hired">Not Hired</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all-status");
                            setPremiumFilter("all-premium");
                            setCountryFilter("all-country");
                            setHiredFilter("all-hired");
                            setCurrentPage(1);
                        }}
                    >
                        Clear All
                    </Button>
                </div>
            </div>

            {/* Users Display */}
            {paginatedUsers.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No users found matching your filters.
                    </CardContent>
                </Card>
            ) : viewMode === "list" ? (
                <div className="space-y-3">
                    {paginatedUsers.map((user) => (
                        <Card key={user.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="py-4">
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                                    {/* User Info */}
                                    <div>
                                        <p className="font-semibold text-sm">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                        {user.country && <p className="text-xs text-muted-foreground">{user.country}</p>}
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex flex-wrap gap-1">
                                        <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                                            {user.status}
                                        </Badge>
                                        {user.isPremium && <Badge className="bg-yellow-600">Premium</Badge>}
                                        {user.isHired && <Badge className="bg-green-600">Hired</Badge>}
                                        {user.emailVerified && <Badge variant="secondary">Verified</Badge>}
                                    </div>

                                    {/* Created Date */}
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">Joined</p>
                                        <p className="font-medium">{new Date(user.createdAt || "").toLocaleDateString()}</p>
                                    </div>

                                    {/* Resume */}
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">Resume</p>
                                        <Badge variant={user.resume ? "secondary" : "outline"}>
                                            {user.resume ? "Available" : "None"}
                                        </Badge>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-1 flex-wrap justify-end">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <Eye className="h-3.5 w-3.5 mr-1" />
                                            Details
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setDeleteConfirmId(user.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paginatedUsers.map((user) => (
                        <Card key={user.id} className="hover:shadow-lg transition-shadow hover:scale-105 cursor-pointer">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between mb-2">
                                    <img
                                        src={user.image || "https://via.placeholder.com/40"}
                                        alt={user.name}
                                        className="h-10 w-10 rounded-full"
                                    />
                                    <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"} className="text-xs">
                                        {user.status === "ACTIVE" ? "✓" : "✕"}
                                    </Badge>
                                </div>
                                <CardTitle className="text-sm line-clamp-1">{user.name}</CardTitle>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                {user.country && <p className="text-xs text-muted-foreground">{user.country}</p>}
                            </CardHeader>
                            <CardContent className="pb-3">
                                <div className="space-y-2 mb-3">
                                    <div className="flex flex-wrap gap-1">
                                        {user.isPremium && <Badge className="bg-yellow-600 text-xs">Premium</Badge>}
                                        {user.isHired && <Badge className="bg-green-600 text-xs">Hired</Badge>}
                                        {user.emailVerified && <Badge variant="secondary" className="text-xs">Verified</Badge>}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Joined: {new Date(user.createdAt || "").toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 text-xs"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="text-xs"
                                        onClick={() => setDeleteConfirmId(user.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages} ({users.length} total users)
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the user and all their associated data including resume, applications, and wallet information. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => deleteConfirmId && doDeleteUser(deleteConfirmId)}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Delete User
                    </AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default UsersManagementMain;
