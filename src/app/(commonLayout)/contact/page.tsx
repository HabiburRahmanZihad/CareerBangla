import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Clock3,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const contactMethods = [
    {
        icon: Mail,
        title: "Email support",
        value: "support@careerbangla.com",
        description: "For general questions, account help, or platform support.",
        tone: "bg-primary/10 text-primary",
    },
    {
        icon: Phone,
        title: "Call us",
        value: "+880 1700-000000",
        description: "For urgent business inquiries during working hours.",
        tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
        icon: MessageSquare,
        title: "Partnerships",
        value: "partners@careerbangla.com",
        description: "For employer onboarding, collaborations, and hiring partnerships.",
        tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
];

const supportTopics = [
    "Job seeker account support",
    "Recruiter onboarding and hiring help",
    "Resume and profile guidance",
    "Partnership and company verification",
];

export default function ContactPage() {
    return (
        <div className="overflow-x-hidden bg-background">
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] border border-border/60 bg-card/85 p-5 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6 lg:p-8">
                        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                            <div className="max-w-3xl">
                                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                                    Contact Us
                                </span>
                                <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                    Reach the CareerBangla team without friction
                                </h1>
                                <p className="mt-5 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                                    Whether you are a job seeker, recruiter, or partner, we want
                                    communication to stay simple. Use the right channel below and we
                                    will route your request quickly.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <Clock3 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">
                                                Support Hours
                                            </p>
                                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                Saturday to Thursday, 10:00 AM to 7:00 PM
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">
                                                Office
                                            </p>
                                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                Dhaka, Bangladesh
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4 shadow-sm sm:p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">
                                                Verified responses
                                            </p>
                                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                We keep communication aligned with official CareerBangla channels only.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-6 md:py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 lg:grid-cols-3">
                        {contactMethods.map((method) => (
                            <div
                                key={method.title}
                                className="rounded-[1.7rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6"
                            >
                                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${method.tone}`}>
                                    <method.icon className="h-5 w-5" />
                                </div>
                                <h2 className="mt-5 text-lg font-black tracking-tight text-foreground">
                                    {method.title}
                                </h2>
                                <p className="mt-2 text-sm font-semibold text-primary">
                                    {method.value}
                                </p>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                    {method.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="rounded-[1.8rem] border border-border/60 bg-card p-6 shadow-sm sm:p-7">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                Common topics
                            </p>
                            <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground">
                                What we can help with
                            </h2>

                            <div className="mt-6 space-y-3">
                                {supportTopics.map((topic) => (
                                    <div
                                        key={topic}
                                        className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80"
                                    >
                                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                        {topic}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[1.8rem] border border-primary/20 bg-slate-950 p-6 text-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)] sm:p-8">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                Quick action
                            </p>
                            <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                                Need help finding the right starting point?
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                                If you are ready to explore roles or create an account first, start
                                from the pages below and come back to us if you need support.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Button size="lg" className="h-12 rounded-full px-7 text-sm font-bold" asChild>
                                    <Link href="/jobs">
                                        Browse Jobs
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-12 rounded-full border-white/10 bg-white/5 px-7 text-sm font-bold text-white hover:bg-white/10"
                                    asChild
                                >
                                    <Link href="/register">Create Account</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
