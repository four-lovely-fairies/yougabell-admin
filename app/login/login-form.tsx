"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  next?: string;
  forbidden?: boolean;
  linkError?: boolean;
};

export function LoginForm({ next, forbidden, linkError }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (next) redirectTo.searchParams.set("next", next);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo.toString() },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="space-y-6">
        <div className="bg-primary/5 flex flex-col items-center gap-3 rounded-xl border px-6 py-8 text-center">
          <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
            <CheckCircle2 className="size-6" />
          </span>
          <div className="space-y-1">
            <p className="font-medium">메일함을 확인해 주세요</p>
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-medium">{email}</span>
              <br />
              위 주소로 로그인 링크를 보냈습니다. 링크를 열면 콘솔로 접속됩니다.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            setStatus("idle");
            setErrorMessage(null);
          }}
        >
          <RotateCcw className="size-4" />
          다른 이메일로 다시 보내기
        </Button>
        <p className="text-muted-foreground text-center text-xs">
          메일이 오지 않으면 스팸함을 확인하거나 잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {forbidden ? (
        <Alert
          tone="destructive"
          title="접근 권한이 없습니다"
          description="이 계정은 운영자 목록에 없습니다. 관리자에게 접근 권한을 요청하세요."
        />
      ) : null}
      {linkError ? (
        <Alert
          tone="destructive"
          title="로그인 링크가 유효하지 않습니다"
          description="링크가 만료되었거나 이미 사용되었습니다. 아래에서 다시 요청해 주세요."
        />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <div className="relative">
          <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@yougabell.com"
            className="pl-9"
            disabled={status === "sending"}
          />
        </div>
      </div>

      {status === "error" && errorMessage ? (
        <p className="text-destructive flex items-center gap-1.5 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        disabled={status === "sending" || email.trim().length === 0}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            전송 중…
          </>
        ) : (
          <>
            <Mail className="size-4" />
            로그인 링크 받기
          </>
        )}
      </Button>
    </form>
  );
}

function Alert({
  tone,
  title,
  description,
}: {
  tone: "destructive";
  title: string;
  description: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border px-3.5 py-3 text-sm",
        tone === "destructive" &&
          "border-destructive/30 bg-destructive/5 text-destructive",
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <div className="space-y-0.5">
        <p className="font-medium">{title}</p>
        <p className="text-destructive/80">{description}</p>
      </div>
    </div>
  );
}
