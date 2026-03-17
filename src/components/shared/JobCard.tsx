import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { IJob } from "@/types/user.types";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, Clock, MapPin } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
    job: IJob;
}

const locationTypeColors: Record<string, string> = {
    REMOTE: "bg-green-100 text-green-800",
    ONSITE: "bg-blue-100 text-blue-800",
    HYBRID: "bg-purple-100 text-purple-800",
};

const jobTypeLabels: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
};

const JobCard = ({ job }: JobCardProps) => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                        <Link href={`/jobs/${job.id}`} className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1">
                            {job.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge variant="outline" className={locationTypeColors[job.locationType] || ""}>
                        {job.locationType}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pb-3 space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {jobTypeLabels[job.jobType] || job.jobType}
                    </span>
                    {job.createdAt && (
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                        </span>
                    )}
                </div>

                {job.salaryMin && job.salaryMax && (
                    <p className="text-sm font-medium text-primary">
                        &#2547;{job.salaryMin.toLocaleString()} - &#2547;{job.salaryMax.toLocaleString()}/month
                    </p>
                )}

                {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {job.skills.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                            </Badge>
                        ))}
                        {job.skills.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                                +{job.skills.length - 5} more
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-3 border-t">
                <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default JobCard;
