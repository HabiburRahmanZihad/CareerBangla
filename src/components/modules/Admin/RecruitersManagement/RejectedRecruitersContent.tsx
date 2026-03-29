/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { swalConfirm, swalDanger } from "@/lib/swal";
import { approveRecruiter, deleteRecruiter, getAllRecruiters } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, CheckCircle, ChevronDown, ChevronUp, Mail, RefreshCw, Search, Trash2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const RejectedRecruitersContent = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["all-recruiters"],
        queryFn: () => getAllRecruiters({ limit: "200" }),
    });

    const { mutateAsync: doDelete } = useMutation({
        mutationFn: (id: string) => deleteRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter permanently deleted");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete"),
    });

    const { mutateAsync: doApprove } = useMutation({
        mutationFn: (id: string) => approveRecruiter(id),
        onSuccess: () => {
            toast.success("Recruiter re-approved and verification email sent");
            queryClient.invalidateQueries({ queryKey: ["all-recruiters"] });
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
            {/* ── Premium Header ────────────────────────────────────────────── */}
            <div className="space-y-2 py-2">
                <div className="flex items-center gap-2 mb-4">
                    <Link href="/admin/dashboard/recruiters-management">
                        <Button variant="ghost" size="icon" className="hover:bg-muted rounded-lg">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-destructive to-red-600 bg-clip-text text-transparent">
                    Rejected Applications
                </h1>
                <p className="text-base text-muted-foreground">
                    Review rejected recruiter applications. You can re-approve or permanently delete.
                </p>
            </div>

            {/* ── Stats Bar ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="border-border/40 bg-linear-to-br from-destructive/5 to-transparent">
                    <CardContent className="pt-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Rejected</p>
                        <p className="text-2xl font-bold text-destructive mt-1">{rejected.length}</p>
                    </CardContent>
                </Card>
                <Card className="border-border/40 bg-linear-to-br from-muted/30 to-transparent">
                    <CardContent className="pt-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">This Month</p>
                        <p className="text-2xl font-bold text-muted-foreground mt-1">
                            {rejected.filter((r) => {
                                const now = new Date();
                                const created = new Date(r.createdAt || "");
                                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                            }).length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-border/40 bg-linear-to-br from-primary/5 to-transparent">
                    <CardContent className="pt-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Recruiters</p>
                        <p className="text-2xl font-bold text-primary mt-1">
                            {allRecruiters.filter((r) => r.status === "REJECTED").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Search Bar ────────────────────────────────────────────────── */}
            <div className="flex gap-3 flex-wrap items-center">
                <div className="relative flex-1 min-w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search name, email, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 rounded-lg border-border/40 focus:border-destructive/50 focus:shadow-lg focus:shadow-destructive/5 transition-all bg-background/50"
                    />
                </div>
                {searchTerm && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchTerm("")}
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
            {rejected.length === 0 ? (
                <Card className="border-border/40 bg-linear-to-br from-muted/30 to-transparent">
                    <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <p className="font-bold text-muted-foreground">
                            {allRecruiters.filter((r) => r.status === "REJECTED").length === 0
                                ? "No rejected applications"
                                : "No results found"}
                        </p>
                        <p className="text-sm text-muted-foreground/60 max-w-xs">
                            {searchTerm ? "Try adjusting your search keywords" : "All applicants have been reviewed"}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {rejected.map((recruiter) => (
                        <Card
                            key={recruiter.id}
                            className="border-border/40 hover:border-destructive/50 hover:shadow-lg hover:shadow-destructive/5 transition-all group overflow-hidden"
                        >
                            <CardHeader className="pb-3 space-y-3 bg-linear-to-br from-muted/50 to-transparent">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    {/* Avatar + Info */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {recruiter.profilePhoto ? (
                                            <Image
                                                src={recruiter.profilePhoto}
                                                alt={recruiter.name}
                                                width={44}
                                                height={44}
                                                className="rounded-full border border-border/40 object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full border border-border/40 bg-muted flex items-center justify-center shrink-0">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg leading-tight truncate">{recruiter.name}</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">{recruiter.email}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className="bg-destructive/10 text-destructive border-destructive/30">REJECTED</Badge>
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
                                    {recruiter.contactNumber && (
                                        <div className="text-sm">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact</p>
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
                                {expandedId === recruiter.id && (
                                    <div className="border-t border-border/40 pt-4 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {recruiter.companyAddress && (
                                                <div>
                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</p>
                                                    <p className="text-sm font-semibold mt-1">{recruiter.companyAddress}</p>
                                                </div>
                                            )}
                                            {recruiter.companyWebsite && (
                                                <div>
                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Website</p>
                                                    <a
                                                        href={recruiter.companyWebsite}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm font-semibold text-primary hover:underline break-all"
                                                    >
                                                        {recruiter.companyWebsite}
                                                    </a>
                                                </div>
                                            )}
                                            {recruiter.description && (
                                                <div className="md:col-span-2">
                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">About</p>
                                                    <p className="text-sm mt-1 line-clamp-2">{recruiter.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
                                    <Button
                                        size="sm"
                                        variant={expandedId === recruiter.id ? "default" : "outline"}
                                        onClick={() => setExpandedId(expandedId === recruiter.id ? null : recruiter.id)}
                                        className="rounded-lg"
                                    >
                                        {expandedId === recruiter.id ? (
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
                                        className="rounded-lg bg-primary hover:bg-orange-700 text-primary-foreground"
                                        onClick={async () => {
                                            const r = await swalConfirm({
                                                title: "Re-Approve Recruiter?",
                                                text: "This will activate their account and send a verification email.",
                                                confirmText: "Re-Approve",
                                                icon: "question",
                                            });
                                            if (r.isConfirmed) doApprove(recruiter.id);
                                        }}
                                    >
                                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                                        Re-Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={async () => {
                                            const r = await swalDanger({
                                                title: "Permanently Delete?",
                                                text: "This will permanently delete the recruiter and all data. This cannot be undone.",
                                                confirmText: "Delete Permanently",
                                            });
                                            if (r.isConfirmed) doDelete(recruiter.id);
                                        }}
                                        className="rounded-lg"
                                    >
                                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

        </div>
    );
};

export default RejectedRecruitersContent;
