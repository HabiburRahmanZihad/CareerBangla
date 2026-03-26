"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { createAdmin, deleteAdmin, getAllAdmins } from "@/services/admin.services";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, Plus, RefreshCw, Shield, ShieldAlert, Trash2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AdminsManagementContent = () => {
    const queryClient = useQueryClient();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-all-admins"],
        queryFn: () => getAllAdmins({ limit: "50" }),
    });

    const { mutateAsync: createMutate, isPending: createPending } = useMutation({
        mutationFn: (data: Record<string, unknown>) => createAdmin(data),
        onSuccess: () => {
            toast.success("Admin created successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-all-admins"] });
            setDialogOpen(false);
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
                role: "ADMIN",
            });
        },
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, email, password } = form.state.values;
        if (!name.trim() || !email.trim() || !password.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setShowConfirm(true);
    };

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

                    {/* ── Create Admin Modal ── */}
                    <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) form.reset(); }}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" /> New Admin
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-primary" />
                                    Create New Admin
                                </DialogTitle>
                                <DialogDescription>
                                    This will create a new admin account with full dashboard access.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleFormSubmit} noValidate className="space-y-4 mt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={createPending}>
                                        {createPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                        Create Admin
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* ── Confirmation Alert ── */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Admin Creation</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to grant <strong>admin privileges</strong> to{" "}
                            <strong>{form.state.values.email || "this user"}</strong>.
                            They will have full access to the admin dashboard. This action is sensitive and should only be done for trusted individuals.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => form.handleSubmit()}
                            disabled={createPending}
                        >
                            {createPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Yes, Create Admin
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
