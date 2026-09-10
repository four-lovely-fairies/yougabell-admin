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
  const [status, setStatus] = useState<
    "idle" | "sending" | "oauth" | "sent" | "error"
  >("idle");
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

  async function handleGoogleSignIn() {
    setStatus("oauth");
    setErrorMessage(null);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (next) redirectTo.searchParams.set("next", next);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo.toString() },
    });

    // 성공하면 Google 인증 페이지로 이동한다. 이 분기는 팝업 차단·설정 오류처럼
    // 리다이렉트가 시작되지 못한 경우에만 실행된다.
    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
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
              <br />위 주소로 로그인 링크를 보냈습니다. 링크를 열면 콘솔로
              접속됩니다.
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
    <div className="space-y-5">
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

      {status === "error" && errorMessage ? (
        <p className="text-destructive flex items-center gap-1.5 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => void handleGoogleSignIn()}
        disabled={status === "sending" || status === "oauth"}
      >
        {status === "oauth" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Google로 이동 중…
          </>
        ) : (
          <>
            <GoogleIcon />
            Google로 계속하기
          </>
        )}
      </Button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background text-muted-foreground px-2">
            또는 이메일
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
              disabled={status === "sending" || status === "oauth"}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={
            status === "sending" ||
            status === "oauth" ||
            email.trim().length === 0
          }
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
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21.805 12.23c0-.718-.064-1.408-.184-2.072H12v3.924h5.498a4.705 4.705 0 01-2.04 3.087v2.565h3.301c1.932-1.779 3.046-4.401 3.046-7.504z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.075-.915 6.766-2.479l-3.301-2.565c-.915.613-2.084.976-3.465.976-2.657 0-4.91-1.793-5.715-4.204H2.873v2.647A9.998 9.998 0 0012 22z"
        fill="#34A853"
      />
      <path
        d="M6.285 13.728A5.997 5.997 0 016 12c0-.6.102-1.183.285-1.728V7.625H2.873A9.998 9.998 0 002 12c0 1.602.383 3.119 1.063 4.375l3.222-2.647z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.068c1.5 0 2.846.516 3.906 1.53l2.93-2.93C17.07 3.03 14.754 2 12 2a9.998 9.998 0 00-9.127 5.625l3.412 2.647C7.09 7.861 9.343 6.068 12 6.068z"
        fill="#EA4335"
      />
    </svg>
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
