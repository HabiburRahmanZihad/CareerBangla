"use client";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getAllAdmins } from "@/services/admin.services";
import { useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    ChevronRight,
    Copy,
    LayoutGrid,
    List,
    Mail,
    RefreshCw,
    Search,
    Shield,
    ShieldAlert,
    Users
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Admin Avatars ──────────────────────────────────────────────────────────
const ADMIN_GRADIENTS = [
    "from-red-600 to-rose-600",
    "from-purple-600 to-indigo-600",
    "from-blue-600 to-cyan-600",
    "from-orange-600 to-red-600",
    "from-pink-600 to-rose-600",
];

const adminGradient = (email: string) =>
    ADMIN_GRADIENTS[(email.charCodeAt(0) || 0) % ADMIN_GRADIENTS.length];

const AdminAvatar = ({ name, email, size = 12 }: { name: string; email: string; size?: number }) => {
    const grad = adminGradient(email);
    return (
        <div className={cn(`h-${size} w-${size} rounded-xl bg-linear-to-br p-0.5 shrink-0 flex items-center justify-center font-black text-white text-sm shadow-lg`, grad)}>
            <div className="h-full w-full rounded-[10px] bg-black/10 flex items-center justify-center">
                {name.charAt(0).toUpperCase()}
            </div>
        </div>
    );
};

// ── Role Badge Config ──────────────────────────────────────────────────────
const ROLE_CONFIG: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
    ADMIN: { label: "Admin", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", icon: Shield },
    SUPER_ADMIN: { label: "Super Admin", bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", icon: ShieldAlert },
};

const RoleBadge = ({ role }: { role: string }) => {
    const config = ROLE_CONFIG[role] || ROLE_CONFIG.ADMIN;
    const Icon = config.icon;
    return (
        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold", config.bg, config.text)}>
            <Icon className="h-3 w-3" />
            {config.label}
        </span>
    );
};

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: React.ElementType; accent: string }) => (
    <div className={cn("relative rounded-2xl border border-border/40 bg-card overflow-hidden p-4 flex items-center gap-3")}>
        <div className={cn("absolute left-0 inset-y-0 w-1 bg-linear-to-b", accent)} />
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", accent.replace("from-", "bg-").split(" ")[0].replace("bg-", "bg-") + "/10")}>
            <Icon className="h-5 w-5 text-current" />
        </div>
        <div className="pl-1">
            <p className="text-2xl font-black leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
    </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const AdminsManagementContent = () => {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-all-admins"],
        queryFn: () => getAllAdmins({ limit: "100" }),
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");

    const admins = data?.data || [];
    const filteredAdmins = admins.filter(
        (admin) =>
            admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const superAdmins = admins.filter((a) => a.role === "SUPER_ADMIN").length;
    const regularAdmins = admins.filter((a) => a.role === "ADMIN").length;

    const copyEmail = (email: string) => {
        navigator.clipboard.writeText(email);
        toast.success("Email copied to clipboard!");
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array(3).fill(null).map((_, i) => (
                        <Skeleton key={i} className="h-20 rounded-2xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(4).fill(null).map((_, i) => (
                        <Skeleton key={i} className="h-40 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                            Admins Management
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage administrative users and permissions</p>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching} className="rounded-xl">
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>

                {/* ── Stats Grid ────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        label="Total Admins"
                        value={admins.length}
                        icon={Users}
                        accent="from-primary to-orange-600"
                    />
                    <StatCard
                        label="Super Admins"
                        value={superAdmins}
                        icon={ShieldAlert}
                        accent="from-red-600 to-rose-600"
                    />
                    <StatCard
                        label="Regular Admins"
                        value={regularAdmins}
                        icon={Shield}
                        accent="from-blue-600 to-cyan-600"
                    />
                </div>
            </div>

            {/* ── Search & Controls ──────────────────────────────────────────── */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex-1 min-w-64 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search admins by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 rounded-xl border-border/40 bg-muted/30"
                        />
                    </div>
                    <Badge variant="secondary">{filteredAdmins.length} result{filteredAdmins.length !== 1 ? "s" : ""}</Badge>
                    <div className="flex gap-1 border border-border/40 rounded-lg p-1">
                        <Button
                            size="sm"
                            variant={layoutMode === "grid" ? "default" : "ghost"}
                            onClick={() => setLayoutMode("grid")}
                            className="rounded-md"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={layoutMode === "list" ? "default" : "ghost"}
                            onClick={() => setLayoutMode("list")}
                            className="rounded-md"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── No Results ────────────────────────────────────────────────── */}
            {filteredAdmins.length === 0 ? (
                <Card className="border-border/40 bg-muted/50">
                    <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="font-bold text-muted-foreground">No admins found</p>
                        <p className="text-sm text-muted-foreground/60 max-w-xs">
                            {admins.length === 0 ? "No administrators in the system yet." : "Try adjusting your search filters."}
                        </p>
                    </CardContent>
                </Card>
            ) : layoutMode === "grid" ? (
                // ── Grid Layout ────────────────────────────────────────────
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAdmins.map((admin) => {
                        const adminRole = admin.role || "ADMIN";
                        return (
                            <Card
                                key={admin.id}
                                className="border-border/40 hover:border-border/80 transition-colors group overflow-hidden"
                            >
                                <CardHeader className="pb-3 space-y-3 bg-linear-to-br from-muted/50 to-transparent">
                                    <div className="flex items-start justify-between gap-2">
                                        <AdminAvatar name={admin.name} email={admin.email} size={12} />
                                        <RoleBadge role={adminRole} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base leading-tight">{admin.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{admin.email}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <button
                                        onClick={() => copyEmail(admin.email)}
                                        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm group/copy"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Mail className="h-4 w-4 shrink-0" />
                                            <span className="truncate">{admin.email}</span>
                                        </div>
                                        <Copy className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                                    </button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                // ── List Layout ────────────────────────────────────────────
                <div className="space-y-2">
                    {filteredAdmins.map((admin) => {
                        const adminRole = admin.role || "ADMIN";
                        return (
                            <Card key={admin.id} className="border-border/40 hover:border-border/80 transition-colors group">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <AdminAvatar name={admin.name} email={admin.email} size={10} />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-sm leading-tight">{admin.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {admin.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <RoleBadge role={adminRole} />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyEmail(admin.email)}
                                                className="rounded-lg h-8 w-8 p-0"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminsManagementContent;
