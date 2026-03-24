"use client";

import { Button } from "@/components/ui/button";
import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { cn } from "@/lib/utils";
import { Briefcase, LogIn, Menu, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
    user?: { name: string; role: string; image?: string } | null;
}

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Jobs" },
];

const Navbar = ({ user }: NavbarProps) => {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold text-primary">CareerBangla</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <Button asChild>
                            <Link href={getDefaultDashboardRoute(user.role as UserRole)}>
                                Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Register
                                </Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background p-4 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "block py-2 text-sm font-medium",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-3 border-t space-y-2">
                        {user ? (
                            <Button asChild className="w-full">
                                <Link href={getDefaultDashboardRoute(user.role as UserRole)}>
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" asChild className="w-full">
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild className="w-full">
                                    <Link href="/register">Register</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
