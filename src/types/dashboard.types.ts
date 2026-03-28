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
