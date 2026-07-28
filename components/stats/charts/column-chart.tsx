import { formatInt } from "./viz";

export type ColumnDatum = {
  label: string;
  value: number;
  /** 마크 hover 시 노출할 문구. 미지정 시 "라벨 · 값". */
  tooltip?: string;
  /** 값 자체가 순서 척도일 때(예: 기분 레벨) 막대별 색을 덮어쓴다. */
  color?: string;
};

/**
 * 단일 시리즈 세로 막대.
 *
 * 순수 flex + px 높이라 스케일 왜곡이 없고, 막대 사이 2px 표면 간격이
 * 화면 폭과 무관하게 정확히 유지된다.
 */
export function ColumnChart({
  data,
  color,
  height = 160,
  unit = "건",
  /** 축 라벨을 n개마다 하나씩만 노출 (조밀한 시계열용) */
  labelEvery = 1,
  /** 척도 상한 고정 (예: 기분 레벨 5점 만점) */
  max: maxOverride,
  axisTopLabel,
}: {
  data: ColumnDatum[];
  color: string;
  height?: number;
  unit?: string;
  labelEvery?: number;
  max?: number;
  axisTopLabel?: string;
}) {
  const max = maxOverride ?? Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="space-y-1.5">
      <div className="flex items-stretch gap-3">
        <div
          className="flex w-9 shrink-0 flex-col justify-between text-right text-[10px] tabular-nums text-muted-foreground"
          style={{ height }}
        >
          <span>{axisTopLabel ?? formatInt(max)}</span>
          <span>0</span>
        </div>
        <div
          className="relative flex flex-1 items-end gap-[2px] border-b"
          style={{ height, borderColor: "var(--viz-axis)" }}
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-1/2 border-t"
            style={{ borderColor: "var(--viz-grid)" }}
          />
          {data.map((d) => (
            <div
              key={d.label}
              className="relative flex h-full flex-1 items-end"
              title={d.tooltip ?? `${d.label} · ${formatInt(d.value)}${unit}`}
            >
              {d.value > 0 && (
                <span
                  className="w-full rounded-t-[4px]"
                  style={{
                    height: Math.max(2, (d.value / max) * height),
                    background: d.color ?? color,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-[2px] pl-12">
        {data.map((d, i) => (
          <span
            key={d.label}
            className="flex-1 truncate text-center text-[10px] text-muted-foreground"
          >
            {i % labelEvery === 0 ? d.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
