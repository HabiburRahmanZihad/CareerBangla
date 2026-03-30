import Image from "next/image";
import Link from "next/link";

interface CareerBanglaLogoProps {
    /** Size variant of the logo */
    size?: "sm" | "md" | "lg" | "xl";
    /** Whether to include text/branding */
    withText?: boolean;
    /** Link destination (defaults to home) */
    href?: string;
    /** Optional CSS class for container */
    className?: string;
    /** Whether to be clickable link or just display */
    isLink?: boolean;
}

export default function CareerBanglaLogo({
    size = "md",
    withText = true,
    href = "/",
    className = "",
    isLink = true,
}: CareerBanglaLogoProps) {
    // Logo dimensions based on size variant
    const dimensions = {
        sm: { width: 32, height: 32, textSize: "text-sm" },
        md: { width: 48, height: 48, textSize: "text-lg" },
        lg: { width: 64, height: 64, textSize: "text-2xl" },
        xl: { width: 80, height: 80, textSize: "text-3xl" },
    };

    const { width, height, textSize } = dimensions[size];

    // Logo image component
    const logoImage = (
        <div className="flex items-center gap-2.5">
            <Image
                src="/carrerBanglalogo.png"
                alt="CareerBangla"
                width={width}
                height={height}
                priority
                className="object-contain"
            />
            {withText && (
                <span className={`font-extrabold tracking-tight text-primary ${textSize}`}>
                    CareerBangla
                </span>
            )}
        </div>
    );

    // Wrap in link if isLink is true
    if (isLink) {
        return (
            <Link href={href} className={`inline-flex items-center gap-2 group ${className}`}>
                {logoImage}
            </Link>
        );
    }

    return <div className={`inline-flex items-center gap-2 ${className}`}>{logoImage}</div>;
}
