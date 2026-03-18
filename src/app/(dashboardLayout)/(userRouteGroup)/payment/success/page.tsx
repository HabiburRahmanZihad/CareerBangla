import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canAccessRoute, getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const PaymentSuccessPage = async () => {
    const userInfo = await getUserInfo();

    if (!userInfo) {
        redirect("/login");
    }

    if (!canAccessRoute("/payment/success", userInfo.role)) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Your subscription has been activated and coins have been added to your wallet.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button asChild>
                            <Link href="/dashboard/wallet">View Wallet</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentSuccessPage;
