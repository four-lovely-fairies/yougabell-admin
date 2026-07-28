import { formatInt } from "./viz";

export type BarDatum = {
  label: string;
  value: number;
  /** 값 오른쪽에 덧붙일 보조 수치 (완료 수, 비율 등) */
  suffix?: string;
  color?: string;
};

/**
 * 가로 랭킹 막대. 라벨과 수치를 항상 직접 노출하므로 색 없이도 읽힌다.
 */
export function BarList({
  data,
  color,
  unit = "건",
  emptyMessage = "기간 내 기록이 없습니다.",
}: {
  data: BarDatum[];
  color: string;
  unit?: string;
  emptyMessage?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  if (data.length === 0) {
    return <p className="py-6 text-center text-xs text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2">
      {data.map((d) => (
        <li key={d.label} className="space-y-1">
          <div className="flex items-baseline justify-between gap-3 text-xs">
            <span className="truncate">{d.label}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {formatInt(d.value)}
              {unit}
              {d.suffix ? ` · ${d.suffix}` : ""}
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-[4px]"
            style={{ background: "var(--viz-track)" }}
          >
            <span
              className="block h-full rounded-[4px]"
              style={{
                width: `${Math.max(2, (d.value / max) * 100)}%`,
                background: d.color ?? color,
              }}
              title={`${d.label} · ${formatInt(d.value)}${unit}`}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
