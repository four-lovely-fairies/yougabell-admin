import { formatInt } from "./viz";

export type StackSeries = {
  key: string;
  label: string;
  color: string;
  values: number[];
};

const SEGMENT_GAP = 2;

/**
 * 누적 세로 막대. 세그먼트 사이에 2px 표면 간격을 둬서 인접 색이 맞닿지 않게 한다
 * (색 구분이 어려운 경우에도 경계가 보이도록).
 */
export function StackedColumnChart({
  labels,
  series,
  height = 180,
  unit = "건",
  labelEvery = 1,
}: {
  labels: string[];
  series: StackSeries[];
  height?: number;
  unit?: string;
  labelEvery?: number;
}) {
  const totals = labels.map((_, i) =>
    series.reduce((acc, s) => acc + (s.values[i] ?? 0), 0),
  );
  const max = Math.max(1, ...totals);
  // 가장 높은 기둥이 간격까지 더해도 플롯 높이를 넘지 않도록 스케일을 미리 줄인다.
  const plot = Math.max(20, height - (series.length - 1) * SEGMENT_GAP);

  return (
    <div className="space-y-1.5">
      <div className="flex items-stretch gap-3">
        <div
          className="flex w-9 shrink-0 flex-col justify-between text-right text-[10px] tabular-nums text-muted-foreground"
          style={{ height }}
        >
          <span>{formatInt(max)}</span>
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
          {labels.map((label, i) => (
            <div
              key={label}
              className="flex h-full flex-1 flex-col justify-end"
              style={{ gap: SEGMENT_GAP }}
              title={`${label} · 합계 ${formatInt(totals[i])}${unit}\n${series
                .map((s) => `${s.label} ${formatInt(s.values[i] ?? 0)}`)
                .join(" · ")}`}
            >
              {/* 위에서부터 쌓이도록 시리즈 순서를 뒤집고, 값이 0인 세그먼트는 뺀다.
                  실제로 그려지는 맨 위 세그먼트에만 4px 라운드를 준다. */}
              {series
                .map((s) => ({ series: s, value: s.values[i] ?? 0 }))
                .filter((s) => s.value > 0)
                .reverse()
                .map((s, revIdx) => (
                  <span
                    key={s.series.key}
                    className={revIdx === 0 ? "w-full rounded-t-[4px]" : "w-full"}
                    style={{
                      height: Math.max(2, (s.value / max) * plot),
                      background: s.series.color,
                    }}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-[2px] pl-12">
        {labels.map((label, i) => (
          <span
            key={label}
            className="flex-1 truncate text-center text-[10px] text-muted-foreground"
          >
            {i % labelEvery === 0 ? label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
