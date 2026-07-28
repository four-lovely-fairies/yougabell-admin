import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EngagementStats } from "@/lib/api";
import { ChartBlock, ChartTable } from "./charts/chart-frame";
import { ColumnChart } from "./charts/column-chart";
import { formatInt, seriesColor, WEEKDAY_LABELS } from "./charts/viz";

/**
 * 워킹맘·대디 타깃이라 "언제 앱을 여는가"가 알림 발송 시각 튜닝의 근거가 된다.
 */
export function RhythmSection({ stats }: { stats: EngagementStats }) {
  const { weekday, hourly } = stats;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>요일별 활동</CardTitle>
          <CardDescription>
            기록 건수 기준. 평일/주말 사용 패턴 차이를 본다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartBlock
            table={
              <ChartTable
                columns={["요일", "기록", "활성 사용자"]}
                rows={weekday.map((w) => [
                  WEEKDAY_LABELS[w.weekday - 1],
                  w.events,
                  w.activeUsers,
                ])}
              />
            }
          >
            <ColumnChart
              data={weekday.map((w) => ({
                label: WEEKDAY_LABELS[w.weekday - 1],
                value: w.events,
                tooltip: `${WEEKDAY_LABELS[w.weekday - 1]}요일 · 기록 ${formatInt(
                  w.events,
                )}건 · 활성 ${formatInt(w.activeUsers)}명`,
              }))}
              color={seriesColor(1)}
            />
          </ChartBlock>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>시간대별 활동</CardTitle>
          <CardDescription>
            KST 0~23시. 미션 알림 발송 시각을 정할 때 참고한다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartBlock
            table={
              <ChartTable
                columns={["시각", "기록"]}
                rows={hourly.map((h) => [`${h.hour}시`, h.events])}
              />
            }
          >
            <ColumnChart
              data={hourly.map((h) => ({
                label: `${h.hour}`,
                value: h.events,
                tooltip: `${h.hour}시 · ${formatInt(h.events)}건`,
              }))}
              color={seriesColor(1)}
              labelEvery={3}
            />
          </ChartBlock>
        </CardContent>
      </Card>
    </div>
  );
}
