"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import { Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarContentProps {
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string;
}

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

const ROLE_LABEL: Record<string, string> = {
    USER: "Job Seeker",
    RECRUITER: "Recruiter",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
};

const DashboardSidebarContent = ({ navItems, userInfo }: DashboardSidebarContentProps) => {
    const pathname = usePathname();
    const grad = avatarGradient(userInfo.name);
    const initial = userInfo.name.charAt(0).toUpperCase();
    const avatarSrc = userInfo.resume?.profilePhoto || userInfo.image || null;
    const roleLabel = ROLE_LABEL[userInfo.role] ?? userInfo.role;

    return (
        <div className="hidden md:flex h-full w-64 flex-col bg-card border-r border-border/50 overflow-hidden">

            {/* ── Logo ──────────────────────────────────────────────────── */}
            <div className="flex h-16 items-center px-5 border-b border-border/40 shrink-0">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <span className="text-2xl font-black text-primary tracking-tight">CareerBangla</span>
                </Link>
            </div>

            {/* ── Nav ───────────────────────────────────────────────────── */}
            <ScrollArea className="flex-1 py-3">
                <nav className="px-3 space-y-5">
                    {navItems.map((section, sectionIdx) => (
                        <div key={sectionIdx}>
                            {section.title && (
                                <p className="px-2 mb-1.5 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                                    {section.title}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {section.items.map((item, itemIdx) => {
                                    const Icon = getIconComponent(item.icon);
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link
                                            key={itemIdx}
                                            href={item.href}
                                            className={cn(
                                                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                isActive
                                                    ? "bg-white/20"
                                                    : "bg-muted/50 group-hover:bg-muted"
                                            )}>
                                                <Icon className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="flex-1 truncate">{item.title}</span>

                                            {/* Active indicator dot */}
                                            {isActive && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-white/70 shrink-0" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </ScrollArea>

            {/* ── User footer ───────────────────────────────────────────── */}
            <div className="shrink-0 px-3 py-3 border-t border-border/40 space-y-1">
                {/* User card */}
                <Link
                    href="/my-profile"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors group"
                >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className={`p-0.5 rounded-xl bg-linear-to-br ${grad} shadow-sm`}>
                            <div className="h-8 w-8 rounded-[10px] border border-card bg-card flex items-center justify-center overflow-hidden">
                                {avatarSrc ? (
                                    <Image src={avatarSrc} alt={userInfo.name} width={32} height={32} className="object-cover w-full h-full" />
                                ) : (
                                    <span className={`font-black text-sm bg-linear-to-br ${grad} bg-clip-text text-transparent`}>
                                        {initial}
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Online dot */}
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold truncate leading-none">{userInfo.name}</p>
                            {userInfo.isPremium && (
                                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black text-white shrink-0 ${userInfo.role === "RECRUITER" ? "bg-blue-500" : "bg-amber-500"
                                    }`}>
                                    <Crown className="h-2 w-2" />
                                    {userInfo.role === "RECRUITER" ? "Pro" : "Pro"}
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{roleLabel}</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default DashboardSidebarContent;
