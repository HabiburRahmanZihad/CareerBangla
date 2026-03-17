import { Briefcase } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-3">
                        <Link href="/" className="flex items-center gap-2">
                            <Briefcase className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold text-primary">CareerBangla</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Your trusted job portal platform in Bangladesh. Connect with top recruiters and find your dream career.
                        </p>
                    </div>

                    {/* Job Seekers */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">For Job Seekers</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
                            <li><Link href="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
                            <li><Link href="/dashboard/my-resume" className="hover:text-primary transition-colors">Build Resume</Link></li>
                        </ul>
                    </div>

                    {/* Recruiters */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">For Recruiters</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/register" className="hover:text-primary transition-colors">Post a Job</Link></li>
                            <li><Link href="/register" className="hover:text-primary transition-colors">Search Candidates</Link></li>
                            <li><Link href="/register" className="hover:text-primary transition-colors">Subscription Plans</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} CareerBangla. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
