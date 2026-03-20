"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { IReferralStats } from "@/services/referral.services";
import { UserInfo } from "@/types/user.types";
import { format } from "date-fns";
import { CheckCircle, Clock, Copy, Gift, HelpCircle, Share2, Trophy, Users } from "lucide-react";
import { toast } from "sonner";

interface ReferralContentProps {
    userInfo?: UserInfo;
    referralStats?: IReferralStats;
}

const ReferralContent = ({ userInfo, referralStats }: ReferralContentProps) => {
    const referralCode = referralStats?.referralCode || userInfo?.referralCode || "N/A";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const referralLink = `${origin}/register?ref=${referralCode}`;

    const totalPaidReferrals = referralStats?.totalPaidReferrals ?? 0;
    const progressToNext = referralStats?.progressToNext ?? 0;
    const rewardsEarned = referralStats?.rewardsEarned ?? 0;
    const progressPercentage = progressToNext * 10;
    const recentReferrals = referralStats?.recentReferrals ?? [];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
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
                copyToClipboard(referralLink);
            }
        } else {
            copyToClipboard(referralLink);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-primary">Refer & Earn Premium</h1>
                <p className="text-lg text-muted-foreground">Invite your friends to CareerBangla and earn free Premium time.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Gift className="w-6 h-6" /> Your Referral Goal
                        </CardTitle>
                        <CardDescription>Refer 10 paying users to get 1 Month FREE Premium.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span>Progress to Next Reward</span>
                                <span className="text-primary">{progressToNext} / 10</span>
                            </div>
                            <Progress value={progressPercentage} className="h-4 w-full" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-card p-4 rounded-xl shadow-sm border text-center">
                                <h4 className="font-bold text-2xl text-card-foreground">{totalPaidReferrals}</h4>
                                <p className="text-xs text-muted-foreground">Successful Referrals</p>
                            </div>
                            <div className="bg-card p-4 rounded-xl shadow-sm border text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    <h4 className="font-bold text-2xl text-card-foreground">{rewardsEarned}</h4>
                                </div>
                                <p className="text-xs text-muted-foreground">Rewards Earned</p>
                            </div>
                        </div>
                        {rewardsEarned > 0 && (
                            <p className="text-sm text-green-600 font-medium text-center">
                                You&apos;ve earned {rewardsEarned * 30} days of free Premium!
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" /> Share Your Code
                        </CardTitle>
                        <CardDescription>Share this code or link with your network.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Your Referral Code</Label>
                            <div className="flex gap-2">
                                <Input readOnly value={referralCode} className="font-mono text-lg font-bold text-center bg-muted" />
                                <Button variant="secondary" onClick={() => copyToClipboard(referralCode)}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Your Referral Link</Label>
                            <div className="flex gap-2">
                                <Input readOnly value={referralLink} className="text-sm bg-muted whitespace-nowrap overflow-hidden text-clip" />
                                <Button variant="secondary" onClick={() => copyToClipboard(referralLink)}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <Button onClick={handleShare} className="w-full" variant="outline">
                            <Share2 className="w-4 h-4 mr-2" /> Share with Friends
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {recentReferrals.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="w-5 h-5" /> Your Referrals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="pb-2 font-medium text-muted-foreground">Name</th>
                                        <th className="pb-2 font-medium text-muted-foreground">Joined</th>
                                        <th className="pb-2 font-medium text-muted-foreground text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentReferrals.map((ref) => (
                                        <tr key={ref.id}>
                                            <td className="py-3 font-medium">{ref.referredUserName}</td>
                                            <td className="py-3 text-muted-foreground">
                                                {format(new Date(ref.createdAt), "MMM d, yyyy")}
                                            </td>
                                            <td className="py-3 text-right">
                                                {ref.hasPaid ? (
                                                    <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-200">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Paid
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        <Clock className="w-3 h-3 mr-1" /> Pending
                                                    </Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <HelpCircle className="w-5 h-5" /> How it works
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <ol className="list-decimal pl-5 space-y-3">
                        <li><strong>Share your code:</strong> Send your unique referral code or link to your friends.</li>
                        <li><strong>Friends sign up & pay:</strong> Your friends must register using your code and purchase any Premium subscription plan.</li>
                        <li><strong>Earn rewards:</strong> For every 10 friends who successfully pay for a subscription, your account is automatically extended with <strong>30 days of free Premium access</strong>!</li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReferralContent;
