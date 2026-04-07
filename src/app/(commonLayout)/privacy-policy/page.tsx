import Link from "next/link";
import {
    Shield,
    Lock,
    Eye,
    Database,
    Bell,
    Users,
    Globe,
    Mail,
} from "lucide-react";

export const metadata = {
    title: "Privacy Policy | CareerBangla",
    description:
        "Learn how CareerBangla collects, uses, and protects your personal information.",
};

const sections = [
    {
        icon: Database,
        title: "Information We Collect",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10",
        content: [
            {
                subtitle: "Account Information",
                text: "When you register, we collect your name, email address, phone number, and password. Recruiters additionally provide company name, designation, and business contact details.",
            },
            {
                subtitle: "Profile & Resume Data",
                text: "Job seekers may voluntarily provide education history, work experience, skills, certifications, and other resume information to improve job matching.",
            },
            {
                subtitle: "Usage Data",
                text: "We automatically collect information about how you interact with our platform — pages visited, search queries, jobs viewed, applications submitted, and device/browser information.",
            },
            {
                subtitle: "Payment Information",
                text: "Subscription payments are processed securely through Stripe. We do not store your full card details — only a tokenized reference provided by Stripe.",
            },
        ],
    },
    {
        icon: Eye,
        title: "How We Use Your Information",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        content: [
            {
                subtitle: "Service Delivery",
                text: "To operate the platform, match job seekers with relevant opportunities, allow recruiters to find candidates, and process applications and subscriptions.",
            },
            {
                subtitle: "Personalization",
                text: "To recommend relevant jobs, provide personalized dashboards, and improve your experience based on your profile and activity on the platform.",
            },
            {
                subtitle: "Communications",
                text: "To send transactional emails (account verification, password resets, application updates), platform notifications, and — with your consent — marketing updates.",
            },
            {
                subtitle: "Analytics & Improvement",
                text: "To understand usage patterns, identify bugs, measure feature effectiveness, and continuously improve CareerBangla's services.",
            },
        ],
    },
    {
        icon: Users,
        title: "Information Sharing",
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-500/10",
        content: [
            {
                subtitle: "With Recruiters",
                text: "When you apply for a job, your resume and application details are shared with the relevant recruiter. Your profile may also be visible to approved recruiters searching for candidates.",
            },
            {
                subtitle: "Service Providers",
                text: "We share data with trusted third parties who assist in operating our platform — including Stripe (payments), email providers, and cloud hosting — under strict data processing agreements.",
            },
            {
                subtitle: "Legal Requirements",
                text: "We may disclose your information if required by law, court order, or to protect the rights, property, or safety of CareerBangla, its users, or the public.",
            },
            {
                subtitle: "No Selling of Data",
                text: "We do not sell, rent, or trade your personal information to third parties for their marketing purposes.",
            },
        ],
    },
    {
        icon: Lock,
        title: "Data Security",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
        content: [
            {
                subtitle: "Encryption",
                text: "All data transmitted between your browser and our servers is encrypted using TLS (HTTPS). Passwords are hashed using industry-standard algorithms — never stored in plain text.",
            },
            {
                subtitle: "Access Controls",
                text: "Access to personal data is restricted to authorized personnel only, on a need-to-know basis. We conduct regular security reviews and audits.",
            },
            {
                subtitle: "Data Breach Response",
                text: "In the unlikely event of a data breach affecting your personal information, we will notify affected users and relevant authorities in accordance with applicable law.",
            },
        ],
    },
    {
        icon: Bell,
        title: "Your Rights & Choices",
        color: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-500/10",
        content: [
            {
                subtitle: "Access & Correction",
                text: "You can view and update your personal information at any time from your profile settings page.",
            },
            {
                subtitle: "Account Deletion",
                text: "You may request deletion of your account and associated data by contacting our support team. Some data may be retained for legal or legitimate business purposes.",
            },
            {
                subtitle: "Marketing Opt-Out",
                text: "You can opt out of marketing emails at any time by clicking the unsubscribe link in any email or adjusting your notification preferences in settings.",
            },
            {
                subtitle: "Data Portability",
                text: "You may request a copy of your personal data in a structured, machine-readable format by contacting our support team.",
            },
        ],
    },
    {
        icon: Globe,
        title: "Cookies & Tracking",
        color: "text-sky-600 dark:text-sky-400",
        bg: "bg-sky-500/10",
        content: [
            {
                subtitle: "Essential Cookies",
                text: "We use essential cookies to maintain your login session, remember your preferences, and ensure the platform functions correctly. These cannot be disabled.",
            },
            {
                subtitle: "Analytics Cookies",
                text: "We use analytics cookies to understand how users interact with the platform and improve our services. You can opt out via your browser settings.",
            },
        ],
    },
];

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="relative overflow-hidden border-b bg-linear-to-br from-primary/8 via-primary/4 to-background py-16 text-center">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/8 blur-2xl" />
                <div className="relative container mx-auto px-4">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="mb-3 text-4xl font-extrabold tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="mx-auto max-w-xl text-muted-foreground">
                        We are committed to protecting your privacy. This policy explains
                        how CareerBangla collects, uses, and safeguards your personal
                        information.
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
                            This Privacy Policy applies to CareerBangla (&quot;we&quot;, &quot;our&quot;,
                            &quot;us&quot;) and governs data collection and usage for all services
                            available at{" "}
                            <span className="font-medium text-foreground">
                                careerbangla.com
                            </span>
                            . By using CareerBangla, you consent to the data practices
                            described in this policy. If you do not agree, please do not
                            use our services.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-8">
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
                                <div className="divide-y divide-border/40">
                                    {section.content.map((item) => (
                                        <div key={item.subtitle} className="px-6 py-4">
                                            <h3 className="mb-1 text-sm font-semibold text-foreground">
                                                {item.subtitle}
                                            </h3>
                                            <p className="text-sm leading-6 text-muted-foreground">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Children's Privacy */}
                    <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
                        <h2 className="mb-2 font-bold text-foreground">
                            7. Children&apos;s Privacy
                        </h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            CareerBangla is not intended for individuals under the age of
                            18. We do not knowingly collect personal information from
                            minors. If we discover that a minor has provided personal data
                            without parental consent, we will delete it promptly.
                        </p>
                    </div>

                    {/* Changes */}
                    <div className="mt-4 rounded-2xl border border-border/60 bg-card p-6">
                        <h2 className="mb-2 font-bold text-foreground">
                            8. Changes to This Policy
                        </h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            We may update this Privacy Policy from time to time. We will
                            notify you of significant changes by posting a notice on the
                            platform or sending an email. Your continued use of CareerBangla
                            after changes are posted constitutes acceptance of the updated
                            policy.
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
                                    Contact Us
                                </h2>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    If you have questions about this Privacy Policy or wish
                                    to exercise your data rights, please contact our Privacy
                                    team at{" "}
                                    <a
                                        href="mailto:privacy@careerbangla.com"
                                        className="font-medium text-primary hover:underline"
                                    >
                                        privacy@careerbangla.com
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
                        <Link href="/terms-of-service" className="hover:text-primary hover:underline">
                            Terms of Service
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
