import { SiteHeader } from "@/components/nav/site-header";
import { ApiUnreachable } from "@/components/shared/api-unreachable";
import { EngagementSection } from "@/components/stats/engagement-section";
import { MissionSection } from "@/components/stats/mission-section";
import { MoodSection } from "@/components/stats/mood-section";
import { RangeFilter, RANGE_PRESETS } from "@/components/stats/range-filter";
import { RhythmSection } from "@/components/stats/rhythm-section";
import { StatTiles } from "@/components/stats/stat-tiles";
import { adminApi, type EngagementStats } from "@/lib/api";
import { getAdminAccessToken } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const DEFAULT_DAYS = 30;

function parseDays(raw: string | undefined): number {
  const n = Number(raw);
  return RANGE_PRESETS.includes(n as (typeof RANGE_PRESETS)[number])
    ? n
    : DEFAULT_DAYS;
}

function formatRange(range: EngagementStats["range"]): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });
  // to는 반열린 구간의 끝(다음 날 00:00)이라 하루 빼서 표시한다.
  const lastDay = new Date(new Date(range.to).getTime() - 24 * 60 * 60 * 1000);
  return `${fmt(range.from)} – ${fmt(lastDay.toISOString())} (KST)`;
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days: daysRaw } = await searchParams;
  const days = parseDays(daysRaw);

  let stats: EngagementStats;
  try {
    const token = (await getAdminAccessToken()) ?? undefined;
    stats = await adminApi.stats.engagement(days, token);
  } catch (error) {
    return (
      <>
        <SiteHeader crumbs={[{ label: "통계" }]} />
        <main className="flex flex-1 flex-col gap-6 p-6">
          <ApiUnreachable error={error} resource="통계" />
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader crumbs={[{ label: "통계" }]} />
      <main className="flex flex-1 flex-col gap-6 p-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">참여도 통계</h1>
            <p className="text-muted-foreground text-sm">
              {formatRange(stats.range)} · 접속 로그가 없어 사용자가 남긴 기록을
              접속의 대리 지표로 씁니다.
            </p>
          </div>
          <RangeFilter days={days} />
        </header>

        <StatTiles stats={stats} />
        <EngagementSection stats={stats} />
        <RhythmSection stats={stats} />
        <MoodSection stats={stats} />
        <MissionSection stats={stats} />
      </main>
    </>
  );
}
