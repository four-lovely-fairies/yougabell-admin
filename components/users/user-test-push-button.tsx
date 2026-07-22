"use client";

import { useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { adminApi, AdminApiError } from "@/lib/api";

export function UserTestPushButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    try {
      const result = await adminApi.notifications.testPush(userId);

      if (result.attempted === 0) {
        toast.warning("등록된 푸시 토큰이 없습니다", {
          description: "이 사용자는 앱에서 알림을 허용하지 않았습니다.",
        });
      } else if (result.sent === 0) {
        const reason = result.tickets
          .map((ticket) => ticket.error)
          .filter(Boolean)
          .join(", ");
        toast.error(`발송 실패 (${result.failed}건)`, {
          description: reason || "토큰이 만료되었을 수 있습니다.",
        });
      } else {
        toast.success(`푸시 발송됨 (${result.sent}/${result.attempted})`);
      }
    } catch (error) {
      const description =
        error instanceof AdminApiError
          ? `API ${error.status}`
          : error instanceof Error
            ? error.message
            : "알 수 없는 오류";
      toast.error("발송 요청 실패", { description });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={send} disabled={loading}>
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Bell className="size-4" />
      )}
      테스트
    </Button>
  );
}
