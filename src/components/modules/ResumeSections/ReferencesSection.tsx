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
import { IUpdateResumePayload } from "@/zod/resume.validation";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";

interface ReferencesSectionProps {
    form: UseFormReturn<IUpdateResumePayload>;
}

export default function ReferencesSection({ form }: ReferencesSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "references",
    });

    const addReference = () => {
        append({
            name: "",
            designation: "",
            company: "",
            email: "",
            phone: "",
            relationship: "",
        });
    };

    return (
        <div className="space-y-4">
            <FormDescription>
                Optional: Add professional references who can vouch for your work and skills
            </FormDescription>

            {fields.length > 0 && (
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-6 space-y-4">
                            <div className="flex justify-between">
                                <h4 className="font-semibold">Reference {index + 1}</h4>
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
                                    name={`references.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Manager" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`references.${index}.designation`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Designation</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Team Lead" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`references.${index}.company`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Company Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`references.${index}.relationship`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Relationship</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Former Manager" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`references.${index}.email`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="john@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`references.${index}.phone`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1 (555) 000-0000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No references added yet</p>
                </div>
            )}

            <Button type="button" onClick={addReference} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Reference
            </Button>
        </div>
    );
}
