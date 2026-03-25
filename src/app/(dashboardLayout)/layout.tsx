import DashboardNavbar from "@/components/modules/Dashboard/DashboardNavbar"
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar"
import { LogoutAndRedirect } from "@/components/shared/LogoutAndRedirect"
import { getUserInfo } from "@/services/auth.services"
import React from "react"

const RootDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const userInfo = await getUserInfo()

    if (!userInfo) {
        // User not found (deleted or invalid session)
        // Render client component to clear cookies and redirect
        return <LogoutAndRedirect />
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Dashboard Sidebar */}
            <DashboardSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* DashboardNavbar */}
                <DashboardNavbar />
                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
                    <div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default RootDashboardLayout