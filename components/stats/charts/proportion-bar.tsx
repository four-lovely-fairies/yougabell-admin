import { cn } from "@/lib/utils";
import { formatInt, formatPercent } from "./viz";

export type ProportionSegment = {
  key: string;
  label: string;
  value: number;
  color: string;
};

/**
 * 100% 누적 가로 막대 — 구성비 하나를 한 줄로 보여준다.
 * 세그먼트 사이 2px 표면 간격 + 범례/수치 병기.
 */
export function ProportionBar({
  segments,
  unit = "건",
}: {
  segments: ProportionSegment[];
  unit?: string;
}) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const visible = segments.filter((s) => s.value > 0);

  if (total === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        기간 내 기록이 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex h-3 w-full gap-[2px] overflow-hidden">
        {visible.map((s, i) => (
          <span
            key={s.key}
            className={cn(
              i === 0 && "rounded-l-[4px]",
              i === visible.length - 1 && "rounded-r-[4px]",
            )}
            style={{
              width: `${(s.value / total) * 100}%`,
              background: s.color,
            }}
            title={`${s.label} · ${formatInt(s.value)}${unit} (${formatPercent(
              s.value / total,
            )})`}
          />
        ))}
      </div>
      <ul className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {segments.map((s) => (
          <li
            key={s.key}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ background: s.color }}
            />
            <span className="flex-1 truncate">{s.label}</span>
            <span className="tabular-nums text-foreground">
              {formatInt(s.value)}
              {unit}
            </span>
            <span className="w-12 text-right tabular-nums">
              {formatPercent(s.value / total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
