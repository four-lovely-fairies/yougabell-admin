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
import { ProportionBar } from "./charts/proportion-bar";
import {
  formatDecimal,
  formatInt,
  MOOD_LEVEL_LABELS,
  moodColor,
  shortDate,
} from "./charts/viz";

/**
 * 오늘의 기분 = 마음 배터리 체크(1~5).
 * 순서 척도라 카테고리 색이 아니라 단일 색상 명도 램프를 쓴다.
 */
export function MoodSection({ stats }: { stats: EngagementStats }) {
  const { moodLevels, moodDaily, totals } = stats;
  const stride = Math.max(1, Math.ceil(moodDaily.length / 12));

  return (
    <Card>
      <CardHeader>
        <CardTitle>오늘의 기분 (마음 배터리)</CardTitle>
        <CardDescription>
          부모가 스스로 체크한 에너지 레벨. 1(고갈) → 5(최고예요) 순서 척도라 명도가
          곧 값이다. 기간 평균 {formatDecimal(totals.avgMoodLevel, 2)} / 5.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <ChartBlock
          title="레벨 분포"
          description={`총 ${formatInt(totals.moodChecks)}건`}
        >
          <ProportionBar
            segments={moodLevels.map((m) => ({
              key: String(m.level),
              label: MOOD_LEVEL_LABELS[m.level],
              value: m.count,
              color: moodColor(m.level),
            }))}
          />
        </ChartBlock>

        <ChartBlock
          title="일별 평균 기분"
          description="막대 높이·색 모두 평균 레벨. 기록이 없는 날은 비어 있다."
          table={
            <ChartTable
              columns={["날짜", "평균 레벨", "체크 수"]}
              rows={moodDaily.map((d) => [
                d.date,
                formatDecimal(d.avgLevel, 2),
                d.count,
              ])}
            />
          }
        >
          <ColumnChart
            data={moodDaily.map((d) => ({
              label: shortDate(d.date),
              value: d.avgLevel ?? 0,
              color: moodColor(Math.min(5, Math.max(1, Math.round(d.avgLevel ?? 1)))),
              tooltip:
                d.count === 0
                  ? `${d.date} · 기록 없음`
                  : `${d.date} · 평균 ${formatDecimal(d.avgLevel, 2)} / 5 · ${formatInt(
                      d.count,
                    )}건`,
            }))}
            color={moodColor(3)}
            max={5}
            axisTopLabel="5"
            labelEvery={stride}
            unit="점"
          />
        </ChartBlock>
      </CardContent>
    </Card>
  );
}
