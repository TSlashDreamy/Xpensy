import { cn } from "cn";
import React from "react";

interface DigitColumnProps {
  digit: number;
  isPending: boolean;
}

const DIGIT_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

function DigitColumn({ digit, isPending }: DigitColumnProps) {
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
        {DIGIT_VALUES.map((value) => (
          <span key={value} className="h-[1em] leading-[1em] text-center">
            {value}
          </span>
        ))}
      </span>
    </span>
  );
}

export default React.memo(DigitColumn);
