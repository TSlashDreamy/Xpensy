import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen max-w-5xl w-full flex flex-1 flex-col gap-10 justify-center items-center p-5 mx-auto">
      <Hero />
      <div className="flex flex-col gap-6 px-4">
        <Suspense>
          <AuthButton />
        </Suspense>
        <ThemeSwitcher />
      </div>
    </main>
  );
}
