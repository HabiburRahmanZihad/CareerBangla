import Image from "next/image";
import Link from "next/link";

const footerLinks = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: "About Us", href: "/about-us" },
    { label: "Resources", href: "/career-resources" },
    { label: "Contact", href: "/contact" },
];

const Footer = () => {
    return (
        <footer className="border-t border-border/70 bg-background">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-5 rounded-[1.75rem] border border-border/70 bg-card px-5 py-8 text-center shadow-sm">
                    <Link href="/" className="inline-flex items-center">
                        <Image
                            src="/carrerBanglalogo.png"
                            alt="CareerBangla"
                            width={158}
                            height={48}
                            priority
                            className="object-contain"
                        />
                    </Link>

                    <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                        CareerBangla helps professionals discover jobs and connect with trusted employers in Bangladesh.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="w-full border-t border-border/70 pt-4 text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} CareerBangla. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
