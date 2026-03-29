import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            items: [
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
    ];
};

export const recruiterNavItems: NavSection[] = [
    {
        title: "Job Management",
        items: [
            {
                title: "Post a Job",
                href: "/recruiter/dashboard/post-job",
                icon: "PlusCircle",
            },
            {
                title: "Pending Jobs",
                href: "/recruiter/dashboard/my-jobs/pending",
                icon: "Clock",
            },
            {
                title: "Approved Jobs",
                href: "/recruiter/dashboard/my-jobs/approved",
                icon: "CheckCircle",
            },
            {
                title: "Inactive Jobs",
                href: "/recruiter/dashboard/my-jobs/inactive",
                icon: "XCircle",
            },
            {
                title: "Job Applications",
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
                title: "Subscriptions",
                href: "/recruiter/dashboard/subscriptions",
                icon: "CreditCard",
            },
            {
                title: "Notifications",
                href: "/recruiter/dashboard/notifications",
                icon: "Bell",
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
                title: "Pending Approvals",
                href: "/admin/dashboard/pending-jobs",
                icon: "Clock",
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
                title: "Payment Subscriptions",
                href: "/admin/dashboard/payment-subscriptions",
                icon: "DollarSign",
            },
            {
                title: "Coupons",
                href: "/admin/dashboard/coupons-management",
                icon: "Ticket",
            },
            {
                title: "Tracking & Analytics",
                href: "/admin/dashboard/tracking",
                icon: "Activity",
            },
            {
                title: "Notifications",
                href: "/admin/dashboard/notifications",
                icon: "Bell",
            },
        ],
    },
];

export const userNavItems: NavSection[] = [
    {
        title: "Job Search",
        items: [
            {
                title: "My Applications",
                href: "/dashboard/my-applications",
                icon: "FileText",
            },
        ],
    },
    {
        title: "Professional Profile",
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
        title: "Account & Preferences",
        items: [
            {
                title: "Subscriptions",
                href: "/dashboard/subscriptions",
                icon: "CreditCard",
            },
            {
                title: "Referrals",
                href: "/dashboard/referrals",
                icon: "Users",
            },
            {
                title: "Notifications",
                href: "/dashboard/notifications",
                icon: "Bell",
            },
            {
                title: "Devices",
                href: "/dashboard/devices",
                icon: "Monitor",
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
