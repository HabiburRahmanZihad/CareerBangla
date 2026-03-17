"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { applyToJob } from "@/services/application.services";
import { getMyResume } from "@/services/resume.services";
import { getMyWallet } from "@/services/wallet.services";
import { IJob } from "@/types/user.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, ArrowLeft, Briefcase, Building2, Calendar, Clock, Coins, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface JobDetailsContentProps {
    job: IJob;
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

const APPLY_COST = 5;

const JobDetailsContent = ({ job }: JobDetailsContentProps) => {
    const [coverLetter, setCoverLetter] = useState("");
    const [showApplyForm, setShowApplyForm] = useState(false);

    const { data: resumeData } = useQuery({
        queryKey: ["my-resume"],
        queryFn: () => getMyResume(),
    });

    const { data: walletData } = useQuery({
        queryKey: ["my-wallet"],
        queryFn: () => getMyWallet(),
    });

    const profileCompletion = resumeData?.data?.profileCompletion ?? 0;
    const coinBalance = walletData?.data?.balance ?? 0;
    const isProfileComplete = profileCompletion >= 100;
    const hasEnoughCoins = coinBalance >= APPLY_COST;
    const canApply = isProfileComplete && hasEnoughCoins;

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
        <div className="max-w-4xl mx-auto">
            <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="space-y-3">
                                <CardTitle className="text-2xl">{job.title}</CardTitle>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Building2 className="h-4 w-4" />
                                    <span>{job.company}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge>{job.locationType}</Badge>
                                    <Badge variant="outline">{jobTypeLabels[job.jobType]}</Badge>
                                    <Badge variant="secondary">{experienceLevelLabels[job.experienceLevel]}</Badge>
                                    <Badge variant={job.status === "OPEN" ? "default" : "destructive"}>
                                        {job.status}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    {job.location}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Briefcase className="h-4 w-4" />
                                    {jobTypeLabels[job.jobType]}
                                </span>
                                {job.createdAt && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                                    </span>
                                )}
                                {job.applicationDeadline && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            {job.salaryMin && job.salaryMax && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold mb-1">Salary Range</h3>
                                        <p className="text-lg text-primary font-medium">
                                            &#2547;{job.salaryMin.toLocaleString()} - &#2547;{job.salaryMax.toLocaleString()}/month
                                        </p>
                                    </div>
                                </>
                            )}

                            <Separator />
                            <div>
                                <h3 className="font-semibold mb-3">Job Description</h3>
                                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                                    {job.description}
                                </div>
                            </div>

                            {job.skills && job.skills.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold mb-3">Required Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.map((skill) => (
                                                <Badge key={skill} variant="secondary">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Apply Card */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            {job.status === "OPEN" ? (
                                <>
                                    {!showApplyForm ? (
                                        <div className="space-y-3">
                                            {!isProfileComplete && (
                                                <Alert variant="destructive">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        Your profile is {profileCompletion}% complete. You must complete your profile to 100% before applying.{" "}
                                                        <Link href="/dashboard/my-resume" className="underline font-medium">Complete Profile</Link>
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                            {!hasEnoughCoins && isProfileComplete && (
                                                <Alert variant="destructive">
                                                    <Coins className="h-4 w-4" />
                                                    <AlertDescription>
                                                        Insufficient coins. You need {APPLY_COST} coins to apply. Your balance: {coinBalance}.{" "}
                                                        <Link href="/dashboard/wallet" className="underline font-medium">Buy Coins</Link>
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                            <Button
                                                className="w-full"
                                                onClick={() => setShowApplyForm(true)}
                                                disabled={!canApply}
                                            >
                                                Apply Now ({APPLY_COST} coins)
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <h4 className="font-medium">Cover Letter (Optional)</h4>
                                            <Textarea
                                                placeholder="Write a brief cover letter..."
                                                value={coverLetter}
                                                onChange={(e) => setCoverLetter(e.target.value)}
                                                rows={5}
                                            />
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    Applying costs {APPLY_COST} coins. Your balance: {coinBalance} coins.
                                                </AlertDescription>
                                            </Alert>
                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex-1"
                                                    onClick={() => apply()}
                                                    disabled={isPending}
                                                >
                                                    {isPending ? "Applying..." : "Submit Application"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowApplyForm(false)}
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
                                        This job is no longer accepting applications.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* Company Info */}
                    {job.recruiter && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Company Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                {job.recruiter.companyName && (
                                    <p><span className="text-muted-foreground">Company:</span> {job.recruiter.companyName}</p>
                                )}
                                {job.recruiter.companyAddress && (
                                    <p><span className="text-muted-foreground">Address:</span> {job.recruiter.companyAddress}</p>
                                )}
                                {job.recruiter.companyWebsite && (
                                    <p>
                                        <span className="text-muted-foreground">Website:</span>{" "}
                                        <a href={job.recruiter.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            {job.recruiter.companyWebsite}
                                        </a>
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Category */}
                    {job.category && (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Category</p>
                                <Badge variant="outline" className="mt-1">{job.category.name}</Badge>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetailsContent;
