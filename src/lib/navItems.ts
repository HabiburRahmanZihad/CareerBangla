import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            items: [
                {
                    title: "Home",
                    href: "/",
                    icon: "Home",
                },
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard",
                },
                {
                    title: "My Profile",
                    href: "/my-profile",
                    icon: "User",
                },
            ],
        },
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/change-password",
                    icon: "Settings",
                },
            ],
        },
    ];
};

export const recruiterNavItems: NavSection[] = [
    {
        title: "Job Management",
        items: [
            {
                title: "My Jobs",
                href: "/recruiter/dashboard/my-jobs",
                icon: "Briefcase",
            },
            {
                title: "Post a Job",
                href: "/recruiter/dashboard/post-job",
                icon: "PlusCircle",
            },
            {
                title: "Applications",
                href: "/recruiter/dashboard/applications",
                icon: "FileText",
            },
            {
                title: "Search Candidates",
                href: "/recruiter/dashboard/search-candidates",
                icon: "Search",
            },
        ],
    },
    {
        title: "Account",
        items: [
            {
                title: "Wallet",
                href: "/recruiter/dashboard/wallet",
                icon: "Wallet",
            },
            {
                title: "Subscriptions",
                href: "/recruiter/dashboard/subscriptions",
                icon: "CreditCard",
            },
        ],
    },
];

export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [
            {
                title: "Admins",
                href: "/admin/dashboard/admins-management",
                icon: "Shield",
            },
            {
                title: "Recruiters",
                href: "/admin/dashboard/recruiters-management",
                icon: "Building2",
            },
            {
                title: "Users",
                href: "/admin/dashboard/users-management",
                icon: "Users",
            },
        ],
    },
    {
        title: "Platform Management",
        items: [
            {
                title: "Jobs",
                href: "/admin/dashboard/jobs-management",
                icon: "Briefcase",
            },
            {
                title: "Applications",
                href: "/admin/dashboard/applications-management",
                icon: "FileText",
            },
            {
                title: "Job Categories",
                href: "/admin/dashboard/categories-management",
                icon: "Tag",
            },
            {
                title: "Subscriptions",
                href: "/admin/dashboard/subscriptions-management",
                icon: "CreditCard",
            },
            {
                title: "Coupons",
                href: "/admin/dashboard/coupons-management",
                icon: "Ticket",
            },
        ],
    },
];

export const userNavItems: NavSection[] = [
    {
        title: "Jobs",
        items: [
            {
                title: "Browse Jobs",
                href: "/jobs",
                icon: "Search",
            },
            {
                title: "My Applications",
                href: "/dashboard/my-applications",
                icon: "FileText",
            },
        ],
    },
    {
        title: "Profile",
        items: [
            {
                title: "My Resume",
                href: "/dashboard/my-resume",
                icon: "FileUser",
            },
            {
                title: "ATS Score",
                href: "/dashboard/ats-score",
                icon: "BarChart3",
            },
        ],
    },
    {
        title: "Account",
        items: [
            {
                title: "Wallet",
                href: "/dashboard/wallet",
                icon: "Wallet",
            },
            {
                title: "Subscriptions",
                href: "/dashboard/subscriptions",
                icon: "CreditCard",
            },
            {
                title: "Notifications",
                href: "/dashboard/notifications",
                icon: "Bell",
            },
        ],
    },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "SUPER_ADMIN":
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];

        case "RECRUITER":
            return [...commonNavItems, ...recruiterNavItems];

        case "USER":
            return [...commonNavItems, ...userNavItems];
    }
};
