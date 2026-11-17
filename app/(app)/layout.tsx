import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

import HomeActionsSkeleton from "@/components/home-actions/home-actions-skeleton";
import PrivacyBoundary from "@/components/privacy/privacy-boundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import ExpenseCounterSkeleton from "@/containers/expense-counter/expense-counter-skeleton";
import ExpenseLimitStatsSkeleton from "@/containers/expense-limit/expense-limit-stats-skeleton";

import type { Metadata } from "next";

import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  ),
  title: "Xpensy | Your expense tracker",
  description:
    "The convenient way to track all your expenses in one place together.",
};

const geistSans = Geist({
  variable: "--font-sans",
  display: "swap",
  subsets: ["latin", "cyrillic"],
});

const privacyFallback = (
  <div className="min-h-screen bg-background p-12">
    <div className="flex h-[calc(100vh-6rem)] flex-col items-center justify-center gap-3 sm:gap-4">
      <ExpenseLimitStatsSkeleton />
      <ExpenseCounterSkeleton />
      <HomeActionsSkeleton />
    </div>
  </div>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Start the cookie lookup without awaiting so the static shell can render;
  // PrivacyBoundary resolves it inside the Suspense boundary below.
  const cookiePromise = cookies();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} antialiased bg-(image:--background)`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={privacyFallback}>
            <PrivacyBoundary cookiePromise={cookiePromise}>
              <TooltipProvider>{children}</TooltipProvider>
            </PrivacyBoundary>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
