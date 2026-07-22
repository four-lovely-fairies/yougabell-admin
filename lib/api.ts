// api 호출 — server component(SSR)와 client component(페이지네이션·수정) 양쪽에서 사용.
// 인증: Supabase 세션 access_token을 Bearer로 첨부. API의 AdminRoleGuard가
// role=admin 또는 ADMIN_ALLOWED_EMAILS로 인가한다. 미인증 요청은 proxy.ts가
// 이미 /login으로 막으므로, 여기 도달하는 요청은 세션이 있다고 가정한다.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

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

async function authHeaders(
  token?: string,
  extra?: Record<string, string>,
): Promise<Record<string, string>> {
  const bearer = token ?? (await getBrowserAccessToken());
  return {
    ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    ...extra,
  };
}

export type UserListItem = {
  id: string;
  name: string;
  birthDate: string;
  gender: "female" | "male";
  workStatus: "working" | "full_time_caregiver" | null;
  onboardedAt: string | null;
  childrenCount: number;
  createdAt: string;
};

export type UsersListResponse = {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
};

export type ListUsersQuery = {
  onboarded?: "true" | "false" | "all";
  q?: string;
  page?: number;
  limit?: number;
};

export async function listUsers(
  query: ListUsersQuery = {},
  token?: string,
): Promise<UsersListResponse> {
  const search = new URLSearchParams();
  if (query.onboarded) search.set("onboarded", query.onboarded);
  if (query.q) search.set("q", query.q);
  if (query.page) search.set("page", String(query.page));
  if (query.limit) search.set("limit", String(query.limit));

  const res = await fetch(`${BASE_URL}/admin/users?${search.toString()}`, {
    headers: await authHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API ${res.status} when listing users`);
  }
  return (await res.json()) as UsersListResponse;
}

// ============================================================
// admin 콘텐츠 운영 (milestones / growth-stages / missions / categories)
// ============================================================

export class AdminApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`Admin API ${status}`);
  }
}

async function adminRequest<T>(
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

export type MilestoneCategory = {
  id: string;
  label: string;
  iconKey: string;
  color: string;
  displayOrder: number;
};

export type Milestone = {
  id: string;
  categoryId: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  title: string | null;
  description: string;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateMilestoneBody = {
  categoryId: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  title?: string;
  description: string;
  displayOrder?: number;
};

export type UpdateMilestoneBody = Partial<CreateMilestoneBody>;

export type MilestoneListQuery = {
  categoryId?: string;
  ageMonths?: number;
  cursor?: string;
  take?: number;
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

export type GrowthStage = {
  id: string;
  name: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  summary: string;
};

export type CreateGrowthStageBody = {
  id: string;
  name: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  summary: string;
};

export type UpdateGrowthStageBody = Omit<Partial<CreateGrowthStageBody>, "id">;

export type MissionSource = {
  citation: string;
  url: string | null;
  note: string | null;
};

export type Mission = {
  id: string;
  categoryId: string;
  title: string;
  shortTitle: string;
  description: string;
  durationMinutes: number;
  effect: string;
  subThemeLabel: string | null;
  goal: string | null;
  recommendedAgeMonthsMin: number | null;
  recommendedAgeMonthsMax: number | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  tags: string[];
  sources: MissionSource[];
  createdAt: string;
  updatedAt: string;
};

export type CreateMissionBody = {
  categoryId: string;
  title: string;
  shortTitle: string;
  description: string;
  durationMinutes: number;
  effect: string;
  subThemeLabel?: string;
  goal?: string;
  recommendedAgeMonthsMin?: number;
  recommendedAgeMonthsMax?: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  tags?: string[];
  sources?: { citation: string; url?: string; note?: string }[];
};

export type UpdateMissionBody = Partial<CreateMissionBody>;

export type MissionListQuery = {
  categoryId?: string;
  ageMonths?: number;
  cursor?: string;
  take?: number;
};

function buildSearch(record: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const adminApi = {
  categories: {
    list: (token?: string) =>
      adminRequest<MilestoneCategory[]>("/admin/categories", { token }),
  },
  milestones: {
    list: (q: MilestoneListQuery = {}, token?: string) =>
      adminRequest<CursorPage<Milestone>>(`/admin/milestones${buildSearch(q)}`, {
        token,
      }),
    create: (body: CreateMilestoneBody) =>
      adminRequest<Milestone>("/admin/milestones", {
        method: "POST",
        json: body,
      }),
    update: (id: string, body: UpdateMilestoneBody) =>
      adminRequest<Milestone>(`/admin/milestones/${id}`, {
        method: "PATCH",
        json: body,
      }),
    remove: (id: string) =>
      adminRequest<void>(`/admin/milestones/${id}`, { method: "DELETE" }),
  },
  growthStages: {
    list: (token?: string) =>
      adminRequest<GrowthStage[]>("/admin/growth-stages", { token }),
    create: (body: CreateGrowthStageBody) =>
      adminRequest<GrowthStage>("/admin/growth-stages", {
        method: "POST",
        json: body,
      }),
    update: (id: string, body: UpdateGrowthStageBody) =>
      adminRequest<GrowthStage>(`/admin/growth-stages/${id}`, {
        method: "PATCH",
        json: body,
      }),
    remove: (id: string) =>
      adminRequest<void>(`/admin/growth-stages/${id}`, { method: "DELETE" }),
  },
  missions: {
    list: (q: MissionListQuery = {}, token?: string) =>
      adminRequest<CursorPage<Mission>>(`/admin/missions${buildSearch(q)}`, {
        token,
      }),
    create: (body: CreateMissionBody) =>
      adminRequest<Mission>("/admin/missions", { method: "POST", json: body }),
    update: (id: string, body: UpdateMissionBody) =>
      adminRequest<Mission>(`/admin/missions/${id}`, {
        method: "PATCH",
        json: body,
      }),
    remove: (id: string) =>
      adminRequest<void>(`/admin/missions/${id}`, { method: "DELETE" }),
  },
};
