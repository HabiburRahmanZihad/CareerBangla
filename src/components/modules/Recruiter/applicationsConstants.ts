import { Calendar, CheckCircle, Clock, Star, Trash2 } from "lucide-react";

export const statusConfig: Record<string, { bg: string; text: string; badge: string; icon: React.ElementType; accentColor: string }> = {
    PENDING: {
        bg: "bg-yellow-50 dark:bg-yellow-950/20",
        text: "text-yellow-700 dark:text-yellow-400",
        badge: "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30",
        icon: Clock,
        accentColor: "from-yellow-500 to-yellow-500/10",
    },
    SHORTLISTED: {
        bg: "bg-indigo-50 dark:bg-indigo-950/20",
        text: "text-indigo-700 dark:text-indigo-400",
        badge: "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30",
        icon: Star,
        accentColor: "from-indigo-500 to-indigo-500/10",
    },
    INTERVIEW: {
        bg: "bg-blue-50 dark:bg-blue-950/20",
        text: "text-blue-700 dark:text-blue-400",
        badge: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
        icon: Calendar,
        accentColor: "from-blue-500 to-blue-500/10",
    },
    HIRED: {
        bg: "bg-green-50 dark:bg-green-950/20",
        text: "text-green-700 dark:text-green-400",
        badge: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30",
        icon: CheckCircle,
        accentColor: "from-green-500 to-green-500/10",
    },
    REJECTED: {
        bg: "bg-red-50 dark:bg-red-950/20",
        text: "text-red-700 dark:text-red-400",
        badge: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30",
        icon: Trash2,
        accentColor: "from-red-500 to-red-500/10",
    },
};

export const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SHORTLISTED: "bg-indigo-100 text-indigo-800",
    INTERVIEW: "bg-blue-100 text-blue-800",
    HIRED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
};

export const terminalStatuses = ["HIRED", "REJECTED", "INTERVIEW"];

export const validTransitions: Record<string, string[]> = {
    PENDING: ["SHORTLISTED"],
    SHORTLISTED: ["INTERVIEW"],
    INTERVIEW: [],
    HIRED: [],
    REJECTED: [],
};

export const toPdfBlob = (payload: unknown): Blob => {
    if (payload instanceof Blob) {
        return payload;
    }

    if (payload instanceof ArrayBuffer) {
        return new Blob([payload], { type: "application/pdf" });
    }

    if (ArrayBuffer.isView(payload)) {
        const view = payload as ArrayBufferView;
        const bytes = new Uint8Array(view.buffer, view.byteOffset || 0, view.byteLength || 0);
        return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    }

    if (payload && typeof payload === "object" && "type" in payload && "data" in payload) {
        const maybeBuffer = payload as { type?: unknown; data?: unknown };
        if (maybeBuffer.type === "Buffer" && Array.isArray(maybeBuffer.data)) {
            return new Blob([new Uint8Array(maybeBuffer.data)], { type: "application/pdf" });
        }
    }

    return new Blob([payload as BlobPart], { type: "application/pdf" });
};
