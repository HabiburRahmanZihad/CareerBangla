"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createAdmin, deleteAdmin, getAllAdmins, changeUserRole } from "@/services/admin.services";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Plus, RefreshCw, Shield, Trash2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AdminsManagementContent = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [selectedRole, setSelectedRole] = useState("ADMIN");

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-all-admins"],
        queryFn: () => getAllAdmins({ limit: "50" }),
    });

    const { mutateAsync: createMutate, isPending: createPending } = useMutation({
        mutationFn: (data: Record<string, unknown>) => createAdmin(data),
        onSuccess: () => {
            toast.success("Admin created successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-all-admins"] });
            setShowForm(false);
            form.reset();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to create admin"),
    });

    const { mutateAsync: deleteMutate } = useMutation({
        mutationFn: (id: string) => deleteAdmin(id),
        onSuccess: () => {
            toast.success("Admin deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-all-admins"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete admin"),
    });

    const { mutateAsync: changeRole } = useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) => changeUserRole({ userId, role }),
        onSuccess: () => {
            toast.success("Role updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-all-admins"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to change role"),
    });

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            contactNumber: "",
        },
        onSubmit: async ({ value }) => {
            await createMutate({
                admin: {
                    name: value.name,
                    email: value.email,
                    ...(value.contactNumber && { contactNumber: value.contactNumber }),
                },
                password: value.password,
                role: selectedRole,
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

    const admins = data?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admins Management</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{admins.length} admins</Badge>
                    <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
                        <Plus className="h-4 w-4 mr-1" />
                        {showForm ? "Cancel" : "New Admin"}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Create New Admin</CardTitle>
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
                            <form.Field name="name">
                                {(field) => <AppField field={field} label="Full Name" placeholder="e.g. John Doe" />}
                            </form.Field>
                            <form.Field name="email">
                                {(field) => <AppField field={field} label="Email" type="email" placeholder="e.g. admin@example.com" />}
                            </form.Field>
                            <form.Field name="password">
                                {(field) => <AppField field={field} label="Password" type="password" placeholder="Min 6 characters" />}
                            </form.Field>
                            <form.Field name="contactNumber">
                                {(field) => <AppField field={field} label="Contact Number (optional)" type="tel" placeholder="e.g. 01712345678" />}
                            </form.Field>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Role</label>
                                <Select defaultValue="ADMIN" onValueChange={setSelectedRole}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <AppSubmitButton isPending={createPending} pendingLabel="Creating...">
                                    Create Admin
                                </AppSubmitButton>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

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
                                        <Select
                                            defaultValue={adminRole}
                                            onValueChange={(role) => {
                                                if (admin.userId) changeRole({ userId: admin.userId, role });
                                            }}
                                        >
                                            <SelectTrigger className="w-36 h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive h-8 w-8"
                                            onClick={() => {
                                                if (confirm("Delete this admin? This action cannot be undone."))
                                                    deleteMutate(admin.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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
