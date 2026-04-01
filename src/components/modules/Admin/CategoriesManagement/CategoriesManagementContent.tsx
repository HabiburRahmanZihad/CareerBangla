"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { swalDanger } from "@/lib/swal";
import { createJobCategory, deleteJobCategory, getJobCategories } from "@/services/job.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle,
    Folder,
    Layers,
    Loader2,
    Plus,
    RefreshCw,
    Search,
    Tag,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Color palette ─────────────────────────────────────────────────────────────

const CATEGORY_COLORS = [
    { bg: "bg-blue-500/10",    border: "border-blue-200 dark:border-blue-800",     text: "text-blue-700 dark:text-blue-400",     dot: "bg-blue-500"    },
    { bg: "bg-violet-500/10",  border: "border-violet-200 dark:border-violet-800", text: "text-violet-700 dark:text-violet-400", dot: "bg-violet-500"  },
    { bg: "bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-800",text: "text-emerald-700 dark:text-emerald-400",dot: "bg-emerald-500"},
    { bg: "bg-orange-500/10",  border: "border-orange-200 dark:border-orange-800", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500"  },
    { bg: "bg-pink-500/10",    border: "border-pink-200 dark:border-pink-800",     text: "text-pink-700 dark:text-pink-400",     dot: "bg-pink-500"    },
    { bg: "bg-teal-500/10",    border: "border-teal-200 dark:border-teal-800",     text: "text-teal-700 dark:text-teal-400",     dot: "bg-teal-500"    },
    { bg: "bg-indigo-500/10",  border: "border-indigo-200 dark:border-indigo-800", text: "text-indigo-700 dark:text-indigo-400", dot: "bg-indigo-500"  },
    { bg: "bg-rose-500/10",    border: "border-rose-200 dark:border-rose-800",     text: "text-rose-700 dark:text-rose-400",     dot: "bg-rose-500"    },
    { bg: "bg-amber-500/10",   border: "border-amber-200 dark:border-amber-800",   text: "text-amber-700 dark:text-amber-400",   dot: "bg-amber-500"   },
    { bg: "bg-cyan-500/10",    border: "border-cyan-200 dark:border-cyan-800",     text: "text-cyan-700 dark:text-cyan-400",     dot: "bg-cyan-500"    },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────

const CategoriesSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64 rounded-md" />
            <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const CategoriesManagementContent = () => {
    const queryClient = useQueryClient();
    const [newCategory, setNewCategory] = useState("");
    const [searchTerm,  setSearchTerm]  = useState("");

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["job-categories"],
        queryFn:  () => getJobCategories(),
    });

    const { mutateAsync: addCategory, isPending: isAdding } = useMutation({
        mutationFn: (name: string) => createJobCategory({ name }),
        onSuccess: (response) => {
            toast.success("Category created");
            setNewCategory("");
            queryClient.setQueryData(["job-categories"], (oldData: any) => {
                const oldList = Array.isArray(oldData?.data) ? oldData.data : [];
                const created = response?.data;
                if (!created?.id) return oldData;
                return { ...oldData, data: [created, ...oldList] };
            });
            queryClient.invalidateQueries({ queryKey: ["job-categories"] });
        },
        onError: (err: any) =>
            toast.error(getRequestErrorMessage(err, "Failed to create category")),
    });

    const { mutateAsync: removeCategory, isPending: isDeleting } = useMutation({
        mutationFn: (id: string) => deleteJobCategory(id),
        onSuccess: () => {
            toast.success("Category deleted");
            queryClient.invalidateQueries({ queryKey: ["job-categories"] });
        },
        onError: (err: any) =>
            toast.error(getRequestErrorMessage(err, "Failed to delete category")),
    });

    const handleAdd = () => {
        const name = newCategory.trim();
        if (name) addCategory(name);
    };

    const handleDelete = async (id: string, title: string) => {
        const result = await swalDanger({
            title: "Delete Category",
            text: `"${title}" will be permanently deleted. Jobs using this category may be affected.`,
            confirmText: "Delete",
            cancelText: "Cancel",
        });
        if (result.isConfirmed) await removeCategory(id);
    };

    if (isLoading) return <CategoriesSkeleton />;

    const categories = Array.isArray(data?.data) ? data.data : [];
    const filtered   = categories.filter((cat) =>
        (cat.title || "").toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    return (
        <div className="space-y-6">
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-violet-500/10 via-violet-500/5 to-transparent p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/5" />
                <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-violet-500/5" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-500/10 shadow-sm">
                            <Tag className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Job Categories</h1>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Organize job listings with structured categories
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className="gap-1.5 px-3 py-1.5 text-sm font-medium bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                            <Layers className="h-3.5 w-3.5" />
                            {categories.length} categories
                        </Badge>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-border/60"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            title="Refresh"
                        >
                            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Add category ──────────────────────────────────────────── */}
            <Card className="border-border/60 shadow-sm">
                <CardContent className="pb-5 pt-5">
                    <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                        <Plus className="h-4 w-4 text-primary" />
                        Add New Category
                    </p>
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g. Software Engineering, Marketing, Design…"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            className="flex-1"
                            disabled={isAdding}
                        />
                        <Button
                            onClick={handleAdd}
                            disabled={isAdding || !newCategory.trim()}
                            className="shrink-0 gap-2"
                        >
                            {isAdding ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            Add
                        </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Press <kbd className="rounded border border-border/60 bg-muted px-1 py-0.5 font-mono text-[10px]">Enter</kbd> or click Add to create
                    </p>
                </CardContent>
            </Card>

            {/* ── Search + grid ─────────────────────────────────────────── */}
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search categories…"
                            className="pl-9"
                        />
                    </div>
                    <p className="shrink-0 text-sm text-muted-foreground">
                        {filtered.length} of {categories.length} categories
                        {isFetching && (
                            <span className="ml-2 text-xs text-primary/70">(refreshing…)</span>
                        )}
                    </p>
                </div>

                {categories.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="py-20 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
                                <Folder className="h-7 w-7 text-muted-foreground/50" />
                            </div>
                            <p className="font-medium text-muted-foreground">No categories yet</p>
                            <p className="mt-1 text-sm text-muted-foreground/60">
                                Add your first category using the form above
                            </p>
                        </CardContent>
                    </Card>
                ) : filtered.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="py-16 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/60">
                                <AlertCircle className="h-5 w-5 text-muted-foreground/50" />
                            </div>
                            <p className="font-medium text-muted-foreground">
                                No matches for &ldquo;{searchTerm}&rdquo;
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-3"
                                onClick={() => setSearchTerm("")}
                            >
                                Clear search
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {filtered.map((cat, idx) => {
                            const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                            return (
                                <div
                                    key={cat.id}
                                    className={`group relative flex flex-col gap-2.5 rounded-xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${color.bg} ${color.border}`}
                                >
                                    {/* Color dot */}
                                    <span className={`h-2 w-2 rounded-full ${color.dot}`} />

                                    {/* Category name */}
                                    <p className={`wrap-break-word text-sm font-semibold leading-snug ${color.text}`}>
                                        {cat.title || "Untitled"}
                                    </p>

                                    {/* Delete — appears on hover */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1.5 top-1.5 h-6 w-6 opacity-0 transition-all group-hover:opacity-100 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(cat.id, cat.title || "this category")}
                                        disabled={isDeleting}
                                        title="Delete category"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesManagementContent;
