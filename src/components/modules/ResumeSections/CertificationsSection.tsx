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

interface CertificationsSectionProps {
    form: UseFormReturn<IUpdateResumePayload>;
}

export default function CertificationsSection({ form }: CertificationsSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "certifications",
    });

    const addCertification = () => {
        append({
            certificationName: "",
            issuingOrganization: "",
            issueDate: "",
            expiryDate: "",
            credentialId: "",
            credentialUrl: "",
        });
    };

    return (
        <div className="space-y-4">
            {fields.length > 0 && (
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-6 space-y-4">
                            <div className="flex justify-between">
                                <h4 className="font-semibold">
                                    Certification {index + 1}
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
                                <FormField
                                    control={form.control}
                                    name={`certifications.${index}.certificationName`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Certification Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="AWS Solutions Architect" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`certifications.${index}.issuingOrganization`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Issuing Organization *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Amazon Web Services" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`certifications.${index}.issueDate`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Issue Date *</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`certifications.${index}.expiryDate`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expiry Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`certifications.${index}.credentialId`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Credential ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ABC123XYZ" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`certifications.${index}.credentialUrl`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Credential URL</FormLabel>
                                            <FormControl>
                                                <Input type="url" placeholder="https://..." {...field} />
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
                    <p className="text-muted-foreground">No certifications added yet</p>
                </div>
            )}

            <Button type="button" onClick={addCertification} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
            </Button>
        </div>
    );
}
