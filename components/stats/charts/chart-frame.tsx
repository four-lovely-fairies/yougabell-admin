import type { ReactNode } from "react";

export type LegendItem = { label: string; color: string; value?: string };

/**
 * 범례. 시리즈가 2개 이상이면 항상 노출한다 — 색만으로 정체성을 전달하지 않기 위해.
 */
export function ChartLegend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-[2px]"
            style={{ background: item.color }}
          />
          <span>{item.label}</span>
          {item.value !== undefined && (
            <span className="tabular-nums text-foreground">{item.value}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * 차트 밑에 접어 두는 원본 수치 표.
 *
 * light 모드에서 일부 시리즈 색이 표면 대비 3:1 미만이라, 색 판별이 어려운
 * 사용자를 위한 대체 경로로 표를 항상 함께 제공한다.
 */
export function ChartTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-xs text-muted-foreground underline-offset-4 hover:underline">
        수치 표 보기
      </summary>
      <div className="mt-2 max-h-64 overflow-auto rounded-md border">
        <table className="w-full text-xs">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              {columns.map((c, i) => (
                <th
                  key={c}
                  className={
                    i === 0
                      ? "px-2 py-1.5 text-left font-medium"
                      : "px-2 py-1.5 text-right font-medium"
                  }
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row[0])} className="border-t">
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={
                      i === 0
                        ? "px-2 py-1 text-left"
                        : "px-2 py-1 text-right tabular-nums"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/** 차트 한 덩어리 — 제목·설명·범례·플롯·표를 같은 리듬으로 묶는다. */
export function ChartBlock({
  title,
  description,
  legend,
  children,
  table,
}: {
  /** 상위 Card 헤더가 이미 같은 말을 하고 있으면 생략한다. */
  title?: string;
  description?: string;
  legend?: LegendItem[];
  children: ReactNode;
  table?: ReactNode;
}) {
  return (
    <section className="viz space-y-3">
      {(title || description) && (
        <header className="space-y-1">
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </header>
      )}
      {legend && legend.length > 0 && <ChartLegend items={legend} />}
      {children}
      {table}
    </section>
  );
}
