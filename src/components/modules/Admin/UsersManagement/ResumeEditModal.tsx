/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { downloadPdfFromElement } from "@/lib/pdfUtils";
import { IAward, ICertification, IEducation, ILanguage, IProject, IReference, IResume, IWorkExperience } from "@/types/user.types";
import { Award, BookOpen, Briefcase, Code2, Download, Edit2, FileText, Globe, Lightbulb, Link as LinkIcon, MessageSquare, PhoneIcon, Plus, Trophy, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ResumeEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resume: IResume | null | undefined;
    onSave: (resume: Partial<IResume>) => Promise<void>;
    isLoading?: boolean;
}

export const ResumeEditModal = ({ open, onOpenChange, resume, onSave, isLoading }: ResumeEditModalProps) => {
    const [activeTab, setActiveTab] = useState<"basic" | "skills" | "experience" | "education" | "certifications" | "projects" | "languages" | "awards" | "references">("basic");
    const [localResume, setLocalResume] = useState<Partial<IResume>>(resume || {});
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setLocalResume(resume || {});
            setActiveTab("basic");
            setIsEditing(false);
        }
        onOpenChange(newOpen);
    };

    const handleCancel = () => {
        if (isEditing) {
            setLocalResume(resume || {});
            setIsEditing(false);
        } else {
            handleOpenChange(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await onSave(localResume);
            handleOpenChange(false);
            toast.success("Resume updated successfully");
        } catch (error) {
            console.error("Failed to save resume:", error);
            toast.error("Failed to save resume");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true);
            const fileName = `${localResume.fullName || "Resume"}.pdf`;
            await downloadPdfFromElement("resume-pdf-content", fileName);
            toast.success("Resume downloaded successfully");
        } catch (error) {
            console.error("Failed to download resume:", error);
            toast.error("Failed to download resume");
        } finally {
            setIsDownloading(false);
        }
    };

    const updateArrayField = <T,>(field: keyof IResume, index: number, updates: Partial<T>) => {
        const current = (localResume[field] as T[]) || [];
        const updated = [...current];
        updated[index] = { ...updated[index], ...updates };
        setLocalResume(prev => ({
            ...prev,
            [field]: updated
        }));
    };

    const addArrayItem = <T extends object>(field: keyof IResume, template: T) => {
        const current = (localResume[field] as T[]) || [];
        setLocalResume(prev => ({
            ...prev,
            [field]: [...current, template]
        }));
    };

    const removeArrayItem = (field: keyof IResume, index: number) => {
        const current = (localResume[field] as any[]) || [];
        setLocalResume(prev => ({
            ...prev,
            [field]: current.filter((_, i) => i !== index)
        }));
    };

    const updateSkillsArray = (field: "technicalSkills" | "softSkills" | "toolsAndTechnologies" | "languages", value: string) => {
        const skills = value.split(",").map(s => s.trim()).filter(s => s);
        setLocalResume(prev => ({
            ...prev,
            [field]: skills
        }));
    };

    const getSkillsString = (field: "technicalSkills" | "softSkills" | "toolsAndTechnologies" | "languages") => {
        return ((localResume[field] as string[]) || []).join(", ");
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white border-0 rounded-2xl shadow-2xl">
                {/* ── Premium Header ────────────────────────────────────────────── */}
                <div className="sticky top-0 z-50 bg-linear-to-r from-primary/10 to-orange-600/10 border-b border-border/40 px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-10 w-10 rounded-lg bg-linear-to-br from-primary to-orange-600 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <DialogTitle className="text-2xl font-black bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                                    {isEditing ? "Resume Editor" : "Resume View"}
                                </DialogTitle>
                            </div>
                            <DialogDescription className="text-sm ml-13">
                                {isEditing ? "✏️ Edit resume information" : "📋 View resume details"}
                            </DialogDescription>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleDownloadPDF}
                                disabled={isDownloading || !localResume.fullName}
                                className="rounded-lg border-border/40 hover:bg-muted/50"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                {isDownloading ? "Downloading..." : "Download"}
                            </Button>
                            {!isEditing && (
                                <Button
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                    className="rounded-lg bg-primary hover:bg-orange-700"
                                >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            )}
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleOpenChange(false)}
                                className="h-8 w-8 rounded-lg hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div id="resume-pdf-content" className="space-y-6 px-1">
                    <div className="flex gap-2 border-b pb-4 overflow-x-auto">
                        {[
                            { id: "basic", label: "Basic Info" },
                            { id: "skills", label: "Skills" },
                            { id: "experience", label: "Experience" },
                            { id: "education", label: "Education" },
                            { id: "certifications", label: "Certifications" },
                            { id: "projects", label: "Projects" },
                            { id: "languages", label: "Languages" },
                            { id: "awards", label: "Awards" },
                            { id: "references", label: "References" }
                        ].map(tab => (
                            <button
                                disabled={isEditing}
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                    } ${isEditing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6 py-2">
                        {/* Basic Info Tab */}
                        {activeTab === "basic" && (
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={localResume.fullName || ""}
                                            onChange={e => setLocalResume(prev => ({ ...prev, fullName: e.target.value }))}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Professional Title</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={localResume.professionalTitle || ""}
                                            onChange={e => setLocalResume(prev => ({ ...prev, professionalTitle: e.target.value }))}
                                            placeholder="Full Stack Developer"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Professional Summary</Label>
                                    <Textarea
                                        disabled={!isEditing}
                                        value={localResume.professionalSummary || ""}
                                        onChange={e => setLocalResume(prev => ({ ...prev, professionalSummary: e.target.value }))}
                                        placeholder="Brief professional summary..."
                                        rows={4}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={localResume.email || ""}
                                            onChange={e => setLocalResume(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={localResume.contactNumber || ""}
                                            onChange={e => setLocalResume(prev => ({ ...prev, contactNumber: e.target.value }))}
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={localResume.address || ""}
                                            onChange={e => setLocalResume(prev => ({ ...prev, address: e.target.value }))}
                                            placeholder="City, Country"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Portfolio URL</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={localResume.portfolioUrl || ""}
                                            onChange={e => setLocalResume(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                                            placeholder="https://portfolio.com"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label>LinkedIn Profile</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={localResume.linkedinUrl || ""}
                                            onChange={e => setLocalResume(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                                            placeholder="https://linkedin.com/in/john"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>GitHub Profile</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={localResume.githubUrl || ""}
                                            onChange={e => setLocalResume(prev => ({ ...prev, githubUrl: e.target.value }))}
                                            placeholder="https://github.com/john"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Skills Tab */}
                        {activeTab === "skills" && (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label>Technical Skills (comma-separated)</Label>
                                    <Textarea
                                        disabled={!isEditing}
                                        value={getSkillsString("technicalSkills")}
                                        onChange={e => updateSkillsArray("technicalSkills", e.target.value)}
                                        placeholder="JavaScript, React, Node.js, Python..."
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Soft Skills (comma-separated)</Label>
                                    <Textarea
                                        disabled={!isEditing}
                                        value={getSkillsString("softSkills")}
                                        onChange={e => updateSkillsArray("softSkills", e.target.value)}
                                        placeholder="Leadership, Communication, Problem-solving..."
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tools & Technologies (comma-separated)</Label>
                                    <Textarea
                                        disabled={!isEditing}
                                        value={getSkillsString("toolsAndTechnologies")}
                                        onChange={e => updateSkillsArray("toolsAndTechnologies", e.target.value)}
                                        placeholder="Git, Docker, AWS, PostgreSQL..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Work Experience Tab */}
                        {activeTab === "experience" && (
                            <div className="space-y-5">
                                {(localResume.workExperience || []).map((exp, idx) => (
                                    <Card key={idx}>
                                        <CardHeader className="flex flex-row items-start justify-between pb-3">
                                            <CardTitle className="text-base">{exp.companyName || "Company"}</CardTitle>
                                            <Button
                                                disabled={!isEditing}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeArrayItem("workExperience", idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Company Name"
                                                    value={exp.companyName || ""}
                                                    onChange={e => updateArrayField<IWorkExperience>("workExperience", idx, { companyName: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Job Title"
                                                    value={exp.jobTitle || ""}
                                                    onChange={e => updateArrayField<IWorkExperience>("workExperience", idx, { jobTitle: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Start Date (YYYY-MM)"
                                                    value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ""}
                                                    type="date"
                                                    onChange={e => updateArrayField<IWorkExperience>("workExperience", idx, { startDate: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="End Date (YYYY-MM)"
                                                    value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ""}
                                                    type="date"
                                                    onChange={e => updateArrayField<IWorkExperience>("workExperience", idx, { endDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Textarea
                                                    disabled={!isEditing}
                                                    placeholder="Responsibilities"
                                                    value={((exp.responsibilities || []) as string[]).join("\n") || ""}
                                                    onChange={e => updateArrayField<IWorkExperience>("workExperience", idx, { responsibilities: e.target.value.split("\n") })}
                                                    rows={3}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button
                                    disabled={!isEditing}
                                    variant="outline"
                                    onClick={() => addArrayItem<IWorkExperience>("workExperience", {
                                        companyName: "",
                                        jobTitle: "",
                                        startDate: "",
                                        endDate: "",
                                        id: ""
                                    })}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Experience
                                </Button>
                            </div>
                        )}

                        {/* Education Tab */}
                        {activeTab === "education" && (
                            <div className="space-y-5">
                                {(localResume.education || []).map((edu, idx) => (
                                    <Card key={idx}>
                                        <CardHeader className="flex flex-row items-start justify-between pb-3">
                                            <CardTitle className="text-base">{edu.institutionName || "School"}</CardTitle>
                                            <Button
                                                disabled={!isEditing}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeArrayItem("education", idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="School/University Name"
                                                    value={edu.institutionName || ""}
                                                    onChange={e => updateArrayField<IEducation>("education", idx, { institutionName: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Degree"
                                                    value={edu.degree || ""}
                                                    onChange={e => updateArrayField<IEducation>("education", idx, { degree: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Field of Study"
                                                    value={edu.fieldOfStudy || ""}
                                                    onChange={e => updateArrayField<IEducation>("education", idx, { fieldOfStudy: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="CGPA/Result"
                                                    value={edu.cgpaOrResult || ""}
                                                    onChange={e => updateArrayField<IEducation>("education", idx, { cgpaOrResult: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Start Date"
                                                    type="date"
                                                    value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ""}
                                                    onChange={e => updateArrayField<IEducation>("education", idx, { startDate: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="End Date"
                                                    type="date"
                                                    value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ""}
                                                    onChange={e => updateArrayField<IEducation>("education", idx, { endDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Textarea
                                                    disabled={!isEditing}
                                                    placeholder="Description"
                                                    value={edu.description || ""}
                                                    onChange={e => updateArrayField<IEducation>("education", idx, { description: e.target.value })}
                                                    rows={2}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button
                                    disabled={!isEditing}
                                    variant="outline"
                                    onClick={() => addArrayItem<IEducation>("education", {
                                        institutionName: "",
                                        degree: "",
                                        fieldOfStudy: "",
                                        cgpaOrResult: "",
                                        startDate: "",
                                        endDate: "",
                                        description: "",
                                        id: ""
                                    })}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Education
                                </Button>
                            </div>
                        )}

                        {/* Certifications Tab */}
                        {activeTab === "certifications" && (
                            <div className="space-y-5">
                                {(localResume.certifications || []).map((cert, idx) => (
                                    <Card key={idx}>
                                        <CardHeader className="flex flex-row items-start justify-between pb-3">
                                            <CardTitle className="text-base">{cert.certificationName || cert.name || "Certification"}</CardTitle>
                                            <Button
                                                disabled={!isEditing}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeArrayItem("certifications", idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Certification Name"
                                                    value={cert.certificationName || cert.name || ""}
                                                    onChange={e => updateArrayField<ICertification>("certifications", idx, { certificationName: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Issuing Organization"
                                                    value={cert.issuingOrganization || cert.issuer || ""}
                                                    onChange={e => updateArrayField<ICertification>("certifications", idx, { issuingOrganization: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Issue Date"
                                                    type="date"
                                                    value={cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : ""}
                                                    onChange={e => updateArrayField<ICertification>("certifications", idx, { issueDate: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Expiration Date"
                                                    type="date"
                                                    value={cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : ""}
                                                    onChange={e => updateArrayField<ICertification>("certifications", idx, { expiryDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Credential ID"
                                                    value={cert.credentialId || ""}
                                                    onChange={e => updateArrayField<ICertification>("certifications", idx, { credentialId: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Credential URL"
                                                    value={cert.credentialUrl || ""}
                                                    onChange={e => updateArrayField<ICertification>("certifications", idx, { credentialUrl: e.target.value })}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button
                                    disabled={!isEditing}
                                    variant="outline"
                                    onClick={() => addArrayItem<ICertification>("certifications", {
                                        certificationName: "",
                                        issuingOrganization: "",
                                        issueDate: "",
                                        expiryDate: "",
                                        id: ""
                                    })}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Certification
                                </Button>
                            </div>
                        )}

                        {/* Projects Tab */}
                        {activeTab === "projects" && (
                            <div className="space-y-5">
                                {(localResume.projects || []).map((proj, idx) => (
                                    <Card key={idx}>
                                        <CardHeader className="flex flex-row items-start justify-between pb-3">
                                            <CardTitle className="text-base">{proj.projectName || "Project"}</CardTitle>
                                            <Button
                                                disabled={!isEditing}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeArrayItem("projects", idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Project Name"
                                                    value={proj.projectName || ""}
                                                    onChange={e => updateArrayField<IProject>("projects", idx, { projectName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Your Role"
                                                    value={proj.role || ""}
                                                    onChange={e => updateArrayField<IProject>("projects", idx, { role: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Textarea
                                                    disabled={!isEditing}
                                                    placeholder="Description"
                                                    value={proj.description || ""}
                                                    onChange={e => updateArrayField<IProject>("projects", idx, { description: e.target.value })}
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Live URL"
                                                    value={proj.liveUrl || ""}
                                                    onChange={e => updateArrayField<IProject>("projects", idx, { liveUrl: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Github URL"
                                                    value={proj.githubUrl || ""}
                                                    onChange={e => updateArrayField<IProject>("projects", idx, { githubUrl: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Start Date"
                                                    type="date"
                                                    value={proj.startDate ? new Date(proj.startDate).toISOString().split('T')[0] : ""}
                                                    onChange={e => updateArrayField<IProject>("projects", idx, { startDate: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="End Date"
                                                    type="date"
                                                    value={proj.endDate ? new Date(proj.endDate).toISOString().split('T')[0] : ""}
                                                    onChange={e => updateArrayField<IProject>("projects", idx, { endDate: e.target.value })}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button
                                    disabled={!isEditing}
                                    variant="outline"
                                    onClick={() => addArrayItem<IProject>("projects", {
                                        projectName: "",
                                        description: "",
                                        role: "",
                                        liveUrl: "",
                                        githubUrl: "",
                                        startDate: "",
                                        endDate: "",
                                        id: ""
                                    })}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Project
                                </Button>
                            </div>
                        )}

                        {/* Languages Tab */}
                        {activeTab === "languages" && (
                            <div className="space-y-5">
                                {(localResume.languages || []).map((lang, idx) => (
                                    <Card key={idx}>
                                        <CardHeader className="flex flex-row items-start justify-between pb-3">
                                            <CardTitle className="text-base">{lang.language || "Language"}</CardTitle>
                                            <Button
                                                disabled={!isEditing}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeArrayItem("languages", idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Language Name"
                                                    value={lang.language || ""}
                                                    onChange={e => updateArrayField<ILanguage>("languages", idx, { language: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Select disabled={!isEditing} value={lang.proficiencyLevel || ""} onValueChange={value => updateArrayField<ILanguage>("languages", idx, { proficiencyLevel: value as any })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select proficiency" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                                        <SelectItem value="Fluent">Fluent</SelectItem>
                                                        <SelectItem value="Native">Native</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button
                                    disabled={!isEditing}
                                    variant="outline"
                                    onClick={() => addArrayItem<ILanguage>("languages", {
                                        language: "",
                                        proficiencyLevel: "Intermediate",
                                        id: ""
                                    })}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Language
                                </Button>
                            </div>
                        )}

                        {/* Awards Tab */}
                        {activeTab === "awards" && (
                            <div className="space-y-5">
                                {(localResume.awards || []).map((award, idx) => (
                                    <Card key={idx}>
                                        <CardHeader className="flex flex-row items-start justify-between pb-3">
                                            <CardTitle className="text-base">{award.title || "Award"}</CardTitle>
                                            <Button
                                                disabled={!isEditing}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeArrayItem("awards", idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Award Name"
                                                    value={award.title || ""}
                                                    onChange={e => updateArrayField<IAward>("awards", idx, { title: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Presented By"
                                                    value={award.issuer || ""}
                                                    onChange={e => updateArrayField<IAward>("awards", idx, { issuer: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Date"
                                                    type="date"
                                                    value={award.date ? new Date(award.date).toISOString().split('T')[0] : ""}
                                                    onChange={e => updateArrayField<IAward>("awards", idx, { date: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Textarea
                                                    disabled={!isEditing}
                                                    placeholder="Description"
                                                    value={award.description || ""}
                                                    onChange={e => updateArrayField<IAward>("awards", idx, { description: e.target.value })}
                                                    rows={2}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button
                                    disabled={!isEditing}
                                    variant="outline"
                                    onClick={() => addArrayItem<IAward>("awards", {
                                        title: "",
                                        issuer: "",
                                        date: "",
                                        description: "",
                                        id: ""
                                    })}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Award
                                </Button>
                            </div>
                        )}

                        {/* References Tab */}
                        {activeTab === "references" && (
                            <div className="space-y-5">
                                {(localResume.references || []).map((ref, idx) => (
                                    <Card key={idx}>
                                        <CardHeader className="flex flex-row items-start justify-between pb-3">
                                            <CardTitle className="text-base">{ref.name || "Reference"}</CardTitle>
                                            <Button
                                                disabled={!isEditing}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeArrayItem("references", idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Reference Name"
                                                    value={ref.name || ""}
                                                    onChange={e => updateArrayField<IReference>("references", idx, { name: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Designation"
                                                    value={ref.designation || ""}
                                                    onChange={e => updateArrayField<IReference>("references", idx, { designation: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Company"
                                                    value={ref.company || ""}
                                                    onChange={e => updateArrayField<IReference>("references", idx, { company: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Relationship"
                                                    value={ref.relationship || ""}
                                                    onChange={e => updateArrayField<IReference>("references", idx, { relationship: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Email"
                                                    type="email"
                                                    value={ref.email || ""}
                                                    onChange={e => updateArrayField<IReference>("references", idx, { email: e.target.value })}
                                                />
                                                <Input
                                                    disabled={!isEditing}
                                                    placeholder="Phone"
                                                    value={ref.phone || ""}
                                                    onChange={e => updateArrayField<IReference>("references", idx, { phone: e.target.value })}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button
                                    disabled={!isEditing}
                                    variant="outline"
                                    onClick={() => addArrayItem<IReference>("references", {
                                        name: "",
                                        designation: "",
                                        company: "",
                                        email: "",
                                        phone: "",
                                        relationship: "",
                                        id: ""
                                    })}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Reference
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving || isLoading}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={() => handleOpenChange(false)}>
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
