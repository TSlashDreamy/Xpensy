import { XpensyLogo } from "./xpensy-logo";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="w-3xs">
        <XpensyLogo />
      </div>
      <p className="text-3xl lg:text-4xl leading-tight! mx-auto max-w-xl text-center">
        The convenient way to track all your expenses together
      </p>
      <div className="w-full p-px bg-linear-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
