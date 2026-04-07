import { NextRequest, NextResponse } from "next/server";

const COMMON_JOB_TITLES = [
    "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "React Developer", "Node.js Developer", "Python Developer", "Java Developer",
    "DevOps Engineer", "Data Scientist", "Machine Learning Engineer", "AI Engineer",
    "UI/UX Designer", "Graphic Designer", "Product Manager", "Project Manager",
    "Business Analyst", "Digital Marketing", "SEO Specialist", "Content Writer",
    "Sales Executive", "HR Manager", "Accountant", "Finance Manager",
    "Customer Support", "Operations Manager", "Supply Chain Manager",
    "Android Developer", "iOS Developer", "Mobile Developer",
    "Cybersecurity Engineer", "Network Engineer", "System Administrator",
    "Database Administrator", "Cloud Engineer", "QA Engineer",
    "Data Analyst", "Marketing Manager", "Brand Manager", "Social Media Manager",
];

function getFallbackSuggestions(query: string): string[] {
    const lower = query.toLowerCase();
    return COMMON_JOB_TITLES
        .filter(title => title.toLowerCase().includes(lower))
        .slice(0, 6);
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
        return NextResponse.json({ suggestions: [] });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your_anthropic_api_key_here") {
        return NextResponse.json({ suggestions: getFallbackSuggestions(query) });
    }

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 200,
                messages: [
                    {
                        role: "user",
                        content: `Generate 6 job title search suggestions for the query: "${query}"

Context: Bangladesh job market on a modern hiring platform.
Return ONLY a JSON array of strings with no explanation. Example: ["React Developer", "React Native Developer", "React Frontend Engineer"]
Each suggestion should be a specific, realistic job title relevant to the query.`,
                    },
                ],
            }),
        });

        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        const text: string =
            data.content?.[0]?.type === "text" ? data.content[0].text.trim() : "[]";

        const match = text.match(/\[[\s\S]*\]/);
        if (!match) throw new Error("No JSON array found");

        const suggestions = JSON.parse(match[0]) as string[];
        return NextResponse.json({ suggestions: suggestions.slice(0, 6) });
    } catch {
        return NextResponse.json({ suggestions: getFallbackSuggestions(query) });
    }
}
