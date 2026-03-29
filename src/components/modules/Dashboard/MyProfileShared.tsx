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

// ── SectionCard ────────────────────────────────────────────────────────────────
export const SectionCard = ({ icon: Icon, title, count, children }: {
    icon: React.ElementType; title: string;
    count?: number; children: React.ReactNode;
}) => (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold">{title}</h3>
            {count !== undefined && count > 0 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 ml-auto">{count}</Badge>
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
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1 break-all">
                        {value} <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                ) : (
                    <p className="text-sm font-medium break-all capitalize">{value}</p>
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
    <div className="relative pl-6 pb-5 last:pb-0">
        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary/20 border-2 border-primary/40" />
        <div className="absolute left-1.25 top-4 bottom-0 w-px bg-border last:hidden" />
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 mb-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            {(date || dateEnd) && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="h-3 w-3" />
                    {date}{dateEnd ? ` — ${dateEnd}` : " — Present"}
                </span>
            )}
        </div>
        {subtitle && <p className="text-xs text-muted-foreground mb-1.5">{subtitle}</p>}
        {bullets && bullets.length > 0 && (
            <ul className="space-y-1 mb-2">
                {bullets.map((b, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary mt-1 shrink-0">•</span>{b}
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
