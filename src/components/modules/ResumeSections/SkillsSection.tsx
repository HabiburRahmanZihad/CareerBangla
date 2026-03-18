"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IUpdateResumePayload } from "@/zod/resume.validation";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface SkillsSectionProps {
    form: UseFormReturn<IUpdateResumePayload>;
}

export default function SkillsSection({ form }: SkillsSectionProps) {
    const [currentSkill, setCurrentSkill] = useState("");
    const [activeCategory, setActiveCategory] = useState<"technical" | "soft" | "tools">("technical");

    const technicalSkills = form.watch("technicalSkills") || [];
    const softSkills = form.watch("softSkills") || [];
    const toolsAndTechnologies = form.watch("toolsAndTechnologies") || [];

    const addSkill = () => {
        if (!currentSkill.trim()) return;

        const trimmedSkill = currentSkill.trim();

        if (activeCategory === "technical") {
            if (!technicalSkills.includes(trimmedSkill)) {
                form.setValue("technicalSkills", [...technicalSkills, trimmedSkill]);
            }
        } else if (activeCategory === "soft") {
            if (!softSkills.includes(trimmedSkill)) {
                form.setValue("softSkills", [...softSkills, trimmedSkill]);
            }
        } else if (activeCategory === "tools") {
            if (!toolsAndTechnologies.includes(trimmedSkill)) {
                form.setValue("toolsAndTechnologies", [...toolsAndTechnologies, trimmedSkill]);
            }
        }

        setCurrentSkill("");
    };

    const removeSkill = (category: "technical" | "soft" | "tools", index: number) => {
        if (category === "technical") {
            form.setValue("technicalSkills", technicalSkills.filter((_, i) => i !== index));
        } else if (category === "soft") {
            form.setValue("softSkills", softSkills.filter((_, i) => i !== index));
        } else if (category === "tools") {
            form.setValue("toolsAndTechnologies", toolsAndTechnologies.filter((_, i) => i !== index));
        }
    };

    const handleAddSkillKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <div className="space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant={activeCategory === "technical" ? "default" : "outline"}
                        onClick={() => setActiveCategory("technical")}
                        size="sm"
                    >
                        Technical
                    </Button>
                    <Button
                        type="button"
                        variant={activeCategory === "soft" ? "default" : "outline"}
                        onClick={() => setActiveCategory("soft")}
                        size="sm"
                    >
                        Soft Skills
                    </Button>
                    <Button
                        type="button"
                        variant={activeCategory === "tools" ? "default" : "outline"}
                        onClick={() => setActiveCategory("tools")}
                        size="sm"
                    >
                        Tools & Tech
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder={`Add a ${activeCategory === "technical" ? "technical skill" : activeCategory === "soft" ? "soft skill" : "tool or technology"}...`}
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyPress={handleAddSkillKeyPress}
                    />
                    <Button
                        type="button"
                        onClick={addSkill}
                        disabled={!currentSkill.trim()}
                        size="sm"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Technical Skills */}
            <div>
                <h4 className="font-semibold mb-3 text-sm">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                    {technicalSkills.length > 0 ? (
                        technicalSkills.map((skill, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                                {skill}
                                <button
                                    
                                    type="button"
                                    onClick={() => removeSkill("technical", index)}
                                    className="ml-2 hover:opacity-70"
                                    title="Remove Technical Skill"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            No technical skills added yet
                        </p>
                    )}
                </div>
            </div>

            {/* Soft Skills */}
            <div>
                <h4 className="font-semibold mb-3 text-sm">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                    {softSkills.length > 0 ? (
                        softSkills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeSkill("soft", index)}
                                    className="ml-2 hover:opacity-70"
                                    title="Remove Soft Skill"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            No soft skills added yet
                        </p>
                    )}
                </div>
            </div>

            {/* Tools and Technologies */}
            <div>
                <h4 className="font-semibold mb-3 text-sm">Tools & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                    {toolsAndTechnologies.length > 0 ? (
                        toolsAndTechnologies.map((tool, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {tool}
                                <button
                                    type="button"
                                    onClick={() => removeSkill("tools", index)}
                                    className="ml-2 hover:opacity-70"
                                    title="Remove Tool or Technology"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            No tools added yet
                        </p>
                    )}
                </div>
            </div>

            <FormDescription>
                Use tags to categorize your skills. Skills are stored as separate items for better ATS compatibility.
            </FormDescription>
        </div>
    );
}
