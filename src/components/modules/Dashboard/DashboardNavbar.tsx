import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getNavItemsByRole } from "@/lib/navItems"
import { getUserInfo } from "@/services/auth.services"
import { NavSection } from "@/types/dashboard.types"
import { redirect } from "next/navigation"
import DashboardNavbarContent from "./DashboardNavbarContent"

const DashboardNavbar = async () => {
   const userInfo = await getUserInfo()

   if (!userInfo) {
     redirect("/login")
   }

    const navItems : NavSection[] = getNavItemsByRole(userInfo.role)
  
    const dashboardHome = getDefaultDashboardRoute(userInfo.role)
  return (
    <DashboardNavbarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome}/>
  )
}

export default DashboardNavbar