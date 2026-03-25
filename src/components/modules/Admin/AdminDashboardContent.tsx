"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/services/stats.services";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Building2, RefreshCw, Shield, Users } from "lucide-react";
import Link from "next/link";

const AdminDashboardContent = () => {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => getDashboardStats(),
    });

    const stats = data?.data;

    const cards = [
        { title: "Total Users", value: stats?.userCount, icon: Users, href: "/admin/dashboard/users-management", color: "text-blue-600" },
        { title: "Total Recruiters", value: stats?.recruiterCount, icon: Building2, href: "/admin/dashboard/recruiters-management", color: "text-green-600" },
        { title: "Total Jobs", value: stats?.jobCount, icon: Briefcase, href: "/admin/dashboard/jobs-management", color: "text-purple-600" },
        { title: "Total Admins", value: stats?.adminCount, icon: Shield, href: "/admin/dashboard/admins-management", color: "text-orange-600" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                    <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <Link key={card.title} href={card.href}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-12" />
                                ) : (
                                    <p className="text-2xl font-bold">{card.value ?? 0}</p>
                                )}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {stats?.totalRevenue !== undefined && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">
                            &#2547;{(stats.totalRevenue || 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Total platform revenue</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminDashboardContent;
