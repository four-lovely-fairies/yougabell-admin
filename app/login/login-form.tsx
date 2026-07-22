"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  next?: string;
  forbidden?: boolean;
};

export function LoginForm({ next, forbidden }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (next) redirectTo.searchParams.set("next", next);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo.toString() },
    });

    if (otpError) {
      setStatus("error");
      setError(otpError.message);
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="space-y-2 text-sm">
        <p className="font-medium">메일함을 확인해 주세요.</p>
        <p className="text-muted-foreground">
          {email} 주소로 로그인 링크를 보냈습니다. 링크를 열면 콘솔로 접속됩니다.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {forbidden ? (
        <p className="text-destructive text-sm">
          이 계정은 운영자 목록에 없습니다. 관리자에게 접근 권한을 요청하세요.
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@yougabell.com"
        />
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? "전송 중…" : "로그인 링크 받기"}
      </Button>
    </form>
  );
}
