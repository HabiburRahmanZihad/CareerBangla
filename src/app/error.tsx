"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (process.env.NODE_ENV === "development") {
      console.error("[Error Boundary]", error);
    }
  }, [error]);

  const isNetworkError = error?.message?.includes("network") || error?.message?.includes("fetch");
  const isDatabaseError = error?.message?.includes("database") || error?.message?.includes("connection");

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>

        {/* Error Content */}
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            {isNetworkError ? "Connection Error" : isDatabaseError ? "Service Error" : "Something Went Wrong"}
          </h1>
          <p className="text-slate-600 text-sm">
            {isNetworkError
              ? "Unable to connect to the server. Please check your internet connection."
              : isDatabaseError
                ? "The service is temporarily unavailable. Please try again in a moment."
                : "An unexpected error occurred. Our team has been notified."}
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
              <summary className="cursor-pointer font-semibold text-red-900 mb-2">Debug Info</summary>
              <code className="text-xs text-red-800 whitespace-pre-wrap wrap-break-word">
                {error?.message || "Unknown error"}
              </code>
            </details>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2.5 px-4 rounded-lg transition text-center"
          >
            Home
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-center text-xs text-slate-500 pt-4">
          Error ID: {error?.digest || "unknown"}
        </p>
      </div>
    </div>
  );
}
