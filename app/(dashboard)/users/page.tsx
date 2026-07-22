import { SiteHeader } from "@/components/nav/site-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsersFilters } from "@/components/users/users-filters";
import { UsersPagination } from "@/components/users/users-pagination";
import { listUsers, type UserListItem } from "@/lib/api";
import { maskId, maskName } from "@/lib/mask";
import { getAdminAccessToken } from "@/lib/supabase/server";

type SearchParams = {
  q?: string;
  page?: string;
};

function parsePage(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ko-KR");
}

const WORK_STATUS_LABEL: Record<NonNullable<UserListItem["workStatus"]>, string> = {
  working: "재직",
  full_time_caregiver: "전업",
};

const GENDER_LABEL: Record<UserListItem["gender"], string> = {
  female: "여",
  male: "남",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, page: pageRaw } = await searchParams;
  const page = parsePage(pageRaw);
  const limit = 20;

  let data;
  let error: string | null = null;
  try {
    const token = (await getAdminAccessToken()) ?? undefined;
    data = await listUsers({ onboarded: "true", q, page, limit }, token);
  } catch (e) {
    error = e instanceof Error ? e.message : "알 수 없는 오류";
    data = { items: [], total: 0, page, limit };
  }

  const baseQuery = new URLSearchParams();
  if (q) baseQuery.set("q", q);

  return (
    <>
      <SiteHeader crumbs={[{ label: "사용자" }]} />
      <main className="flex flex-1 flex-col gap-6 p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>온보딩 완료 사용자</CardTitle>
              <CardDescription>
                온보딩(`onboardedAt`)을 마친 가입자 목록. 개인정보는 마스킹 표시.
              </CardDescription>
            </div>
            <UsersFilters />
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                API 호출 실패: {error} · api 서버가 떠 있는지 확인하세요.
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">ID</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead className="w-16">성별</TableHead>
                  <TableHead className="w-20">직장</TableHead>
                  <TableHead className="w-20 text-right">자녀</TableHead>
                  <TableHead className="w-32 text-right">온보딩 완료</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.length === 0 && !error && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-12"
                    >
                      조건에 맞는 사용자가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
                {data.items.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {maskId(u.id)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {maskName(u.name)}
                    </TableCell>
                    <TableCell>{GENDER_LABEL[u.gender]}</TableCell>
                    <TableCell>
                      {u.workStatus ? (
                        <Badge variant="secondary">
                          {WORK_STATUS_LABEL[u.workStatus]}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {u.childrenCount}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(u.onboardedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <UsersPagination
              page={data.page}
              limit={data.limit}
              total={data.total}
              baseQuery={baseQuery}
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
