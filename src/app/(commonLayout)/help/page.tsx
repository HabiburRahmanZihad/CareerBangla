"use client";

import {
    Bot,
    Briefcase,
    ChevronDown,
    ChevronUp,
    CreditCard,
    FileText,
    HelpCircle,
    Mail,
    MessageSquare,
    Phone,
    Search,
    Shield,
    UserCheck,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const FAQ_CATEGORIES = [
    {
        id: "job-seekers",
        icon: Briefcase,
        label: "Job Seekers",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10",
        faqs: [
            {
                q: "How do I create a job seeker account?",
                a: 'Click "Join Now" in the top navigation, fill in your name, email, and password, then verify your email address. Once verified, you can complete your profile and start applying for jobs.',
            },
            {
                q: "How do I apply for a job?",
                a: 'Browse jobs at /jobs or search for specific roles. Click on a job card to view details, then click "Apply Now". Your saved resume is automatically attached. You can track your applications in My Applications dashboard.',
            },
            {
                q: "What is the ATS score feature?",
                a: "ATS (Applicant Tracking System) score checks how well your resume matches standard hiring software used by companies. Go to Dashboard → ATS Score, paste a job description, and get a compatibility score with improvement suggestions.",
            },
            {
                q: "How do I build my resume on CareerBangla?",
                a: "Navigate to Dashboard → My Resume. You can add your education, work experience, skills, certifications, and projects. The platform generates a professional PDF resume you can download and use anywhere.",
            },
            {
                q: "Can I apply for jobs without a subscription?",
                a: "Yes! Basic job applications are free. Premium subscription plans unlock additional benefits like priority visibility to recruiters, advanced ATS analysis, and more application slots per month.",
            },
            {
                q: "How does the referral program work?",
                a: "Share your unique referral link from Dashboard → Referrals. When a friend registers and subscribes using your link, both of you earn rewards. Rewards can be applied as discounts on subscription plans.",
            },
        ],
    },
    {
        id: "recruiters",
        icon: UserCheck,
        label: "Recruiters",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        faqs: [
            {
                q: "How do I register as a recruiter?",
                a: 'Click "Join Now" and select "Register as Recruiter". Provide your company name, designation, and contact details. Your account will be reviewed by our admin team and approved within 1-2 business days.',
            },
            {
                q: "Why is my recruiter account pending approval?",
                a: "All recruiter accounts go through a verification process to ensure legitimate companies are using the platform. Our team reviews your company information and approves accounts within 1-2 business days.",
            },
            {
                q: "How do I post a job?",
                a: "From your Recruiter Dashboard, click \"Post a Job\". Fill in the job title, description, requirements, location, salary range, and job type. Submit for admin approval — once approved, your job goes live.",
            },
            {
                q: "How do I search for candidates?",
                a: "Use Recruiter Dashboard → Search Candidates. Filter by skills, experience level, education, or location. Upgrade to a premium plan for unlimited candidate searches and direct contact options.",
            },
            {
                q: "Why was my job rejected?",
                a: "Jobs may be rejected if they violate our content policies, contain misleading information, or don't meet our quality standards. You'll receive a rejection reason — edit your job listing and resubmit for review.",
            },
            {
                q: "How do I manage job applications?",
                a: "Go to Recruiter Dashboard → Applications. You can view all applicants for your jobs, download their resumes, and update application statuses to track your hiring pipeline.",
            },
        ],
    },
    {
        id: "subscriptions",
        icon: CreditCard,
        label: "Subscriptions & Billing",
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-500/10",
        faqs: [
            {
                q: "What payment methods are accepted?",
                a: "We accept all major credit and debit cards (Visa, Mastercard, Amex) via Stripe's secure payment gateway. We're working on adding bKash and Nagad support for local payments.",
            },
            {
                q: "Can I cancel my subscription?",
                a: "Yes, you can cancel anytime from Dashboard → Subscriptions. Your access continues until the end of the current billing period. We do not offer refunds for partial months.",
            },
            {
                q: "Do you offer a free trial?",
                a: "We offer a free tier with core features. Some premium plans may include a trial period — check the Pricing page for current offers.",
            },
            {
                q: "How do coupon codes work?",
                a: "Enter a valid coupon code during checkout to receive a discount. Coupons may provide percentage or fixed amount discounts and are subject to expiry dates and usage limits.",
            },
            {
                q: "My payment failed — what do I do?",
                a: "Check that your card details are correct and that sufficient funds are available. Try a different card if the issue persists. Contact support@careerbangla.com if you continue to experience payment issues.",
            },
        ],
    },
    {
        id: "account",
        icon: Shield,
        label: "Account & Security",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
        faqs: [
            {
                q: "How do I reset my password?",
                a: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a reset link. The link expires after 1 hour for security.',
            },
            {
                q: "How do I verify my email address?",
                a: "After registration, check your inbox for a verification email. Click the link inside to verify. If you didn't receive it, go to the login page and request a new verification email.",
            },
            {
                q: "What is device management?",
                a: "CareerBangla limits simultaneous logins for account security. From Dashboard → Devices, you can see all logged-in devices and remotely log out from any you don't recognize.",
            },
            {
                q: "How do I delete my account?",
                a: "Contact support@careerbangla.com with your account deletion request. We'll process it within 7 business days. Note that some data may be retained for legal compliance purposes.",
            },
            {
                q: "I can't log in — what should I do?",
                a: "Try resetting your password. Ensure your email is verified. Check if you've exceeded device login limits (Dashboard → Devices). Contact support if the issue persists.",
            },
        ],
    },
    {
        id: "technical",
        icon: Zap,
        label: "Technical Issues",
        color: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-500/10",
        faqs: [
            {
                q: "The site is not loading properly. What should I do?",
                a: "Try refreshing the page, clearing your browser cache, or using a different browser. Ensure your internet connection is stable. If the issue persists, it may be a temporary service disruption — check back in a few minutes.",
            },
            {
                q: "My resume PDF download is not working.",
                a: "Ensure your browser allows popups from CareerBangla. Try using Chrome or Firefox. If the download starts but the PDF is blank, ensure your profile sections are filled out completely.",
            },
            {
                q: "I'm not receiving email notifications.",
                a: "Check your spam/junk folder. Add support@careerbangla.com to your contacts. Verify your notification preferences in Dashboard → Notifications. Ensure your email address is verified.",
            },
        ],
    },
    {
        id: "resume",
        icon: FileText,
        label: "Resume & Profile",
        color: "text-sky-600 dark:text-sky-400",
        bg: "bg-sky-500/10",
        faqs: [
            {
                q: "How do I make my profile visible to recruiters?",
                a: "Complete your profile — add work experience, education, skills, and a professional photo. A complete profile (80%+) is significantly more likely to be found by recruiters in candidate searches.",
            },
            {
                q: "Can I have multiple resumes?",
                a: "Currently CareerBangla supports one active resume per account. You can update your resume at any time. We recommend tailoring your profile to the type of jobs you're targeting.",
            },
            {
                q: "How do I improve my ATS score?",
                a: "Use keywords from the job description in your resume. Ensure your experience descriptions are clear and quantified. Avoid complex tables or graphics. Use standard section headings like Experience, Education, Skills.",
            },
        ],
    },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-border/40 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-muted/30"
            >
                <span className="text-sm font-medium text-foreground">{faq.q}</span>
                {open ? (
                    <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                    <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
            </button>
            {open && (
                <div className="px-6 pb-4">
                    <p className="text-sm leading-6 text-muted-foreground">{faq.a}</p>
                </div>
            )}
        </div>
    );
}

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("job-seekers");

    const filteredFAQs = searchQuery.trim()
        ? FAQ_CATEGORIES.flatMap((cat) =>
            cat.faqs
                .filter(
                    (faq) =>
                        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((faq) => ({ ...faq, categoryLabel: cat.label }))
        )
        : null;

    const activeData = FAQ_CATEGORIES.find((c) => c.id === activeCategory);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="relative overflow-hidden border-b bg-linear-to-br from-primary/8 via-primary/4 to-background py-16 text-center">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/8 blur-2xl" />
                <div className="relative container mx-auto px-4">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                        <HelpCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="mb-3 text-4xl font-extrabold tracking-tight">
                        Help Center
                    </h1>
                    <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
                        Find answers to common questions. Can&apos;t find what you&apos;re looking
                        for? Our AI Career Assistant or support team is here to help.
                    </p>

                    {/* Search */}
                    <div className="mx-auto max-w-lg">
                        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm backdrop-blur-md focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search help articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Search results */}
                {filteredFAQs !== null ? (
                    <div className="mx-auto max-w-3xl">
                        <p className="mb-4 text-sm text-muted-foreground">
                            {filteredFAQs.length} result{filteredFAQs.length !== 1 ? "s" : ""}{" "}
                            for &quot;{searchQuery}&quot;
                        </p>
                        {filteredFAQs.length === 0 ? (
                            <div className="rounded-2xl border border-border/60 bg-card p-10 text-center">
                                <HelpCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                                <p className="font-medium text-foreground">No results found</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Try a different search term or contact our support team.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
                                {filteredFAQs.map((faq, i) => (
                                    <div key={i}>
                                        <div className="border-b border-border/40 bg-muted/20 px-6 py-2">
                                            <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                                                {faq.categoryLabel}
                                            </span>
                                        </div>
                                        <FAQItem faq={faq} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mx-auto max-w-5xl">
                        <div className="flex flex-col gap-6 lg:flex-row">
                            {/* Category sidebar */}
                            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible lg:w-56 shrink-0 pb-2 lg:pb-0">
                                {FAQ_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors text-left ${activeCategory === cat.id
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                    >
                                        <div
                                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${activeCategory === cat.id
                                                    ? "bg-white/20"
                                                    : cat.bg
                                                }`}
                                        >
                                            <cat.icon
                                                className={`h-4 w-4 ${activeCategory === cat.id
                                                        ? "text-primary-foreground"
                                                        : cat.color
                                                    }`}
                                            />
                                        </div>
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* FAQ list */}
                            <div className="flex-1">
                                {activeData && (
                                    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
                                        <div className="flex items-center gap-3 border-b border-border/40 px-6 py-4">
                                            <div
                                                className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeData.bg}`}
                                            >
                                                <activeData.icon
                                                    className={`h-5 w-5 ${activeData.color}`}
                                                />
                                            </div>
                                            <h2 className="font-bold text-foreground">
                                                {activeData.label}
                                            </h2>
                                            <span className="ml-auto text-xs text-muted-foreground">
                                                {activeData.faqs.length} articles
                                            </span>
                                        </div>
                                        {activeData.faqs.map((faq, i) => (
                                            <FAQItem key={i} faq={faq} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Still need help? */}
                <div className="mx-auto mt-12 max-w-3xl">
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
                        <h2 className="mb-2 text-xl font-bold text-foreground">
                            Still need help?
                        </h2>
                        <p className="mb-6 text-sm text-muted-foreground">
                            Our support team and AI assistant are ready to help you.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/contact"
                                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                            >
                                <Mail className="h-4 w-4" /> Email Support
                            </Link>
                            <a
                                href="tel:+8801700000000"
                                className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                            >
                                <Phone className="h-4 w-4" /> Call Us
                            </a>
                            <button
                                onClick={() => {
                                    // Trigger chatbot open - dispatching a custom event
                                    window.dispatchEvent(new CustomEvent("open-careerbот"));
                                }}
                                className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                            >
                                <Bot className="h-4 w-4" /> Chat with CareerBot
                            </button>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" /> Avg. response time: 4 hours
                            </span>
                            <span>·</span>
                            <span>Support hours: Sat–Thu, 10 AM–7 PM (BST)</span>
                        </div>
                    </div>
                </div>

                {/* Quick links */}
                <div className="mx-auto mt-8 max-w-3xl">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                        <Link href="/privacy-policy" className="hover:text-primary hover:underline">
                            Privacy Policy
                        </Link>
                        <span>·</span>
                        <Link href="/terms-of-service" className="hover:text-primary hover:underline">
                            Terms of Service
                        </Link>
                        <span>·</span>
                        <Link href="/contact" className="hover:text-primary hover:underline">
                            Contact Us
                        </Link>
                        <span>·</span>
                        <Link href="/jobs" className="hover:text-primary hover:underline">
                            Browse Jobs
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
