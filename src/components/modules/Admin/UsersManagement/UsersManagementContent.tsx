"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { changeUserStatus, getAllUsers } from "@/services/admin.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const UsersManagementContent = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["all-users"],
        queryFn: () => getAllUsers({ limit: "50" }),
    });

    const { mutateAsync: updateStatus } = useMutation({
        mutationFn: ({ userId, status }: { userId: string; status: string }) =>
            changeUserStatus({ userId, status }),
        onSuccess: () => {
            toast.success("User status updated");
            queryClient.invalidateQueries({ queryKey: ["all-users"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update status"),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
            </div>
        );
    }

    const users = data?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Users Management</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{users.length} users</Badge>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {users.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No users found.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {users.map((user) => (
                        <Card key={user.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-base">{user.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{user.role}</Badge>
                                        <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                                            {user.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <Select
                                    defaultValue={user.status || "ACTIVE"}
                                    onValueChange={(status) => updateStatus({ userId: user.id, status })}
                                >
                                    <SelectTrigger className="w-32 h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UsersManagementContent;
