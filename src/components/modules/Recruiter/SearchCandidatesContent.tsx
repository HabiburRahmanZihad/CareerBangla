"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchCandidates } from "@/services/resume.services";
import { useQuery } from "@tanstack/react-query";
import { Search, User } from "lucide-react";
import { useState } from "react";

const SearchCandidatesContent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [skills, setSkills] = useState("");
    const [searchParams, setSearchParams] = useState<Record<string, unknown>>({});

    const { data, isLoading } = useQuery({
        queryKey: ["search-candidates", searchParams],
        queryFn: () => searchCandidates({ ...searchParams, limit: "20" }),
        enabled: Object.keys(searchParams).length > 0,
    });

    const handleSearch = () => {
        const params: Record<string, unknown> = {};
        if (searchTerm) params.searchTerm = searchTerm;
        if (skills) params.skills = skills;
        setSearchParams(params);
    };

    const candidates = data?.data || [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Search Candidates</h1>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="Search by name, title, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1"
                        />
                        <Input
                            placeholder="Skills (comma separated)"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch}>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-lg" />
                    ))}
                </div>
            ) : Object.keys(searchParams).length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Enter search criteria to find candidates. Viewing a candidate costs 10 coins.
                    </CardContent>
                </Card>
            ) : candidates.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No candidates found matching your criteria.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidates.map((candidate) => (
                        <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{candidate.user?.name || "Candidate"}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{candidate.title || "No title"}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-3">
                                {candidate.address && (
                                    <p className="text-sm text-muted-foreground">{candidate.address}</p>
                                )}
                                {candidate.skills && candidate.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {candidate.skills.slice(0, 5).map((skill) => (
                                            <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                                        ))}
                                    </div>
                                )}
                                <Button variant="outline" size="sm" className="w-full text-xs">
                                    View Full Profile (10 coins)
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchCandidatesContent;
