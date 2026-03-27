"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { createJob, getJobCategories } from "@/services/job.services";
import { getMyRecruiterProfile } from "@/services/recruiter.services";
import { createJobZodSchema } from "@/zod/job.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const splitList = (value: string): string[] =>
    value
        .split(/,|\n/)
        .map((item) => item.trim())
        .filter(Boolean);

const getFieldError = (field: { state: { meta: { isTouched: boolean; errors: unknown[] } } }): string | null => {
    if (!field.state.meta.isTouched || field.state.meta.errors.length === 0) {
        return null;
    }

    const firstError = field.state.meta.errors[0];
    return typeof firstError === "string" ? firstError : String(firstError);
};

const STEP_FIELDS: Record<number, string[]> = {
    1: ["title", "categoryId", "vacancies", "company", "companyAddress"],
    2: ["description", "responsibilities", "skills", "education", "experienceYears", "ageMin", "ageMax"],
    3: ["salaryMin", "salaryMax", "location", "locationType", "jobType"],
    4: ["applicationDeadline", "applicationMethod", "applicationEmail", "applicationLink", "contactPhone"],
};

const TOTAL_STEPS = 4;

const PostJobContent = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

    const { data: categoriesData } = useQuery({
        queryKey: ["job-categories"],
        queryFn: () => getJobCategories(),
    });

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ["my-recruiter-profile"],
        queryFn: () => getMyRecruiterProfile(),
    });

    const isVerified = (profileData?.data?.status === "APPROVED") || false;
    const profileCompletion = profileData?.data?.profileCompletion ?? 0;
    // Recruiters don't need 100% completion, just need to be verified/approved
    const isProfileComplete = true;
    const canPost = isVerified;
    const isGuardLoading = profileLoading;

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: Record<string, unknown>) => createJob(data),
        onSuccess: () => {
            toast.success("Job posted successfully!");
            router.push("/recruiter/dashboard/my-jobs");
        },
        onError: (err: any) => {
            setServerError(err?.response?.data?.message || "Failed to post job");
        },
    });

    const form = useForm({
        defaultValues: {
            // 1) Basic Information
            title: "",
            categoryId: "",
            vacancies: "1",

            // 2) Company Information
            company: "",
            companyAddress: "",
            companyDescription: "",
            companyLogo: "",

            // 3) Job Details
            description: "",
            responsibilities: "",
            additionalRequirements: "",
            skills: "",

            // 4) Candidate Criteria
            education: "",
            experienceYears: "0",
            experienceLevel: "MID",
            ageMin: "",
            ageMax: "",
            genderPreference: "ANY",

            // 5) Salary & Benefits
            salaryMin: "",
            salaryMax: "",
            salaryType: "NEGOTIABLE",
            compensationBenefits: "",

            // 6) Location & Work Type
            location: "",
            locationType: "ONSITE",
            jobType: "FULL_TIME",

            // 7) Application Information
            applicationDeadline: "",
            applicationMethod: "PLATFORM",
            applicationEmail: "",
            applicationLink: "",
            contactPhone: "",

            // 8) Advanced / Optional
            featuredJob: false,
            urgentHiring: false,
            allowVideoCv: false,
            tags: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);

            const parsed = createJobZodSchema.safeParse(value);
            if (!parsed.success) {
                setServerError(parsed.error.issues[0]?.message || "Please check form validation errors");
                return;
            }

            const skills = splitList(value.skills);
            const responsibilities = splitList(value.responsibilities);
            const requirementLines = splitList(value.additionalRequirements);
            const benefits = splitList(value.compensationBenefits);

            const fallbackRequirements = [
                `Minimum education: ${value.education}`,
                `Experience: ${value.experienceYears} year(s)`,
            ];

            if (value.ageMin || value.ageMax) {
                fallbackRequirements.push(`Preferred age range: ${value.ageMin || "N/A"}-${value.ageMax || "N/A"}`);
            }
            if (value.genderPreference !== "ANY") {
                fallbackRequirements.push(`Gender preference: ${value.genderPreference}`);
            }
            if (value.tags) {
                fallbackRequirements.push(`Keywords: ${value.tags}`);
            }

            const requirements = requirementLines.length > 0 ? requirementLines : fallbackRequirements;

            const payload: Record<string, unknown> = {
                title: value.title,
                description: value.description,
                company: value.company,
                location: value.location,
                jobType: value.jobType,
                experience: `${value.experienceYears} years (${value.experienceLevel})`,
                education: value.education,
                skills,
                responsibilities,
                requirements,
                benefits,
                deadline: value.applicationDeadline,
                vacancies: Number(value.vacancies),
                salaryMin: value.salaryMin ? Number(value.salaryMin) : undefined,
                salaryMax: value.salaryMax ? Number(value.salaryMax) : undefined,
                categoryId: value.categoryId || undefined,

                // Additional spec fields for forward compatibility (ignored by current backend validator)
                companyAddress: value.companyAddress,
                companyDescription: value.companyDescription || undefined,
                companyLogo: value.companyLogo || undefined,
                locationType: value.locationType,
                salaryType: value.salaryType,
                compensationBenefits: value.compensationBenefits || undefined,
                applicationMethod: value.applicationMethod,
                applicationEmail: value.applicationEmail || undefined,
                applicationLink: value.applicationLink || undefined,
                contactPhone: value.contactPhone || undefined,
                featuredJob: value.featuredJob,
                urgentHiring: value.urgentHiring,
                allowVideoCv: value.allowVideoCv,
                tags: splitList(value.tags),
            };

            await mutateAsync(payload);
        },
    });

    const categoriesRaw = categoriesData as unknown;
    const categories = Array.isArray(categoriesRaw)
        ? categoriesRaw
        : Array.isArray((categoriesRaw as { data?: unknown })?.data)
            ? ((categoriesRaw as { data: unknown[] }).data)
            : [];
    const hasCategories = categories.length > 0;

    const activeFields = STEP_FIELDS[currentStep] || [];

    const getStepFieldError = (name: string, fallback?: string | null): string | undefined => {
        return stepErrors[name] || fallback || undefined;
    };

    const validateCurrentStep = () => {
        const parsed = createJobZodSchema.safeParse(form.state.values);

        if (parsed.success) {
            setStepErrors({});
            return true;
        }

        const active = new Set(activeFields);
        const nextErrors: Record<string, string> = {};

        for (const issue of parsed.error.issues) {
            const key = typeof issue.path[0] === "string" ? issue.path[0] : "";
            if (active.has(key) && !nextErrors[key]) {
                nextErrors[key] = issue.message;
            }
        }

        setStepErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleNextStep = () => {
        setServerError(null);
        if (!validateCurrentStep()) {
            return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    };

    const handlePreviousStep = () => {
        setServerError(null);
        setStepErrors({});
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-2xl font-bold">Post a New Job</h1>

            {/* Guard Alerts */}
            {isGuardLoading ? (
                <Skeleton className="h-16 w-full" />
            ) : (
                <>
                    {!isVerified && (
                        <Alert variant="destructive">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertDescription>
                                Your account is not verified yet. You cannot post jobs until an admin verifies your profile.
                            </AlertDescription>
                        </Alert>
                    )}
                    {!isProfileComplete && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Your profile is {profileCompletion}% complete. You must complete your profile to 100% before posting jobs.
                            </AlertDescription>
                        </Alert>
                    )}
                </>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((step) => (
                    <div
                        key={step}
                        className={`rounded-md border px-3 py-2 text-xs text-center ${currentStep === step ? "border-primary bg-primary/10 text-primary font-semibold" : "text-muted-foreground"}`}
                    >
                        Step {step}
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Job Details (Step {currentStep} of {TOTAL_STEPS})</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (currentStep < TOTAL_STEPS) {
                                handleNextStep();
                                return;
                            }
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        {currentStep === 1 && (
                            <>
                                <div className="space-y-4 rounded-md border p-4">
                                    <h3 className="font-semibold">1. Basic Information</h3>

                                    <form.Field name="title" validators={{ onChange: createJobZodSchema.shape.title }}>
                                        {(field) => <AppField field={field} label="Job Title" placeholder="e.g. Senior React Developer" serverError={getStepFieldError("title")} />}
                                    </form.Field>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label>Job Category</Label>
                                            <form.Field name="categoryId">
                                                {(field) => {
                                                    const error = getStepFieldError("categoryId", getFieldError(field));
                                                    return (
                                                        <>
                                                            <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                                <SelectTrigger disabled={!hasCategories}>
                                                                    <SelectValue placeholder={hasCategories ? "Select category" : "No category available"} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {categories.filter((cat: any) => cat?.id).map((cat: any) => (
                                                                        <SelectItem key={cat.id} value={cat.id}>
                                                                            {cat.name || cat.title}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {!hasCategories && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    No job categories available right now. You can still post without selecting one.
                                                                </p>
                                                            )}
                                                            {error && <p className="text-sm text-destructive">{error}</p>}
                                                        </>
                                                    );
                                                }}
                                            </form.Field>
                                        </div>

                                        <form.Field name="vacancies" validators={{ onChange: createJobZodSchema.shape.vacancies }}>
                                            {(field) => <AppField field={field} label="Vacancy / Number of Positions" type="number" placeholder="e.g. 3" serverError={getStepFieldError("vacancies")} />}
                                        </form.Field>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-md border p-4">
                                    <h3 className="font-semibold">2. Company Information</h3>

                                    <form.Field name="company" validators={{ onChange: createJobZodSchema.shape.company }}>
                                        {(field) => <AppField field={field} label="Company Name" placeholder="Your company name" serverError={getStepFieldError("company")} />}
                                    </form.Field>

                                    <form.Field name="companyAddress" validators={{ onChange: createJobZodSchema.shape.companyAddress }}>
                                        {(field) => <AppField field={field} label="Company Address" placeholder="Company address" serverError={getStepFieldError("companyAddress")} />}
                                    </form.Field>

                                    <form.Field name="companyDescription">
                                        {(field) => (
                                            <div className="space-y-1.5">
                                                <Label htmlFor={field.name}>Company Description</Label>
                                                <Textarea
                                                    id={field.name}
                                                    value={field.state.value}
                                                    placeholder="Short company overview"
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </form.Field>

                                    <form.Field name="companyLogo">
                                        {(field) => (
                                            <div className="space-y-1.5">
                                                <Label htmlFor="company-logo">Company Logo (optional)</Label>
                                                <Input
                                                    id="company-logo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => field.handleChange(e.target.files?.[0]?.name || "")}
                                                />
                                            </div>
                                        )}
                                    </form.Field>
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                <div className="space-y-4 rounded-md border p-4">
                                    <h3 className="font-semibold">3. Job Details</h3>

                                    <form.Field name="description" validators={{ onChange: createJobZodSchema.shape.description }}>
                                        {(field) => {
                                            const error = getFieldError(field);
                                            return (
                                                <div className="space-y-1.5">
                                                    <Label htmlFor={field.name}>Job Description</Label>
                                                    <Textarea
                                                        id={field.name}
                                                        value={field.state.value}
                                                        placeholder="Describe the role..."
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                    />
                                                    {(getStepFieldError("description", error)) && <p className="text-sm text-destructive">{getStepFieldError("description", error)}</p>}
                                                </div>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="responsibilities" validators={{ onChange: createJobZodSchema.shape.responsibilities }}>
                                        {(field) => {
                                            const error = getFieldError(field);
                                            return (
                                                <div className="space-y-1.5">
                                                    <Label htmlFor={field.name}>Responsibilities & Context</Label>
                                                    <Textarea
                                                        id={field.name}
                                                        value={field.state.value}
                                                        placeholder="Use comma or new line separated items"
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                    />
                                                    {(getStepFieldError("responsibilities", error)) && <p className="text-sm text-destructive">{getStepFieldError("responsibilities", error)}</p>}
                                                </div>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="additionalRequirements">
                                        {(field) => (
                                            <div className="space-y-1.5">
                                                <Label htmlFor={field.name}>Additional Requirements</Label>
                                                <Textarea
                                                    id={field.name}
                                                    value={field.state.value}
                                                    placeholder="Use comma or new line separated items"
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </form.Field>

                                    <form.Field name="skills" validators={{ onChange: createJobZodSchema.shape.skills }}>
                                        {(field) => <AppField field={field} label="Required Skills (comma separated)" placeholder="React, TypeScript, Node.js" serverError={getStepFieldError("skills")} />}
                                    </form.Field>
                                </div>

                                <div className="space-y-4 rounded-md border p-4">
                                    <h3 className="font-semibold">4. Candidate Criteria</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <form.Field name="education" validators={{ onChange: createJobZodSchema.shape.education }}>
                                            {(field) => <AppField field={field} label="Education Level" placeholder="e.g. Bachelor" serverError={getStepFieldError("education")} />}
                                        </form.Field>

                                        <form.Field name="experienceYears" validators={{ onChange: createJobZodSchema.shape.experienceYears }}>
                                            {(field) => <AppField field={field} label="Experience (Years)" type="number" placeholder="e.g. 2" serverError={getStepFieldError("experienceYears")} />}
                                        </form.Field>

                                        <div className="space-y-1.5">
                                            <Label>Experience Level</Label>
                                            <form.Field name="experienceLevel">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ENTRY">Entry</SelectItem>
                                                            <SelectItem value="MID">Mid</SelectItem>
                                                            <SelectItem value="SENIOR">Senior</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label>Gender Preference</Label>
                                            <form.Field name="genderPreference">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ANY">Any</SelectItem>
                                                            <SelectItem value="MALE">Male</SelectItem>
                                                            <SelectItem value="FEMALE">Female</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>

                                        <form.Field name="ageMin">
                                            {(field) => <AppField field={field} label="Age Min" type="number" placeholder="e.g. 21" serverError={getStepFieldError("ageMin")} />}
                                        </form.Field>

                                        <form.Field name="ageMax">
                                            {(field) => <AppField field={field} label="Age Max" type="number" placeholder="e.g. 35" serverError={getStepFieldError("ageMax")} />}
                                        </form.Field>
                                    </div>
                                </div>
                            </>
                        )}

                        {currentStep === 3 && (
                            <>
                                <div className="space-y-4 rounded-md border p-4">
                                    <h3 className="font-semibold">5. Salary & Benefits</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <form.Field name="salaryMin">
                                            {(field) => <AppField field={field} label="Minimum Salary (BDT)" type="number" placeholder="e.g. 30000" serverError={getStepFieldError("salaryMin")} />}
                                        </form.Field>

                                        <form.Field name="salaryMax">
                                            {(field) => <AppField field={field} label="Maximum Salary (BDT)" type="number" placeholder="e.g. 60000" serverError={getStepFieldError("salaryMax")} />}
                                        </form.Field>

                                        <div className="space-y-1.5">
                                            <Label>Salary Type</Label>
                                            <form.Field name="salaryType">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="NEGOTIABLE">Negotiable</SelectItem>
                                                            <SelectItem value="FIXED">Fixed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>
                                    </div>

                                    <form.Field name="compensationBenefits">
                                        {(field) => (
                                            <div className="space-y-1.5">
                                                <Label htmlFor={field.name}>Compensation & Benefits</Label>
                                                <Textarea
                                                    id={field.name}
                                                    value={field.state.value}
                                                    placeholder="Bonus, Lunch, Mobile bill, Insurance"
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </form.Field>
                                </div>

                                <div className="space-y-4 rounded-md border p-4">
                                    <h3 className="font-semibold">6. Location & Work Type</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <form.Field name="location" validators={{ onChange: createJobZodSchema.shape.location }}>
                                            {(field) => <AppField field={field} label="Job Location" placeholder="e.g. Dhaka, Bangladesh" serverError={getStepFieldError("location")} />}
                                        </form.Field>

                                        <div className="space-y-1.5">
                                            <Label>Workplace Type</Label>
                                            <form.Field name="locationType">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ONSITE">On-site</SelectItem>
                                                            <SelectItem value="REMOTE">Remote</SelectItem>
                                                            <SelectItem value="HYBRID">Hybrid</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label>Employment Type</Label>
                                            <form.Field name="jobType">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="FULL_TIME">Full-time</SelectItem>
                                                            <SelectItem value="PART_TIME">Part-time</SelectItem>
                                                            <SelectItem value="CONTRACT">Contract</SelectItem>
                                                            <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {currentStep === 4 && (
                            <>
                                <div className="space-y-4 rounded-md border p-4">
                                    <h3 className="font-semibold">7. Application Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <form.Field name="applicationDeadline" validators={{ onChange: createJobZodSchema.shape.applicationDeadline }}>
                                            {(field) => <AppField field={field} label="Application Deadline" type="date" serverError={getStepFieldError("applicationDeadline")} />}
                                        </form.Field>

                                        <div className="space-y-1.5">
                                            <Label>Application Method</Label>
                                            <form.Field name="applicationMethod">
                                                {(field) => (
                                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PLATFORM">Apply via Platform</SelectItem>
                                                            <SelectItem value="EMAIL">Email</SelectItem>
                                                            <SelectItem value="LINK">External Link</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </form.Field>
                                        </div>

                                        <form.Subscribe selector={(state) => state.values.applicationMethod}>
                                            {(applicationMethod) =>
                                                applicationMethod === "EMAIL" ? (
                                                    <form.Field name="applicationEmail">
                                                        {(field) => <AppField field={field} label="Application Email" type="email" placeholder="hr@company.com" serverError={getStepFieldError("applicationEmail")} />}
                                                    </form.Field>
                                                ) : null
                                            }
                                        </form.Subscribe>

                                        <form.Subscribe selector={(state) => state.values.applicationMethod}>
                                            {(applicationMethod) =>
                                                applicationMethod === "LINK" ? (
                                                    <form.Field name="applicationLink">
                                                        {(field) => <AppField field={field} label="Application Link" placeholder="https://..." serverError={getStepFieldError("applicationLink")} />}
                                                    </form.Field>
                                                ) : null
                                            }
                                        </form.Subscribe>

                                        <form.Field name="contactPhone">
                                            {(field) => <AppField field={field} label="Contact Phone Number" type="tel" placeholder="+8801XXXXXXXXX" serverError={getStepFieldError("contactPhone")} />}
                                        </form.Field>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-md border p-4">
                                    <h3 className="font-semibold">8. Advanced / Optional Features</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <form.Field name="featuredJob">
                                            {(field) => (
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={field.name}
                                                        checked={field.state.value}
                                                        onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                                                    />
                                                    <Label htmlFor={field.name}>Featured Job</Label>
                                                </div>
                                            )}
                                        </form.Field>

                                        <form.Field name="urgentHiring">
                                            {(field) => (
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={field.name}
                                                        checked={field.state.value}
                                                        onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                                                    />
                                                    <Label htmlFor={field.name}>Urgent Hiring Badge</Label>
                                                </div>
                                            )}
                                        </form.Field>

                                        <form.Field name="allowVideoCv">
                                            {(field) => (
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={field.name}
                                                        checked={field.state.value}
                                                        onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                                                    />
                                                    <Label htmlFor={field.name}>Allow Video CV</Label>
                                                </div>
                                            )}
                                        </form.Field>
                                    </div>

                                    <form.Field name="tags">
                                        {(field) => <AppField field={field} label="Tags / Keywords" placeholder="frontend, react, urgent" />}
                                    </form.Field>
                                </div>
                            </>
                        )}

                        {serverError && (
                            <Alert variant="destructive">
                                <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex items-center justify-between gap-3">
                            <Button type="button" variant="outline" onClick={handlePreviousStep} disabled={currentStep === 1}>
                                Previous
                            </Button>

                            {currentStep < TOTAL_STEPS ? (
                                <Button type="button" onClick={handleNextStep}>
                                    Next Step
                                </Button>
                            ) : (
                                <AppSubmitButton isPending={isPending} pendingLabel="Posting Job..." disabled={!canPost || isGuardLoading}>
                                    Post Job
                                </AppSubmitButton>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostJobContent;
