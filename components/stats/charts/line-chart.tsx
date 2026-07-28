import { formatInt } from "./viz";

export type LineSeries = {
  key: string;
  label: string;
  color: string;
  values: number[];
};

const VIEW_W = 1000;

/**
 * 다중 시리즈 라인 차트.
 *
 * viewBox 가로만 늘어나도록 `preserveAspectRatio="none"` 을 쓰되, 선은
 * `vector-effect="non-scaling-stroke"` 로 항상 2px을 유지한다. 텍스트는 SVG 안에
 * 넣지 않는다 (가로 스트레치에 같이 늘어나므로) — 축·라벨은 전부 HTML.
 */
export function LineChart({
  labels,
  series,
  height = 200,
  unit = "명",
  labelEvery = 1,
}: {
  labels: string[];
  series: LineSeries[];
  height?: number;
  unit?: string;
  labelEvery?: number;
}) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const n = labels.length;
  const x = (i: number) => (n <= 1 ? VIEW_W / 2 : (i / (n - 1)) * VIEW_W);
  const y = (v: number) => height - (v / max) * height;

  return (
    <div className="space-y-1.5">
      <div className="flex items-stretch gap-3">
        <div
          className="flex w-9 shrink-0 flex-col justify-between text-right text-[10px] tabular-nums text-muted-foreground"
          style={{ height }}
        >
          <span>{formatInt(max)}</span>
          <span>{formatInt(Math.round(max / 2))}</span>
          <span>0</span>
        </div>
        <div className="relative flex-1">
          <svg
            className="block w-full"
            height={height}
            viewBox={`0 0 ${VIEW_W} ${height}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`일별 추이 — ${series.map((s) => s.label).join(", ")}`}
          >
            {[0, 0.5, 1].map((ratio) => (
              <line
                key={ratio}
                x1={0}
                x2={VIEW_W}
                y1={height * ratio}
                y2={height * ratio}
                stroke={ratio === 1 ? "var(--viz-axis)" : "var(--viz-grid)"}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {series.map((s) => (
              <polyline
                key={s.key}
                points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {/* hover 히트 영역 — 마크보다 넓게 잡아 툴팁을 잡기 쉽게 한다 */}
            {labels.map((label, i) => (
              <rect
                key={label}
                x={n <= 1 ? 0 : x(i) - VIEW_W / (n - 1) / 2}
                y={0}
                width={n <= 1 ? VIEW_W : VIEW_W / (n - 1)}
                height={height}
                fill="transparent"
              >
                <title>
                  {`${label}\n${series
                    .map((s) => `${s.label} ${formatInt(s.values[i] ?? 0)}${unit}`)
                    .join("\n")}`}
                </title>
              </rect>
            ))}
          </svg>
        </div>
      </div>
      <div className="flex pl-12">
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
