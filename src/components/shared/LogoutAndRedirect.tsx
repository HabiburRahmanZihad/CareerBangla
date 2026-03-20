"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LogoutAndRedirect() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            try {
                // Call logout route handler to clear cookies
                const response = await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    console.log("Cookies cleared successfully");
                }
            } catch (error) {
                console.error("Logout error:", error);
            } finally {
                // Always redirect to login after logout attempt
                router.push("/login");
            }
        };

        logout();
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <div className="mb-4 inline-block animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 h-12 w-12"></div>
                <p className="text-gray-600">Redirecting to login...</p>
            </div>
        </div>
    );
}
