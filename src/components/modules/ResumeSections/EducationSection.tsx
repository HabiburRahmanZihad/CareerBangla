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
import { IUpdateResumePayload } from "@/zod/resume.validation";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";

interface EducationSectionProps {
    form: UseFormReturn<IUpdateResumePayload>;
}

export default function EducationSection({ form }: EducationSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "education",
    });

    const addEducation = () => {
        append({
            degree: "",
            fieldOfStudy: "",
            institutionName: "",
            location: "",
            startDate: "",
            endDate: "",
            currentlyStudying: false,
            cgpaOrResult: "",
            description: "",
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
                                    Education {index + 1}
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
                                {/* Degree */}
                                <FormField
                                    control={form.control}
                                    name={`education.${index}.degree`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Degree *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Bachelor of Science"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Field of Study */}
                                <FormField
                                    control={form.control}
                                    name={`education.${index}.fieldOfStudy`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Field of Study *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Computer Science"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Institution Name */}
                                <FormField
                                    control={form.control}
                                    name={`education.${index}.institutionName`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Institution Name *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="University Name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Location */}
                                <FormField
                                    control={form.control}
                                    name={`education.${index}.location`}
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
                                    name={`education.${index}.startDate`}
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
                                    name={`education.${index}.endDate`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    disabled={form.watch(`education.${index}.currentlyStudying`)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* CGPA/Result */}
                                <FormField
                                    control={form.control}
                                    name={`education.${index}.cgpaOrResult`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CGPA / Result</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="3.85 / 4.0"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Currently Studying */}
                            <FormField
                                control={form.control}
                                name={`education.${index}.currentlyStudying`}
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="mt-0! cursor-pointer">
                                            I am currently studying
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name={`education.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormDescription>
                                            Add any additional details about your education
                                        </FormDescription>
                                        <FormControl>
                                            <textarea
                                                className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
                                                placeholder="Relevant coursework, honors, or achievements..."
                                                {...field}
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
                        No education added yet
                    </p>
                </div>
            )}

            <Button
                type="button"
                onClick={addEducation}
                variant="outline"
                className="w-full"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
            </Button>
        </div>
    );
}
