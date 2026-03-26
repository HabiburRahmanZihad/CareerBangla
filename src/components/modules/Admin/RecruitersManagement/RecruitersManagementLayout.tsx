"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import ConfirmedRecruitersContent from "./ConfirmedRecruitersContent";
import RecruiterApplicationsContent from "./RecruiterApplicationsContent";

const RecruitersManagementLayout = () => {
    const [activeTab, setActiveTab] = useState("applications");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Recruiters Management</h1>
                    <p className="text-muted-foreground">Manage recruiter applications and confirmed accounts</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-auto">
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmed Recruiters</TabsTrigger>
                </TabsList>

                <TabsContent value="applications" className="space-y-6">
                    <RecruiterApplicationsContent />
                </TabsContent>

                <TabsContent value="confirmed" className="space-y-6">
                    <ConfirmedRecruitersContent />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RecruitersManagementLayout;
