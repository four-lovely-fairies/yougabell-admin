"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AdminApiError, inquiryApi, type InquiryStatus } from "@/lib/api";

const ANSWER_MAX = 4000;

type Props = {
  inquiryId: string;
  status: InquiryStatus;
  answerBody: string | null;
  answeredAt: string | null;
};

export function InquiryAnswerForm({
  inquiryId,
  status,
  answerBody,
  answeredAt,
}: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState(answerBody ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  const isAnswered = status === "answered";
  const canSubmit = draft.trim().length > 0 && !saving;

  const run = async (body: Parameters<typeof inquiryApi.update>[1]) => {
    setSaving(true);
    setError(null);
    try {
      await inquiryApi.update(inquiryId, body);
      startTransition(() => router.refresh());
    } catch (e) {
      setError(toMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-muted-foreground text-sm font-medium">
          {isAnswered ? "답변 (수정)" : "답변 작성"}
        </h2>
        {isAnswered && answeredAt ? (
          <span className="text-muted-foreground text-xs">
            최초 답변 {new Date(answeredAt).toLocaleString("ko-KR")}
          </span>
        ) : null}
      </div>

      <Textarea
        value={draft}
        maxLength={ANSWER_MAX}
        rows={8}
        placeholder="사용자에게 보낼 답변을 작성하세요."
        onChange={(e) => setDraft(e.target.value)}
        disabled={saving}
      />
      <p className="text-muted-foreground text-right text-xs">
        {draft.trim().length} / {ANSWER_MAX}
      </p>

      {error ? (
        <p aria-live="polite" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          disabled={!canSubmit}
          onClick={() => void run({ answerBody: draft.trim() })}
        >
          {saving ? "저장 중..." : isAnswered ? "답변 수정" : "답변 등록"}
        </Button>
        {status === "received" ? (
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => void run({ status: "in_progress" })}
          >
            확인 중으로 표시
          </Button>
        ) : null}
      </div>

      {!isAnswered ? (
        <p className="text-muted-foreground text-xs">
          답변을 등록하면 상태가 &quot;답변 완료&quot;로 바뀌고 사용자에게
          알림이 발송됩니다. 수정 시에는 알림이 다시 가지 않습니다.
        </p>
      ) : null}
    </section>
  );
}

function toMessage(e: unknown): string {
  if (!(e instanceof AdminApiError)) return "알 수 없는 오류가 발생했습니다.";
  if (e.status === 0) return "API 서버에 연결할 수 없습니다.";
  if (e.status === 400) return "답변 본문을 입력해 주세요.";
  if (e.status === 404) return "문의를 찾을 수 없습니다.";
  if (e.status === 403) return "운영자 권한이 없습니다.";
  return `저장 실패 (${e.status})`;
}
