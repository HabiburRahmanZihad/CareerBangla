"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Github, Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";

interface ResumeTwoPageLayoutProps {
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

const ResumeTwoPageLayout = ({ values }: ResumeTwoPageLayoutProps) => {
    const technicalSkills = parseSkills(values.technicalSkills);
    const softSkills = parseSkills(values.softSkills);
    const tools = parseSkills(values.toolsAndTechnologies);
    const interests = parseSkills(values.interests);

    const validProjects = (values.projects || []).filter((p: any) => p.projectName);
    const validEducation = (values.education || []).filter((e: any) => e.degree);
    const validLanguages = (values.languages || []).filter((l: any) => l.language);
    const validWorkExp = (values.workExperience || []).filter((w: any) => w.jobTitle);
    const validCertifications = (values.certifications || []).filter((c: any) => c.certificationName);
    const validAwards = (values.awards || []).filter((a: any) => a.title);
    const validReferences = (values.references || []).filter((r: any) => r.name);

    return (
        <div className="bg-white text-black leading-tight">
            {/* ========== PAGE 1 ========== */}
            <div className="min-h-screen p-10 border-b-4 border-gray-300" style={{ pageBreakAfter: "always" }}>
                {/* HEADER */}
                <div className="text-center border-b-2 border-[#1a3a52] pb-3 mb-4">
                    <h1 className="text-3xl font-bold text-[#1a3a52] tracking-wider">
                        {values.fullName || "YOUR NAME"}
                    </h1>
                    {values.professionalTitle && (
                        <p className="text-sm font-semibold text-gray-700 mt-1">{values.professionalTitle}</p>
                    )}

                    {/* Contact Info */}
                    <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-700 flex-wrap">
                        {values.contactNumber && (
                            <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" /> {values.contactNumber}
                            </span>
                        )}
                        {values.email && (
                            <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" /> {values.email}
                            </span>
                        )}
                        {values.address && (
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" /> {values.address}
                            </span>
                        )}
                    </div>

                    {/* Links/URLs */}
                    <div className="flex items-center justify-center gap-4 mt-1.5 text-xs text-blue-600 flex-wrap">
                        {values.githubUrl && (
                            <a href={values.githubUrl} className="flex items-center gap-1 hover:underline">
                                <Github className="w-3.5 h-3.5" /> Github
                            </a>
                        )}
                        {values.linkedinUrl && (
                            <a href={values.linkedinUrl} className="flex items-center gap-1 hover:underline">
                                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                            </a>
                        )}
                        {values.portfolioUrl && (
                            <a href={values.portfolioUrl} className="flex items-center gap-1 hover:underline">
                                <Globe className="w-3.5 h-3.5" /> Portfolio
                            </a>
                        )}
                    </div>
                </div>

                {/* CAREER OBJECTIVE */}
                {values.professionalSummary && (
                    <section className="mb-3">
                        <h2 className="text-xs font-bold text-[#1a3a52] uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                            Career Objective
                        </h2>
                        <p className="text-xs text-gray-800 leading-relaxed">{values.professionalSummary}</p>
                    </section>
                )}

                {/* SKILLS */}
                {(technicalSkills.length > 0 || softSkills.length > 0 || tools.length > 0) && (
                    <section className="mb-3">
                        <h2 className="text-xs font-bold text-[#1a3a52] uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                            Skills
                        </h2>
                        <div className="space-y-1">
                            {technicalSkills.length > 0 && (
                                <div>
                                    <span className="font-semibold text-xs">Frontend:</span>
                                    <span className="text-xs text-gray-800 ml-1">
                                        {technicalSkills.slice(0, 4).join(", ")}
                                        {technicalSkills.length > 4 && `, ${technicalSkills.slice(4).join(", ")}`}
                                    </span>
                                </div>
                            )}
                            {softSkills.length > 0 && (
                                <div>
                                    <span className="font-semibold text-xs">Soft Skills:</span>
                                    <span className="text-xs text-gray-800 ml-1">{softSkills.join(", ")}</span>
                                </div>
                            )}
                            {tools.length > 0 && (
                                <div>
                                    <span className="font-semibold text-xs">Tools & Platforms:</span>
                                    <span className="text-xs text-gray-800 ml-1">{tools.join(", ")}</span>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* PROJECTS - Up to 3 on page 1 */}
                {validProjects.length > 0 && (
                    <section className="mb-3">
                        <h2 className="text-xs font-bold text-[#1a3a52] uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                            Projects
                        </h2>
                        <div className="space-y-2">
                            {validProjects.slice(0, 3).map((proj: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline gap-2">
                                        <h3 className="font-bold text-xs text-[#1a3a52]">{proj.projectName}</h3>
                                        {proj.liveUrl && (
                                            <a href={proj.liveUrl} className="text-blue-600 text-[10px] underline whitespace-nowrap">
                                                LIVE
                                            </a>
                                        )}
                                        {proj.githubUrl && (
                                            <a href={proj.githubUrl} className="text-blue-600 text-[10px] underline whitespace-nowrap">
                                                SERVER
                                            </a>
                                        )}
                                    </div>
                                    {proj.description && (
                                        <p className="text-xs text-gray-800 leading-tight mb-1">{proj.description}</p>
                                    )}
                                    {proj.technologiesUsed && (
                                        <div className="mb-1">
                                            <span className="font-semibold text-[10px]">Technologies:</span>
                                            <span className="text-xs text-gray-700 ml-1">
                                                {(typeof proj.technologiesUsed === "string"
                                                    ? proj.technologiesUsed.split(",").map((s: string) => s.trim()).filter(Boolean)
                                                    : proj.technologiesUsed
                                                ).join(", ")}
                                            </span>
                                        </div>
                                    )}
                                    {proj.highlights && (
                                        <ul className="text-xs text-gray-800 space-y-0.5">
                                            {(typeof proj.highlights === "string"
                                                ? proj.highlights.split(",").map((s: string) => s.trim()).filter(Boolean)
                                                : proj.highlights
                                            ).slice(0, 2).map((highlight: string, j: number) => (
                                                <li key={j} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#1a3a52]">
                                                    {highlight}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* EDUCATION */}
                {validEducation.length > 0 && (
                    <section className="mb-3">
                        <h2 className="text-xs font-bold text-[#1a3a52] uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                            Education
                        </h2>
                        <div className="space-y-1.5">
                            {validEducation.map((edu: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline gap-2">
                                        <h3 className="font-semibold text-xs text-gray-800">
                                            {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                                        </h3>
                                        <span className="text-[10px] text-gray-600 whitespace-nowrap">
                                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                        </span>
                                    </div>
                                    {edu.institutionName && (
                                        <p className="text-xs text-gray-700">{edu.institutionName}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* LANGUAGES */}
                {validLanguages.length > 0 && (
                    <section className="mb-3">
                        <h2 className="text-xs font-bold text-[#1a3a52] uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                            Languages
                        </h2>
                        <ul className="text-xs text-gray-800 space-y-0.5">
                            {validLanguages.map((l: any, i: number) => (
                                <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#1a3a52]">
                                    {l.language} ({l.proficiencyLevel || "N/A"})
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            {/* ========== PAGE 2 ========== */}
            {(validProjects.length > 3 || validWorkExp.length > 0 || validCertifications.length > 0 || validAwards.length > 0 || validReferences.length > 0 || interests.length > 0) && (
                <div className="min-h-screen p-10">
                    {/* Header on page 2 */}
                    <div className="mb-4 pb-2 border-b-2 border-[#1a3a52]">
                        <h1 className="text-xl font-bold text-[#1a3a52]">{values.fullName || "YOUR NAME"}</h1>
                        <p className="text-xs text-gray-600">Continued</p>
                    </div>

                    {/* WORK EXPERIENCE */}
                    {validWorkExp.length > 0 && (
                        <section className="mb-4">
                            <h2 className="text-xs font-bold text-[#1a3a52] uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                                Work Experience
                            </h2>
                            <div className="space-y-2">
                                {validWorkExp.map((exp: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline gap-2">
                                            <h3 className="font-semibold text-xs text-gray-800">{exp.jobTitle}</h3>
                                            <span className="text-[10px] text-gray-600 whitespace-nowrap">
                                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                            </span>
                                        </div>
                                        {exp.companyName && (
                                            <p className="text-xs text-gray-700 italic">{exp.companyName}</p>
                                        )}
                                        {exp.responsibilities && (
                                            <ul className="mt-1 space-y-0.5">
                                                {(typeof exp.responsibilities === "string"
                                                    ? exp.responsibilities.split(",").map((s: string) => s.trim()).filter(Boolean)
                                                    : exp.responsibilities
                                                ).map((r: string, j: number) => (
                                                    <li key={j} className="text-xs text-gray-800 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-[#1a3a52]">
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

                    {/* ADDITIONAL PROJECTS */}
                    {validProjects.length > 3 && (
                        <section className="mb-4">
                            <h2 className="text-xs font-bold text-[#1a3a52] uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                                Additional Projects
                            </h2>
                            <div className="space-y-2">
                                {validProjects.slice(3).map((proj: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline gap-2">
                                            <h3 className="font-bold text-xs text-[#1a3a52]">{proj.projectName}</h3>
                                            {proj.liveUrl && (
                                                <a href={proj.liveUrl} className="text-blue-600 text-[10px] underline">
                                                    LIVE
                                                </a>
                                            )}
                                        </div>
                                        {proj.description && (
                                            <p className="text-xs text-gray-800">{proj.description}</p>
                                        )}
                                        {proj.technologiesUsed && (
                                            <span className="text-[10px] text-gray-700">
                                                {(typeof proj.technologiesUsed === "string"
                                                    ? proj.technologiesUsed.split(",").map((s: string) => s.trim()).filter(Boolean)
                                                    : proj.technologiesUsed
                                                ).join(", ")}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* CERTIFICATIONS */}
                    {validCertifications.length > 0 && (
                        <section className="mb-4">
                            <h2 className="text-xs font-bold text-[#1a3a52] uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                                Certifications
                            </h2>
                            <div className="space-y-1">
                                {validCertifications.map((cert: any, i: number) => (
                                    <div key={i} className="flex justify-between items-baseline gap-2">
                                        <div>
                                            <span className="font-semibold text-xs">{cert.certificationName}</span>
                                            {cert.issuingOrganization && (
                                                <span className="text-gray-700 text-xs"> - {cert.issuingOrganization}</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-600 whitespace-nowrap">{formatDate(cert.issueDate)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* AWARDS */}
                    {validAwards.length > 0 && (
                        <section className="mb-4">
                            <h2 className="text-xs font-bold text-[#1a3a52] uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                                Awards & Achievements
                            </h2>
                            <div className="space-y-1">
                                {validAwards.map((award: any, i: number) => (
                                    <div key={i} className="flex justify-between items-baseline gap-2">
                                        <div>
                                            <span className="font-semibold text-xs">{award.title}</span>
                                            {award.issuer && (
                                                <span className="text-gray-700 text-xs"> - {award.issuer}</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-600 whitespace-nowrap">{formatDate(award.date)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* REFERENCES */}
                    {validReferences.length > 0 && (
                        <section className="mb-4">
                            <h2 className="text-xs font-bold text-[#1a3a52] uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                                References
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {validReferences.map((ref: any, i: number) => (
                                    <div key={i}>
                                        <p className="font-semibold text-xs">{ref.name}</p>
                                        {ref.designation && (
                                            <p className="text-[10px] text-gray-600">
                                                {ref.designation}{ref.company ? ` at ${ref.company}` : ""}
                                            </p>
                                        )}
                                        {ref.email && <p className="text-[10px] text-gray-600">{ref.email}</p>}
                                        {ref.phone && <p className="text-[10px] text-gray-600">{ref.phone}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* INTERESTS */}
                    {interests.length > 0 && (
                        <section className="mb-4">
                            <h2 className="text-xs font-bold text-[#1a3a52] uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                                Interests
                            </h2>
                            <p className="text-xs text-gray-800">{interests.join(", ")}</p>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResumeTwoPageLayout;
