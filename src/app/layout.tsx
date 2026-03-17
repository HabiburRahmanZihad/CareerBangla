import { Toaster } from "@/components/ui/sonner";
import QueryProviders from "@/providers/QueryProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerBangla - Your Career, Your Future",
  description: "CareerBangla is a comprehensive job portal platform connecting job seekers with recruiters. Find your dream job, build your resume, and advance your career.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProviders>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProviders>
      </body>
    </html>
  );
}
