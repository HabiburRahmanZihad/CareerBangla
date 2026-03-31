"use server";

import { canAccessRoute, getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

/**
 * Helper function to protect pages with authentication and role-based access control
 * @param routePath - The current route path (e.g., "/admin/dashboard")
 * @param options - Optional configuration
 * @returns User info if authenticated and authorized, otherwise redirects
 */
export async function protectPage(
    routePath: string,
    options?: {
        redirectUnauth?: string;
    }
) {
    const userInfo = await getUserInfo();

    // No user - redirect to login
    if (!userInfo) {
        redirect(options?.redirectUnauth || "/login");
    }

    // User lacks permission for this route
    if (!canAccessRoute(routePath, userInfo.role)) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    return userInfo;
}

/**
 * Validate user role for a specific route
 * @param requiredRole - The required role (e.g., "ADMIN", "RECRUITER", "USER")
 * @returns User info if authenticated and has required role, otherwise redirects
 */
export async function protectPageByRole(
    requiredRole: "ADMIN" | "RECRUITER" | "USER" | "SUPER_ADMIN"
) {
    const userInfo = await getUserInfo();

    if (!userInfo) {
        redirect("/login");
    }

    if (requiredRole === "SUPER_ADMIN") {
        if (userInfo.role !== "SUPER_ADMIN") {
            redirect(getDefaultDashboardRoute(userInfo.role));
        }

        return userInfo;
    }

    // Normalize SUPER_ADMIN to ADMIN
    const normalizedUserRole = userInfo.role === "SUPER_ADMIN" ? "ADMIN" : userInfo.role;
    const normalizedRequiredRole = requiredRole === "SUPER_ADMIN" ? "ADMIN" : requiredRole;

    if (normalizedUserRole !== normalizedRequiredRole) {
        redirect(getDefaultDashboardRoute(userInfo.role));
    }

    return userInfo;
}
