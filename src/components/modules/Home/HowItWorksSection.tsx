import SectionHeader from "@/components/modules/Home/SectionHeader";
import {
    Briefcase,
    CheckCircle2,
    Clock3,
    Search,
    UserPlus,
} from "lucide-react";

const howItWorks = [
    {
        step: "01",
        icon: UserPlus,
        title: "Create a Strong Profile",
        description:
            "Start with your account, build an ATS-ready resume, and set up the skills and details that make matching more accurate from the beginning.",
        support: "Resume builder and profile completion guidance",
        accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        border: "hover:border-blue-200 dark:hover:border-blue-900/60",
    },
    {
        step: "02",
        icon: Search,
        title: "Discover Relevant Roles",
        description:
            "Browse verified job listings by role, salary, company, and location so you spend less time filtering noise and more time targeting the right openings.",
        support: "Verified listings with sharper filtering",
        accent: "bg-primary/10 text-primary",
        border: "hover:border-primary/30",
    },
    {
        step: "03",
        icon: CheckCircle2,
        title: "Apply and Track Progress",
        description:
            "Submit faster, monitor your application status, and move through the hiring journey with better visibility instead of guessing what happens next.",
        support: "One workflow from apply to hiring update",
        accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        border: "hover:border-emerald-200 dark:hover:border-emerald-900/60",
    },
];

const processSignals = [
    { label: "Simple steps", value: "3" },
    { label: "Main dashboard", value: "1" },
    { label: "Tracking status", value: "Live" },
];

const workflowNotes = [
    {
        icon: Briefcase,
        title: "Less friction",
        text: "Everything important stays inside one job workflow.",
        tone: "text-primary",
    },
    {
        icon: Clock3,
        title: "Faster momentum",
        text: "Users can move from setup to application quickly.",
        tone: "text-blue-600 dark:text-blue-400",
    },
];

export default function HowItWorksSection() {
    return (
        <section className="bg-background py-16 md:py-24">
            <div className="container mx-auto  px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
                    <div className="glass-strong glass-shadow rounded-[2rem] border border-border/60 p-6 sm:p-7 lg:p-8">
                        <SectionHeader
                            tag="Process"
                            title="Get Hired in 3 Clear Steps"
                            description="CareerBangla removes the usual mess from job hunting. The flow is designed so candidates can set up, discover opportunities, and apply without jumping between scattered tools."
                        />

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {processSignals.map((signal) => (
                                <div
                                    key={signal.label}
                                    className="rounded-2xl border border-border/50 bg-card p-4 text-center"
                                >
                                    <p className="text-2xl font-black tracking-tight text-foreground">
                                        {signal.value}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                        {signal.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 space-y-3">
                            {workflowNotes.map((note) => (
                                <div
                                    key={note.title}
                                    className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/70 p-4"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background">
                                        <note.icon className={`h-5 w-5 ${note.tone}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground">
                                            {note.title}
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            {note.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-[1.75rem] border border-border/60 bg-card p-4 sm:p-5">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                Process promise
                            </p>
                            <p className="mt-2 text-base font-bold text-foreground">
                                A hiring flow that feels guided, not chaotic
                            </p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Every step is built to reduce decision fatigue and keep users moving
                                forward with more clarity.
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute bottom-10 left-7 top-10 hidden w-px bg-border sm:block" />

                        <div className="space-y-4 sm:space-y-5">
                            {howItWorks.map((step) => (
                                <article
                                    key={step.step}
                                    className="group relative flex gap-4 sm:gap-5"
                                >
                                    <div className="relative z-10 flex shrink-0 flex-col items-center">
                                        <div
                                            className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-background shadow-sm transition-transform duration-300 group-hover:scale-105 ${step.accent}`}
                                        >
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <div className="mt-3 rounded-full border border-border/60 bg-background px-3 py-1 text-[11px] font-black tracking-[0.18em] text-muted-foreground">
                                            {step.step}
                                        </div>
                                    </div>

                                    <div className={`flex-1 rounded-[1.9rem] border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl sm:p-6 ${step.border}`}>
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="max-w-xl">
                                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                                                    Step {step.step}
                                                </p>
                                                <h3 className="mt-1 text-lg font-black tracking-tight text-foreground sm:text-xl">
                                                    {step.title}
                                                </h3>
                                                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                                    {step.description}
                                                </p>
                                            </div>
                                            <div className="inline-flex w-fit rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80">
                                                Clear workflow
                                            </div>
                                        </div>

                                        <div className="mt-5 flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                                {step.support}
                                            </div>
                                            <div className="text-xs font-medium text-muted-foreground">
                                                Built to keep users moving forward
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
