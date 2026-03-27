import DeviceLimitActions from "@/components/modules/Auth/DeviceLimitActions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

interface DeviceLimitPageProps {
    searchParams: Promise<{ redirect?: string }>;
}

const DeviceLimitPage = async ({ searchParams }: DeviceLimitPageProps) => {
    const userInfo = await getUserInfo();

    if (userInfo) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    const params = await searchParams;
    const redirectPath = params.redirect;

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <Card className="w-full max-w-lg shadow-md">
                <CardHeader>
                    <CardTitle>Multiple Device Login</CardTitle>
                    <CardDescription>
                        You are already logged in on another device.
                        To login now, you must logout from all devices.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Click &quot;Logout all devices & Login&quot; to continue now.
                        Otherwise, click &quot;Cancel&quot; and return to the login page.
                    </p>
                </CardContent>
                <CardFooter>
                    <DeviceLimitActions redirectPath={redirectPath} />
                </CardFooter>
            </Card>
        </div>
    );
};

export default DeviceLimitPage;
