import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IJob } from "@/types/user.types";
import { formatDistanceToNow } from "date-fns";
import {
    Briefcase,
    Building2,
    Calendar,
    DollarSign,
    MapPin,
    Trash2,
    Users,
    Zap
} from "lucide-react";

interface RecruiterInactiveJobCardProps {
    job: IJob;
    layoutMode: "grid" | "list";
    statusConfig: Record<string, { bg: string; text: string; badge: string; icon: React.ElementType; accentColor: string }>;
    deleting: boolean;
    isFetching: boolean;
    onDelete: (id: string) => void;
}

export const RecruiterInactiveJobCard = ({
    job,
    layoutMode,
    statusConfig,
    deleting,
    isFetching,
    onDelete,
}: RecruiterInactiveJobCardProps) => {
    return (
        <Card
            className={`group relative overflow-hidden bg-card/60 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/40 border border-border/50
                ${layoutMode === "list" ? "flex flex-col md:flex-row h-auto items-stretch rounded-2xl md:rounded-[2rem]" : "flex flex-col h-full rounded-[2rem]"}
            `}
        >
            {/* Decorative Background Blob */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

            <div className={`p-6 flex-1 flex flex-col gap-5 ${layoutMode === "list" ? "md:w-3/4 md:pr-4 md:border-r border-border/50" : ""}`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-xl leading-tight text-foreground line-clamp-2 md:line-clamp-1 group-hover:text-primary transition-colors">
                                {job.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5 text-sm font-medium text-muted-foreground bg-muted/30 w-fit px-2 py-0.5 rounded-md">
                                <Building2 className="w-3.5 h-3.5" />
                                <span className="line-clamp-1">{job.company || job.recruiter?.companyName || "Unknown Company"}</span>
                            </div>
                        </div>
                    </div>
                    <Badge className={`${(statusConfig[job.status] || statusConfig.INACTIVE).badge} border px-3 py-1 font-bold shrink-0 whitespace-nowrap uppercase tracking-wider text-xs hidden sm:flex`}>
                        {job.status}
                    </Badge>
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3 text-sm mt-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border/60 shadow-sm">
                        <MapPin className="w-4 h-4 text-primary/70" />
                        <span className="font-medium line-clamp-1">{job.location}</span>
                    </div>
                    {job.jobType && (
                        <div className="flex items-center gap-1.5 text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border/60 shadow-sm">
                            <Zap className="w-4 h-4 text-primary/70" />
                            <span className="font-medium capitalize">{job.jobType.replace("_", " ").toLowerCase()}</span>
                        </div>
                    )}
                    {(job.salaryMin || job.salaryMax) && (
                        <div className="flex items-center gap-1.5 text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border/60 shadow-sm">
                            <DollarSign className="w-4 h-4 text-green-500/80" />
                            <span className="font-medium text-green-600 dark:text-green-400">
                                {job.salaryMin ? `৳${job.salaryMin.toLocaleString()}` : ""}
                                {job.salaryMin && job.salaryMax ? " - " : ""}
                                {job.salaryMax ? `৳${job.salaryMax.toLocaleString()}` : ""}
                            </span>
                        </div>
                    )}
                    {job.createdAt && (
                        <div className="flex items-center gap-1.5 text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border/60 shadow-sm">
                            <Calendar className="w-4 h-4 text-primary/70" />
                            <span className="font-medium">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                        </div>
                    )}
                </div>

                {/* Skills / Description */}
                {job.skills && job.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                        {job.skills.slice(0, layoutMode === "list" ? 6 : 3).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 font-semibold px-2.5 py-1 rounded-md">
                                {skill}
                            </Badge>
                        ))}
                        {job.skills.length > (layoutMode === "list" ? 6 : 3) && (
                            <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-transparent font-semibold px-2 py-1 rounded-md">
                                +{job.skills.length - (layoutMode === "list" ? 6 : 3)} more
                            </Badge>
                        )}
                    </div>
                ) : (
                    job.description && (
                        <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-80 mt-auto pt-2">
                            {job.description}
                        </div>
                    )
                )}
            </div>

            {/* Sidebar / Bottom area */}
            <div className={`flex ${layoutMode === "list" ? "md:w-1/4 flex-col justify-center p-6 bg-muted/10" : "flex-col p-6 pt-0 mt-auto"}`}>
                <div className={`grid grid-cols-2 gap-3 mb-5 ${layoutMode === "list" ? "mb-6" : ""}`}>
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-background border border-border/60 shadow-sm relative overflow-hidden group/stat">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                        <span className="text-2xl font-black text-foreground">{job._count?.applications || 0}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Apps</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-background border border-border/60 shadow-sm relative overflow-hidden group/stat">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                        <Users className="w-6 h-6 text-primary mb-1 mt-0.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">View</span>
                    </div>
                </div>
                <div className="flex flex-col mt-auto w-full">
                    <Button
                        variant="outline"
                        className="h-11 w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 bg-destructive/5 transition-all shadow-sm font-bold"
                        disabled={deleting || isFetching}
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
                                onDelete(job.id);
                            }
                        }}
                        title="Delete job"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Forever
                    </Button>
                </div>
            </div>
        </Card>
    );
};
