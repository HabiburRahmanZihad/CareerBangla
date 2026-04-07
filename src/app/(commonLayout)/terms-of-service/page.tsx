import Link from "next/link";
import {
    FileText,
    UserCheck,
    Briefcase,
    CreditCard,
    AlertTriangle,
    Scale,
    Mail,
} from "lucide-react";

export const metadata = {
    title: "Terms of Service | CareerBangla",
    description:
        "Read CareerBangla's terms and conditions governing the use of our platform.",
};

const sections = [
    {
        icon: UserCheck,
        title: "Eligibility & Account Registration",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10",
        items: [
            "You must be at least 18 years old to use CareerBangla.",
            "You agree to provide accurate, current, and complete information during registration.",
            "You are responsible for maintaining the confidentiality of your password and account.",
            "You agree to notify us immediately of any unauthorized account access.",
            "One person may not maintain more than one free account. Duplicate accounts may be removed.",
            "CareerBangla reserves the right to refuse registration or suspend accounts that violate these terms.",
        ],
    },
    {
        icon: Briefcase,
        title: "Platform Use & Conduct",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        items: [
            "Job seekers may create profiles, apply for jobs, and use resume tools for personal career purposes only.",
            "Recruiters may post jobs, search candidates, and manage applications for legitimate hiring purposes.",
            "You must not post false, misleading, or fraudulent job listings or resume information.",
            "You must not use the platform to spam, harass, or contact users for non-recruitment purposes.",
            "Scraping, crawling, or automated data extraction from CareerBangla is strictly prohibited.",
            "You must not attempt to reverse-engineer, hack, or disrupt the platform's operation.",
            "All content you post must comply with applicable laws of Bangladesh.",
        ],
    },
    {
        icon: CreditCard,
        title: "Subscriptions & Payments",
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-500/10",
        items: [
            "CareerBangla offers both free and paid subscription plans with varying feature access.",
            "Paid subscriptions are billed in advance on a monthly or annual basis as selected.",
            "All prices are listed in Bangladeshi Taka (BDT) unless otherwise stated.",
            "Subscription fees are non-refundable except as required by applicable law.",
            "CareerBangla reserves the right to change pricing with 30 days' advance notice.",
            "Failed payments may result in service suspension until payment is resolved.",
            "Coupon codes are subject to validity periods and single-use restrictions unless otherwise stated.",
        ],
    },
    {
        icon: AlertTriangle,
        title: "Prohibited Content & Activities",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
        items: [
            "Posting jobs that violate labor laws or discriminate based on gender, religion, ethnicity, or disability.",
            "Uploading malicious software, viruses, or harmful code of any kind.",
            "Impersonating another person, company, or CareerBangla staff.",
            "Collecting personal data of other users without their explicit consent.",
            "Using the platform for any illegal, fraudulent, or unauthorized purpose.",
            "Attempting to gain unauthorized access to other users' accounts or system components.",
            "Reselling or sublicensing access to CareerBangla's services.",
        ],
    },
    {
        icon: FileText,
        title: "Intellectual Property",
        color: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-500/10",
        items: [
            "CareerBangla and its associated logos, design, and content are owned by CareerBangla and protected by copyright law.",
            "You retain ownership of content you upload (resumes, job postings, etc.) but grant CareerBangla a license to display and use it to operate the platform.",
            "You may not reproduce, distribute, or create derivative works from CareerBangla's proprietary content.",
            "Feedback and suggestions you provide to CareerBangla may be used without obligation to compensate you.",
        ],
    },
    {
        icon: Scale,
        title: "Limitation of Liability & Disclaimers",
        color: "text-sky-600 dark:text-sky-400",
        bg: "bg-sky-500/10",
        items: [
            "CareerBangla is provided 'as is' without warranties of any kind, express or implied.",
            "We do not guarantee that the platform will be available uninterrupted or error-free at all times.",
            "We are not responsible for the accuracy or legitimacy of job postings created by recruiters.",
            "We are not liable for hiring decisions made by recruiters or employment outcomes of job seekers.",
            "Our total liability in connection with the service shall not exceed the amount you paid in the 3 months preceding the claim.",
            "CareerBangla shall not be liable for indirect, incidental, or consequential damages.",
        ],
    },
];

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="relative overflow-hidden border-b bg-linear-to-br from-primary/8 via-primary/4 to-background py-16 text-center">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/8 blur-2xl" />
                <div className="relative container mx-auto px-4">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="mb-3 text-4xl font-extrabold tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="mx-auto max-w-xl text-muted-foreground">
                        Please read these terms carefully before using CareerBangla. By
                        accessing or using our platform, you agree to be bound by these
                        terms.
                    </p>
                    <p className="mt-4 text-xs text-muted-foreground/60">
                        Last updated: January 1, 2025 &nbsp;·&nbsp; Effective: January 1, 2025
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="mx-auto max-w-3xl">
                    {/* Intro */}
                    <div className="mb-10 rounded-2xl border border-border/60 bg-card p-6">
                        <p className="text-sm leading-7 text-muted-foreground">
                            These Terms of Service (&quot;Terms&quot;) constitute a legally binding
                            agreement between you and CareerBangla (&quot;Company&quot;, &quot;we&quot;,
                            &quot;us&quot;, &quot;our&quot;) governing your access to and use of the
                            CareerBangla platform, including our website, mobile application,
                            and all associated services. If you do not agree to these Terms,
                            do not access or use CareerBangla.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {sections.map((section, idx) => (
                            <div
                                key={section.title}
                                className="rounded-2xl border border-border/60 bg-card overflow-hidden"
                            >
                                <div className="flex items-center gap-3 border-b border-border/40 px-6 py-4">
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${section.bg}`}
                                    >
                                        <section.icon
                                            className={`h-5 w-5 ${section.color}`}
                                        />
                                    </div>
                                    <h2 className="font-bold text-foreground">
                                        {idx + 1}. {section.title}
                                    </h2>
                                </div>
                                <ul className="divide-y divide-border/30">
                                    {section.items.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 px-6 py-3"
                                        >
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                                            <span className="text-sm leading-6 text-muted-foreground">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Governing Law */}
                    <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
                        <h2 className="mb-2 font-bold text-foreground">
                            7. Governing Law & Dispute Resolution
                        </h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            These Terms are governed by the laws of the People&apos;s Republic
                            of Bangladesh. Any disputes arising out of or relating to these
                            Terms shall first be attempted to be resolved through good-faith
                            negotiation. If unresolved, disputes shall be subject to the
                            exclusive jurisdiction of the courts of Dhaka, Bangladesh.
                        </p>
                    </div>

                    {/* Termination */}
                    <div className="mt-4 rounded-2xl border border-border/60 bg-card p-6">
                        <h2 className="mb-2 font-bold text-foreground">
                            8. Termination
                        </h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            CareerBangla reserves the right to suspend or terminate your
                            account and access to services at any time, with or without
                            notice, for conduct that we believe violates these Terms or is
                            harmful to other users, us, third parties, or for any other
                            reason at our discretion. Upon termination, provisions that by
                            their nature should survive will remain in effect.
                        </p>
                    </div>

                    {/* Changes */}
                    <div className="mt-4 rounded-2xl border border-border/60 bg-card p-6">
                        <h2 className="mb-2 font-bold text-foreground">
                            9. Changes to Terms
                        </h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            We reserve the right to modify these Terms at any time. Material
                            changes will be communicated via email or a prominent notice on
                            the platform at least 7 days before they take effect. Continued
                            use of CareerBangla after changes take effect constitutes
                            acceptance of the updated Terms.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="mb-1 font-bold text-foreground">
                                    Questions About These Terms?
                                </h2>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    Contact our legal team at{" "}
                                    <a
                                        href="mailto:legal@careerbangla.com"
                                        className="font-medium text-primary hover:underline"
                                    >
                                        legal@careerbangla.com
                                    </a>{" "}
                                    or visit our{" "}
                                    <Link
                                        href="/contact"
                                        className="font-medium text-primary hover:underline"
                                    >
                                        Contact Page
                                    </Link>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Related links */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                        <Link href="/privacy-policy" className="hover:text-primary hover:underline">
                            Privacy Policy
                        </Link>
                        <span>·</span>
                        <Link href="/help" className="hover:text-primary hover:underline">
                            Help Center
                        </Link>
                        <span>·</span>
                        <Link href="/contact" className="hover:text-primary hover:underline">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
