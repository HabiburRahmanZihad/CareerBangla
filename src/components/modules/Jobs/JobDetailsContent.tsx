"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { applyToJob } from "@/services/application.services";
import { getMyResume } from "@/services/resume.services";
import { IJob } from "@/types/user.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, ArrowLeft, Award, BookOpen, Briefcase, Building2, Calendar, Clock, DollarSign, MapPin, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface JobDetailsContentProps {
    job: IJob;
    userRole?: string;
}

const jobTypeLabels: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
};

const experienceLevelLabels: Record<string, string> = {
    ENTRY: "Entry Level",
    MID: "Mid Level",
    SENIOR: "Senior Level",
    LEAD: "Lead",
    EXECUTIVE: "Executive",
};

const JobDetailsContent = ({ job, userRole }: JobDetailsContentProps) => {
    const [coverLetter, setCoverLetter] = useState("");
    const [showApplyForm, setShowApplyForm] = useState(false);

    // Check if user is admin/super admin/recruiter
    const cannotApply = ["ADMIN", "SUPER_ADMIN", "RECRUITER"].includes(userRole || "");

    const { data: resumeData } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
        enabled: !cannotApply, // Only fetch if user can apply
    });

    const profileCompletion = resumeData?.data?.profileCompletion ?? 0;
    const isProfileComplete = profileCompletion >= 100;
    const canApply = isProfileComplete && !cannotApply;

    const { mutateAsync: apply, isPending } = useMutation({
        mutationFn: () => applyToJob({ jobId: job.id, coverLetter: coverLetter || undefined }),
        onSuccess: () => {
            toast.success("Application submitted successfully!");
            setShowApplyForm(false);
            setCoverLetter("");
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || error.message || "Failed to apply");
        },
    });

    return (
        <div className="max-w-6xl mx-auto">
            <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
            </Link>

            {/* Header Card */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="space-y-4">
                        <div>
                            <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                <span className="text-lg font-medium">{job.company}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {job.locationType && <Badge>{job.locationType}</Badge>}
                            <Badge variant="outline">{jobTypeLabels[job.jobType]}</Badge>
                            {job.experienceLevel && <Badge variant="secondary">{experienceLevelLabels[job.experienceLevel] || job.experienceLevel}</Badge>}
                            <Badge variant={job.status === "LIVE" ? "default" : "destructive"}>{job.status}</Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Left Column - Description & Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Info */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <MapPin className="h-5 w-5 mx-auto mb-2 text-primary" />
                                    <p className="text-sm text-muted-foreground">Location</p>
                                    <p className="font-medium text-sm">{job.location}</p>
                                </div>
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
                                    <p className="text-sm text-muted-foreground">Posted</p>
                                    <p className="font-medium text-xs">
                                        {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : "N/A"}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                                    <p className="text-sm text-muted-foreground">Vacancies</p>
                                    <p className="font-medium">{job.vacancies || 1}</p>
                                </div>
                                {job.applicationDeadline && (
                                    <div className="text-center p-4 bg-muted rounded-lg">
                                        <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
                                        <p className="text-sm text-muted-foreground">Deadline</p>
                                        <p className="font-medium text-xs">
                                            {new Date(job.applicationDeadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Salary */}
                    {job.salaryMin && job.salaryMax && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Salary Range
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">
                                    &#2547;{job.salaryMin.toLocaleString()} - &#2547;{job.salaryMax.toLocaleString()}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">per month</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Job Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Responsibilities */}
                    {job.responsibilities && job.responsibilities.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    Responsibilities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {job.responsibilities.map((resp, idx) => (
                                        <li key={idx} className="flex gap-3 text-muted-foreground">
                                            <span className="text-primary font-bold">•</span>
                                            <span>{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Requirements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {job.requirements.map((req, idx) => (
                                        <li key={idx} className="flex gap-3 text-muted-foreground">
                                            <span className="text-primary font-bold">•</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Zap className="h-5 w-5" />
                                    Required Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Benefits */}
                    {job.benefits && job.benefits.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Benefits
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {job.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex gap-3 text-muted-foreground">
                                            <span className="text-primary font-bold">✓</span>
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Apply Card - Only show if user can apply */}
                    {!cannotApply && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Apply Now</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {job.status === "LIVE" ? (
                                    <>
                                        {!showApplyForm ? (
                                            <div className="space-y-3">
                                                {!isProfileComplete && (
                                                    <Alert variant="destructive">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <AlertDescription className="text-xs">
                                                            Profile {profileCompletion}% complete. Complete to 100% to apply.{" "}
                                                            <Link href="/dashboard/my-resume" className="underline font-medium">Complete Now</Link>
                                                        </AlertDescription>
                                                    </Alert>
                                                )}
                                                <Button
                                                    className="w-full"
                                                    onClick={() => setShowApplyForm(true)}
                                                    disabled={!canApply}
                                                >
                                                    Apply Now
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-sm font-medium">Cover Letter (Optional)</label>
                                                    <Textarea
                                                        placeholder="Tell us why you're interested in this role..."
                                                        value={coverLetter}
                                                        onChange={(e) => setCoverLetter(e.target.value)}
                                                        rows={5}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        className="flex-1"
                                                        onClick={() => apply()}
                                                        disabled={isPending}
                                                    >
                                                        {isPending ? "Submitting..." : "Submit"}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setShowApplyForm(false);
                                                            setCoverLetter("");
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            This position is no longer accepting applications.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Recruiter/Admin Notice */}
                    {cannotApply && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Job Viewing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {userRole === "RECRUITER"
                                            ? "Recruiters cannot apply to jobs."
                                            : "Admins cannot apply to jobs."}
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    )}

                    {/* Company Info */}
                    {job.recruiter && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Company Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {job.recruiter.companyName && (
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Company</p>
                                        <p className="font-medium">{job.recruiter.companyName}</p>
                                    </div>
                                )}
                                {job.recruiter.companyAddress && (
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Address</p>
                                        <p className="font-medium text-sm">{job.recruiter.companyAddress}</p>
                                    </div>
                                )}
                                {job.recruiter.companyWebsite && (
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Website</p>
                                        <a
                                            href={job.recruiter.companyWebsite}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline text-sm font-medium break-all"
                                        >
                                            {job.recruiter.companyWebsite}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Category */}
                    {job.category && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge className="px-3 py-1">{job.category.name}</Badge>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetailsContent;
