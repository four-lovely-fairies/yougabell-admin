import Link from "next/link";

import { cn } from "@/lib/utils";

const PRESETS = [
  { days: 7, label: "최근 7일" },
  { days: 30, label: "최근 30일" },
  { days: 90, label: "최근 90일" },
] as const;

export const RANGE_PRESETS = PRESETS.map((p) => p.days);

/** 기간 프리셋. 상태가 URL에만 있으므로 서버 컴포넌트 링크로 충분하다. */
export function RangeFilter({ days }: { days: number }) {
  return (
    <nav aria-label="집계 기간" className="flex items-center gap-1">
      {PRESETS.map((preset) => (
        <Link
          key={preset.days}
          href={`/stats?days=${preset.days}`}
          aria-current={preset.days === days ? "page" : undefined}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            preset.days === days
              ? "bg-secondary font-medium text-secondary-foreground"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          {preset.label}
        </Link>
      ))}
    </nav>
  );
}
