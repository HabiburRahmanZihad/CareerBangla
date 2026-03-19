"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Copy, Gift, HelpCircle, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { UserInfo } from "@/types/user.types";
import { Label } from "@/components/ui/label";

interface ReferralContentProps {
    userInfo?: UserInfo;
}

const ReferralContent = ({ userInfo }: ReferralContentProps) => {

    const referralCode = userInfo?.referralCode || "N/A";
    const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
    const paidReferrals = 0; // The backend isn't returning this right now in my-profile, but ideally we'd pass it. We'll default to 0 for the UI demo.
    const progressPercentage = (paidReferrals % 10) * 10;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
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
                                <span>Referrals Progress</span>
                                <span className="text-primary">{paidReferrals % 10} / 10</span>
                            </div>
                            <Progress value={progressPercentage} className="h-4 w-full" />
                        </div>
                        <div className="bg-card p-4 rounded-xl shadow-sm border text-center">
                            <h4 className="font-bold text-2xl text-card-foreground">{paidReferrals}</h4>
                            <p className="text-sm text-muted-foreground">Total Successful Referrals</p>
                        </div>
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
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
