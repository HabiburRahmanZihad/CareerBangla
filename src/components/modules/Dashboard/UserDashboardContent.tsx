"use client";

import AtsScoreContent from "@/components/modules/Dashboard/Resume/AtsScoreContent";
import ProfileCompletionBar from "@/components/shared/ProfileCompletionBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyApplications } from "@/services/application.services";
import { getMyResume } from "@/services/resume.services";
import { IUserWithDetails } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, FileText, FileUser } from "lucide-react";
import Link from "next/link";

interface UserDashboardContentProps {
    userInfo: IUserWithDetails;
}

const UserDashboardContent = ({ userInfo }: UserDashboardContentProps) => {
    const { data: resumeData, isLoading: resumeLoading } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
    });

    const { data: applicationsData, isLoading: applicationsLoading } = useQuery({
        queryKey: ["my-applications"],
        queryFn: () => getMyApplications({ limit: "5" }),
    });

    const profileCompletion = resumeData?.data?.profileCompletion ?? 0;
    const applicationCount = applicationsData?.meta?.total ?? 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, {userInfo.name}!</h1>
                    <p className="text-muted-foreground">Here&apos;s your career overview</p>
                </div>
            </div>

            {/* Profile Completion */}
            {resumeLoading ? (
                <Skeleton className="h-16 w-full" />
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <ProfileCompletionBar completion={profileCompletion} />
                    </CardContent>
                </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/my-applications">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {applicationsLoading ? (
                                <Skeleton className="h-8 w-12" />
                            ) : (
                                <p className="text-2xl font-bold">{applicationCount}</p>
                            )}
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/my-resume">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Profile</CardTitle>
                            <FileUser className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{profileCompletion}%</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/jobs">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Browse Jobs</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-primary">Explore</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* ATS Score */}
            <Card>
                <CardHeader>
                    <CardTitle>ATS Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <AtsScoreContent />
                </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    {applicationsLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : applicationsData?.data && applicationsData.data.length > 0 ? (
                        <div className="space-y-3">
                            {applicationsData.data.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{app.job?.title || "Unknown Job"}</p>
                                        <p className="text-sm text-muted-foreground">{app.job?.company}</p>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${app.status === "HIRED" ? "bg-green-100 text-green-800" :
                                        app.status === "REJECTED" ? "bg-red-100 text-red-800" :
                                            app.status === "SHORTLISTED" ? "bg-blue-100 text-blue-800" :
                                                "bg-yellow-100 text-yellow-800"
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            No applications yet. <Link href="/jobs" className="text-primary hover:underline">Browse jobs</Link>
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserDashboardContent;
