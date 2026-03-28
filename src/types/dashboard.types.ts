export interface NavItem {
    title: string;
    href: string;
    icon: string;
}

export interface NavSection {
    title?: string;
    items: NavItem[];
}

export interface PieChartData {
    status: string;
    count: number;
}

export interface BarChartData {
    month: Date | string;
    count: number;
}

export interface IRecruiterDashboardData {
    jobCount: number;
    applicationCount: number;
    activeJobCount: number;
    uniqueApplicants: number;
    applicationStatusDistribution: PieChartData[];
    jobsByStatus: PieChartData[];
    applicationsByMonth: BarChartData[];
}

export interface IAdminDashboardData {
    jobCount: number;
    applicationCount: number;
    userCount: number;
    recruiterCount: number;
    adminCount: number;
    superAdminCount: number;
    activeJobCount: number;
    pendingRecruiters: number;
    totalRevenue: number;
    barChartData: BarChartData[];
    pieChartData: PieChartData[];
}
