"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import { Badge } from "@/components/ui/badge";
import { rv } from "@/zod/resume.validation";
import {
    Award,
    BookOpen,
    Briefcase,
    Code2,
    Globe,
    GraduationCap,
    Languages,
    Lightbulb,
    Star,
    User,
    Users,
} from "lucide-react";
import {
    EmptyState,
    FormSection,
    ItemCard,
    LockedBanner,
    type ResumeSectionProps,
    SelectField,
    TextareaField,
} from "./resume-form-helpers";

// ─── Basic Information ───────────────────────────────────────────────────────

export const BasicInfoSection = ({
    form, se, computedIsLocked, isPremium, resume,
}: ResumeSectionProps & { isPremium: boolean; resume: any }) => {
    // Per-field locking: a field locks once it has saved data (free tier only)
    const fl = (field: string) => computedIsLocked || (!isPremium && !!resume?.[field]);
    const anyFieldLocked = !isPremium && (!!resume?.fullName || !!resume?.email || !!resume?.professionalTitle || !!resume?.contactNumber || !!resume?.address || !!resume?.nationality || !!resume?.dateOfBirth || !!resume?.gender);
    return (
        <FormSection icon={User} title="Basic Information" defaultOpen={true} isLocked={computedIsLocked}>
            {anyFieldLocked && <LockedBanner />}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form.Field name="fullName" validators={{ onChange: rv.fullName }}>
                    {(f: any) => <AppField field={f} serverError={se[f.name]} label="Full Name" placeholder="John Doe" disabled={fl("fullName")} />}
                </form.Field>
                <form.Field name="email" validators={{ onChange: rv.email }}>
                    {(f: any) => <AppField field={f} serverError={se[f.name]} label="Email" type="email" placeholder="john@example.com" disabled={fl("email")} />}
                </form.Field>
                <form.Field name="professionalTitle" validators={{ onChange: rv.professionalTitle }}>
                    {(f: any) => <AppField field={f} serverError={se[f.name]} label="Professional Title" placeholder="e.g. Full Stack Developer" disabled={fl("professionalTitle")} />}
                </form.Field>
                <form.Field name="contactNumber" validators={{ onChange: rv.contactNumber }}>
                    {(f: any) => <AppField field={f} serverError={se[f.name]} label="Contact Number" placeholder="01XXXXXXXXX" disabled={fl("contactNumber")} />}
                </form.Field>
                <form.Field name="address" validators={{ onChange: rv.address }}>
                    {(f: any) => <AppField field={f} serverError={se[f.name]} label="Address" placeholder="Dhaka, Bangladesh" disabled={fl("address")} />}
                </form.Field>
                <form.Field name="nationality" validators={{ onChange: rv.nationality }}>
                    {(f: any) => <AppField field={f} serverError={se[f.name]} label="Nationality" placeholder="e.g. Bangladeshi" disabled={fl("nationality")} />}
                </form.Field>
                <form.Field name="dateOfBirth" validators={{ onChange: rv.dateOfBirth }}>
                    {(f: any) => <AppField field={f} serverError={se[f.name]} label="Date of Birth" type="date" disabled={fl("dateOfBirth")} />}
                </form.Field>
                <form.Field name="gender">
                    {(f: any) => (
                        <SelectField field={f} label="Gender" placeholder="Select gender" serverErrors={se} disabled={fl("gender")} options={[
                            { value: "MALE", label: "Male" },
                            { value: "FEMALE", label: "Female" },
                            { value: "OTHER", label: "Other" },
                        ]} />
                    )}
                </form.Field>
            </div>
        </FormSection>
    );
};

// ─── Social Profiles ─────────────────────────────────────────────────────────

export const SocialProfilesSection = ({ form, se }: Pick<ResumeSectionProps, "form" | "se">) => (
    <FormSection icon={Globe} title="Social Profiles" defaultOpen={true}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field name="linkedinUrl" validators={{ onChange: rv.linkedinUrl }}>
                {(f: any) => <AppField field={f} serverError={se[f.name]} label="LinkedIn URL" placeholder="linkedin.com/in/…" />}
            </form.Field>
            <form.Field name="githubUrl" validators={{ onChange: rv.githubUrl }}>
                {(f: any) => <AppField field={f} serverError={se[f.name]} label="GitHub URL" placeholder="github.com/…" />}
            </form.Field>
            <form.Field name="portfolioUrl" validators={{ onChange: rv.portfolioUrl }}>
                {(f: any) => <AppField field={f} serverError={se[f.name]} label="Portfolio URL" placeholder="https://…" />}
            </form.Field>
        </div>
    </FormSection>
);

// ─── Skills & Summary ────────────────────────────────────────────────────────

export const SkillsSummarySection = ({
    form, se, computedIsLocked, isPremium, resume,
}: ResumeSectionProps & { isPremium: boolean; resume: any }) => {
    // Per-field locking: a field locks once it has saved data (free tier only)
    const fl = (field: string) => computedIsLocked || (!isPremium && !!(Array.isArray(resume?.[field]) ? resume[field].length : resume?.[field]));
    const anyFieldLocked = !isPremium && (!!resume?.technicalSkills?.length || !!resume?.softSkills?.length || !!resume?.toolsAndTechnologies?.length || !!resume?.professionalSummary);
    return (
        <FormSection icon={Code2} title="Skills & Summary" defaultOpen={true} isLocked={computedIsLocked}>
            {anyFieldLocked && <LockedBanner />}
            <div className="space-y-4">
                <form.Field name="technicalSkills" validators={{ onChange: rv.technicalSkills }}>
                    {(f: any) => <AppField field={f} serverError={se[f.name]} label="Technical Skills" placeholder="React, TypeScript, Node.js, …  (comma-separated)" disabled={fl("technicalSkills")} />}
                </form.Field>
                <form.Field name="softSkills" validators={{ onChange: rv.softSkills }}>
                    {(f: any) => <AppField field={f} serverError={se[f.name]} label="Soft Skills" placeholder="Communication, Leadership, …  (comma-separated)" disabled={fl("softSkills")} />}
                </form.Field>
                <form.Field name="toolsAndTechnologies" validators={{ onChange: rv.toolsAndTechnologies }}>
                    {(f: any) => <AppField field={f} serverError={se[f.name]} label="Tools & Technologies" placeholder="Git, Docker, Figma, …  (comma-separated)" disabled={fl("toolsAndTechnologies")} />}
                </form.Field>
                <form.Field name="interests" validators={{ onChange: rv.interests }}>
                    {(f: any) => <AppField field={f} serverError={se[f.name]} label="Interests" placeholder="Open Source, Reading, …  (comma-separated)" disabled={fl("interests")} />}
                </form.Field>
                <form.Field name="professionalSummary" validators={{ onChange: rv.professionalSummary }}>
                    {(f: any) => (
                        <TextareaField
                            field={f}
                            label="Professional Summary"
                            placeholder="A concise overview of your experience, skills, and career goals…"
                            hint="A strong summary significantly boosts your ATS score."
                            serverErrors={se}
                            disabled={fl("professionalSummary")}
                        />
                    )}
                </form.Field>
            </div>
        </FormSection>
    );
};

// ─── Work Experience ─────────────────────────────────────────────────────────

export const WorkExperienceSection = ({
    form, se, computedIsLocked, workExpLocked,
}: ResumeSectionProps & { workExpLocked: boolean }) => {
    const isLocked = workExpLocked || computedIsLocked;
    return (
        <form.Field name="workExperience" mode="array">
            {(field: any) => (
                <FormSection
                    icon={Briefcase}
                    title="Work Experience"
                    count={field.state.value.length}
                    onAdd={() => field.pushValue({ jobTitle: "", companyName: "", startDate: "", endDate: "", responsibilities: "" })}
                    defaultOpen={true}
                    isLocked={isLocked}
                >
                    {workExpLocked && <LockedBanner />}
                    {field.state.value.length === 0 ? (
                        <EmptyState label="Work Experience" />
                    ) : (
                        field.state.value.map((_: any, i: number) => (
                            <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={isLocked}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <form.Field name={`workExperience[${i}].jobTitle`} validators={{ onChange: rv.jobTitle }}>
                                        {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Job Title" placeholder="Software Engineer" disabled={isLocked} />}
                                    </form.Field>
                                    <form.Field name={`workExperience[${i}].companyName`} validators={{ onChange: rv.companyName }}>
                                        {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Company" placeholder="Google" disabled={isLocked} />}
                                    </form.Field>
                                    <form.Field name={`workExperience[${i}].startDate`} validators={{ onChange: rv.requiredStartDate }}>
                                        {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Start Date" type="date" disabled={isLocked} />}
                                    </form.Field>
                                    <form.Field name={`workExperience[${i}].endDate`} validators={{
                                        onChange: ({ value }: { value: unknown }) => {
                                            const v = typeof value === "string" ? value : "";
                                            if (!v) return undefined;
                                            const start = form.state.values.workExperience?.[i]?.startDate;
                                            if (start && new Date(v) < new Date(start)) return "End date must be after start date";
                                            return undefined;
                                        },
                                    }}>
                                        {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="End Date (leave blank if current)" type="date" disabled={isLocked} />}
                                    </form.Field>
                                    <div className="sm:col-span-2">
                                        <form.Field name={`workExperience[${i}].responsibilities`} validators={{ onChange: rv.responsibilities }}>
                                            {(sf: any) => (
                                                <TextareaField field={sf} label="Responsibilities (comma-separated)" placeholder="Built RESTful APIs, Improved performance by 40%, …" serverErrors={se} disabled={isLocked} />
                                            )}
                                        </form.Field>
                                    </div>
                                </div>
                            </ItemCard>
                        ))
                    )}
                </FormSection>
            )}
        </form.Field>
    );
};

// ─── Education ───────────────────────────────────────────────────────────────

export const EducationSection = ({
    form, se, computedIsLocked, educationLocked,
}: ResumeSectionProps & { educationLocked: boolean }) => {
    const isLocked = educationLocked || computedIsLocked;
    return (
        <form.Field name="education" mode="array">
            {(field: any) => (
                <FormSection
                    icon={GraduationCap}
                    title="Education"
                    count={field.state.value.length}
                    onAdd={() => field.pushValue({ degree: "", institutionName: "", fieldOfStudy: "", startDate: "", endDate: "" })}
                    defaultOpen={true}
                    isLocked={isLocked}
                >
                    {educationLocked && <LockedBanner />}
                    {field.state.value.length === 0 ? (
                        <EmptyState label="Education" />
                    ) : (
                        field.state.value.map((_: any, i: number) => (
                            <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={isLocked}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <form.Field name={`education[${i}].degree`} validators={{ onChange: rv.degree }}>
                                        {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Degree" placeholder="BSc in Computer Science" disabled={isLocked} />}
                                    </form.Field>
                                    <form.Field name={`education[${i}].institutionName`} validators={{ onChange: rv.institutionName }}>
                                        {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Institution" placeholder="University Name" disabled={isLocked} />}
                                    </form.Field>
                                    <form.Field name={`education[${i}].fieldOfStudy`} validators={{ onChange: rv.fieldOfStudy }}>
                                        {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Field of Study" placeholder="Computer Science" disabled={isLocked} />}
                                    </form.Field>
                                    <form.Field name={`education[${i}].startDate`} validators={{ onChange: rv.requiredStartDate }}>
                                        {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Start Date" type="date" disabled={isLocked} />}
                                    </form.Field>
                                    <form.Field name={`education[${i}].endDate`} validators={{
                                        onChange: ({ value }: { value: unknown }) => {
                                            const v = typeof value === "string" ? value : "";
                                            if (!v) return undefined;
                                            const start = form.state.values.education?.[i]?.startDate;
                                            if (start && new Date(v) < new Date(start)) return "End date must be after start date";
                                            return undefined;
                                        },
                                    }}>
                                        {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="End Date" type="date" disabled={isLocked} />}
                                    </form.Field>
                                </div>
                            </ItemCard>
                        ))
                    )}
                </FormSection>
            )}
        </form.Field>
    );
};

// ─── Certifications ──────────────────────────────────────────────────────────

export const CertificationsSection = ({ form, se, computedIsLocked }: ResumeSectionProps) => (
    <form.Field name="certifications" mode="array">
        {(field: any) => (
            <FormSection
                icon={BookOpen}
                title="Certifications"
                count={field.state.value.length}
                onAdd={() => field.pushValue({ certificationName: "", issuingOrganization: "", issueDate: "" })}
                defaultOpen={false}
                isLocked={computedIsLocked}
            >
                {field.state.value.length === 0 ? (
                    <EmptyState label="Certifications" />
                ) : (
                    field.state.value.map((_: any, i: number) => (
                        <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <form.Field name={`certifications[${i}].certificationName`} validators={{ onChange: rv.certificationName }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Certification Name" placeholder="AWS Certified Solutions Architect" />}
                                </form.Field>
                                <form.Field name={`certifications[${i}].issuingOrganization`} validators={{ onChange: rv.issuingOrganization }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Issuing Organization" placeholder="Amazon Web Services" />}
                                </form.Field>
                                <form.Field name={`certifications[${i}].issueDate`} validators={{ onChange: rv.requiredIssueDate }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Issue Date" type="date" />}
                                </form.Field>
                            </div>
                        </ItemCard>
                    ))
                )}
            </FormSection>
        )}
    </form.Field>
);

// ─── Projects ────────────────────────────────────────────────────────────────

export const ProjectsSection = ({ form, se, computedIsLocked }: ResumeSectionProps) => (
    <form.Field name="projects" mode="array">
        {(field: any) => (
            <FormSection
                icon={Star}
                title="Projects"
                count={field.state.value.length}
                onAdd={() => field.pushValue({ projectName: "", role: "", description: "", technologiesUsed: "", liveUrl: "", githubUrl: "", startDate: "", endDate: "", highlights: "" })}
                defaultOpen={false}
                isLocked={computedIsLocked}
            >
                {field.state.value.length === 0 ? (
                    <EmptyState label="Projects" />
                ) : (
                    field.state.value.map((_: any, i: number) => (
                        <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <form.Field name={`projects[${i}].projectName`} validators={{ onChange: rv.projectName }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Project Name" placeholder="E-commerce Platform" />}
                                </form.Field>
                                <form.Field name={`projects[${i}].role`} validators={{ onChange: rv.projectRole }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Role" placeholder="Lead Developer" />}
                                </form.Field>
                                <div className="sm:col-span-2">
                                    <form.Field name={`projects[${i}].description`} validators={{ onChange: rv.projectDescription }}>
                                        {(sf: any) => <TextareaField field={sf} label="Description" placeholder="What the project does and your contribution…" serverErrors={se} />}
                                    </form.Field>
                                </div>
                                <div className="sm:col-span-2">
                                    <form.Field name={`projects[${i}].technologiesUsed`} validators={{ onChange: rv.projectTechnologies }}>
                                        {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Technologies Used" placeholder="React, Node.js, …  (comma-separated)" />}
                                    </form.Field>
                                </div>
                                <form.Field name={`projects[${i}].liveUrl`} validators={{ onChange: rv.projectLiveUrl }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Live URL" placeholder="https://…" />}
                                </form.Field>
                                <form.Field name={`projects[${i}].githubUrl`} validators={{ onChange: rv.projectGithubUrl }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="GitHub URL" placeholder="https://github.com/…" />}
                                </form.Field>
                                <form.Field name={`projects[${i}].startDate`}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Start Date" type="date" />}
                                </form.Field>
                                <form.Field name={`projects[${i}].endDate`} validators={{
                                    onChange: ({ value }: { value: unknown }) => {
                                        const v = typeof value === "string" ? value : "";
                                        if (!v) return undefined;
                                        const start = form.state.values.projects?.[i]?.startDate;
                                        if (start && new Date(v) < new Date(start)) return "End date must be after start date";
                                        return undefined;
                                    },
                                }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="End Date" type="date" />}
                                </form.Field>
                                <div className="sm:col-span-2">
                                    <form.Field name={`projects[${i}].highlights`} validators={{ onChange: rv.projectHighlights }}>
                                        {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Key Highlights" placeholder="Increased performance by 50%, …  (comma-separated)" />}
                                    </form.Field>
                                </div>
                            </div>
                        </ItemCard>
                    ))
                )}
            </FormSection>
        )}
    </form.Field>
);

// ─── Languages ───────────────────────────────────────────────────────────────

export const LanguagesSection = ({ form, se, computedIsLocked }: ResumeSectionProps) => (
    <form.Field name="languages" mode="array">
        {(field: any) => (
            <FormSection
                icon={Languages}
                title="Languages"
                count={field.state.value.length}
                onAdd={() => field.pushValue({ language: "", proficiencyLevel: "" })}
                defaultOpen={false}
                isLocked={computedIsLocked}
            >
                {field.state.value.length === 0 ? (
                    <EmptyState label="Languages" />
                ) : (
                    field.state.value.map((_: any, i: number) => (
                        <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <form.Field name={`languages[${i}].language`} validators={{ onChange: rv.language }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Language" placeholder="English" />}
                                </form.Field>
                                <form.Field name={`languages[${i}].proficiencyLevel`} validators={{ onChange: rv.proficiencyLevel }}>
                                    {(sf: any) => (
                                        <SelectField field={sf} label="Proficiency" placeholder="Select level" serverErrors={se} options={[
                                            { value: "Native", label: "Native" },
                                            { value: "Fluent", label: "Fluent" },
                                            { value: "Intermediate", label: "Intermediate" },
                                            { value: "Beginner", label: "Beginner" },
                                        ]} />
                                    )}
                                </form.Field>
                            </div>
                        </ItemCard>
                    ))
                )}
            </FormSection>
        )}
    </form.Field>
);

// ─── Awards ──────────────────────────────────────────────────────────────────

export const AwardsSection = ({ form, se, computedIsLocked }: ResumeSectionProps) => (
    <form.Field name="awards" mode="array">
        {(field: any) => (
            <FormSection
                icon={Award}
                title="Awards & Achievements"
                count={field.state.value.length}
                onAdd={() => field.pushValue({ title: "", issuer: "", date: "", description: "" })}
                defaultOpen={false}
                isLocked={computedIsLocked}
            >
                {field.state.value.length === 0 ? (
                    <EmptyState label="Awards" />
                ) : (
                    field.state.value.map((_: any, i: number) => (
                        <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <form.Field name={`awards[${i}].title`} validators={{ onChange: rv.awardTitle }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Title" placeholder="Employee of the Month" />}
                                </form.Field>
                                <form.Field name={`awards[${i}].issuer`} validators={{ onChange: rv.awardIssuer }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Issuer" placeholder="Google" />}
                                </form.Field>
                                <form.Field name={`awards[${i}].date`} validators={{ onChange: rv.requiredDate }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Date" type="date" />}
                                </form.Field>
                                <div className="sm:col-span-2">
                                    <form.Field name={`awards[${i}].description`} validators={{ onChange: rv.awardDescription }}>
                                        {(sf: any) => <TextareaField field={sf} label="Description" serverErrors={se} />}
                                    </form.Field>
                                </div>
                            </div>
                        </ItemCard>
                    ))
                )}
            </FormSection>
        )}
    </form.Field>
);

// ─── References ──────────────────────────────────────────────────────────────

export const ReferencesSection = ({ form, se, computedIsLocked }: ResumeSectionProps) => (
    <form.Field name="references" mode="array">
        {(field: any) => (
            <FormSection
                icon={Users}
                title="References"
                count={field.state.value.length}
                onAdd={() => field.pushValue({ name: "", designation: "", company: "", email: "", phone: "", relationship: "" })}
                defaultOpen={false}
                isLocked={computedIsLocked}
            >
                {field.state.value.length === 0 ? (
                    <EmptyState label="References" />
                ) : (
                    field.state.value.map((_: any, i: number) => (
                        <ItemCard key={i} index={i} onRemove={() => field.removeValue(i)} isLocked={computedIsLocked}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <form.Field name={`references[${i}].name`} validators={{ onChange: rv.refName }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Name" placeholder="Jane Doe" />}
                                </form.Field>
                                <form.Field name={`references[${i}].designation`} validators={{ onChange: rv.refDesignation }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Designation" placeholder="Engineering Manager" />}
                                </form.Field>
                                <form.Field name={`references[${i}].company`} validators={{ onChange: rv.refCompany }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Company" placeholder="Google" />}
                                </form.Field>
                                <form.Field name={`references[${i}].relationship`} validators={{ onChange: rv.refRelationship }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Relationship" placeholder="Direct Manager" />}
                                </form.Field>
                                <form.Field name={`references[${i}].email`} validators={{ onChange: rv.refEmail }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Email" type="email" placeholder="jane@example.com" />}
                                </form.Field>
                                <form.Field name={`references[${i}].phone`} validators={{ onChange: rv.refPhone }}>
                                    {(sf: any) => <AppField field={sf} serverError={se[sf.name]} label="Phone" placeholder="01XXXXXXXXX" />}
                                </form.Field>
                            </div>
                        </ItemCard>
                    ))
                )}
            </FormSection>
        )}
    </form.Field>
);

// ─── Interests ───────────────────────────────────────────────────────────────

export const InterestsSection = ({ form, se }: Pick<ResumeSectionProps, "form" | "se">) => (
    <form.Field name="interests">
        {(field: any) => (
            <FormSection
                icon={Lightbulb}
                title="Interests"
                count={field.state.value?.length || 0}
                defaultOpen={false}
            >
                <div className="space-y-3">
                    <AppField
                        field={field}
                        serverError={se[field.name]}
                        label="Your Interests"
                        placeholder="Machine Learning, Open Source, Cloud Computing… (comma-separated)"
                    />
                    {field.state.value && field.state.value.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {(typeof field.state.value === 'string'
                                ? field.state.value.split(',').map((item: string) => item.trim()).filter(Boolean)
                                : field.state.value
                            ).map((interest: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                    {interest}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </FormSection>
        )}
    </form.Field>
);
