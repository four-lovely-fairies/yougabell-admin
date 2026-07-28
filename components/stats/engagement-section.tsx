import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EngagementStats } from "@/lib/api";
import { BarList } from "./charts/bar-list";
import { ChartBlock, ChartTable } from "./charts/chart-frame";
import { LineChart } from "./charts/line-chart";
import { StackedColumnChart } from "./charts/stacked-column-chart";
import {
  ACTIVITY_LABELS,
  formatInt,
  formatPercent,
  seriesColor,
  shortDate,
} from "./charts/viz";

const ACTIVE_DAYS_LABELS: Record<string, string> = {
  "1": "1일만 (이탈)",
  "2-3": "2–3일",
  "4-7": "4–7일",
  "8-14": "8–14일",
  "15+": "15일 이상",
};

/** 날짜 축이 조밀해지면 라벨을 솎아 낸다 — 겹침 방지. */
const labelStride = (count: number) => Math.max(1, Math.ceil(count / 12));

export function EngagementSection({ stats }: { stats: EngagementStats }) {
  const { daily, activeDays, totals, range } = stats;
  const dateLabels = daily.map((d) => shortDate(d.date));
  const stride = labelStride(daily.length);

  const trendSeries = [
    {
      key: "activeUsers",
      label: "활성 사용자",
      color: seriesColor(1),
      values: daily.map((d) => d.activeUsers),
    },
    {
      key: "newUsers",
      label: "신규 가입",
      color: seriesColor(2),
      values: daily.map((d) => d.newUsers),
    },
  ];

  const activitySeries = [
    {
      key: "mission",
      label: ACTIVITY_LABELS.mission,
      color: seriesColor(1),
      values: daily.map((d) => d.mission),
    },
    {
      key: "mood",
      label: ACTIVITY_LABELS.mood,
      color: seriesColor(2),
      values: daily.map((d) => d.mood),
    },
    {
      key: "care",
      label: ACTIVITY_LABELS.care,
      color: seriesColor(3),
      values: daily.map((d) => d.care),
    },
    {
      key: "chat",
      label: ACTIVITY_LABELS.chat,
      color: seriesColor(4),
      values: daily.map((d) => d.chat),
    },
  ];

  const bucketTotal = activeDays.reduce((acc, b) => acc + b.users, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>재접속 · 활동</CardTitle>
        <CardDescription>
          접속 로그 테이블이 없어 <strong>오늘의 놀이 · 오늘의 기분 · 마음 케어 ·
          챗</strong> 기록을 접속의 대리 지표로 집계한다. 하루에 이 중 하나라도 남긴
          사용자를 그날의 활성 사용자로 센다. (KST 기준)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <ChartBlock
          title="일별 활성 사용자 · 신규 가입"
          description={`최근 ${range.days}일 · 활성 ${formatInt(totals.activeUsers)}명 (중복 제거)`}
          legend={trendSeries.map((s) => ({ label: s.label, color: s.color }))}
          table={
            <ChartTable
              columns={["날짜", "활성 사용자", "신규 가입"]}
              rows={daily.map((d) => [d.date, d.activeUsers, d.newUsers])}
            />
          }
        >
          <LineChart
            labels={dateLabels}
            series={trendSeries}
            labelEvery={stride}
            unit="명"
          />
        </ChartBlock>

        <ChartBlock
          title="일별 활동 기록 구성"
          description="사용자가 남긴 기록 건수 — 어떤 기능이 재방문을 만드는지 본다."
          legend={activitySeries.map((s) => ({ label: s.label, color: s.color }))}
          table={
            <ChartTable
              columns={["날짜", "놀이", "기분", "마음 케어", "챗"]}
              rows={daily.map((d) => [d.date, d.mission, d.mood, d.care, d.chat])}
            />
          }
        >
          <StackedColumnChart
            labels={dateLabels}
            series={activitySeries}
            labelEvery={stride}
          />
        </ChartBlock>

        <ChartBlock
          title="사용자별 활동일수 분포"
          description={`기간 내 활동한 날의 수. 2일 이상이면 최소 한 번 돌아온 사용자 — 재접속률 ${
            totals.activeUsers === 0 ? "—" : formatPercent(totals.returningRate)
          }`}
        >
          <BarList
            data={activeDays.map((b) => ({
              label: ACTIVE_DAYS_LABELS[b.bucket] ?? b.bucket,
              value: b.users,
              suffix:
                bucketTotal === 0
                  ? undefined
                  : formatPercent(b.users / bucketTotal, 0),
            }))}
            color={seriesColor(1)}
            unit="명"
            emptyMessage="기간 내 활동한 사용자가 없습니다."
          />
        </ChartBlock>
      </CardContent>
    </Card>
  );
}
