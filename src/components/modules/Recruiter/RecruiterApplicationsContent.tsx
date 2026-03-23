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
import { getApplicationsByJob, updateApplicationStatus } from "@/services/application.services";
import { getMyJobs } from "@/services/job.services";
import envConfig from "@/lib/envConfig";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Crown, Lock, Mail, Phone, FileText, User, Loader2, Calendar, StickyNote } from "lucide-react";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SHORTLISTED: "bg-indigo-100 text-indigo-800",
    INTERVIEW: "bg-blue-100 text-blue-800",
    HIRED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
};

const terminalStatuses = ["HIRED", "REJECTED"];

// Valid transitions matching backend
const validTransitions: Record<string, string[]> = {
    PENDING: ["SHORTLISTED", "REJECTED"],
    SHORTLISTED: ["INTERVIEW", "REJECTED"],
    INTERVIEW: ["HIRED", "REJECTED"],
    HIRED: [],
    REJECTED: [],
};

const RecruiterApplicationsContent = () => {
    const queryClient = useQueryClient();
    const [selectedJobId, setSelectedJobId] = useState<string>("");
    const [interviewModal, setInterviewModal] = useState<{
        appId: string;
        date: string;
        note: string;
    } | null>(null);
    const [downloadingCv, setDownloadingCv] = useState<string | null>(null);

    const { data: jobsData, isLoading: jobsLoading } = useQuery({
        queryKey: ["my-jobs"],
        queryFn: () => getMyJobs({ limit: "100" }),
    });

    const { data: applicationsData, isLoading: applicationsLoading } = useQuery({
        queryKey: ["job-applications", selectedJobId],
        queryFn: () => getApplicationsByJob(selectedJobId),
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
            toast.error(err?.response?.data?.message || "Failed to update status");
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

    const handleDownloadCv = async (userId: string, userName: string) => {
        setDownloadingCv(userId);
        try {
            const res = await fetch(`${envConfig.apiBaseUrl}/resumes/download-pdf?userId=${userId}`, {
                credentials: "include",
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.message || "Failed to download CV");
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${userName.replace(/\s+/g, "-")}-CV.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err: any) {
            toast.error(err.message || "Failed to download CV");
        } finally {
            setDownloadingCv(null);
        }
    };

    const jobs = jobsData?.data || [];
    const rawData = applicationsData?.data;
    const applications = (rawData && 'applications' in rawData ? rawData.applications : rawData) || [];
    const isPremiumRecruiter: boolean = (rawData && 'isPremiumRecruiter' in rawData ? rawData.isPremiumRecruiter : false) ?? false;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Applications</h1>

            {jobsLoading ? (
                <Skeleton className="h-10 w-64" />
            ) : (
                <div className="max-w-sm">
                    <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a job to view applications" />
                        </SelectTrigger>
                        <SelectContent>
                            {jobs.map((job: any) => (
                                <SelectItem key={job.id} value={job.id}>
                                    {job.title} ({job._count?.applications || 0} apps)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Premium upsell banner for free recruiters */}
            {selectedJobId && !applicationsLoading && !isPremiumRecruiter && applications.length > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-800 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-300">
                    <div className="flex items-center gap-3">
                        <Crown className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                        <span>
                            Upgrade to <strong>Career Boost</strong> to see full applicant details (email, phone) and download their CVs.
                        </span>
                    </div>
                    <Link href="/recruiter/dashboard/subscriptions">
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                            Upgrade
                        </Button>
                    </Link>
                </div>
            )}

            {!selectedJobId ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Select a job above to view its applications
                    </CardContent>
                </Card>
            ) : applicationsLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                </div>
            ) : applications.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No applications for this job yet.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {applications.map((app: any) => {
                        const nextStatuses = validTransitions[app.status] || [];
                        const isTerminal = terminalStatuses.includes(app.status);

                        return (
                            <Card key={app.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                                                {app.user?.image || app.user?.resume?.profilePhoto ? (
                                                    <Image
                                                        src={app.user.resume?.profilePhoto || app.user.image}
                                                        alt={app.user?.name || ""}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{app.user?.name || "Unknown User"}</CardTitle>
                                                {/* Professional title - premium only */}
                                                {isPremiumRecruiter && app.user?.resume?.professionalTitle && (
                                                    <p className="text-xs text-muted-foreground">{app.user.resume.professionalTitle}</p>
                                                )}
                                                {/* Contact info - premium only */}
                                                {isPremiumRecruiter ? (
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                                                        {app.user?.email && (
                                                            <span className="flex items-center gap-1">
                                                                <Mail className="w-3.5 h-3.5" /> {app.user.email}
                                                            </span>
                                                        )}
                                                        {app.user?.resume?.contactNumber && (
                                                            <span className="flex items-center gap-1">
                                                                <Phone className="w-3.5 h-3.5" /> {app.user.resume.contactNumber}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                        <Lock className="w-3 h-3" /> Contact info hidden &mdash; upgrade to Career Boost
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Badge className={statusColors[app.status] || ""}>{app.status}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {app.coverLetter && (
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{app.coverLetter}</p>
                                    )}

                                    {/* Interview details if scheduled */}
                                    {app.status === "INTERVIEW" && app.interviewDate && (
                                        <div className="flex items-center gap-4 mb-3 text-sm bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md px-3 py-2">
                                            <span className="flex items-center gap-1 text-blue-700 dark:text-blue-300">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Interview: {new Date(app.interviewDate).toLocaleDateString("en-US", {
                                                    weekday: "short", year: "numeric", month: "short", day: "numeric"
                                                })}
                                            </span>
                                            {app.interviewNote && (
                                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                                    <StickyNote className="w-3.5 h-3.5" /> {app.interviewNote}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-xs text-muted-foreground">
                                            Applied {app.createdAt && formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                                        </p>
                                        <div className="ml-auto flex items-center gap-2">
                                            {/* Status transition dropdown */}
                                            {!isTerminal && nextStatuses.length > 0 && (
                                                <Select
                                                    value=""
                                                    onValueChange={(status) => handleStatusChange(app.id, status)}
                                                >
                                                    <SelectTrigger className="w-40 h-8 text-xs">
                                                        <SelectValue placeholder="Change status..." />
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

                                            {/* Download CV button - premium only */}
                                            {isPremiumRecruiter ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs"
                                                    disabled={downloadingCv === app.user?.id}
                                                    onClick={() => handleDownloadCv(app.user?.id, app.user?.name || "Applicant")}
                                                >
                                                    {downloadingCv === app.user?.id ? (
                                                        <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Downloading...</>
                                                    ) : (
                                                        <><FileText className="w-3.5 h-3.5 mr-1" /> Download CV</>
                                                    )}
                                                </Button>
                                            ) : (
                                                <Button variant="outline" size="sm" className="text-xs opacity-50 cursor-not-allowed" disabled>
                                                    <Lock className="w-3.5 h-3.5 mr-1" /> CV (Career Boost)
                                                </Button>
                                            )}
                                        </div>
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
