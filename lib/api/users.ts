import { BASE_URL, authHeaders } from "./client";

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

export type TestPushResult = {
  attempted: number;
  sent: number;
  failed: number;
  tickets: {
    token: string;
    status: "ok" | "error";
    error?: string;
    message?: string;
  }[];
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
