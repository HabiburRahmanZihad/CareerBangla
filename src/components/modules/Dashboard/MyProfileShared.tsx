import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";

// ── Gradient helpers ───────────────────────────────────────────────────────────
export const completionGradient = (n: number) =>
    n >= 80 ? "from-green-500 to-emerald-400"
    : n >= 60 ? "from-blue-500 to-cyan-400"
    : n >= 40 ? "from-yellow-500 to-amber-400"
    : "from-orange-500 to-red-400";

export const completionText = (n: number) =>
    n >= 80 ? "text-green-600 dark:text-green-400"
    : n >= 60 ? "text-blue-600 dark:text-blue-400"
    : n >= 40 ? "text-yellow-600 dark:text-yellow-400"
    : "text-orange-600 dark:text-orange-400";

export const completionColor = (n: number): string =>
    n >= 80 ? "#22c55e" : n >= 60 ? "#3b82f6" : n >= 40 ? "#eab308" : "#f97316";

// ── SectionCard ────────────────────────────────────────────────────────────────
export const SectionCard = ({ icon: Icon, title, count, children }: {
    icon: React.ElementType; title: string;
    count?: number; children: React.ReactNode;
}) => (
    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden relative hover:border-border/60 transition-colors duration-200">
        <div className="absolute left-0 inset-y-0 w-0.75 bg-linear-to-b from-primary to-primary/10" />
        <div className="px-5 py-3.5 border-b border-border/30 flex items-center gap-2.5 bg-muted/10">
            <Icon className="h-4 w-4 text-primary shrink-0" />
            <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
            {count !== undefined && count > 0 && (
                <span className="ml-auto text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{count}</span>
            )}
        </div>
        <div className="p-5">{children}</div>
    </div>
);

// ── InfoItem ───────────────────────────────────────────────────────────────────
export const InfoItem = ({ icon: Icon, label, value, href }: {
    icon: React.ElementType; label: string;
    value?: string | null; href?: string;
}) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2.5 py-2.5 border-b border-border/20 last:border-0">
            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="h-3 w-3 text-primary/80" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</p>
                {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1 break-all mt-0.5">
                        {value} <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                ) : (
                    <p className="text-sm font-medium capitalize break-all mt-0.5">{value}</p>
                )}
            </div>
        </div>
    );
};

// ── TimelineItem ───────────────────────────────────────────────────────────────
export const TimelineItem = ({ title, subtitle, date, dateEnd, bullets, tags }: {
    title: string; subtitle?: string;
    date?: string; dateEnd?: string;
    bullets?: string[]; tags?: string[];
}) => (
    <div className="relative pl-7 pb-6 last:pb-0">
        <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-primary/20" />
        <div className="absolute left-1.5 top-5 bottom-0 w-px bg-linear-to-b from-border/60 to-transparent" />
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 mb-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            {(date || dateEnd) && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full shrink-0">
                    <Clock className="h-2.5 w-2.5" />
                    {date}{dateEnd ? ` — ${dateEnd}` : " — Present"}
                </span>
            )}
        </div>
        {subtitle && <p className="text-xs text-muted-foreground mb-1.5">{subtitle}</p>}
        {bullets && bullets.length > 0 && (
            <ul className="space-y-1 mb-2">
                {bullets.map((b, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary mt-0.5 shrink-0 text-xs">›</span>{b}
                    </li>
                ))}
            </ul>
        )}
        {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
                {tags.map((t, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5">{t}</Badge>
                ))}
            </div>
        )}
    </div>
);
