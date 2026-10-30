import { cn } from "cn";

interface DigitColumnProps {
  digit: number;
  isPending: boolean;
}

export default function DigitColumn({ digit, isPending }: DigitColumnProps) {
  return (
    <span className="inline-block h-[1em] overflow-hidden align-bottom">
      <span
        className={cn(
          isPending ? "duration-100 ease-linear" : "duration-500 ease-out",
          "flex flex-col transition-transform motion-reduce:transition-none",
        )}
        data-digit={digit}
        style={{ transform: `translateY(-${digit}em)` }}
      >
        {Array.from({ length: 10 }, (_, value) => (
          <span key={value} className="h-[1em] leading-[1em] text-center">
            {value}
          </span>
        ))}
      </span>
    </span>
  );
}
