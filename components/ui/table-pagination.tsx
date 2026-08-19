import Link from "next/link";

type Props = {
  page: number;
  limit: number;
  total: number;
  baseQuery: URLSearchParams;
  /** 페이지 링크가 향할 경로. 예: "/users", "/inquiries" */
  basePath: string;
  /** 총계 뒤에 붙는 단위. 예: "명", "건" */
  unit: string;
};

function buildHref(
  basePath: string,
  base: URLSearchParams,
  page: number,
): string {
  const next = new URLSearchParams(base.toString());
  next.set("page", String(page));
  return `${basePath}?${next.toString()}`;
}

export function TablePagination({
  page,
  limit,
  total,
  baseQuery,
  basePath,
  unit,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        {total === 0 ? "결과 없음" : `${start}–${end} / 총 ${total}${unit}`}
      </span>
      <div className="flex items-center gap-2">
        {prevDisabled ? (
          <span className="inline-flex h-9 items-center rounded-md border border-zinc-200 px-3 text-zinc-400">
            이전
          </span>
        ) : (
          <Link
            href={buildHref(basePath, baseQuery, page - 1)}
            className="inline-flex h-9 items-center rounded-md border border-zinc-200 px-3 hover:bg-zinc-50"
          >
            이전
          </Link>
        )}
        <span className="text-muted-foreground">
          {page} / {totalPages}
        </span>
        {nextDisabled ? (
          <span className="inline-flex h-9 items-center rounded-md border border-zinc-200 px-3 text-zinc-400">
            다음
          </span>
        ) : (
          <Link
            href={buildHref(basePath, baseQuery, page + 1)}
            className="inline-flex h-9 items-center rounded-md border border-zinc-200 px-3 hover:bg-zinc-50"
          >
            다음
          </Link>
        )}
      </div>
    </div>
  );
}
