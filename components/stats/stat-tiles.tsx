import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EngagementStats } from "@/lib/api";
import { formatDecimal, formatInt, formatPercent } from "./charts/viz";

type Tile = { label: string; value: string; helper: string };

/**
 * 상단 지표 타일.
 *
 * "재접속"은 접속 로그가 아니라 **기간 내 활동한 날의 수**로 계산한다 —
 * 2일 이상 활동 = 최소 한 번 돌아온 사용자.
 */
export function StatTiles({ stats }: { stats: EngagementStats }) {
  const { totals, range } = stats;

  const tiles: Tile[] = [
    {
      label: "활성 사용자",
      value: formatInt(totals.activeUsers),
      helper: `최근 ${range.days}일 · 전체 온보딩 ${formatInt(totals.users)}명 중 ${
        totals.users === 0
          ? "—"
          : formatPercent(totals.activeUsers / totals.users, 0)
      }`,
    },
    {
      label: "재접속률",
      value: totals.activeUsers === 0 ? "—" : formatPercent(totals.returningRate),
      helper: `2일 이상 활동 ${formatInt(totals.returningUsers)}명 · 1인 평균 ${formatDecimal(
        totals.avgActiveDays,
      )}일`,
    },
    {
      label: "놀이 완료율",
      value:
        totals.missionExecutions === 0
          ? "—"
          : formatPercent(totals.missionCompletionRate),
      helper: `실행 ${formatInt(totals.missionExecutions)}건 중 완료 ${formatInt(
        totals.missionCompleted,
      )}건`,
    },
    {
      label: "평균 기분",
      value:
        totals.avgMoodLevel === null
          ? "—"
          : `${formatDecimal(totals.avgMoodLevel, 2)} / 5`,
      helper: `마음 배터리 체크 ${formatInt(totals.moodChecks)}건`,
    },
    {
      label: "신규 가입",
      value: formatInt(totals.newUsers),
      helper: `자녀 프로필 누적 ${formatInt(totals.children)}명`,
    },
    {
      label: "마음 케어 실행",
      value: formatInt(totals.careExecutions),
      helper: "기분 체크 이후 이어진 케어 콘텐츠",
    },
    {
      label: "챗 사용자 발화",
      value: formatInt(totals.chatMessages),
      helper: "assistant 응답 제외",
    },
    {
      label: "피드백 수집",
      value: formatInt(stats.feedback.count),
      helper: `놀이 실행 대비 ${
        totals.missionExecutions === 0
          ? "—"
          : formatPercent(stats.feedback.count / totals.missionExecutions, 0)
      }`,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((t) => (
        <Card key={t.label}>
          <CardHeader className="gap-1">
            <CardDescription>{t.label}</CardDescription>
            <CardTitle className="text-3xl">{t.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">{t.helper}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
