import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EngagementStats } from "@/lib/api";
import { BarList } from "./charts/bar-list";
import { ChartBlock } from "./charts/chart-frame";
import { ProportionBar } from "./charts/proportion-bar";
import {
  formatDecimal,
  formatInt,
  formatPercent,
  MISSION_STATUS_LABELS,
  seriesColor,
  type VizSlot,
} from "./charts/viz";

const STATUS_SLOT: Record<string, VizSlot> = {
  completed: 1,
  early_completed: 2,
  in_progress: 3,
  paused: 4,
  cancelled: 5,
};

/** 5점/10점 척도를 게이지 한 줄로. 수치를 항상 병기한다. */
function ScoreMeter({
  label,
  value,
  max,
  helper,
}: {
  label: string;
  value: number | null;
  max: number;
  helper: string;
}) {
  const ratio = value === null ? 0 : Math.min(1, value / max);
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium tabular-nums">
          {value === null ? "—" : `${formatDecimal(value, 2)} / ${max}`}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-[4px]"
        style={{ background: "var(--viz-track)" }}
      >
        <span
          className="block h-full rounded-[4px]"
          style={{ width: `${ratio * 100}%`, background: seriesColor(1) }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground">{helper}</p>
    </div>
  );
}

export function MissionSection({ stats }: { stats: EngagementStats }) {
  const { missionStatus, categories, topMissions, feedback, keywords, totals } =
    stats;
  const categoryTotal = categories.reduce((acc, c) => acc + c.executions, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>오늘의 놀이</CardTitle>
          <CardDescription>
            실행 {formatInt(totals.missionExecutions)}건 · 완료율{" "}
            {totals.missionExecutions === 0
              ? "—"
              : formatPercent(totals.missionCompletionRate)}
            . 조기 완료는 타이머를 끝까지 돌리지 않고 마친 경우다.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 lg:grid-cols-2">
          <ChartBlock title="실행 상태 구성">
            <ProportionBar
              segments={missionStatus.map((s) => ({
                key: s.status,
                label: MISSION_STATUS_LABELS[s.status] ?? s.status,
                value: s.count,
                color: seriesColor(STATUS_SLOT[s.status] ?? 5),
              }))}
            />
          </ChartBlock>
          <ChartBlock
            title="발달 카테고리별 실행"
            description="놀이가 특정 영역에 쏠려 있지 않은지 확인한다."
          >
            <BarList
              data={categories.map((c) => ({
                label: c.label,
                value: c.executions,
                suffix:
                  categoryTotal === 0
                    ? undefined
                    : formatPercent(c.executions / categoryTotal, 0),
              }))}
              color={seriesColor(1)}
            />
          </ChartBlock>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>실행 TOP 10 놀이</CardTitle>
            <CardDescription>
              실행 수 기준. 괄호는 완료 건수와 평균 만족도(5점).
            </CardDescription>
          </CardHeader>
          <CardContent className="viz">
            <BarList
              data={topMissions.map((m) => ({
                label: m.title,
                value: m.executions,
                suffix: `완료 ${formatInt(m.completed)} · 만족 ${formatDecimal(
                  m.avgSatisfaction,
                )}`,
              }))}
              color={seriesColor(1)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>놀이 피드백</CardTitle>
            <CardDescription>
              실행 후 남긴 피드백 {formatInt(feedback.count)}건의 평균.
            </CardDescription>
          </CardHeader>
          <CardContent className="viz space-y-5">
            <ScoreMeter
              label="아이 반응"
              value={feedback.avgChildReaction}
              max={5}
              helper="1 시큰둥 → 5 아주 좋아함"
            />
            <ScoreMeter
              label="부모 에너지"
              value={feedback.avgParentEnergy}
              max={10}
              helper="놀이 후 남은 체력 (0~10)"
            />
            <ScoreMeter
              label="놀이 만족도"
              value={feedback.avgMissionSatisfaction}
              max={5}
              helper="콘텐츠 자체에 대한 만족"
            />
            <div className="space-y-2 border-t pt-4">
              <p className="text-xs text-muted-foreground">
                피드백 키워드 TOP {keywords.length}
              </p>
              {keywords.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  기간 내 키워드가 없습니다.
                </p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {keywords.map((k) => (
                    <li key={k.keyword}>
                      <Badge variant="secondary" className="font-normal">
                        {k.keyword}
                        <span className="ml-1 tabular-nums text-muted-foreground">
                          {k.count}
                        </span>
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
