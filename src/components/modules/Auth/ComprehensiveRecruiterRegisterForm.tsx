/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { recruiterRegisterAction } from "@/app/(commonLayout)/(authRouteGroup)/register/recruiter/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IRecruiterRegisterPayload, recruiterRegisterZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Eye, EyeOff, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const INDUSTRIES = [
    "Technology",
    "Finance",
    "Healthcare",
    "E-commerce",
    "Manufacturing",
    "Education",
    "Hospitality",
    "Real Estate",
    "Energy",
    "Retail",
    "Media & Entertainment",
    "Telecommunications",
    "Transportation",
    "Agriculture",
    "Other",
];

const COMPANY_SIZES = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
];

const ComprehensiveRecruiterRegisterForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");

    // File preview states
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
    const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (payload: IRecruiterRegisterPayload) => {
            const formData = new FormData();

            // Add all text fields
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== null && value !== undefined && typeof value === 'string') {
                    formData.append(key, value);
                }
            });

            // Add files
            if (profilePhotoFile) {
                formData.append("profilePhotoFile", profilePhotoFile);
            }
            if (companyLogoFile) {
                formData.append("companyLogoFile", companyLogoFile);
            }

            return recruiterRegisterAction(formData as any);
        },
    });

    const form = useForm({
        defaultValues: {
            // Personal Information
            name: "",
            email: "",
            password: "",
            designation: "",
            profilePhoto: "",

            // Company Information
            companyName: "",
            industry: "",
            companyWebsite: "",
            companyAddress: "",
            companySize: "",
            description: "",
            companyLogo: "",

            // Contact Information
            contactNumber: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                // Validate contact number if provided
                if (value.contactNumber && !/^01[3-9]\d{8}$/.test(value.contactNumber)) {
                    setServerError("Invalid phone number format");
                    return;
                }

                const result = (await mutateAsync(value)) as any;
                if (result.success) {
                    setSuccess(true);
                } else {
                    setServerError(result.message || "Registration failed");
                }
            } catch (error: any) {
                setServerError(`Registration failed: ${error.message}`);
            }
        },
    });

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "profile" | "logo"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file");
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const preview = reader.result as string;
            if (type === "profile") {
                setProfilePhotoFile(file);
                setProfilePhotoPreview(preview);
                form.setFieldValue("profilePhoto", preview);
            } else {
                setCompanyLogoFile(file);
                setCompanyLogoPreview(preview);
                form.setFieldValue("companyLogo", preview);
            }
        };
        reader.readAsDataURL(file);
    };

    if (success) {
        return (
            <Card className="w-full max-w-md mx-auto shadow-md">
                <CardContent className="pt-8 pb-8 text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h2 className="text-xl font-bold">Registration Successful!</h2>
                    <p className="text-muted-foreground">
                        Your recruiter account has been created and is pending admin approval. You will be able to log in once your account is approved.
                    </p>
                    <Link href="/login">
                        <Button className="mt-4">Go to Login</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Register as Recruiter</CardTitle>
                <CardDescription>
                    Create a recruiter account to post jobs and find talent.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    method="POST"
                    action="#"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="personal">Personal Info</TabsTrigger>
                            <TabsTrigger value="company">Company Info</TabsTrigger>
                            <TabsTrigger value="additional">Additional</TabsTrigger>
                        </TabsList>

                        {/* Personal Information Tab */}
                        <TabsContent value="personal" className="space-y-4 mt-4">
                            <form.Field
                                name="name"
                                validators={{ onChange: recruiterRegisterZodSchema.shape.name }}
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label="Full Name *"
                                        type="text"
                                        placeholder="Enter your full name"
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="email"
                                validators={{ onChange: recruiterRegisterZodSchema.shape.email }}
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label="Email Address *"
                                        type="email"
                                        placeholder="Enter your email"
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="password"
                                validators={{ onChange: recruiterRegisterZodSchema.shape.password }}
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label="Password *"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password (min 8 characters)"
                                        append={
                                            <Button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                variant="ghost"
                                                size="icon"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="size-4" aria-hidden="true" />
                                                ) : (
                                                    <Eye className="size-4" aria-hidden="true" />
                                                )}
                                            </Button>
                                        }
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="designation"
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label="Designation"
                                        type="text"
                                        placeholder="e.g., HR Manager"
                                    />
                                )}
                            </form.Field>

                            {/* Profile Photo Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Profile Photo</label>
                                <div className="flex items-center gap-4">
                                    {profilePhotoPreview ? (
                                        <div className="relative">
                                            <Image
                                                src={profilePhotoPreview}
                                                alt="Profile preview"
                                                width={100}
                                                height={100}
                                                className="rounded-lg object-cover"
                                            />
                                            <button
                                                title="Remove Photo"
                                                type="button"
                                                onClick={() => {
                                                    setProfilePhotoPreview(null);
                                                    setProfilePhotoFile(null);
                                                    form.setFieldValue("profilePhoto", "");
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="relative flex items-center justify-center w-28 h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                            <div className="text-center">
                                                <Upload className="h-6 w-6 mx-auto text-gray-400" />
                                                <span className="text-xs text-gray-500 block mt-1">Upload</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, "profile")}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    <div className="text-sm text-muted-foreground">
                                        <p>JPG, PNG, GIF</p>
                                        <p>Max 5MB</p>
                                    </div>
                                </div>
                            </div>

                            <form.Field
                                name="contactNumber"
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label="Contact Number"
                                        type="tel"
                                        placeholder="01XXXXXXXXX"
                                    />
                                )}
                            </form.Field>
                        </TabsContent>

                        {/* Company Information Tab */}
                        <TabsContent value="company" className="space-y-4 mt-4">
                            <form.Field
                                name="companyName"
                                validators={{ onChange: recruiterRegisterZodSchema.shape.companyName }}
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label="Company Name *"
                                        type="text"
                                        placeholder="Enter your company name"
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="industry"
                                validators={{ onChange: recruiterRegisterZodSchema.shape.industry }}
                            >
                                {(field) => (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Industry *</label>
                                        <select
                                            title="Remove"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select an industry</option>
                                            {INDUSTRIES.map((industry) => (
                                                <option key={industry} value={industry}>
                                                    {industry}
                                                </option>
                                            ))}
                                        </select>
                                        {field.state.meta.errors?.length ? (
                                            <p className="text-sm text-red-500">
                                                {String(field.state.meta.errors[0])}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            </form.Field>

                            <form.Field
                                name="companyWebsite"
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label="Company Website"
                                        type="text"
                                        placeholder="https://example.com"
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="companyAddress"
                            >
                                {(field) => (
                                    <AppField
                                        field={field}
                                        label="Company Address"
                                        type="text"
                                        placeholder="Enter company address"
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="companySize"
                            >
                                {(field) => (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Company Size</label>
                                        <select
                                            title="Remove"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select company size</option>
                                            {COMPANY_SIZES.map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                        {field.state.meta.errors?.length ? (
                                            <p className="text-sm text-red-500">
                                                {String(field.state.meta.errors[0])}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            </form.Field>
                        </TabsContent>

                        {/* Additional Information Tab */}
                        <TabsContent value="additional" className="space-y-4 mt-4">
                            <form.Field
                                name="description"
                            >
                                {(field) => (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">About Company</label>
                                        <textarea
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder="Tell us about your company..."
                                            maxLength={500}
                                            rows={4}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {field.state.value?.length || 0}/500 characters
                                        </p>
                                        {field.state.meta.errors?.length ? (
                                            <p className="text-sm text-red-500">
                                                {String(field.state.meta.errors[0])}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            </form.Field>

                            {/* Company Logo Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company Logo</label>
                                <div className="flex items-center gap-4">
                                    {companyLogoPreview ? (
                                        <div className="relative">
                                            <Image
                                                src={companyLogoPreview}
                                                alt="Logo preview"
                                                width={100}
                                                height={100}
                                                className="rounded-lg object-cover"
                                            />
                                            <button
                                                title="Remove Photo"
                                                type="button"
                                                onClick={() => {
                                                    setCompanyLogoPreview(null);
                                                    setCompanyLogoFile(null);
                                                    form.setFieldValue("companyLogo", "");
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="relative flex items-center justify-center w-28 h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                            <div className="text-center">
                                                <Upload className="h-6 w-6 mx-auto text-gray-400" />
                                                <span className="text-xs text-gray-500 block mt-1">Upload</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, "logo")}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    <div className="text-sm text-muted-foreground">
                                        <p>JPG, PNG, GIF</p>
                                        <p>Max 5MB</p>
                                    </div>
                                </div>
                            </div>

                        </TabsContent>
                    </Tabs>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-2 justify-between pt-4">
                        {activeTab !== "personal" && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    const tabs = ["personal", "company", "additional"];
                                    const currentIndex = tabs.indexOf(activeTab);
                                    if (currentIndex > 0) {
                                        setActiveTab(tabs[currentIndex - 1]);
                                    }
                                }}
                            >
                                Previous
                            </Button>
                        )}
                        {activeTab !== "additional" ? (
                            <Button
                                type="button"
                                className="ml-auto"
                                onClick={() => {
                                    const tabs = ["personal", "company", "additional"];
                                    const currentIndex = tabs.indexOf(activeTab);
                                    if (currentIndex < tabs.length - 1) {
                                        setActiveTab(tabs[currentIndex + 1]);
                                    }
                                }}
                            >
                                Next
                            </Button>
                        ) : (
                            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                                {([canSubmit, isSubmitting]) => (
                                    <AppSubmitButton
                                        isPending={isSubmitting || isPending}
                                        pendingLabel="Creating Account..."
                                        disabled={!canSubmit}
                                        className="ml-auto"
                                    >
                                        Register as Recruiter
                                    </AppSubmitButton>
                                )}
                            </form.Subscribe>
                        )}
                    </div>
                </form>
            </CardContent>

            <CardFooter className="justify-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Looking for a job instead?{" "}
                    <Link href="/register" className="text-primary font-medium hover:underline underline-offset-4">
                        Register as Job Seeker
                    </Link>
                    {" "}&middot;{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">
                        Log In
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
};

export default ComprehensiveRecruiterRegisterForm;
