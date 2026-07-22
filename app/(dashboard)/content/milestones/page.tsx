import { MilestonesTable } from "@/components/milestones/milestones-table";
import { adminApi } from "@/lib/api";
import { getAdminAccessToken } from "@/lib/supabase/server";

// SSR fetch가 매 요청마다 발생해야 함 — Next.js 16 default static prerender 회피.
export const dynamic = "force-dynamic";

export default async function MilestonesPage() {
  // 에러는 같은 디렉토리의 error.tsx가 자동 catch (Next.js error boundary).
  const token = (await getAdminAccessToken()) ?? undefined;
  const [list, categories] = await Promise.all([
    adminApi.milestones.list({ take: 50 }, token),
    adminApi.categories.list(token),
  ]);
  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">발달 마일스톤</h1>
        <p className="text-muted-foreground text-sm">
          월령별 발달 내용. 스크롤하면 추가로 불러옵니다.
        </p>
      </header>
      <MilestonesTable
        initialItems={list.items}
        initialCursor={list.nextCursor}
        categories={categories}
      />
    </div>
  );
}
