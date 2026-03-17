"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createCoupon, deleteCoupon, getAllCoupons } from "@/services/coupon.services";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Plus, Trash2, Ticket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CouponsManagementContent = () => {
    const [showForm, setShowForm] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["admin-coupons"],
        queryFn: () => getAllCoupons(),
    });

    const { mutateAsync: createMutate, isPending: createPending } = useMutation({
        mutationFn: (data: Record<string, unknown>) => createCoupon(data),
        onSuccess: () => {
            toast.success("Coupon created successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
            setShowForm(false);
            form.reset();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to create coupon");
        },
    });

    const { mutateAsync: deleteMutate } = useMutation({
        mutationFn: (id: string) => deleteCoupon(id),
        onSuccess: () => {
            toast.success("Coupon deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to delete coupon");
        },
    });

    const form = useForm({
        defaultValues: {
            code: "",
            discount: "",
            maxUses: "",
            expiresAt: "",
        },
        onSubmit: async ({ value }) => {
            await createMutate({
                code: value.code,
                discount: Number(value.discount),
                maxUses: Number(value.maxUses),
                expiresAt: value.expiresAt,
            });
        },
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

    const coupons = data?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Coupons Management</h1>
                <Button onClick={() => setShowForm(!showForm)} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    {showForm ? "Cancel" : "New Coupon"}
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Create Coupon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            noValidate
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit();
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <form.Field name="code">
                                {(field) => <AppField field={field} label="Code" placeholder="e.g. WELCOME50" />}
                            </form.Field>
                            <form.Field name="discount">
                                {(field) => <AppField field={field} label="Discount (coins)" type="number" placeholder="e.g. 50" />}
                            </form.Field>
                            <form.Field name="maxUses">
                                {(field) => <AppField field={field} label="Max Uses" type="number" placeholder="e.g. 100" />}
                            </form.Field>
                            <form.Field name="expiresAt">
                                {(field) => <AppField field={field} label="Expires At" type="date" />}
                            </form.Field>
                            <div className="md:col-span-2">
                                <AppSubmitButton isPending={createPending} pendingLabel="Creating...">
                                    Create Coupon
                                </AppSubmitButton>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {coupons.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No coupons found. Create one to get started.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {coupons.map((coupon) => (
                        <Card key={coupon.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Ticket className="h-5 w-5 text-primary" />
                                        <div>
                                            <CardTitle className="text-base font-mono">{coupon.code}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {coupon.discount} coins discount &middot; {coupon.usedCount}/{coupon.maxUses} used
                                            </p>
                                            {coupon.expiresAt && (
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Expires {formatDistanceToNow(new Date(coupon.expiresAt), { addSuffix: true })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={coupon.isActive ? "default" : "secondary"}>
                                            {coupon.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => deleteMutate(coupon.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CouponsManagementContent;
