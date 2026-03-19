"use client";

import { IUserWithDetails } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Briefcase, FileText, Users } from "lucide-react";
import Link from "next/link";

interface RecruiterDashboardContentProps {
    userInfo: IUserWithDetails;
}

const RecruiterDashboardContent = ({ userInfo }: RecruiterDashboardContentProps) => {
    const isVerified = userInfo.recruiter?.isVerified ?? false;

    const { data: jobsData, isLoading: jobsLoading } = useQuery({
        queryKey: ["my-jobs"],
        queryFn: () => getMyJobs({ limit: "100" }),
    });

    const totalJobs = jobsData?.meta?.total ?? 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
                    <p className="text-muted-foreground">Welcome, {userInfo.name}</p>
                </div>
            </div>

            {!isVerified && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Your account is not verified yet. You cannot post jobs until an admin verifies your profile.
                        Complete your profile to speed up the verification process.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/recruiter/dashboard/my-jobs">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">My Jobs</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {jobsLoading ? (
                                <Skeleton className="h-8 w-12" />
                            ) : (
                                <p className="text-2xl font-bold">{totalJobs}</p>
                            )}
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/recruiter/dashboard/applications">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-primary">View</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/recruiter/dashboard/search-candidates">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Candidates</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-primary">Search</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default RecruiterDashboardContent;
