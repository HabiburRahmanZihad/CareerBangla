type SectionHeaderProps = {
    tag: string;
    title: string;
    description?: string;
    center?: boolean;
};

export default function SectionHeader({
    tag,
    title,
    description,
    center = false,
}: SectionHeaderProps) {
    return (
        <div
            className={`mb-10 flex flex-col gap-2.5 ${center ? "mx-auto items-center text-center" : ""}`}
        >
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-primary">
                {tag}
            </span>
            <h2 className="max-w-xl text-2xl font-bold leading-snug text-foreground sm:text-3xl">
                {title}
            </h2>
            {description && (
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {description}
                </p>
            )}
        </div>
    );
}
