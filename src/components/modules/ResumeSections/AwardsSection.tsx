"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    FormControl,
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

interface AwardsSectionProps {
    form: UseFormReturn<IUpdateResumePayload>;
}

export default function AwardsSection({ form }: AwardsSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "awards",
    });

    const addAward = () => {
        append({
            title: "",
            issuer: "",
            date: "",
            description: "",
        });
    };

    return (
        <div className="space-y-4">
            {fields.length > 0 && (
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-6 space-y-4">
                            <div className="flex justify-between">
                                <h4 className="font-semibold">Award {index + 1}</h4>
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
                                    name={`awards.${index}.title`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Award Title *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Employee of the Year" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`awards.${index}.issuer`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Issuer *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Company Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`awards.${index}.date`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date *</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name={`awards.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Details about the award..."
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
                    <p className="text-muted-foreground">No awards added yet</p>
                </div>
            )}

            <Button type="button" onClick={addAward} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Award
            </Button>
        </div>
    );
}
