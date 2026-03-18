"use client";

import AwardsSection from "@/components/modules/ResumeSections/AwardsSection";
import CertificationsSection from "@/components/modules/ResumeSections/CertificationsSection";
import EducationSection from "@/components/modules/ResumeSections/EducationSection";
import InterestsSection from "@/components/modules/ResumeSections/InterestsSection";
import LanguagesSection from "@/components/modules/ResumeSections/LanguagesSection";
import PersonalInfoSection from "@/components/modules/ResumeSections/PersonalInfoSection";
import ProfessionalSummarySection from "@/components/modules/ResumeSections/ProfessionalSummarySection";
import ProfileCompletionIndicator from "@/components/modules/ResumeSections/ProfileCompletionIndicator";
import ProjectsSection from "@/components/modules/ResumeSections/ProjectsSection";
import ReferencesSection from "@/components/modules/ResumeSections/ReferencesSection";
import SkillsSection from "@/components/modules/ResumeSections/SkillsSection";
import WorkExperienceSection from "@/components/modules/ResumeSections/WorkExperienceSection";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyResume, updateMyResume } from "@/services/resume.services";
import { IUpdateResumePayload, updateResumeZodSchema } from "@/zod/resume.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function MyResumePage() {
    const [selectedTab, setSelectedTab] = useState("personal");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Fetch resume data
    const {
        data: resumeData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["myResume"],
        queryFn: async () => {
            const response = await getMyResume();
            return response.data;
        },
    });

    // Setup form
    const form = useForm<IUpdateResumePayload>({
        resolver: zodResolver(updateResumeZodSchema),
        defaultValues: {},
        mode: "onChange",
    });

    // Update form when resume data loads
    useEffect(() => {
        if (resumeData) {
            const convertedData = convertDatesToStrings(resumeData);
            form.reset({
                fullName: convertedData.fullName,
                email: convertedData.email,
                professionalTitle: convertedData.professionalTitle,
                contactNumber: convertedData.contactNumber,
                dateOfBirth: convertedData.dateOfBirth,
                gender: convertedData.gender,
                nationality: convertedData.nationality,
                address: convertedData.address,
                linkedinUrl: convertedData.linkedinUrl,
                githubUrl: convertedData.githubUrl,
                portfolioUrl: convertedData.portfolioUrl,
                websiteUrl: convertedData.websiteUrl,
                professionalSummary: convertedData.professionalSummary,
                technicalSkills: convertedData.technicalSkills || [],
                softSkills: convertedData.softSkills || [],
                toolsAndTechnologies: convertedData.toolsAndTechnologies || [],
                workExperience: convertedData.workExperience || [],
                education: convertedData.education || [],
                certifications: convertedData.certifications || [],
                projects: convertedData.projects || [],
                languages: convertedData.languages || [],
                awards: convertedData.awards || [],
                interests: convertedData.interests || [],
                references: convertedData.references || [],
            });
        }
    }, [resumeData, form]);

    // Watch form changes
    useEffect(() => {
        const subscription = form.watch(() => {
            setHasUnsavedChanges(true);
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    // Helper function to convert dates to strings recursively
    const convertDatesToStrings = (obj: any): any => {
        if (obj === null || obj === undefined) return obj;
        if (obj instanceof Date) return obj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        if (Array.isArray(obj)) return obj.map(item => convertDatesToStrings(item));
        if (typeof obj === 'object') {
            const converted: any = {};
            for (const key in obj) {
                converted[key] = convertDatesToStrings(obj[key]);
            }
            return converted;
        }
        return obj;
    };

    // Update resume mutation
    const updateMutation = useMutation({
        mutationFn: async (data: IUpdateResumePayload) => {
            const response = await updateMyResume(data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Resume updated successfully!", {
                description: "Your changes have been saved.",
            });
            setHasUnsavedChanges(false);
            const convertedData = convertDatesToStrings(data);
            form.reset(convertedData);
        },
        onError: (error: any) => {
            console.error("Error updating resume:", error);
            toast.error("Failed to update resume", {
                description: error?.message || "Please try again later.",
            });
        },
    });

    const onSubmit = (data: IUpdateResumePayload) => {
        updateMutation.mutate(data);
    };

    const handleSaveSection = () => {
        form.handleSubmit(onSubmit)();
    };

    if (error) {
        return (
            <div className="container py-10">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle>Error Loading Resume</CardTitle>
                        <CardDescription>
                            Failed to load your resume data. Please try again.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container py-10 space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="container py-10">
            <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">My Resume</h1>
                    <p className="text-muted-foreground">
                        Build and manage your professional resume/CV
                    </p>
                </div>

                {/* Profile Completion Indicator */}
                {resumeData && (
                    <ProfileCompletionIndicator
                        profileCompletion={resumeData.profileCompletion as number}
                    />
                )}

                {/* Resume Form */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Tabs
                        value={selectedTab}
                        onValueChange={setSelectedTab}
                        className="w-full"
                    >
                        <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full">
                            <TabsTrigger value="personal">Personal</TabsTrigger>
                            <TabsTrigger value="summary">Summary</TabsTrigger>
                            <TabsTrigger value="skills">Skills</TabsTrigger>
                            <TabsTrigger value="experience">Experience</TabsTrigger>
                            <TabsTrigger value="education">Education</TabsTrigger>
                            <TabsTrigger value="certifications">Certs</TabsTrigger>
                        </TabsList>

                        {/* Tab: Personal Information */}
                        <TabsContent value="personal" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>
                                        Your basic contact and professional details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PersonalInfoSection form={form} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab: Professional Summary */}
                        <TabsContent value="summary" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Professional Summary</CardTitle>
                                    <CardDescription>
                                        A brief introduction to your professional background
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ProfessionalSummarySection form={form} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab: Skills */}
                        <TabsContent value="skills" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Skills</CardTitle>
                                    <CardDescription>
                                        Organize your skills into categories
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SkillsSection form={form} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab: Work Experience */}
                        <TabsContent value="experience" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Work Experience</CardTitle>
                                    <CardDescription>
                                        Add your professional work history
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <WorkExperienceSection form={form} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab: Education */}
                        <TabsContent value="education" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Education</CardTitle>
                                    <CardDescription>
                                        Your academic background
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <EducationSection form={form} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab: Certifications */}
                        <TabsContent value="certifications" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Certifications</CardTitle>
                                    <CardDescription>
                                        Professional certifications and credentials
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <CertificationsSection form={form} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Additional Sections Below Tabs */}
                    <div className="space-y-6">
                        {/* Projects */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Projects</CardTitle>
                                <CardDescription>
                                    Showcase your notable projects
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ProjectsSection form={form} />
                            </CardContent>
                        </Card>

                        {/* Languages */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Languages</CardTitle>
                                <CardDescription>
                                    Languages you speak and your proficiency level
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LanguagesSection form={form} />
                            </CardContent>
                        </Card>

                        {/* Awards */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Awards & Achievements</CardTitle>
                                <CardDescription>
                                    Recognition and awards you've received
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AwardsSection form={form} />
                            </CardContent>
                        </Card>

                        {/* Interests */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Interests</CardTitle>
                                <CardDescription>
                                    Your professional interests and hobbies
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <InterestsSection form={form} />
                            </CardContent>
                        </Card>

                        {/* References */}
                        <Card>
                            <CardHeader>
                                <CardTitle>References</CardTitle>
                                <CardDescription>
                                    Professional references (optional)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ReferencesSection form={form} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <Button variant="outline" type="button" onClick={() => form.reset()}>
                            Discard Changes
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                !hasUnsavedChanges ||
                                updateMutation.isPending
                            }
                        >
                            {updateMutation.isPending ? "Saving..." : "Save Resume"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
