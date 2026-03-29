"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  Code,
  Info,
  Star,
  Target,
  TrendingUp,
  UserCircle
} from "lucide-react";
import Link from "next/link";

const completionCriteria = [
  { category: "Personal Details", criteria: "Full Name, Email, and Contact Number", points: 5, icon: UserCircle, color: "text-blue-500", bg: "bg-blue-500/10", crucial: false },
  { category: "Professional Title", criteria: "Your primary job title", points: 3, icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-500/10", crucial: false },
  { category: "URLs/Portfolio", criteria: "At least one (LinkedIn, GitHub, or Website)", points: 4, icon: Star, color: "text-purple-500", bg: "bg-purple-500/10", crucial: false },
  { category: "Additional Profile Data", criteria: "Date of Birth, Gender, and Address", points: 3, icon: UserCircle, color: "text-blue-500", bg: "bg-blue-500/10", crucial: false },
  { category: "Nationality", criteria: "Your nationality", points: 2, icon: UserCircle, color: "text-blue-500", bg: "bg-blue-500/10", crucial: false },
  { category: "Professional Summary", criteria: "Summary text (MUST be > 50 characters)", points: 12, icon: BookOpen, color: "text-amber-500", bg: "bg-amber-500/10", crucial: true },
  { category: "Technical Skills", criteria: "At least one technical skill", points: 6, icon: Code, color: "text-emerald-500", bg: "bg-emerald-500/10", crucial: false },
  { category: "Soft Skills", criteria: "At least one soft skill", points: 6, icon: Target, color: "text-teal-500", bg: "bg-teal-500/10", crucial: false },
  { category: "Tools & Technologies", criteria: "At least one tool/technology", points: 6, icon: Code, color: "text-emerald-500", bg: "bg-emerald-500/10", crucial: false },
  { category: "Work Experience", criteria: "At least one work experience entry", points: 15, icon: Briefcase, color: "text-orange-500", bg: "bg-orange-500/10", crucial: true },
  { category: "Education", criteria: "At least one education entry", points: 12, icon: BookOpen, color: "text-cyan-500", bg: "bg-cyan-500/10", crucial: true },
  { category: "Certifications", criteria: "At least one certification entry", points: 8, icon: Award, color: "text-yellow-500", bg: "bg-yellow-500/10", crucial: false },
  { category: "Projects", criteria: "At least one project entry", points: 8, icon: Code, color: "text-rose-500", bg: "bg-rose-500/10", crucial: false },
  { category: "Languages", criteria: "At least one language entry", points: 3, icon: BookOpen, color: "text-pink-500", bg: "bg-pink-500/10", crucial: false },
  { category: "Awards", criteria: "At least one award entry", points: 2, icon: Award, color: "text-yellow-500", bg: "bg-yellow-500/10", crucial: false },
  { category: "Interests", criteria: "At least one interest", points: 1, icon: Star, color: "text-sky-500", bg: "bg-sky-500/10", crucial: false },
  { category: "References", criteria: "At least one reference", points: 1, icon: UserCircle, color: "text-blue-500", bg: "bg-blue-500/10", crucial: false },
];

const ProfileCompletionGuide = () => {
  return (
    <div className="w-full container mx-auto space-y-6 lg:space-y-8 pb-10">

      {/* ── Header ── */}
      <div className="relative rounded-3xl border border-border/40 bg-card overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <TrendingUp className="w-48 h-48 -rotate-12" />
        </div>

        <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-2">
              <Target className="w-4 h-4" /> ATS Optimization
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              Profile Score Guide
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              Understand exactly how our advanced ATS algorithm evaluates your profile to maximize your visibility and land your dream job.
            </p>
          </div>
          <div className="relative z-10 shrink-0 w-full lg:w-auto">
            <Link href="/dashboard/my-resume" className="w-full">
              <Button variant="outline" className="w-full lg:w-auto rounded-xl px-6 h-12 font-bold border-border/50 hover:bg-muted/40 shadow-sm gap-2">
                <ChevronLeft className="w-5 h-5" /> Back to Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main content layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* ── Left Column: Completion Criteria ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4 bg-muted/30 px-5 py-3 rounded-2xl border border-border/40">
            <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
              <Award className="w-5 h-5 text-primary" /> Breakdown of Points
            </h2>
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-accent rounded-lg border-primary/20 text-white">
              100% Total
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {completionCriteria.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden flex flex-col justify-between p-5 rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${item.crucial ? 'border-primary/40 shadow-sm shadow-primary/5' : 'border-border/40'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide">
                      +{item.points}%
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                      {item.category}
                      {item.crucial && <Badge variant="secondary" className="px-1.5 py-0 text-[9px] bg-primary/10 text-primary uppercase ml-1">Crucial</Badge>}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.criteria}
                    </p>
                  </div>

                  {item.crucial && (
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-linear-to-br from-transparent to-primary/10 rounded-full opacity-50 blur-xl pointer-events-none group-hover:bg-primary/20 transition-all" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right Column: Sticky Info Panel ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <Card className="rounded-3xl border-border/40 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />

              <CardHeader className="relative pb-4 pt-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-bold tracking-widest uppercase mb-3 w-fit">
                  <Info className="w-4 h-4" /> Pro Tip
                </div>
                <CardTitle className="text-xl">Stuck below 100%?</CardTitle>
                <CardDescription className="text-sm">
                  If you&apos;ve filled out your form but are stuck around 80%-95%, these are the common mathematical drop-offs:
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-5 pb-6">
                <div className="space-y-4">

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold shrink-0">1</div>
                      <div className="w-px h-full bg-border/80 mt-2" />
                    </div>
                    <div className="pb-4">
                      <h4 className="font-bold text-sm text-foreground mb-1">Summary Absence (-12%)</h4>
                      <p className="text-xs text-muted-foreground">Filling out your Professional Summary automatically earns 12%. Don&apos;t leave it blank!</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold shrink-0">2</div>
                      <div className="w-px h-full bg-border/80 mt-2" />
                    </div>
                    <div className="pb-4">
                      <h4 className="font-bold text-sm text-foreground mb-1">Missing Essentials (-5%)</h4>
                      <p className="text-xs text-muted-foreground">Full Name and Email are mandatory fields. Leaving them empty loses 5%.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold shrink-0">3</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">Empty Dynamic Lists (-35%)</h4>
                      <p className="text-xs text-muted-foreground">You must have at least 1 entry saved in EVERY list above (Projects, Skills, Awards, References, etc.).</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 to-transparent backdrop-blur-sm shadow-inner overflow-hidden">
              <CardContent className="relative p-6">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <CheckCircle2 className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg text-foreground mb-1">Reach 100%</h4>
                    <p className="text-sm text-muted-foreground">A 100% complete profile boosts your visibility to recruiters by over 3x.</p>
                    <Link href="/dashboard/my-resume" className="block mt-4">
                      <Button className="w-full rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform h-11" size="sm">
                        Complete Profile <TrendingUp className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileCompletionGuide;
