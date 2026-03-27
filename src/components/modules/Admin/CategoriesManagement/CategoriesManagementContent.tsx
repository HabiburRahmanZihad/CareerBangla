"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { createJobCategory, deleteJobCategory, getJobCategories } from "@/services/job.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CategoriesManagementContent = () => {
    const queryClient = useQueryClient();
    const [newCategory, setNewCategory] = useState("");

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["job-categories"],
        queryFn: () => getJobCategories(),
    });

    const { mutateAsync: addCategory, isPending } = useMutation({
        mutationFn: (name: string) => createJobCategory({ name }),
        onSuccess: (response) => {
            toast.success("Category created");
            setNewCategory("");

            queryClient.setQueryData(["job-categories"], (oldData: any) => {
                const oldList = Array.isArray(oldData?.data) ? oldData.data : [];
                const created = response?.data;

                if (!created?.id) {
                    return oldData;
                }

                return {
                    ...oldData,
                    data: [created, ...oldList],
                };
            });

            queryClient.invalidateQueries({ queryKey: ["job-categories"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed"),
    });

    const { mutateAsync: removeCategory } = useMutation({
        mutationFn: (id: string) => deleteJobCategory(id),
        onSuccess: () => {
            toast.success("Category deleted");
            queryClient.invalidateQueries({ queryKey: ["job-categories"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed"),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    const categories = Array.isArray(data?.data) ? data.data : [];

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Job Categories</h1>
                <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                    <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="Category name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && newCategory && addCategory(newCategory)}
                        />
                        <Button onClick={() => newCategory && addCategory(newCategory)} disabled={isPending || !newCategory}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Categories ({categories.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {categories.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No categories yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <span className="font-medium">{cat.name || cat.title || "Untitled Category"}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive h-8 w-8"
                                        onClick={() => {
                                            if (confirm("Delete this category?")) removeCategory(cat.id);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoriesManagementContent;
