export type UserRole = "SUPER_ADMIN" | "ADMIN" | "RECRUITER" | "USER";

export const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => route === pathname);
};

export type RouteConfig = {
    exact: string[];
    pattern: RegExp[];
};

export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/change-password"],
    pattern: [],
};

export const recruiterProtectedRoutes: RouteConfig = {
    pattern: [/^\/recruiter\/dashboard/],
    exact: [],
};

export const adminProtectedRoutes: RouteConfig = {
    pattern: [/^\/admin\/dashboard/],
    exact: [],
};

export const userProtectedRoutes: RouteConfig = {
    pattern: [/^\/dashboard/],
    exact: ["/payment/success"],
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
};

export const getRouteOwner = (pathname: string): "SUPER_ADMIN" | "ADMIN" | "RECRUITER" | "USER" | "COMMON" | null => {
    if (isRouteMatches(pathname, recruiterProtectedRoutes)) {
        return "RECRUITER";
    }

    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }

    if (isRouteMatches(pathname, userProtectedRoutes)) {
        return "USER";
    }

    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
        return "/admin/dashboard";
    }
    if (role === "RECRUITER") {
        return "/recruiter/dashboard";
    }
    if (role === "USER") {
        return "/dashboard";
    }

    return "/";
};

export const isValidRedirectForRole = (redirectPath: string, role: UserRole) => {
    const unifySuperAdminAndAdminRole = role === "SUPER_ADMIN" ? "ADMIN" : role;

    const effectiveRole = unifySuperAdminAndAdminRole;

    const routeOwner = getRouteOwner(redirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    if (routeOwner === effectiveRole) {
        return true;
    }

    return false;
};

/**
 * Validates if a user can access a specific route based on their role
 * SUPER_ADMIN is treated as ADMIN for access control
 */
export const canAccessRoute = (pathname: string, userRole?: UserRole): boolean => {
    if (!userRole) {
        return false;
    }

    const routeOwner = getRouteOwner(pathname);

    // If route has no owner, it's public
    if (routeOwner === null) {
        return true;
    }

    // COMMON routes are accessible to all authenticated users
    if (routeOwner === "COMMON") {
        return true;
    }

    // Normalize SUPER_ADMIN to ADMIN for access control
    const normalizedRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;

    return routeOwner === normalizedRole;
};
