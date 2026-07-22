import { MissionsTable } from "@/components/missions/missions-table";
import { adminApi } from "@/lib/api";
import { getAdminAccessToken } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MissionsPage() {
  const token = (await getAdminAccessToken()) ?? undefined;
  const [list, categories] = await Promise.all([
    adminApi.missions.list({ take: 50 }, token),
    adminApi.categories.list(token),
  ]);
  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">미션</h1>
        <p className="text-muted-foreground text-sm">
          10분 단위 부모-아이 상호작용. 스크롤하면 추가로 불러옵니다.
        </p>
      </header>
      <MissionsTable
        initialItems={list.items}
        initialCursor={list.nextCursor}
        categories={categories}
      />
    </div>
  );
}
