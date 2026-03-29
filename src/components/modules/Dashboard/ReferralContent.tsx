"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IReferralStats } from "@/services/referral.services";
import { UserInfo } from "@/types/user.types";
import { format } from "date-fns";
import {
    Check,
    CheckCircle,
    Clock,
    Copy,
    Gift,
    Share2,
    Sparkles,
    TrendingUp,
    Trophy,
    Users
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReferralContentProps {
    userInfo?: UserInfo;
    referralStats?: IReferralStats;
}

const ReferralContent = ({ userInfo, referralStats }: ReferralContentProps) => {
    const referralCode = referralStats?.referralCode || userInfo?.referralCode || "N/A";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const referralLink = `${origin}/register?ref=${referralCode}`;

    const totalReferrals = referralStats?.totalReferrals ?? 0;
    const totalPaidReferrals = referralStats?.totalPaidReferrals ?? 0;
    const progressToNext = referralStats?.progressToNext ?? 0;
    const rewardsEarned = referralStats?.rewardsEarned ?? 0;
    const progressPercentage = (progressToNext / 10) * 100;
    const recentReferrals = referralStats?.recentReferrals ?? [];

    const [isCopiedCode, setIsCopiedCode] = useState(false);
    const [isCopiedLink, setIsCopiedLink] = useState(false);

    const copyToClipboard = (text: string, type: 'code' | 'link') => {
        navigator.clipboard.writeText(text);
        if (type === 'code') {
            setIsCopiedCode(true);
            setTimeout(() => setIsCopiedCode(false), 2000);
        } else {
            setIsCopiedLink(true);
            setTimeout(() => setIsCopiedLink(false), 2000);
        }
        toast.success("Copied to clipboard!");
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Join CareerBangla",
                    text: `Sign up on CareerBangla using my referral code: ${referralCode}`,
                    url: referralLink,
                });
            } catch {
                copyToClipboard(referralLink, 'link');
            }
        } else {
            copyToClipboard(referralLink, 'link');
        }
    };

    return (
        <div className="mx-auto space-y-8 pb-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary to-primary/70 text-primary-foreground p-8 md:p-12 shadow-xl border border-primary/20">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white/10 blur-3xl opacity-50" />

                <div className="relative z-10 max-w-2xl space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-sm font-medium">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span>Premium Referral Program</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                        Invite Friends, <br />
                        <span className="text-yellow-300">Earn Free Career Boost!</span>
                    </h1>
                    <p className="text-primary-foreground/90 text-sm sm:text-base md:text-lg max-w-xl">
                        Supercharge your network and your career. For every 10 paid friends who join using your code, you earn <strong>30 days of premium access</strong> absolutely free.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-border/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Referrals</p>
                                <p className="text-4xl font-extrabold text-foreground">{totalReferrals}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Paid Referrals</p>
                                <p className="text-4xl font-extrabold text-foreground">{totalPaidReferrals}</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-yellow-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Rewards Earned</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-4xl font-extrabold text-foreground">{rewardsEarned}</p>
                                    <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-400 px-2.5 py-1 rounded-md">
                                        x 30 Days
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                                <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Central Action Area */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Share Section */}
                <Card className="lg:col-span-3 border-border/50 shadow-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Share2 className="w-6 h-6 text-primary" /> Share Your Link
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            Copy your code or link below. Send it in a message, post it on your timeline, or share it however you like!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1">

                        {/* Referral Link */}
                        <div className="space-y-3">
                            <Label className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Your Unique Link</Label>
                            <div className="flex sm:flex-row flex-col gap-3">
                                <div className="relative flex-1 group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-hover:text-primary transition-colors">
                                        <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <Input
                                        readOnly
                                        value={referralLink}
                                        className="pl-10 h-12 bg-muted/50 border-muted-foreground/20 font-medium text-foreground text-sm xl:text-base cursor-pointer focus-visible:ring-1 transition-all hover:bg-muted/80"
                                        onClick={() => copyToClipboard(referralLink, 'link')}
                                    />
                                </div>
                                <Button
                                    onClick={() => copyToClipboard(referralLink, 'link')}
                                    className="h-12 px-6 shadow-sm whitespace-nowrap"
                                    variant={isCopiedLink ? "secondary" : "default"}
                                >
                                    {isCopiedLink ? (
                                        <><Check className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" /> Copied!</>
                                    ) : (
                                        <><Copy className="w-4 h-4 mr-2" /> Copy Link</>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground py-1">
                            <div className="h-px bg-border flex-1"></div>
                            <span className="font-medium text-xs uppercase tracking-widest">OR</span>
                            <div className="h-px bg-border flex-1"></div>
                        </div>

                        {/* Referral Code */}
                        <div className="space-y-3">
                            <Label className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Your Referral Code</Label>
                            <div className="flex sm:flex-row flex-col gap-3">
                                <Input
                                    readOnly
                                    value={referralCode}
                                    className="h-12 bg-muted/50 border-muted-foreground/20 font-mono text-center text-lg sm:text-xl font-bold tracking-widest cursor-pointer focus-visible:ring-1 transition-all hover:bg-muted/80 flex-1"
                                    onClick={() => copyToClipboard(referralCode, 'code')}
                                />
                                <Button
                                    variant={isCopiedCode ? "secondary" : "outline"}
                                    onClick={() => copyToClipboard(referralCode, 'code')}
                                    className="h-12 px-6 sm:w-36 shadow-sm shrink-0"
                                >
                                    {isCopiedCode ? (
                                        <><Check className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" /> Copied!</>
                                    ) : "Copy Code"}
                                </Button>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="bg-muted/30 pt-6">
                        <Button onClick={handleShare} className="w-full h-12 bg-primary text-white border-0 shadow-md">
                            <Share2 className="w-5 h-5 mr-2" /> Share via your Device
                        </Button>
                    </CardFooter>
                </Card>

                {/* Progress Section */}
                <Card className="lg:col-span-2 border-border/50 shadow-sm bg-linear-to-b from-card to-primary/5 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-80" />

                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Gift className="w-5 h-5 text-primary" /> Goal Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center space-y-8 z-10 pb-6">

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Next Reward In</p>
                                    <p className="text-3xl font-extrabold mt-1 tracking-tight">
                                        <span className="text-primary">{progressToNext}</span>
                                        <span className="text-muted-foreground text-xl font-semibold"> / 10</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-muted-foreground">Completion</p>
                                    <p className="text-xl font-bold">{progressPercentage}%</p>
                                </div>
                            </div>

                            <div className="relative pt-2">
                                <Progress value={progressPercentage} className="h-4 w-full rounded-full bg-muted shadow-inner" />
                            </div>

                            <p className="text-sm leading-relaxed text-muted-foreground text-center pt-2">
                                Just <strong>{10 - progressToNext} more</strong> paid referral{10 - progressToNext !== 1 ? 's' : ''} to unlock your next 30 days of Career Boost! 🚀
                            </p>
                        </div>

                    </CardContent>
                    {rewardsEarned > 0 && (
                        <div className="px-6 pb-6 mt-auto z-10">
                            <div className="bg-linear-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                                <div className="bg-green-500 text-white p-2.5 rounded-full shrink-0 shadow-sm shadow-green-500/20">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-green-700 dark:text-green-400 leading-tight">Awesome work!</p>
                                    <p className="text-xs text-green-700/80 dark:text-green-400/80 mt-0.5 font-medium">You&apos;ve unlocked {rewardsEarned * 30} days of Free Boost.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* How it Works */}
            <div className="space-y-5">
                <h3 className="text-xl font-bold px-1 text-foreground">How it Works</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden sm:block absolute top-11 left-[15%] right-[15%] h-0.5 bg-border/60 z-0"></div>

                    {[
                        { step: 1, title: "Share Your Link", desc: "Send your unique referral link or code to friends.", icon: Share2 },
                        { step: 2, title: "Friends Upgrade", desc: "They register using your code and buy Career Boost.", icon: Users },
                        { step: 3, title: "Earn Premium", desc: "Every 10 successful upgrades gets you 30 free days!", icon: Trophy },
                    ].map((item, index) => (
                        <Card key={index} className="border-border/50 bg-card shadow-sm relative z-10 hover:-translate-y-1 transition-transform duration-300">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-background border border-border shadow-sm rounded-2xl flex items-center justify-center relative">
                                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center border-2 border-background">
                                        {item.step}
                                    </div>
                                    <item.icon className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground mb-1.5">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recent Referrals List */}
            {recentReferrals.length > 0 && (
                <div className="space-y-5 pt-4">
                    <h3 className="text-xl font-bold px-1 flex items-center gap-2 text-foreground">
                        <Users className="w-5 h-5" /> Recent Activity
                    </h3>
                    <Card className="border-border/50 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="hover:bg-transparent border-border/50">
                                        <TableHead className="font-semibold text-muted-foreground w-[40%]">Referred User</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">Date Joined</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground text-right pr-6">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentReferrals.map((ref) => (
                                        <TableRow key={ref.id} className="hover:bg-muted/30 border-border/50 transition-colors">
                                            <TableCell className="font-medium h-14">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                        {ref.referredUserName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="truncate max-w-37.5 sm:max-w-none">{ref.referredUserName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm font-medium">
                                                {format(new Date(ref.createdAt), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                {ref.hasPaid ? (
                                                    <Badge className="bg-green-100 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:hover:bg-green-500/20 dark:text-green-400 dark:border-green-500/20 py-0.5 px-2.5 font-medium rounded-full shadow-none inline-flex items-center gap-1.5 transition-colors">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Paid
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="py-0.5 px-2.5 font-medium rounded-full text-muted-foreground bg-muted/80 hover:bg-muted inline-flex items-center gap-1.5 transition-colors shadow-none">
                                                        <Clock className="w-3.5 h-3.5" /> Pending
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ReferralContent;
