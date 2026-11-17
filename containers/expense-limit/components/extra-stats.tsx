import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { ExpenseStat } from "../stats-config";

interface ExtraStatsProps extends ExpenseStat {
  order: number;
}

// Full class names are required as literals so Tailwind's source scanner
// includes these duration utilities in the generated CSS.
const BADGE_DELAYS = [
  "duration-300",
  "duration-600",
  "duration-900",
  "duration-1200",
  "duration-1500",
  "duration-1800",
  "duration-2100",
  "duration-2400",
  "duration-2700",
  "duration-3000",
] as const;

const SPAN_DELAYS = [
  "duration-600",
  "duration-1200",
  "duration-1800",
  "duration-2400",
  "duration-3000",
] as const;

export default function ExtraStats({
  title,
  variant,
  details,
  order,
}: ExtraStatsProps) {
  const badgeDelay = BADGE_DELAYS[Math.min(order, BADGE_DELAYS.length - 1)];
  const spanDelay = SPAN_DELAYS[Math.min(order, SPAN_DELAYS.length - 1)];

  return (
    <Popover>
      <PopoverTrigger>
        <Badge
          className={`animate-in fade-in slide-in-from-bottom-1 ${badgeDelay}`}
          variant={variant}
        >
          <span
            key={title}
            className={`animate-in fade-in zoom-in-95 inline-block ${spanDelay} ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:animate-none`}
          >
            {title}
          </span>
        </Badge>
      </PopoverTrigger>
      <PopoverContent>
        <ul className="flex flex-col gap-1">
          {details.map(({ icon: Icon, label }) => (
            <li key={label} className="flex gap-1 items-center">
              <Icon size={16} />
              {label}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
