import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserInfo } from "@/services/auth.services";
import { CheckCircle, Crown, Info } from "lucide-react";
import Link from "next/link";

const PricingPage = async () => {
    const user = await getUserInfo();

    return (
        <div className="container mx-auto py-16 space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Simple, Transparent Pricing</h1>
                <p className="text-xl text-muted-foreground">Choose the perfect plan to accelerate your career. Upgrade to Premium for unlimited access.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
                <Card className="flex flex-col border-2 border-border shadow-sm bg-card hover:border-primary/50 transition-colors">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">Free</CardTitle>
                        <CardDescription>Perfect for getting started</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 text-center py-6">
                        <div className="my-4 mb-8">
                            <span className="text-5xl font-extrabold">&#2547;0</span>
                            <span className="text-muted-foreground">/ forever</span>
                        </div>
                        <ul className="space-y-4 text-left">
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">Basic Profile Builder</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">Apply to Jobs</span>
                            </li>
                            <li className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <Info className="w-5 h-5 text-amber-500 shrink-0" />
                                    <span>Profile Updates Locked at 100%</span>
                                </div>
                                <p className="text-xs text-muted-foreground ml-8">You cannot edit once your profile is fully complete.</p>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Link href={user ? "/dashboard" : "/login"} className="w-full">
                            <Button className="w-full" variant="outline" size="lg">Get Started</Button>
                        </Link>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col border-2 border-primary shadow-lg bg-card relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Crown className="w-4 h-4" /> Most Popular
                    </div>
                    <CardHeader className="text-center pb-2 mt-2">
                        <CardTitle className="text-2xl text-primary">Premium</CardTitle>
                        <CardDescription>Accelerate your job search</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 text-center py-6">
                        <div className="my-4 mb-8">
                            <span className="text-5xl font-extrabold text-primary">From &#2547;500</span>
                        </div>
                        <ul className="space-y-4 text-left font-medium">
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                <span>Download Custom ATS PDF</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                <span>Unlimited Profile Editing</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                <span>Priority Job Applications</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                <span>Premium Support</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Link href={user ? "/dashboard/subscriptions" : "/login"} className="w-full">
                            <Button className="w-full text-md" size="lg">Upgrade Now</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default PricingPage;
