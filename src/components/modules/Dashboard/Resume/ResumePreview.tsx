"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Github, Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";

interface ResumePreviewProps {
    values: any;
}

const formatDate = (d: string | undefined) => {
    if (!d) return "Present";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const parseSkills = (val: string | string[] | undefined): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.split(",").map((s: string) => s.trim()).filter(Boolean);
};

const ResumePreview = ({ values }: ResumePreviewProps) => {
    const technicalSkills = parseSkills(values.technicalSkills);
    const softSkills = parseSkills(values.softSkills);
    const tools = parseSkills(values.toolsAndTechnologies);
    const interests = parseSkills(values.interests);

    return (
        <div className="bg-white text-black p-8 shadow-lg border rounded-lg min-h-200 text-[11px] leading-relaxed">
            {/* Header */}
            <div className="text-center border-b-2 border-[#1e3a5f] pb-4 mb-4">
                <h1 className="text-xl font-bold text-[#1e3a5f] tracking-wide">
                    {values.fullName || "Your Name"}
                </h1>
                {values.professionalTitle && (
                    <p className="text-xs text-gray-500 mt-0.5">{values.professionalTitle}</p>
                )}
                <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-gray-600 flex-wrap">
                    {values.email && (
                        <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {values.email}
                        </span>
                    )}
                    {values.contactNumber && (
                        <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {values.contactNumber}
                        </span>
                    )}
                    {values.address && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {values.address}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-center gap-3 mt-1 text-[10px] text-gray-500 flex-wrap">
                    {values.linkedinUrl && (
                        <span className="flex items-center gap-1">
                            <Linkedin className="w-3 h-3" /> LinkedIn
                        </span>
                    )}
                    {values.githubUrl && (
                        <span className="flex items-center gap-1">
                            <Github className="w-3 h-3" /> GitHub
                        </span>
                    )}
                    {values.portfolioUrl && (
                        <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Portfolio
                        </span>
                    )}
                </div>
            </div>

            {/* Professional Summary */}
            {values.professionalSummary && (
                <section className="mb-4">
                    <h2 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        Professional Summary
                    </h2>
                    <p className="text-gray-700 leading-snug">{values.professionalSummary}</p>
                </section>
            )}

            {/* Skills */}
            {(technicalSkills.length > 0 || softSkills.length > 0 || tools.length > 0) && (
                <section className="mb-4">
                    <h2 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        Skills
                    </h2>
                    <div className="space-y-1.5">
                        {technicalSkills.length > 0 && (
                            <div>
                                <span className="font-semibold">Technical: </span>
                                <span className="text-gray-700">{technicalSkills.join(", ")}</span>
                            </div>
                        )}
                        {softSkills.length > 0 && (
                            <div>
                                <span className="font-semibold">Soft Skills: </span>
                                <span className="text-gray-700">{softSkills.join(", ")}</span>
                            </div>
                        )}
                        {tools.length > 0 && (
                            <div>
                                <span className="font-semibold">Tools: </span>
                                <span className="text-gray-700">{tools.join(", ")}</span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Work Experience */}
            {values.workExperience?.length > 0 && values.workExperience.some((e: any) => e.jobTitle) && (
                <section className="mb-4">
                    <h2 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        Work Experience
                    </h2>
                    <div className="space-y-3">
                        {values.workExperience.filter((e: any) => e.jobTitle).map((exp: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-[11px]">{exp.jobTitle}</h3>
                                    <span className="text-[10px] text-gray-500">
                                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                    </span>
                                </div>
                                {exp.companyName && (
                                    <p className="text-gray-500 italic text-[10px]">{exp.companyName}</p>
                                )}
                                {exp.responsibilities && (
                                    <ul className="mt-1 space-y-0.5">
                                        {(typeof exp.responsibilities === "string"
                                            ? exp.responsibilities.split(",").map((s: string) => s.trim()).filter(Boolean)
                                            : exp.responsibilities
                                        ).map((r: string, j: number) => (
                                            <li key={j} className="text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-[#1e3a5f]">
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {values.education?.length > 0 && values.education.some((e: any) => e.degree) && (
                <section className="mb-4">
                    <h2 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        Education
                    </h2>
                    <div className="space-y-2">
                        {values.education.filter((e: any) => e.degree).map((edu: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-[11px]">
                                        {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                                    </h3>
                                    <span className="text-[10px] text-gray-500">
                                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                    </span>
                                </div>
                                {edu.institutionName && (
                                    <p className="text-gray-500 text-[10px]">{edu.institutionName}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {values.projects?.length > 0 && values.projects.some((p: any) => p.projectName) && (
                <section className="mb-4">
                    <h2 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        Projects
                    </h2>
                    <div className="space-y-2">
                        {values.projects.filter((p: any) => p.projectName).map((proj: any, i: number) => (
                            <div key={i}>
                                <h3 className="font-semibold text-[11px]">{proj.projectName}</h3>
                                {proj.description && (
                                    <p className="text-gray-700 text-[10px] mt-0.5">{proj.description}</p>
                                )}
                                {proj.technologiesUsed && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {(typeof proj.technologiesUsed === "string"
                                            ? proj.technologiesUsed.split(",").map((s: string) => s.trim()).filter(Boolean)
                                            : proj.technologiesUsed
                                        ).map((tech: string, j: number) => (
                                            <Badge key={j} variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {values.certifications?.length > 0 && values.certifications.some((c: any) => c.certificationName) && (
                <section className="mb-4">
                    <h2 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        Certifications
                    </h2>
                    <div className="space-y-1.5">
                        {values.certifications.filter((c: any) => c.certificationName).map((cert: any, i: number) => (
                            <div key={i} className="flex justify-between items-baseline">
                                <div>
                                    <span className="font-semibold">{cert.certificationName}</span>
                                    {cert.issuingOrganization && <span className="text-gray-500"> - {cert.issuingOrganization}</span>}
                                </div>
                                <span className="text-[10px] text-gray-500">{formatDate(cert.issueDate)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages */}
            {values.languages?.length > 0 && values.languages.some((l: any) => l.language) && (
                <section className="mb-4">
                    <h2 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        Languages
                    </h2>
                    <p className="text-gray-700">
                        {values.languages.filter((l: any) => l.language).map((l: any) => `${l.language} (${l.proficiencyLevel || "N/A"})`).join("  |  ")}
                    </p>
                </section>
            )}

            {/* Awards */}
            {values.awards?.length > 0 && values.awards.some((a: any) => a.title) && (
                <section className="mb-4">
                    <h2 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        Awards
                    </h2>
                    {values.awards.filter((a: any) => a.title).map((award: any, i: number) => (
                        <div key={i} className="flex justify-between items-baseline">
                            <span><span className="font-semibold">{award.title}</span> - {award.issuer}</span>
                            <span className="text-[10px] text-gray-500">{formatDate(award.date)}</span>
                        </div>
                    ))}
                </section>
            )}

            {/* References */}
            {values.references?.length > 0 && values.references.some((r: any) => r.name) && (
                <section className="mb-4">
                    <h2 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        References
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        {values.references.filter((r: any) => r.name).map((ref: any, i: number) => (
                            <div key={i}>
                                <p className="font-semibold">{ref.name}</p>
                                {ref.designation && <p className="text-[10px] text-gray-500">{ref.designation}{ref.company ? ` at ${ref.company}` : ""}</p>}
                                {ref.email && <p className="text-[10px] text-gray-500">{ref.email}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Interests */}
            {interests.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        Interests
                    </h2>
                    <p className="text-gray-700">{interests.join(", ")}</p>
                </section>
            )}
        </div>
    );
};

export default ResumePreview;
