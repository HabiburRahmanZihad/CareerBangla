import { Badge } from "@/components/ui/badge";

/* ── Section banner ────────────────────────────────────────────────────────── */

export const SectionBanner = ({
    title,
    count,
    icon: Icon,
    grad,
    border,
    iconCls,
}: {
    title: string;
    count: number;
    icon: React.ElementType;
    grad: string;
    border: string;
    iconCls: string;
}) => (
    <div
        className={`relative overflow-hidden flex items-center justify-between rounded-xl border p-4 sm:p-5 bg-linear-to-r ${grad} ${border} transition-all duration-300 hover:shadow-md`}
    >
        <div className="pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative flex items-center gap-3 sm:gap-4">
            <div className={`shrink-0 rounded-lg p-2 ${grad}`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${iconCls}`} />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">{title}</h2>
        </div>
        <Badge variant="secondary" className="text-xs sm:text-sm font-semibold shrink-0 ml-2">
            {count} plan{count !== 1 ? "s" : ""}
        </Badge>
    </div>
);
