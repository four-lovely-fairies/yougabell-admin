import Link from "next/link";

import { InquiryAnswerForm } from "@/components/inquiries/inquiry-answer-form";
import { InquiryStatusBadge } from "@/components/inquiries/inquiry-status-badge";
import { SiteHeader } from "@/components/nav/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { INQUIRY_CATEGORY_LABELS, inquiryApi } from "@/lib/api";
import { maskId, maskName } from "@/lib/mask";
import { getAdminAccessToken } from "@/lib/supabase/server";

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let inquiry;
  let error: string | null = null;
  try {
    const token = (await getAdminAccessToken()) ?? undefined;
    inquiry = await inquiryApi.get(id, token);
  } catch (e) {
    error = e instanceof Error ? e.message : "알 수 없는 오류";
  }

  if (!inquiry) {
    return (
      <>
        <SiteHeader
          crumbs={[{ label: "문의", href: "/inquiries" }, { label: "상세" }]}
        />
        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            문의를 불러오지 못했습니다: {error}
          </div>
          <Link href="/inquiries" className="text-sm underline">
            목록으로
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader
        crumbs={[{ label: "문의", href: "/inquiries" }, { label: "상세" }]}
      />
      <main className="flex flex-1 flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {inquiry.title}
                  <InquiryStatusBadge status={inquiry.status} />
                </CardTitle>
                <CardDescription>
                  {formatDateTime(inquiry.createdAt)}
                  {inquiry.category
                    ? ` · ${INQUIRY_CATEGORY_LABELS[inquiry.category]}`
                    : ""}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-muted-foreground pb-2 text-sm font-medium">
                문의 내용
              </h2>
              <p className="whitespace-pre-wrap rounded-md bg-zinc-50 px-4 py-3 text-sm leading-relaxed">
                {inquiry.body}
              </p>
            </section>

            <section>
              <h2 className="text-muted-foreground pb-2 text-sm font-medium">
                작성자
              </h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-4">
                <Field label="이름" value={maskName(inquiry.userName)} />
                <Field label="ID" value={maskId(inquiry.userId)} mono />
                <Field
                  label="가입"
                  value={formatDateTime(inquiry.userCreatedAt)}
                />
                <Field
                  label="온보딩"
                  value={
                    inquiry.userOnboardedAt
                      ? formatDateTime(inquiry.userOnboardedAt)
                      : "미완료"
                  }
                />
                <Field
                  label="답변 받을 메일"
                  value={inquiry.contactEmail ?? "—"}
                />
                {inquiry.userDeletedAt ? (
                  <Field
                    label="탈퇴"
                    value={formatDateTime(inquiry.userDeletedAt)}
                  />
                ) : null}
              </dl>
              <p className="text-muted-foreground pt-2 text-xs">
                답변 발송에 필요해 이메일은 마스킹하지 않습니다. 외부에 노출하지
                마세요.
              </p>
            </section>

            <InquiryAnswerForm
              inquiryId={inquiry.id}
              status={inquiry.status}
              answerBody={inquiry.answerBody}
              answeredAt={inquiry.answeredAt}
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className={mono ? "font-mono text-xs" : undefined}>{value}</dd>
    </div>
  );
}
