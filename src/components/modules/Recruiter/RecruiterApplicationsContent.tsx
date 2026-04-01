"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { downloadCvForRecruiter, getApplicationsByJob, updateApplicationStatus } from "@/services/application.services";
import { getMyJobs } from "@/services/job.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    Briefcase,
    Calendar,
    CheckCircle,
    Crown,
    FileText,
    Grid3X3,
    List,
    Loader2,
    Lock,
    Mail,
    Phone,
    Search,
    User,
    X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ApplicationDetailView } from "./ApplicationDetailView";
import { statusConfig, terminalStatuses, toPdfBlob, validTransitions } from "./applicationsConstants";

const RecruiterApplicationsContent = () => {
    const queryClient = useQueryClient();
    const [selectedJobId, setSelectedJobId] = useState<string>("");
    const [interviewModal, setInterviewModal] = useState<{
        appId: string;
        date: string;
        note: string;
    } | null>(null);
    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [downloadingCv, setDownloadingCv] = useState<string | null>(null);
    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [skillsFilter, setSkillsFilter] = useState("");
    const [educationFilter, setEducationFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const { data: jobsData, isLoading: jobsLoading } = useQuery({
        queryKey: ["my-jobs"],
        queryFn: () => getMyJobs({ limit: "100" }),
    });

    const { data: applicationsData, isLoading: applicationsLoading } = useQuery({
        queryKey: ["job-applications", selectedJobId, { searchTerm, skillsFilter, educationFilter, statusFilter }],
        queryFn: () => getApplicationsByJob(selectedJobId, {
            search: searchTerm || undefined,
            skills: skillsFilter || undefined,
            education: educationFilter || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
        }),
        enabled: !!selectedJobId,
    });

    const { mutateAsync: changeStatus, isPending: isUpdating } = useMutation({
        mutationFn: (payload: { id: string; status: string; interviewDate?: string; interviewNote?: string }) =>
            updateApplicationStatus(payload.id, {
                status: payload.status,
                interviewDate: payload.interviewDate,
                interviewNote: payload.interviewNote,
            }),
        onSuccess: () => {
            toast.success("Application status updated");
            queryClient.invalidateQueries({ queryKey: ["job-applications", selectedJobId] });
            setInterviewModal(null);
        },
        onError: (err: any) => {
            toast.error(getRequestErrorMessage(err, "Failed to update status"));
        },
    });

    const handleStatusChange = (appId: string, newStatus: string) => {
        if (newStatus === "INTERVIEW") {
            setInterviewModal({ appId, date: "", note: "" });
        } else {
            changeStatus({ id: appId, status: newStatus });
        }
    };

    const handleInterviewSubmit = () => {
        if (!interviewModal) return;
        changeStatus({
            id: interviewModal.appId,
            status: "INTERVIEW",
            interviewDate: interviewModal.date || undefined,
            interviewNote: interviewModal.note || undefined,
        });
    };

    const handleDownloadCv = async (userId: string, userName: string, applicationId?: string) => {
        setDownloadingCv(userId);
        try {
            const response = await downloadCvForRecruiter(userId, applicationId);
            const rawPayload = (response as any)?.data ?? response;
            const blob = toPdfBlob(rawPayload);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${userName.replace(/\s+/g, "-")}-CV.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success("CV downloaded successfully");
        } catch (err: any) {
            toast.error(getRequestErrorMessage(err, "Failed to download CV"));
        } finally {
            setDownloadingCv(null);
        }
    };

    const jobs = jobsData?.data || [];
    const rawData = applicationsData?.data;
    const applications = (rawData && 'applications' in rawData ? rawData.applications : rawData) || [];
    const isPremiumRecruiter: boolean = (rawData && 'isPremiumRecruiter' in rawData ? rawData.isPremiumRecruiter : false) ?? false;

    // Show detail view when an application is selected
    if (selectedApp) {
        return (
            <ApplicationDetailView
                app={selectedApp}
                isPremiumRecruiter={isPremiumRecruiter}
                isUpdating={isUpdating}
                downloadingCv={downloadingCv}
                onBack={() => setSelectedApp(null)}
                onStatusChange={handleStatusChange}
                onDownloadCv={handleDownloadCv}
            />
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary to-primary/70 text-primary-foreground p-8 md:p-12 shadow-xl border border-primary/20">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white/10 blur-3xl opacity-50" />
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-sm font-medium mb-4">
                        <Briefcase className="w-4 h-4" />
                        <span>Applicant Tracking</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Applications</h1>
                    <p className="text-primary-foreground/90 text-sm sm:text-base">
                        Manage and review all job applications in one place. Shortlist talent, schedule interviews, and make hiring decisions.
                    </p>
                </div>
            </div>

            {/* Job Selector */}
            {jobsLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-12 rounded-2xl" />
                    <Skeleton className="h-20 rounded-2xl" />
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Job Selection Card */}
                    <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <Label className="uppercase text-xs font-bold text-muted-foreground tracking-wider mb-3 block">
                                Select a Position
                            </Label>
                            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                                <SelectTrigger className="h-11 bg-muted/50 border-muted-foreground/20">
                                    <SelectValue placeholder="Choose a job to view applications..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {jobs.length === 0 ? (
                                        <SelectItem value="_empty" disabled>
                                            No jobs found
                                        </SelectItem>
                                    ) : (
                                        jobs.map((job: any) => (
                                            <SelectItem key={job.id} value={job.id}>
                                                <div className="flex items-center gap-2">
                                                    <span>{job.title}</span>
                                                    <Badge variant="secondary" className="ml-2">
                                                        {job._count?.applications || 0}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Advanced Filters */}
                    {selectedJobId && (
                        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="uppercase text-xs font-bold text-muted-foreground tracking-wider">
                                            Filters
                                        </Label>
                                        {(searchTerm || skillsFilter || educationFilter || statusFilter !== "all") && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSearchTerm("");
                                                    setSkillsFilter("");
                                                    setEducationFilter("");
                                                    setStatusFilter("all");
                                                }}
                                                className="h-7 text-xs"
                                            >
                                                <X className="w-3 h-3 mr-1" /> Clear All
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search by name or email..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-9 h-10 bg-muted/50 border-muted-foreground/20 placeholder:text-muted-foreground/60"
                                            />
                                        </div>
                                        <Input
                                            placeholder="Skills (comma separated)"
                                            value={skillsFilter}
                                            onChange={(e) => setSkillsFilter(e.target.value)}
                                            className="h-10 bg-muted/50 border-muted-foreground/20 placeholder:text-muted-foreground/60"
                                        />
                                        <Input
                                            placeholder="Education"
                                            value={educationFilter}
                                            onChange={(e) => setEducationFilter(e.target.value)}
                                            className="h-10 bg-muted/50 border-muted-foreground/20 placeholder:text-muted-foreground/60"
                                        />
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="h-10 bg-muted/50 border-muted-foreground/20">
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                                                <SelectItem value="INTERVIEW">Interview</SelectItem>
                                                <SelectItem value="HIRED">Hired</SelectItem>
                                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Grid/List Toggle */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">View</p>
                                        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant={layoutMode === "grid" ? "default" : "ghost"}
                                                onClick={() => setLayoutMode("grid")}
                                                className="h-8 px-3"
                                            >
                                                <Grid3X3 className="w-4 h-4 mr-1.5" /> Grid
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant={layoutMode === "list" ? "default" : "ghost"}
                                                onClick={() => setLayoutMode("list")}
                                                className="h-8 px-3"
                                            >
                                                <List className="w-4 h-4 mr-1.5" /> List
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Premium upsell banner for free recruiters */}
            {selectedJobId && !applicationsLoading && !isPremiumRecruiter && applications.length > 0 && (
                <Card className="border-yellow-200/50 bg-linear-to-r from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20 backdrop-blur-xl shadow-sm overflow-hidden">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-yellow-800 dark:text-yellow-300">Unlock Premium Features</p>
                                <p className="text-xs text-yellow-700 dark:text-yellow-400">View contact info, download CVs, and more with Career Boost</p>
                            </div>
                        </div>
                        <Link href="/recruiter/dashboard/subscriptions">
                            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white shrink-0">
                                Upgrade Now
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {!selectedJobId ? (
                <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-sm">
                    <CardContent className="py-16 px-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">No Position Selected</h3>
                        <p className="text-sm text-muted-foreground">Select a job above to view and manage its applications</p>
                    </CardContent>
                </Card>
            ) : applicationsLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="border-border/50 bg-card/60 backdrop-blur-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                    <Skeleton className="h-8 w-20 rounded-lg" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : applications.length === 0 ? (
                <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                    <CardContent className="py-16 px-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">No Applications Yet</h3>
                        <p className="text-sm text-muted-foreground">Check back later when applicants start submitting their applications</p>
                    </CardContent>
                </Card>
            ) : (
                <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" : "space-y-4"}>
                    {applications.map((app: any) => {
                        const nextStatuses = validTransitions[app.status] || [];
                        const isTerminal = terminalStatuses.includes(app.status);
                        const currentConfig = statusConfig[app.status] || statusConfig.PENDING;

                        return (
                            <Card
                                key={app.id}
                                className={`group relative overflow-hidden bg-card/60 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/40 border border-border/50 rounded-2xl ${layoutMode === "grid" ? "flex flex-col h-full" : "flex flex-col h-auto"
                                    }`}
                            >
                                {/* Decorative Background Blob */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                                <CardHeader className={`relative z-10 ${layoutMode === "grid" ? "pb-3" : "pb-4"}`}>
                                    <div className={`flex items-start ${layoutMode === "grid" ? "flex-col gap-3" : "justify-between gap-4"}`}>
                                        <div className="flex items-start gap-3 w-full">
                                            <div className="relative w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform overflow-hidden">
                                                {app.user?.image || app.user?.resume?.profilePhoto ? (
                                                    <Image
                                                        src={app.user.resume?.profilePhoto || app.user.image}
                                                        alt={app.user?.name || ""}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-5 h-5 text-primary" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 w-full">
                                                <div className={`flex items-center gap-2 mb-1 ${layoutMode === "grid" ? "flex-col items-start" : ""}`}>
                                                    <CardTitle className="text-sm font-semibold truncate">{app.user?.name || "Unknown User"}</CardTitle>
                                                    <Badge
                                                        className={`${currentConfig.badge} border font-semibold text-xs uppercase tracking-wide shrink-0`}
                                                    >
                                                        {app.status}
                                                    </Badge>
                                                </div>
                                                {isPremiumRecruiter && app.user?.resume?.professionalTitle && (
                                                    <p className="text-xs text-muted-foreground truncate">{app.user.resume.professionalTitle}</p>
                                                )}
                                                {/* Contact info - premium only */}
                                                {isPremiumRecruiter ? (
                                                    <div className="flex gap-2 mt-1.5 text-xs text-muted-foreground flex-col items-start">
                                                        {app.user?.email && (
                                                            <span className="flex items-center gap-1 truncate max-w-full">
                                                                <Mail className="w-3 h-3 shrink-0" /> <span className="truncate">{app.user.email}</span>
                                                            </span>
                                                        )}
                                                        {app.user?.resume?.contactNumber && (
                                                            <span className="flex items-center gap-1">
                                                                <Phone className="w-3 h-3 shrink-0" /> {app.user.resume.contactNumber}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                                                        <Lock className="w-3 h-3 shrink-0" /> Contact info hidden
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Stats Badges - Only in list mode */}
                                        {layoutMode === "list" && (
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className="text-right text-xs">
                                                    <p className="font-semibold text-foreground">
                                                        {formatDistanceToNow(new Date(app.createdAt), { addSuffix: false })}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">ago</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className={`relative z-10 ${layoutMode === "grid" ? "space-y-2.5" : "space-y-4"}`}>
                                    {/* Cover Letter Preview */}
                                    {app.coverLetter && (
                                        <p className={`text-muted-foreground leading-relaxed opacity-80 ${layoutMode === "grid" ? "text-xs line-clamp-2" : "text-sm line-clamp-3"}`}>
                                            {app.coverLetter}
                                        </p>
                                    )}

                                    {/* Interview Details Banner */}
                                    {app.status === "INTERVIEW" && app.interviewDate && (
                                        <div className={`bg-linear-to-r from-blue-500/10 to-blue-500/5 border border-blue-200/50 dark:border-blue-500/30 rounded-lg ${layoutMode === "grid" ? "p-2 flex items-start gap-2" : "p-3 flex items-center gap-3"}`}>
                                            <div className={`${layoutMode === "grid" ? "p-1" : "p-2"} rounded-lg bg-blue-500/20 shrink-0`}>
                                                <Calendar className={`${layoutMode === "grid" ? "w-3 h-3" : "w-4 h-4"} text-blue-600 dark:text-blue-400`} />
                                            </div>
                                            <div className={layoutMode === "grid" ? "text-xs" : "text-sm"}>
                                                <p className="font-semibold text-blue-700 dark:text-blue-300">Interview</p>
                                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                                    {new Date(app.interviewDate).toLocaleDateString("en-US", {
                                                        weekday: "short", month: "short", day: "numeric"
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Hired Banner */}
                                    {app.status === "HIRED" && (
                                        <div className={`bg-linear-to-r from-green-500/10 to-green-500/5 border border-green-200/50 dark:border-green-500/30 rounded-lg ${layoutMode === "grid" ? "p-2 flex items-start gap-2" : "p-3 flex items-center gap-3"}`}>
                                            <div className={`${layoutMode === "grid" ? "p-1" : "p-2"} rounded-lg bg-green-500/20 shrink-0`}>
                                                <CheckCircle className={`${layoutMode === "grid" ? "w-3 h-3" : "w-4 h-4"} text-green-600 dark:text-green-400`} />
                                            </div>
                                            <div className={layoutMode === "grid" ? "text-xs" : "text-sm"}>
                                                <p className="font-semibold text-green-700 dark:text-green-300">Hired</p>
                                                {app.hiredCompany && (
                                                    <p className="text-xs text-green-600 dark:text-green-400 truncate">{app.hiredCompany}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className={`flex gap-2 pt-2 border-t border-border/50 ${layoutMode === "grid" ? "flex-col" : "items-center justify-between"}`}>
                                        <div className="flex items-center gap-2 flex-wrap flex-1">
                                            {/* View Details button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-xs h-8 flex-1 min-w-fit"
                                                onClick={() => setSelectedApp(app)}
                                            >
                                                <FileText className="w-3 h-3 mr-1" /> Details
                                            </Button>

                                            {/* Status transition dropdown */}
                                            {!isTerminal && nextStatuses.length > 0 && (
                                                <Select
                                                    value=""
                                                    onValueChange={(status) => handleStatusChange(app.id, status)}
                                                >
                                                    <SelectTrigger className={`h-8 text-xs px-2 bg-primary/10 border-primary/20 hover:bg-primary/20 ${layoutMode === "grid" ? "w-full" : "w-auto"}`}>
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {nextStatuses.map((s) => (
                                                            <SelectItem key={s} value={s}>
                                                                {s.charAt(0) + s.slice(1).toLowerCase()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>

                                        {/* Download CV button - premium only */}
                                        {isPremiumRecruiter ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={`text-xs h-8 ${layoutMode === "grid" ? "w-full" : "w-auto"}`}
                                                disabled={downloadingCv === app.user?.id}
                                                onClick={() => handleDownloadCv(app.user?.id, app.user?.name || "Applicant", app.id)}
                                            >
                                                {downloadingCv === app.user?.id ? (
                                                    <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Downloading</>
                                                ) : (
                                                    <><FileText className="w-3 h-3 mr-1" /> CV</>
                                                )}
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm" className={`text-xs h-8 opacity-50 cursor-not-allowed ${layoutMode === "grid" ? "w-full" : "w-auto"}`} disabled>
                                                <Lock className="w-3 h-3 mr-1" /> CV
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Interview scheduling modal */}
            {interviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle>Schedule Interview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="interview-date">Interview Date</Label>
                                <Input
                                    id="interview-date"
                                    type="date"
                                    value={interviewModal.date}
                                    onChange={(e) => setInterviewModal({ ...interviewModal, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="interview-note">Note (optional)</Label>
                                <Textarea
                                    id="interview-note"
                                    placeholder="e.g. Google Meet link, office address..."
                                    value={interviewModal.note}
                                    onChange={(e) => setInterviewModal({ ...interviewModal, note: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setInterviewModal(null)}>Cancel</Button>
                                <Button onClick={handleInterviewSubmit} disabled={isUpdating}>
                                    {isUpdating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scheduling...</> : "Schedule Interview"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

        </div>
    );
};

export default RecruiterApplicationsContent;
