import Link from "next/link";

import { InquiriesFilters } from "@/components/inquiries/inquiries-filters";
import { InquiryStatusBadge } from "@/components/inquiries/inquiry-status-badge";
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
import { TablePagination } from "@/components/ui/table-pagination";
import {
  INQUIRY_CATEGORY_LABELS,
  inquiryApi,
  type InquiryCategory,
  type InquiryStatus,
} from "@/lib/api";
import { maskName } from "@/lib/mask";
import { getAdminAccessToken } from "@/lib/supabase/server";

type SearchParams = {
  status?: string;
  category?: string;
  q?: string;
  page?: string;
};

const STATUSES: InquiryStatus[] = ["received", "in_progress", "answered"];
const CATEGORIES = Object.keys(INQUIRY_CATEGORY_LABELS) as InquiryCategory[];

function parsePage(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

function parseStatus(raw: string | undefined): InquiryStatus | "all" {
  return STATUSES.find((s) => s === raw) ?? "all";
}

function parseCategory(raw: string | undefined): InquiryCategory | undefined {
  return CATEGORIES.find((c) => c === raw);
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

/** 미답변 건이 얼마나 기다렸는지 — SLA 감시용. */
function waitingDays(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / 86_400_000);
}

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const status = parseStatus(params.status);
  const category = parseCategory(params.category);
  const limit = 20;

  let data;
  let error: string | null = null;
  try {
    const token = (await getAdminAccessToken()) ?? undefined;
    data = await inquiryApi.list(
      {
        status,
        ...(category ? { category } : {}),
        ...(params.q ? { q: params.q } : {}),
        page,
        limit,
      },
      token,
    );
  } catch (e) {
    error = e instanceof Error ? e.message : "알 수 없는 오류";
    data = { items: [], total: 0, openCount: 0, page, limit };
  }

  const baseQuery = new URLSearchParams();
  if (status !== "all") baseQuery.set("status", status);
  if (category) baseQuery.set("category", category);
  if (params.q) baseQuery.set("q", params.q);

  return (
    <>
      <SiteHeader crumbs={[{ label: "문의" }]} />
      <main className="flex flex-1 flex-col gap-6 p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                1:1 문의
                {data.openCount > 0 && (
                  <Badge variant="destructive">미답변 {data.openCount}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                미답변이 위로, 그 안에서 오래 기다린 순으로 정렬됩니다. 작성자
                이름은 마스킹 표시.
              </CardDescription>
            </div>
            <InquiriesFilters />
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
                  <TableHead className="w-24">상태</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-40">유형</TableHead>
                  <TableHead className="w-24">작성자</TableHead>
                  <TableHead className="w-36 text-right">접수</TableHead>
                  <TableHead className="w-20 text-right">대기</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.length === 0 && !error && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-muted-foreground py-12 text-center"
                    >
                      조건에 맞는 문의가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
                {data.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <InquiryStatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/inquiries/${item.id}`}
                        className="hover:underline"
                      >
                        {item.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.category
                        ? INQUIRY_CATEGORY_LABELS[item.category]
                        : "—"}
                    </TableCell>
                    <TableCell>{maskName(item.userName)}</TableCell>
                    <TableCell className="text-muted-foreground text-right">
                      {formatDateTime(item.createdAt)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.status === "answered"
                        ? "—"
                        : `${waitingDays(item.createdAt)}일`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              page={data.page}
              limit={data.limit}
              total={data.total}
              baseQuery={baseQuery}
              basePath="/inquiries"
              unit="건"
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
