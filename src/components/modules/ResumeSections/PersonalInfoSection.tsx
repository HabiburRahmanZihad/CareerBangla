"use client";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IUpdateResumePayload } from "@/zod/resume.validation";
import { UseFormReturn } from "react-hook-form";

interface PersonalInfoSectionProps {
    form: UseFormReturn<IUpdateResumePayload>;
}

export default function PersonalInfoSection({ form }: PersonalInfoSectionProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="John Doe"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Professional Title */}
                <FormField
                    control={form.control}
                    name="professionalTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Professional Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Senior Software Engineer"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Job title or professional designation
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Contact Number */}
                <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="+1 (555) 000-0000"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Date of Birth */}
                <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Gender */}
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    className="w-full px-3 py-2 border rounded-md border-input bg-background"
                                >
                                    <option value="">Select</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Nationality */}
                <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Bangladesh"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Address */}
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="City, Country"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* URLs Section */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Professional URLs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* LinkedIn URL */}
                    <FormField
                        control={form.control}
                        name="linkedinUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>LinkedIn URL</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://linkedin.com/in/username"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* GitHub URL */}
                    <FormField
                        control={form.control}
                        name="githubUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GitHub URL</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://github.com/username"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Portfolio URL */}
                    <FormField
                        control={form.control}
                        name="portfolioUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Portfolio URL</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://yourportfolio.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Website URL */}
                    <FormField
                        control={form.control}
                        name="websiteUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website URL</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://yourwebsite.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
