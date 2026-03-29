"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { swalDanger } from "@/lib/swal";
import { deleteUser, getAllUsersWithDetails } from "@/services/admin.services";
import { IUserWithDetails } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Award, Clock, CreditCard, Eye, FileText, Grid3x3, List, RefreshCw, Search, Trash2, Users } from "lucide-react";
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
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["users-with-details"],
        queryFn: () => getAllUsersWithDetails({ limit: "1000" }),
    });

    const { mutateAsync: doDeleteUser } = useMutation({
        mutationFn: (userId: string) => deleteUser(userId),
        onSuccess: () => {
            toast.success("User deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
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
    const selectedUser = selectedUserId ? (data?.data ?? []).find((u: IUserWithDetails) => u.id === selectedUserId) ?? null : null;
    if (selectedUser) {
        return <UserDetailsPage user={selectedUser} onBack={() => setSelectedUserId(null)} />;
    }

    // Calculate stats
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === "ACTIVE").length;
    const premiumUsers = users.filter(u => u.isPremium).length;
    const resumeUsers = users.filter(u => u.resume).length;
    const hiredUsers = users.filter(u => u.isHired).length;
    const thisWeekUsers = users.filter(u => {
        const now = new Date();
        const created = new Date(u.createdAt || '');
        const dayDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return dayDiff <= 7;
    }).length;

    return (
        <div className="space-y-6">
            {/* ── Premium Header ────────────────────────────────────────────── */}
            <div className="space-y-4 py-2">
                <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                    Users Management
                </h1>
                <p className="text-base text-muted-foreground max-w-2xl">
                    Monitor, manage, and maintain your user base. Track signups, engagement, and user status at a glance.
                </p>
            </div>

            {/* ── Stats Cards ────────────────────────────────────────────────– */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Total Users */}
                <Card className="border-border/40 bg-linear-to-br from-primary/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Users</p>
                                <p className="text-3xl font-bold text-primary mt-1">{totalUsers}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Users */}
                <Card className="border-border/40 bg-linear-to-br from-green-600/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Users</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{activeUsers}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-green-600/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Premium Users */}
                <Card className="border-border/40 bg-linear-to-br from-yellow-600/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Premium</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">{premiumUsers}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-yellow-600/10 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Hired Users */}
                <Card className="border-border/40 bg-linear-to-br from-blue-600/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hired</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">{hiredUsers}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                                <Award className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Controls Bar ────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search */}
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, or country..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-9 rounded-lg border-border/40 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5 transition-all bg-background/50"
                    />
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="rounded-lg border-border/40 hover:bg-muted/50"
                        title="Refresh"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>

                    <div className="h-8 w-px bg-border/40" />

                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg border border-border/40">
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => {
                                setViewMode("list");
                                setCurrentPage(1);
                            }}
                            className="h-7 w-7 rounded-md"
                            title="List View"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => {
                                setViewMode("grid");
                                setCurrentPage(1);
                            }}
                            className="h-7 w-7 rounded-md"
                            title="Grid View"
                        >
                            <Grid3x3 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Filters Section ────────────────────────────────────────────– */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                <Select value={statusFilter} onValueChange={(val) => {
                    setStatusFilter(val);
                    setCurrentPage(1);
                }}>
                    <SelectTrigger className="rounded-lg border-border/40 bg-background/50">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-status">All Status</SelectItem>
                        <SelectItem value="ACTIVE">✓ Active</SelectItem>
                        <SelectItem value="BLOCKED">✕ Blocked</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={premiumFilter} onValueChange={(val) => {
                    setPremiumFilter(val);
                    setCurrentPage(1);
                }}>
                    <SelectTrigger className="rounded-lg border-border/40 bg-background/50">
                        <SelectValue placeholder="Filter by premium" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-premium">All Premium Status</SelectItem>
                        <SelectItem value="premium">💎 Premium</SelectItem>
                        <SelectItem value="free">📦 Free</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={countryFilter} onValueChange={(val) => {
                    setCountryFilter(val);
                    setCurrentPage(1);
                }}>
                    <SelectTrigger className="rounded-lg border-border/40 bg-background/50">
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
                    <SelectTrigger className="rounded-lg border-border/40 bg-background/50">
                        <SelectValue placeholder="Filter by hired" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-hired">All Hired Status</SelectItem>
                        <SelectItem value="hired">🎉 Hired</SelectItem>
                        <SelectItem value="not-hired">⏳ Not Hired</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    className="rounded-lg border-border/40 hover:bg-muted/50"
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

            {/* ── Empty State ────────────────────────────────────────────────– */}
            {paginatedUsers.length === 0 ? (
                <Card className="border-border/40 bg-linear-to-br from-muted/30 to-transparent">
                    <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-bold text-muted-foreground">
                            {totalUsers === 0 ? "No users found" : "No users match your filters"}
                        </p>
                        <p className="text-sm text-muted-foreground/60 max-w-xs">
                            {totalUsers === 0
                                ? "Start by inviting users to your platform."
                                : "Try adjusting your search or filter criteria"}
                        </p>
                    </CardContent>
                </Card>
            ) : viewMode === "list" ? (
                /* ── List View ─────────────────────────────────────────────────── */
                <div className="space-y-3">
                    {paginatedUsers.map((user) => (
                        <Card
                            key={user.id}
                            className="border-border/40 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden group"
                            onClick={() => setSelectedUserId(user.id)}
                        >
                            <CardContent className="py-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                                    {/* User Info with Avatar */}
                                    <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1 min-w-0">
                                        {user.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                className="h-10 w-10 rounded-full object-cover border border-border/40 shrink-0"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm leading-tight truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Country */}
                                    <div className="hidden sm:block lg:col-span-1 min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Country</p>
                                        <p className="text-sm font-semibold truncate">{user.country || "—"}</p>
                                    </div>

                                    {/* Status & Badges */}
                                    <div className="hidden lg:flex items-center gap-2 flex-wrap">
                                        <Badge className={user.status === "ACTIVE" ? "bg-green-600/10 text-green-600 border-green-600/30 text-xs" : "bg-destructive/10 text-destructive border-destructive/30 text-xs"}>
                                            {user.status === "ACTIVE" ? "✓ Active" : "✕ Blocked"}
                                        </Badge>
                                        {user.isPremium && (
                                            <Badge className="bg-yellow-600/10 text-yellow-600 border-yellow-600/30 text-xs">💎 Premium</Badge>
                                        )}
                                        {user.isHired && (
                                            <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/30 text-xs">🎉 Hired</Badge>
                                        )}
                                    </div>

                                    {/* Resume & Verified */}
                                    <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                                        {user.emailVerified && (
                                            <Badge className="bg-emerald-600/10 text-emerald-600 border-emerald-600/30 text-xs">✓ Verified</Badge>
                                        )}
                                        {user.resume && (
                                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                                                <FileText className="h-2.5 w-2.5" />
                                                Resume
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Joined Date */}
                                    <div className="hidden sm:block text-sm">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Joined</p>
                                        <p className="font-semibold">{new Date(user.createdAt || "").toLocaleDateString()}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            size="sm"
                                            className="rounded-lg bg-primary hover:bg-orange-700 text-primary-foreground"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedUserId(user.id);
                                            }}
                                        >
                                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                                            View
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            className="rounded-lg"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                const r = await swalDanger({
                                                    title: "Delete User?",
                                                    text: "This will permanently delete the user and all their data including resume, applications, and wallet. This cannot be undone.",
                                                    confirmText: "Delete User",
                                                });
                                                if (r.isConfirmed) doDeleteUser(user.id);
                                            }}
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
                /* ── Grid View ─────────────────────────────────────────────────── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginatedUsers.map((user) => (
                        <Card
                            key={user.id}
                            className="border-border/40 hover:border-primary/50 overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer group"
                            onClick={() => setSelectedUserId(user.id)}
                        >
                            {/* Gradient Header */}
                            <div className="h-20 bg-linear-to-br from-primary/20 to-orange-600/20" />

                            <CardHeader className="pb-3 -mt-8 relative z-10">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="h-12 w-12 rounded-full object-cover border-2 border-background"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-base border-2 border-background">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <Badge className={user.status === "ACTIVE" ? "bg-green-600/10 text-green-600 border-green-600/30 text-xs ml-auto" : "bg-destructive/10 text-destructive border-destructive/30 text-xs ml-auto"}>
                                        {user.status === "ACTIVE" ? "✓" : "✕"}
                                    </Badge>
                                </div>
                                <CardTitle className="text-base line-clamp-1">{user.name}</CardTitle>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {/* Country Info */}
                                {user.country && (
                                    <div className="text-sm">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</p>
                                        <p className="font-semibold truncate">{user.country}</p>
                                    </div>
                                )}

                                {/* Status Badges */}
                                <div className="flex flex-wrap gap-1.5">
                                    {user.isPremium && (
                                        <Badge className="bg-yellow-600/10 text-yellow-600 border-yellow-600/30 text-xs">💎 Premium</Badge>
                                    )}
                                    {user.isHired && (
                                        <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/30 text-xs">🎉 Hired</Badge>
                                    )}
                                    {user.emailVerified && (
                                        <Badge className="bg-emerald-600/10 text-emerald-600 border-emerald-600/30 text-xs">✓ Verified</Badge>
                                    )}
                                </div>

                                {/* Resume Status */}
                                {user.resume && (
                                    <div className="flex items-center gap-2 text-xs p-2 rounded-lg bg-primary/5 border border-primary/20">
                                        <FileText className="h-3.5 w-3.5 text-primary" />
                                        <span className="font-medium text-primary">Resume Available</span>
                                    </div>
                                )}

                                {/* Joined Date */}
                                <div className="text-xs text-muted-foreground pt-2 border-t border-border/40">
                                    Joined {new Date(user.createdAt || "").toLocaleDateString()}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        className="flex-1 rounded-lg bg-primary hover:bg-orange-700 text-primary-foreground text-xs h-8"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedUserId(user.id);
                                        }}
                                    >
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="rounded-lg text-xs h-8"
                                        size="sm"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            const r = await swalDanger({
                                                title: "Delete User?",
                                                text: "This will permanently delete the user and all their data.",
                                                confirmText: "Delete",
                                            });
                                            if (r.isConfirmed) doDeleteUser(user.id);
                                        }}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* ── Pagination ────────────────────────────────────────────────– */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between flex-wrap gap-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {startIdx + 1} to {Math.min(endIdx, users.length)} of {totalUsers} users
                    </p>
                    <div className="flex gap-2 flex-wrap justify-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="rounded-lg"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <Button
                                        key={pageNum}
                                        size="sm"
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className="rounded-lg"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="rounded-lg"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UsersManagementMain;
