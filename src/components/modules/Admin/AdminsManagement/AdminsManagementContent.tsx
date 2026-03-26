"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllAdmins } from "@/services/admin.services";
import { useQuery } from "@tanstack/react-query";
import { Mail, RefreshCw, Shield, User } from "lucide-react";

const AdminsManagementContent = () => {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-all-admins"],
        queryFn: () => getAllAdmins({ limit: "50" }),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
            </div>
        );
    }

    const admins = data?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admins Management</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{admins.length} admins</Badge>

                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {admins.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No admins found.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {admins.map((admin) => {
                        const adminRole = admin.user?.role || admin.role || "ADMIN";
                        return (
                            <Card key={admin.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Shield className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {admin.name}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    {admin.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge>{adminRole}</Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminsManagementContent;
