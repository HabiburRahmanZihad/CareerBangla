"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { swalDanger } from "@/lib/swal";
import { IApplication, UserInfo } from "@/types/user.types";
import {
    Award, Bell, ChevronRight, Crown,
    Key, LayoutDashboard, Loader2, LogOut,
    Monitor, Sparkles, User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

interface UserDropdownProps {
    userInfo: UserInfo;
}

const ROLE_LABEL: Record<string, string> = {
    USER: "Job Seeker",
    RECRUITER: "Recruiter",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
};

const ROLE_COLOR: Record<string, string> = {
    USER: "text-primary",
    RECRUITER: "text-blue-600 dark:text-blue-400",
    ADMIN: "text-violet-600 dark:text-violet-400",
    SUPER_ADMIN: "text-rose-600 dark:text-rose-400",
};

const AVATAR_GRADIENTS = [
    "from-primary to-orange-600",
    "from-violet-500 to-purple-700",
    "from-blue-500 to-blue-700",
    "from-emerald-500 to-teal-700",
    "from-rose-500 to-pink-700",
    "from-amber-500 to-orange-600",
];

const avatarGradient = (name: string) =>
    AVATAR_GRADIENTS[(name.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length];

// ── Role-aware dashboard link ──────────────────────────────────────────────────
const dashboardLink = (role: string) => {
    if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin/dashboard";
    if (role === "RECRUITER") return "/recruiter/dashboard";
    return "/dashboard";
};

const profileLink = (role: string) => {
    if (role === "RECRUITER") return "/my-profile";
    return "/my-profile";
};

const changePassLink = (role: string) => {
    if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin/dashboard/change-password";
    if (role === "RECRUITER") return "/recruiter/dashboard/change-password";
    return "/dashboard/change-password";
};

// ── Menu Item ──────────────────────────────────────────────────────────────────
const MenuItem = ({
    href,
    icon: Icon,
    label,
    sublabel,
    danger,
    onClick,
    disabled,
    iconClassName,
}: {
    href?: string;
    icon: React.ElementType;
    label: string;
    sublabel?: string;
    danger?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    iconClassName?: string;
}) => {
    const inner = (
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${disabled
                ? "opacity-60 cursor-not-allowed pointer-events-none"
                : "cursor-pointer"
            } ${danger
                ? "hover:bg-destructive/8 text-destructive"
                : "hover:bg-muted/60 text-foreground"
            }`} onClick={disabled ? undefined : onClick}>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${danger
                    ? "bg-destructive/8 group-hover:bg-destructive/15"
                    : "bg-muted/70 group-hover:bg-muted"
                }`}>
                <Icon className={`h-4 w-4 ${danger ? "text-destructive" : "text-muted-foreground group-hover:text-foreground"}${iconClassName ? ` ${iconClassName}` : ""}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-none ${danger ? "text-destructive" : ""}`}>{label}</p>
                {sublabel && <p className="text-[11px] text-muted-foreground mt-0.5">{sublabel}</p>}
            </div>
            {!danger && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
            )}
        </div>
    );

    if (href) return <Link href={href}>{inner}</Link>;
    return inner;
};

// ── Main component ─────────────────────────────────────────────────────────────
const UserDropdown = ({ userInfo }: UserDropdownProps) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const isHired = userInfo.applications?.some((app: IApplication) => app.status === "HIRED");
    const grad = avatarGradient(userInfo.name);
    const roleLabel = ROLE_LABEL[userInfo.role] ?? userInfo.role;
    const roleColor = ROLE_COLOR[userInfo.role] ?? "text-primary";
    const initial = userInfo.name.charAt(0).toUpperCase();
    // Prefer resume profilePhoto, fallback to social image
    const avatarSrc = userInfo.resume?.profilePhoto || userInfo.image || null;

    const handleLogoutClick = async () => {
        if (isLoggingOut) return;
        setOpen(false);

        const result = await swalDanger({
            title: "Confirm Logout",
            text: "You'll be signed out of your current session. You can always sign back in.",
            confirmText: "Logout",
            cancelText: "Cancel",
        });

        if (result.isConfirmed) {
            setIsLoggingOut(true);

            Swal.fire({
                title: "Logging out...",
                text: "Please wait while we end your session.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            try {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "include",
                });
            } finally {
                Swal.close();
                setIsLoggingOut(false);
                router.push("/login");
                router.refresh();
            }
        }
    };

    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    {/* Avatar trigger button */}
                    <button
                        type="button"
                        className="relative h-9 w-9 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 group"
                    >
                        {avatarSrc ? (
                            <Image
                                src={avatarSrc}
                                alt={userInfo.name}
                                fill
                                className="rounded-full object-cover border-2 border-card group-hover:border-primary/30 transition-colors"
                            />
                        ) : (
                            <div className={`h-9 w-9 rounded-full bg-linear-to-br ${grad} flex items-center justify-center font-black text-sm text-white border-2 border-card group-hover:border-primary/20 transition-colors shadow-sm`}>
                                {initial}
                            </div>
                        )}

                        {/* Premium crown badge */}
                        {userInfo.isPremium && (
                            <span className={`absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center border border-card shadow-sm ${userInfo.role === "RECRUITER" ? "bg-blue-500" : "bg-amber-500"
                                }`}>
                                <Crown className="h-2.5 w-2.5 text-white" />
                            </span>
                        )}

                        {/* Online dot */}
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="w-72 p-0 rounded-2xl border border-border/50 shadow-2xl shadow-black/10 overflow-hidden"
                >
                    {/* ── Profile hero ─────────────────────────────────────── */}
                    <div className="relative overflow-hidden">
                        {/* Gradient cover */}
                        <div className={`h-14 bg-linear-to-br ${grad} opacity-90`}>
                            <div className="absolute inset-0 opacity-[0.06]"
                                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                        </div>

                        <div className="px-4 pb-3">
                            {/* Avatar — overlapping cover */}
                            <div className="-mt-6 mb-2 relative w-fit">
                                <div className={`p-0.5 rounded-xl bg-linear-to-br ${grad} shadow-lg`}>
                                    <div className="h-11 w-11 rounded-[10px] border-2 border-card bg-card flex items-center justify-center overflow-hidden">
                                        {avatarSrc ? (
                                            <Image src={avatarSrc} alt={userInfo.name} width={44} height={44} className="object-cover w-full h-full" />
                                        ) : (
                                            <span className={`font-black text-lg bg-linear-to-br ${grad} bg-clip-text text-transparent`}>
                                                {initial}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Online indicator */}
                                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-card" />
                            </div>

                            {/* Name + badges row */}
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                                <div className="min-w-0">
                                    <p className="text-sm font-black truncate leading-tight">{userInfo.name}</p>
                                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{userInfo.email}</p>
                                    <p className={`text-[11px] font-bold mt-0.5 ${roleColor}`}>{roleLabel}</p>
                                </div>

                                {/* Status badges */}
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    {userInfo.isPremium && (
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black text-white ${userInfo.role === "RECRUITER" ? "bg-blue-500" : "bg-amber-500"
                                            }`}>
                                            <Crown className="h-2.5 w-2.5" />
                                            {userInfo.role === "RECRUITER" ? "Premium" : "Pro"}
                                        </span>
                                    )}
                                    {isHired && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                                            <Award className="h-2.5 w-2.5" /> Hired
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Divider ──────────────────────────────────────────── */}
                    <div className="h-px bg-border/40 mx-3" />

                    {/* ── Navigation items ─────────────────────────────────── */}
                    <div className="p-2 space-y-0.5">
                        <MenuItem
                            href={dashboardLink(userInfo.role)}
                            icon={LayoutDashboard}
                            label="Dashboard"
                            sublabel="Go to your workspace"
                        />
                        <MenuItem
                            href={profileLink(userInfo.role)}
                            icon={User}
                            label="My Profile"
                            sublabel="View & edit your profile"
                        />
                        <MenuItem
                            href={changePassLink(userInfo.role)}
                            icon={Key}
                            label="Change Password"
                            sublabel="Update your security credentials"
                        />
                        {/* Notifications shortcut */}
                        <MenuItem
                            href={
                                userInfo.role === "ADMIN" || userInfo.role === "SUPER_ADMIN"
                                    ? "/admin/dashboard/notifications"
                                    : userInfo.role === "RECRUITER"
                                        ? "/recruiter/dashboard/notifications"
                                        : "/dashboard/notifications"
                            }
                            icon={Bell}
                            label="Notifications"
                            sublabel="View all notifications"
                        />
                        {/* Upgrade CTA — only for non-premium users */}
                        {!userInfo.isPremium && userInfo.role === "USER" && (
                            <MenuItem
                                href="/dashboard/subscriptions"
                                icon={Sparkles}
                                label="Upgrade to Pro"
                                sublabel="Unlock premium features"
                            />
                        )}

                        {/* Devices */}
                        {(userInfo.role === "USER") && (
                            <MenuItem
                                href="/dashboard/devices"
                                icon={Monitor}
                                label="Devices"
                                sublabel="Manage active sessions"
                            />
                        )}
                    </div>

                    {/* ── Divider ──────────────────────────────────────────── */}
                    <div className="h-px bg-border/40 mx-3" />

                    {/* ── Logout ───────────────────────────────────────────── */}
                    <div className="p-2">
                        <MenuItem
                            icon={isLoggingOut ? Loader2 : LogOut}
                            label={isLoggingOut ? "Logging out..." : "Logout"}
                            danger
                            disabled={isLoggingOut}
                            iconClassName={isLoggingOut ? "animate-spin" : undefined}
                            onClick={handleLogoutClick}
                        />
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    );
};

export default UserDropdown;
