"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllRecruiters } from "@/services/recruiter.services";
import { IRecruiterProfile } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle, FileText, Loader2, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";

const RecruitersManagementDashboard = () => {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["all-recruiters"],
        queryFn: () => getAllRecruiters({ limit: "100" }),
    });

    const recruiters = (data?.data || []) as IRecruiterProfile[];
    const pendingCount = recruiters.filter((r: IRecruiterProfile) => r.status === "PENDING").length;
    const confirmedCount = recruiters.filter((r: IRecruiterProfile) => r.status === "APPROVED").length;
    const rejectedCount = recruiters.filter((r: IRecruiterProfile) => r.status === "REJECTED").length;
    const totalCount = recruiters.length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Recruiters Management</h1>
                    <p className="text-lg text-muted-foreground">
                        Manage recruiter applications and confirmed accounts in one place
                    </p>
                </div>
                <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                    <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Recruiters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-2xl font-bold">--</span>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold">{totalCount}</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-2xl font-bold">--</span>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Recruiters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-2xl font-bold">--</span>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold text-green-600">{confirmedCount}</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Rejected Recruiters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-2xl font-bold">--</span>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recruiter Applications Card */}
                <Link href="/admin/dashboard/recruiters-management/applications" className="group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <FileText className="h-5 w-5 text-orange-500" />
                                        Recruiter Applications
                                    </CardTitle>
                                    <CardDescription>
                                        Review and manage pending recruiter applications
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary" className="text-orange-600 bg-orange-50">
                                    {pendingCount} Pending
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                    <span>View pending recruiter applications</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                    <span>Approve or reject with confirmation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                    <span>Edit application details</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                    <span>View complete recruiter profile</span>
                                </div>
                            </div>
                            <Button className="w-full group-hover:gap-2 transition-all">
                                View Applications
                                <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Confirmed Recruiters Card */}
                <Link href="/admin/dashboard/recruiters-management/confirmed" className="group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        Confirmed Recruiters
                                    </CardTitle>
                                    <CardDescription>
                                        Manage approved and verified recruiter accounts
                                    </CardDescription>
                                </div>
                                <Badge variant="default" className="bg-green-600">
                                    {confirmedCount} Confirmed
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    <span>View all confirmed recruiters</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    <span>Manage account status (ACTIVE/BLOCKED)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    <span>Edit recruiter information</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    <span>View detailed profiles and analytics</span>
                                </div>
                            </div>
                            <Button className="w-full group-hover:gap-2 transition-all">
                                Manage Recruiters
                                <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Rejected Recruiters Card */}
                <Link href="/admin/dashboard/recruiters-management/rejected" className="group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-destructive border-red-200 dark:border-red-900">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        Rejected Recruiters
                                    </CardTitle>
                                    <CardDescription>
                                        View rejected applications — re-approve or permanently delete
                                    </CardDescription>
                                </div>
                                <Badge variant="destructive">
                                    {rejectedCount} Rejected
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span>View all rejected applicants</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span>Re-approve previously rejected recruiters</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span>Permanently delete from database</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span>Search by name, email, or company</span>
                                </div>
                            </div>
                            <Button variant="destructive" className="w-full group-hover:gap-2 transition-all">
                                View Rejected
                                <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Shortcuts to common recruiter management tasks</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/admin/dashboard/recruiters-management/applications">
                            <Button variant="outline" size="sm">
                                Review Pending Applications ({pendingCount})
                            </Button>
                        </Link>
                        <Link href="/admin/dashboard/recruiters-management/confirmed">
                            <Button variant="outline" size="sm">
                                Manage Accounts ({confirmedCount})
                            </Button>
                        </Link>
                        <Link href="/admin/dashboard/recruiters-management/rejected">
                            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950">
                                Rejected Recruiters ({rejectedCount})
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecruitersManagementDashboard;
