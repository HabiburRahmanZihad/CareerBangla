"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IUpdateResumePayload } from "@/zod/resume.validation";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";

interface WorkExperienceSectionProps {
    form: UseFormReturn<IUpdateResumePayload>;
}

export default function WorkExperienceSection({ form }: WorkExperienceSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "workExperience",
    });

    const addExperience = () => {
        append({
            jobTitle: "",
            companyName: "",
            employmentType: "",
            location: "",
            startDate: "",
            endDate: "",
            currentlyWorking: false,
            responsibilities: [],
            achievements: [],
            technologiesUsed: [],
        });
    };

    return (
        <div className="space-y-4">
            {fields.length > 0 && (
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold">
                                    Experience {index + 1}
                                </h4>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Job Title */}
                                <FormField
                                    control={form.control}
                                    name={`workExperience.${index}.jobTitle`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Title *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Senior Software Engineer"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Company Name */}
                                <FormField
                                    control={form.control}
                                    name={`workExperience.${index}.companyName`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Name *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Tech Company Inc."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Employment Type */}
                                <FormField
                                    control={form.control}
                                    name={`workExperience.${index}.employmentType`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Employment Type</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="w-full px-3 py-2 border rounded-md border-input bg-background"
                                                >
                                                    <option value="">Select type</option>
                                                    <option value="Full-time">Full-time</option>
                                                    <option value="Part-time">Part-time</option>
                                                    <option value="Contract">Contract</option>
                                                    <option value="Freelance">Freelance</option>
                                                    <option value="Temporary">Temporary</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Location */}
                                <FormField
                                    control={form.control}
                                    name={`workExperience.${index}.location`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
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

                                {/* Start Date */}
                                <FormField
                                    control={form.control}
                                    name={`workExperience.${index}.startDate`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date *</FormLabel>
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

                                {/* End Date */}
                                <FormField
                                    control={form.control}
                                    name={`workExperience.${index}.endDate`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    disabled={form.watch(`workExperience.${index}.currentlyWorking`)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Currently Working */}
                            <FormField
                                control={form.control}
                                name={`workExperience.${index}.currentlyWorking`}
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="mt-0! cursor-pointer">
                                            I currently work here
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name={`workExperience.${index}.responsibilities`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Responsibilities</FormLabel>
                                        <FormDescription>
                                            Add one responsibility per line
                                        </FormDescription>
                                        <FormControl>
                                            <Textarea
                                                placeholder="• Responsibility 1&#10;• Responsibility 2&#10;• Responsibility 3"
                                                className="min-h-24"
                                                value={field.value?.join("\n") || ""}
                                                onChange={(e) => {
                                                    const lines = e.target.value
                                                        .split("\n")
                                                        .map((line) => line.trim())
                                                        .filter((line) => line.length > 0);
                                                    field.onChange(lines);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Achievements */}
                            <FormField
                                control={form.control}
                                name={`workExperience.${index}.achievements`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Key Achievements</FormLabel>
                                        <FormDescription>
                                            Highlight your accomplishments at this role
                                        </FormDescription>
                                        <FormControl>
                                            <Textarea
                                                placeholder="• Achievement 1&#10;• Achievement 2"
                                                className="min-h-24"
                                                value={field.value?.join("\n") || ""}
                                                onChange={(e) => {
                                                    const lines = e.target.value
                                                        .split("\n")
                                                        .map((line) => line.trim())
                                                        .filter((line) => line.length > 0);
                                                    field.onChange(lines);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Technologies Used */}
                            <FormField
                                control={form.control}
                                name={`workExperience.${index}.technologiesUsed`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technologies Used</FormLabel>
                                        <FormDescription>
                                            Comma-separated technologies
                                        </FormDescription>
                                        <FormControl>
                                            <Input
                                                placeholder="React, Node.js, PostgreSQL, Docker"
                                                value={field.value?.join(", ") || ""}
                                                onChange={(e) => {
                                                    const techs = e.target.value
                                                        .split(",")
                                                        .map((tech) => tech.trim())
                                                        .filter((tech) => tech.length > 0);
                                                    field.onChange(techs);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </Card>
                    ))}
                </div>
            )}

            {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">
                        No work experience added yet
                    </p>
                </div>
            )}

            <Button
                type="button"
                onClick={addExperience}
                variant="outline"
                className="w-full"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Work Experience
            </Button>
        </div>
    );
}
