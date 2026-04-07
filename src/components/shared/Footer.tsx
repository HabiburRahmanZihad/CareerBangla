import CareerBanglaLogo from "@/components/shared/CareerBanglaLogo";
import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
    Youtube,
} from "lucide-react";
import Link from "next/link";

// ── Link groups ───────────────────────────────────────────────────────────────

const companyLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Career Resources", href: "/career-resources" },
    { label: "Hired Candidates", href: "/hired-candidates" },
    { label: "Contact Us", href: "/contact" },
];

const jobSeekerLinks = [
    { label: "Browse All Jobs", href: "/jobs" },
    { label: "Create Account", href: "/register" },
    { label: "Sign In", href: "/login" },
    { label: "Subscription Plans", href: "/pricing" },
    { label: "My Dashboard", href: "/dashboard" },
];

const recruiterLinks = [
    { label: "Post a Job", href: "/recruiter/dashboard/post-job" },
    { label: "Find Candidates", href: "/recruiter/dashboard/search-candidates" },
    { label: "Recruiter Register", href: "/register/recruiter" },
    { label: "Subscription Plans", href: "/pricing" },
    { label: "Recruiter Dashboard", href: "/recruiter/dashboard" },
];

const socialLinks = [
    {
        label: "Facebook",
        href: "https://facebook.com/careerbangla",
        icon: Facebook,
        color: "hover:text-blue-500",
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/company/careerbangla",
        icon: Linkedin,
        color: "hover:text-sky-500",
    },
    {
        label: "Twitter / X",
        href: "https://twitter.com/careerbangla",
        icon: Twitter,
        color: "hover:text-sky-400",
    },
    {
        label: "Instagram",
        href: "https://instagram.com/careerbangla",
        icon: Instagram,
        color: "hover:text-pink-500",
    },
    {
        label: "YouTube",
        href: "https://youtube.com/@careerbangla",
        icon: Youtube,
        color: "hover:text-red-500",
    },
];

// ── Component ─────────────────────────────────────────────────────────────────

const Footer = () => {
    return (
        <footer className="border-t border-border/60 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main grid */}
                <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">

                    {/* ── Col 1: Brand + Social ── */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <CareerBanglaLogo size="sm" href="/" />
                        <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
                            Bangladesh&apos;s modern hiring platform — connecting job seekers
                            with verified recruiters and real career opportunities.
                        </p>

                        {/* Social links */}
                        <div className="mt-5">
                            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground/60">
                                Follow us
                            </p>
                            <div className="flex items-center gap-2">
                                {socialLinks.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition-all duration-200 hover:border-transparent hover:shadow-sm ${s.color}`}
                                    >
                                        <s.icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Col 2: Company ── */}
                    <div>
                        <h3 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-foreground">
                            Company
                        </h3>
                        <ul className="space-y-2.5">
                            {companyLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Col 3: Job Seekers + Recruiters ── */}
                    <div className="grid gap-8 sm:grid-cols-2">
                        <div>
                            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-foreground">
                                Job Seekers
                            </h3>
                            <ul className="space-y-2.5">
                                {jobSeekerLinks.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-foreground">
                                Recruiters
                            </h3>
                            <ul className="space-y-2.5">
                                {recruiterLinks.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ── Col 4: Contact ── */}
                    <div>
                        <h3 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-foreground">
                            Contact
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="mailto:support@careerbangla.com"
                                    className="group flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Mail className="h-4 w-4" />
                                    </span>
                                    <span>
                                        <span className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground/60">
                                            Email support
                                        </span>
                                        <span className="group-hover:text-primary">
                                            support@careerbangla.com
                                        </span>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+8801700000000"
                                    className="group flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        <Phone className="h-4 w-4" />
                                    </span>
                                    <span>
                                        <span className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground/60">
                                            Call us
                                        </span>
                                        +880 1700-000000
                                    </span>
                                </a>
                            </li>
                            <li>
                                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        <MapPin className="h-4 w-4" />
                                    </span>
                                    <span>
                                        <span className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground/60">
                                            Office
                                        </span>
                                        Dhaka, Bangladesh
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 py-6 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} CareerBangla. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
                        <Link
                            href="/privacy-policy"
                            className="text-xs text-muted-foreground transition-colors hover:text-primary"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms-of-service"
                            className="text-xs text-muted-foreground transition-colors hover:text-primary"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/contact"
                            className="text-xs text-muted-foreground transition-colors hover:text-primary"
                        >
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
