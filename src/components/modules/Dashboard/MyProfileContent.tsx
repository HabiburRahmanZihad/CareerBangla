"use client";

import CoinBalance from "@/components/shared/CoinBalance";
import ProfileCompletionBar from "@/components/shared/ProfileCompletionBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyResume } from "@/services/resume.services";
import { getMyWallet } from "@/services/wallet.services";
import { IUserWithDetails } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Mail, Shield, User } from "lucide-react";

interface MyProfileContentProps {
    userInfo: IUserWithDetails;
}

const MyProfileContent = ({ userInfo }: MyProfileContentProps) => {
    const { data: resumeData, isLoading: resumeLoading } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
    });

    const { data: walletData, isLoading: walletLoading } = useQuery({
        queryKey: ["my-wallet"],
        queryFn: () => getMyWallet(),
    });

    const profileCompletion = resumeData?.data?.profileCompletion ?? 0;

    return (
        <div className="space-y-6 max-w-3xl">
            <h1 className="text-2xl font-bold">My Profile</h1>

            {/* Profile Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={userInfo.image || ""} />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                {userInfo.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold">{userInfo.name}</h2>
                                <Badge variant="outline">{userInfo.role?.toLowerCase().replace("_", " ")}</Badge>
                                {userInfo.emailVerified && (
                                    <Badge variant="default" className="text-xs">Verified</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Mail className="h-3.5 w-3.5" />
                                    {userInfo.email}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                {walletLoading ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : (
                                    <CoinBalance balance={walletData?.data?.balance ?? 0} />
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

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

            {/* Account Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Full Name</p>
                                <p className="text-sm font-medium">{userInfo.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="text-sm font-medium">{userInfo.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Role</p>
                                <p className="text-sm font-medium capitalize">{userInfo.role?.toLowerCase().replace("_", " ")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Status</p>
                                <p className="text-sm font-medium capitalize">{userInfo.status?.toLowerCase() || "active"}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyProfileContent;
