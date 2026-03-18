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
import { IUpdateResumePayload } from "@/zod/resume.validation";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";

interface LanguagesSectionProps {
    form: UseFormReturn<IUpdateResumePayload>;
}

export default function LanguagesSection({ form }: LanguagesSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "languages",
    });

    const addLanguage = () => {
        append({
            language: "",
            proficiencyLevel: "Intermediate",
        });
    };

    return (
        <div className="space-y-4">
            {fields.length > 0 && (
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`languages.${index}.language`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Language *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="English" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`languages.${index}.proficiencyLevel`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Proficiency Level *</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="w-full px-3 py-2 border rounded-md border-input bg-background"
                                                >
                                                    <option value="Native">Native</option>
                                                    <option value="Fluent">Fluent</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Beginner">Beginner</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => remove(index)}
                                        className="w-full"
                                    >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No languages added yet</p>
                </div>
            )}

            <Button type="button" onClick={addLanguage} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Language
            </Button>
        </div>
    );
}
