// api 호출 — server component(SSR)와 client component(페이지네이션·수정) 양쪽에서 사용.
// 인증: Supabase 세션 access_token을 Bearer로 첨부. API의 AdminRoleGuard가
// role=admin 또는 ADMIN_ALLOWED_EMAILS로 인가한다. 미인증 요청은 proxy.ts가
// 이미 /login으로 막으므로, 여기 도달하는 요청은 세션이 있다고 가정한다.

export const BASE_URL =
  // 로컬 dev 포트 할당: web=3000 / api=3001 / admin=3002
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

// 이 모듈은 client component 그래프에도 포함되므로 next/headers(서버 전용)를
// 정적으로도 동적으로도 참조하지 않는다. 브라우저에서는 browser client로 세션
// 토큰을 얻고, server component(SSR)에서는 호출부가 서버 토큰을 명시적으로 주입한다.
async function getBrowserAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
  const {
    data: { session },
  } = await createSupabaseBrowserClient().auth.getSession();
  return session?.access_token ?? null;
}

export async function authHeaders(
  token?: string,
  extra?: Record<string, string>,
): Promise<Record<string, string>> {
  const bearer = token ?? (await getBrowserAccessToken());
  return {
    ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    ...extra,
  };
}

export class AdminApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`Admin API ${status}`);
  }
}

export async function adminRequest<T>(
  path: string,
  init?: RequestInit & { json?: unknown; token?: string },
): Promise<T> {
  const { json, headers, token, ...rest } = init ?? {};
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: await authHeaders(token, {
        "Content-Type": "application/json",
        ...(headers as Record<string, string> | undefined),
      }),
      body: json !== undefined ? JSON.stringify(json) : undefined,
      cache: "no-store",
    });
  } catch (e) {
    // API 미배포·네트워크 실패 — 명시적 0 status로 변환 (SSR 500 방지용 폴백 신호)
    throw new AdminApiError(0, {
      message: "API unreachable",
      error: e instanceof Error ? e.message : String(e),
      base: BASE_URL,
    });
  }
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new AdminApiError(res.status, body);
  return body as T;
}

export function buildSearch(
  record: Record<string, string | number | undefined>,
) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
