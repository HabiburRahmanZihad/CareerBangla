"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Bot,
    Loader2,
    MessageSquare,
    Send,
    Sparkles,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const QUICK_PROMPTS = [
    "How do I improve my resume?",
    "What skills are in demand in Bangladesh?",
    "How to prepare for interviews?",
    "How to use ATS score feature?",
];

export default function AIChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi! I'm **CareerBot**, your AI career assistant. I can help with resume tips, interview prep, job search strategies, and more.\n\nWhat can I help you with today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (open) {
            setUnread(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        if (!open && messages.length > 1) {
            setUnread(true);
        }
    }, [messages, open]);

    const sendMessage = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || loading) return;

        const userMsg: Message = { role: "user", content: trimmed };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to get response");
            }

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.reply },
            ]);
        } catch (err) {
            const errorMsg =
                err instanceof Error ? err.message : "Something went wrong.";
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `Sorry, I encountered an error: ${errorMsg} Please try again.`,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const renderContent = (content: string) => {
        // Simple markdown-like rendering for bold and newlines
        return content.split("\n").map((line, i) => {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
                <span key={i}>
                    {parts.map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                    )}
                    {i < content.split("\n").length - 1 && <br />}
                </span>
            );
        });
    };

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none"
                aria-label="Open AI Career Assistant"
            >
                {open ? (
                    <X className="h-6 w-6 text-primary-foreground" />
                ) : (
                    <div className="relative">
                        <MessageSquare className="h-6 w-6 text-primary-foreground" />
                        {unread && (
                            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-background" />
                        )}
                    </div>
                )}
            </button>

            {/* Chat window */}
            {open && (
                <div className="fixed bottom-24 right-6 z-50 flex w-90 flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl transition-all duration-300 max-sm:inset-x-4 max-sm:w-auto">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-border/60 bg-primary/5 px-4 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold text-foreground">
                                    CareerBot
                                </span>
                                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                AI Career Assistant
                            </p>
                        </div>
                        <button
                            title="Open"
                            onClick={() => setOpen(false)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="h-80 px-4 py-3">
                        <div className="space-y-3">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex gap-2",
                                        msg.role === "user"
                                            ? "flex-row-reverse"
                                            : "flex-row"
                                    )}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                : "bg-muted text-foreground rounded-tl-sm"
                                        )}
                                    >
                                        {renderContent(msg.content)}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-3 py-2">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            Thinking...
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div ref={bottomRef} />
                    </ScrollArea>

                    {/* Quick prompts - only show at start */}
                    {messages.length === 1 && (
                        <div className="border-t border-border/40 px-4 py-2">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Quick questions
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {QUICK_PROMPTS.map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => sendMessage(prompt)}
                                        className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="border-t border-border/60 p-3">
                        <div className="flex items-end gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20">
                            <textarea
                                ref={inputRef}
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about your career..."
                                className="flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                                style={{ maxHeight: "80px" }}
                                disabled={loading}
                            />
                            <Button
                                size="icon"
                                className="h-7 w-7 shrink-0"
                                onClick={() => sendMessage(input)}
                                disabled={loading || !input.trim()}
                            >
                                <Send className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
                            Powered by Claude AI
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
