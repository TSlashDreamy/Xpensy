import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-full flex flex-1 flex-col gap-10 items-center justify-center max-w-5xl p-5">
        <Hero />
        <div className="flex flex-col gap-6 px-4">
          <Suspense>
            <AuthButton />
          </Suspense>
          <ThemeSwitcher />
        </div>
      </div>
    </main>
  );
}
