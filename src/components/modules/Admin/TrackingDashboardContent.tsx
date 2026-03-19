"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCouponUsageTracking, getReferralTracking } from "@/services/tracking.services";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Activity, Ticket } from "lucide-react";

export default function TrackingDashboardContent() {
    const { data: referralData, isLoading: refsLoading } = useQuery({
        queryKey: ["tracking-referrals"],
        queryFn: () => getReferralTracking(1, 100),
    });

    const { data: couponData, isLoading: couponsLoading } = useQuery({
        queryKey: ["tracking-coupons"],
        queryFn: () => getCouponUsageTracking(1, 100),
    });

    const referrals = referralData?.data?.data || [];
    const coupons = couponData?.data?.data || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Tracking</h1>
                <p className="text-muted-foreground mt-2">Monitor Referral conversions and Coupon usage analytics.</p>
            </div>

            <Tabs defaultValue="referrals" className="w-full">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                    <TabsTrigger value="referrals" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Referrals
                    </TabsTrigger>
                    <TabsTrigger value="coupons" className="flex items-center gap-2">
                        <Ticket className="w-4 h-4" /> Coupons
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="referrals" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Referral Conversion History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {refsLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : referrals.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground">No paid referrals tracked yet.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Referrer Code</TableHead>
                                            <TableHead>Referrer User</TableHead>
                                            <TableHead>Referred User</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {referrals.map((ref) => (
                                            <TableRow key={ref.id}>
                                                <TableCell>{ref.paidAt ? format(new Date(ref.paidAt), "MMM dd, yyyy HH:mm") : "N/A"}</TableCell>
                                                <TableCell className="font-mono">{ref.referrer?.referralCode || "N/A"}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{ref.referrer?.name}</div>
                                                    <div className="text-xs text-muted-foreground">{ref.referrer?.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{ref.referredUser?.name}</div>
                                                    <div className="text-xs text-muted-foreground">{ref.referredUser?.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    {ref.hasPaid ? (
                                                        <Badge variant="default" className="bg-green-600">PAID</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">UNPAID</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="coupons" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Coupon Usage Logs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {couponsLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : coupons.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground">No coupons have been used yet.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Last Used</TableHead>
                                            <TableHead>Coupon Code</TableHead>
                                            <TableHead>Usage Count</TableHead>
                                            <TableHead>Limit</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {coupons.map((coupon) => (
                                            <TableRow key={coupon.id}>
                                                <TableCell>{coupon.usedAt ? format(new Date(coupon.usedAt), "MMM dd, yyyy HH:mm") : "N/A"}</TableCell>
                                                <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                                                <TableCell>{coupon.usageCount}</TableCell>
                                                <TableCell>{coupon.maxUsage}</TableCell>
                                                <TableCell>
                                                    <Badge variant={coupon.status === "ACTIVE" ? "default" : "secondary"}>
                                                        {coupon.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
