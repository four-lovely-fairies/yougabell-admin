// 1:1 문의 운영 (yougabell/docs/features/20260819-inquiry.md §4.3).
// admin은 codegen을 쓰지 않으므로 api의 DTO에 맞춰 타입을 직접 선언한다.

import { adminRequest, buildSearch } from "./client";

export type InquiryCategory =
  "service_error" | "account" | "content" | "suggestion" | "etc";

export type InquiryStatus = "received" | "in_progress" | "answered";

export const INQUIRY_CATEGORY_LABELS: Record<InquiryCategory, string> = {
  service_error: "오류·장애",
  account: "계정·로그인",
  content: "콘텐츠·미션·로드맵",
  suggestion: "개선 제안",
  etc: "기타",
};

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  received: "접수됨",
  in_progress: "확인 중",
  answered: "답변 완료",
};

export type AdminInquiryListItem = {
  id: string;
  userId: string;
  userName: string;
  category: InquiryCategory | null;
  title: string;
  status: InquiryStatus;
  answeredAt: string | null;
  createdAt: string;
};

export type AdminInquiryListResponse = {
  items: AdminInquiryListItem[];
  total: number;
  /** 미답변(received + in_progress) 총 건수 — 사이드바 배지에 쓴다. */
  openCount: number;
  page: number;
  limit: number;
};

export type AdminInquiryDetail = {
  id: string;
  category: InquiryCategory | null;
  title: string;
  body: string;
  contactEmail: string | null;
  status: InquiryStatus;
  answerBody: string | null;
  answeredAt: string | null;
  createdAt: string;
  userId: string;
  userName: string;
  userOnboardedAt: string | null;
  userCreatedAt: string;
  userDeletedAt: string | null;
};

export type InquiryListQuery = {
  status?: InquiryStatus | "all";
  category?: InquiryCategory;
  q?: string;
  page?: number;
  limit?: number;
};

export type UpdateInquiryBody = {
  status?: InquiryStatus;
  answerBody?: string;
};

export const inquiryApi = {
  list: (query: InquiryListQuery = {}, token?: string) =>
    adminRequest<AdminInquiryListResponse>(
      `/admin/inquiries${buildSearch(query)}`,
      { token },
    ),
  get: (id: string, token?: string) =>
    adminRequest<AdminInquiryDetail>(`/admin/inquiries/${id}`, { token }),
  update: (id: string, body: UpdateInquiryBody) =>
    adminRequest<AdminInquiryDetail>(`/admin/inquiries/${id}`, {
      method: "PATCH",
      json: body,
    }),
};
