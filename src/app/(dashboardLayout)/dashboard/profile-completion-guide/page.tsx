"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronRight, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ProfileCompletionGuide = () => {
  const completionCriteria = [
    { category: "Personal Details", criteria: "Full Name, Email, and Contact Number", points: 5, uiExists: true },
    { category: "Professional Title", criteria: "Your primary job title", points: 3, uiExists: true },
    { category: "URLs/Portfolio", criteria: "At least one (LinkedIn, GitHub, or Website)", points: 4, uiExists: true },
    { category: "Additional Profile Data", criteria: "Date of Birth, Gender, and Address", points: 3, uiExists: true },
    { category: "Nationality", criteria: "Your nationality", points: 2, uiExists: false },
    { category: "Professional Summary", criteria: "Summary text (MUST be longer than 50 characters)", points: 12, uiExists: true },
    { category: "Technical Skills", criteria: "At least one technical skill", points: 6, uiExists: true },
    { category: "Soft Skills", criteria: "At least one soft skill", points: 6, uiExists: false },
    { category: "Tools & Technologies", criteria: "At least one tool/technology", points: 6, uiExists: false },
    { category: "Work Experience", criteria: "At least one work experience entry", points: 15, uiExists: true },
    { category: "Education", criteria: "At least one education entry", points: 12, uiExists: true },
    { category: "Certifications", criteria: "At least one certification entry", points: 8, uiExists: true },
    { category: "Projects", criteria: "At least one project entry", points: 8, uiExists: false },
    { category: "Languages", criteria: "At least one language entry", points: 3, uiExists: false },
    { category: "Awards", criteria: "At least one award entry", points: 2, uiExists: false },
    { category: "Interests", criteria: "At least one interest", points: 1, uiExists: false },
    { category: "References", criteria: "At least one reference", points: 1, uiExists: false },
  ];

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Completion Guide</h1>
          <p className="text-muted-foreground mt-2">
            Learn exactly how our ATS algorithm evaluates your profile and how to reach 100%.
          </p>
        </div>
        <Link href="/dashboard/my-resume">
          <Button variant="outline">Back to My Resume</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How is my score calculated?</CardTitle>
              <CardDescription>Your ATS success rate is strictly determined by these weighted categories.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completionCriteria.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                    <div className="flex items-start gap-4">
                      {item.uiExists ? (
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-semibold">{item.category}</h4>
                        <p className="text-sm text-muted-foreground">{item.criteria}</p>
                        {!item.uiExists && (
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground mt-1">
                            Pending UI Implementation
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">+{item.points}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Why am I stuck?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                If you have filled out your entire form but are stuck around <strong>50%-60%</strong>, it is because of two main reasons:
              </p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>
                  <strong>Summary Length:</strong> Your Professional Summary <strong>must be strictly longer than 50 characters</strong> to earn its massive 12% weight.
                </li>
                <li>
                  <strong>Missing Advanced ATS Fields:</strong> Currently, the frontend form does not display the input fields for <span className="font-semibold">Projects, Soft Skills, Tools, Languages, Awards, or References</span>.
                </li>
              </ol>
              <p className="text-muted-foreground mt-2">
                These advanced tracking modules make up exactly <strong>29%</strong> of the mathematical scoring criteria in the backend API database schema, but wait on future UI implementation to be visible.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionGuide;
