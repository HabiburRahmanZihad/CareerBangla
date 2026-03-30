"use client";

import NotificationDropdown from "@/components/modules/Dashboard/Layout/NotificationDropdown";
import UserDropdown from "@/components/modules/Dashboard/Layout/UserDropdown";
import { UserRole } from "@/lib/authUtils";
import { cn } from "@/lib/utils";
import { UserInfo } from "@/types/user.types";
import { Briefcase, LogIn, Menu, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
    user?: UserInfo | null;
}

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "About Us", href: "/about-us" },
    { name: "Hired Candidates", href: "/hired-candidates" },
];

export default function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-999 w-full">
            <div className="mx-auto container px-4 pt-4 sm:px-6 lg:px-8">
                <nav className="glass glass-shadow glass-border rounded-2xl">
                    <div className="flex h-19 items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                <Briefcase className="h-5 w-5" />
                            </div>

                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-extrabold tracking-tight text-foreground">
                                    CareerBangla
                                </span>
                                <span className="text-xs font-medium text-muted-foreground">
                                    Find your dream job
                                </span>
                            </div>
                        </Link>

                        {/* desktop nav */}
                        <div className="hidden items-center gap-8 lg:flex">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "group inline-flex items-center gap-1 text-[15px] font-semibold transition-colors duration-300",
                                        pathname === link.href
                                            ? "text-primary"
                                            : "text-foreground/85 hover:text-primary"
                                    )}
                                >
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* right buttons */}
                        <div className="hidden items-center gap-3 lg:flex">
                            {user ? (
                                <>
                                    <NotificationDropdown userRole={user.role as UserRole} />
                                    <UserDropdown userInfo={user} />
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white/50 px-6 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary dark:bg-slate-950/50"
                                    >
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(255,107,26,0.22)] transition-all duration-300 hover:bg-accent"
                                    >
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Join Now
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* mobile button */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/50 text-foreground transition-colors hover:text-primary dark:bg-slate-950/50 lg:hidden"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* mobile menu */}
                    {mobileOpen && (
                        <div className="border-t border-border/70 px-4 py-4 lg:hidden">
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-300",
                                            pathname === link.href
                                                ? "bg-primary/10 text-primary"
                                                : "text-foreground/85 hover:bg-secondary hover:text-primary"
                                        )}
                                    >
                                        <span>{link.name}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-4 flex flex-col gap-3">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-2 rounded-xl border border-border bg-white/60 px-4 py-3 dark:bg-slate-950/60">
                                            <NotificationDropdown userRole={user.role as UserRole} />
                                            <UserDropdown userInfo={user} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileOpen(false)}
                                            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white/60 px-6 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary dark:bg-slate-950/60"
                                        >
                                            <LogIn className="mr-2 h-4 w-4" />
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setMobileOpen(false)}
                                            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent"
                                        >
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Join Now
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
