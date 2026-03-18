"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

interface ProjectsSectionProps {
    form: UseFormReturn<IUpdateResumePayload>;
}

export default function ProjectsSection({ form }: ProjectsSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "projects",
    });

    const addProject = () => {
        append({
            projectName: "",
            role: "",
            description: "",
            technologiesUsed: [],
            liveUrl: "",
            githubUrl: "",
            startDate: "",
            endDate: "",
            highlights: [],
        });
    };

    return (
        <div className="space-y-4">
            {fields.length > 0 && (
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-6 space-y-4">
                            <div className="flex justify-between">
                                <h4 className="font-semibold">Project {index + 1}</h4>
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
                                <FormField
                                    control={form.control}
                                    name={`projects.${index}.projectName`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="E-commerce Platform" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`projects.${index}.role`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Role</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Lead Developer" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`projects.${index}.startDate`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`projects.${index}.endDate`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`projects.${index}.liveUrl`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Live URL</FormLabel>
                                            <FormControl>
                                                <Input type="url" placeholder="https://..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`projects.${index}.githubUrl`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GitHub URL</FormLabel>
                                            <FormControl>
                                                <Input type="url" placeholder="https://github.com/..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name={`projects.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description *</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Project description..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`projects.${index}.technologiesUsed`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technologies Used</FormLabel>
                                        <FormDescription>Comma-separated</FormDescription>
                                        <FormControl>
                                            <Input
                                                placeholder="React, Node.js, MongoDB"
                                                value={field.value?.join(", ") || ""}
                                                onChange={(e) => {
                                                    const techs = e.target.value
                                                        .split(",")
                                                        .map((t) => t.trim())
                                                        .filter((t) => t);
                                                    field.onChange(techs);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`projects.${index}.highlights`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Highlights</FormLabel>
                                        <FormDescription>Add one per line</FormDescription>
                                        <FormControl>
                                            <Textarea
                                                placeholder="• Highlight 1&#10;• Highlight 2"
                                                className="min-h-20"
                                                value={field.value?.join("\n") || ""}
                                                onChange={(e) => {
                                                    const items = e.target.value
                                                        .split("\n")
                                                        .map((l) => l.trim())
                                                        .filter((l) => l);
                                                    field.onChange(items);
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
                    <p className="text-muted-foreground">No projects added yet</p>
                </div>
            )}

            <Button type="button" onClick={addProject} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
            </Button>
        </div>
    );
}
