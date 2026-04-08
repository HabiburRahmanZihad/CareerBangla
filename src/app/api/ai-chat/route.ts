import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are CareerBot, an AI career assistant for CareerBangla — Bangladesh's modern job platform. You help job seekers and recruiters with career-related questions.

You can help with:
- Resume writing tips and ATS optimization
- Job search strategies in Bangladesh
- Interview preparation and common questions
- Career path advice for tech, business, and other fields
- How to use CareerBangla platform features
- Salary insights for the Bangladeshi job market
- Skills in demand for the Bangladeshi job market

Guidelines:
- Be concise, friendly, and practical
- Focus on the Bangladesh job market context when relevant
- Suggest CareerBangla features when appropriate (job search at /jobs, resume builder, ATS score checker, etc.)
- Keep responses under 200 words unless a detailed explanation is needed
- Use bullet points for lists
- Do NOT provide legal, medical, or financial advice`;

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey || apiKey === "your_anthropic_api_key_here") {
            return NextResponse.json(
                { error: "AI service not configured. Please add your ANTHROPIC_API_KEY to .env.local." },
                { status: 503 }
            );
        }

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: messages.map((m: { role: string; content: string }) => ({
                    role: m.role,
                    content: m.content,
                })),
            }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            console.error("Anthropic API error:", err);

            const errMessage: string = err?.error?.message || "";
            const errType: string = err?.error?.type || "";

            if (
                errMessage.toLowerCase().includes("credit balance is too low") ||
                errMessage.toLowerCase().includes("insufficient") ||
                errType === "invalid_request_error" && errMessage.toLowerCase().includes("credit")
            ) {
                return NextResponse.json(
                    { error: "AI assistant is temporarily unavailable. Please try again later." },
                    { status: 503 }
                );
            }

            if (response.status === 429 || errType === "rate_limit_error") {
                return NextResponse.json(
                    { error: "Too many requests. Please wait a moment and try again." },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: "AI service error. Please try again." },
                { status: 502 }
            );
        }

        const data = await response.json();
        const text: string =
            data.content?.[0]?.type === "text" ? data.content[0].text : "";

        return NextResponse.json({ reply: text });
    } catch (error) {
        console.error("AI chat error:", error);
        return NextResponse.json(
            { error: "Failed to get AI response. Please try again." },
            { status: 500 }
        );
    }
}
