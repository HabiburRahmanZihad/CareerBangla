import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Delete all auth cookies
        cookieStore.delete("better-auth.session_token");
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");

        return NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { success: false, message: "Logout failed" },
            { status: 500 }
        );
    }
}
