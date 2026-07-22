import { ShieldCheck, Sparkles } from "lucide-react";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* 좌측 브랜드 패널 (데스크톱) */}
      <aside className="bg-primary text-primary-foreground relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="bg-primary-foreground/10 absolute -top-24 -right-24 size-72 rounded-full blur-3xl" />
        <div className="bg-primary-foreground/5 absolute -bottom-32 -left-16 size-80 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-2.5 font-semibold">
          <span className="bg-primary-foreground/15 flex size-9 items-center justify-center rounded-lg">
            <Sparkles className="size-5" />
          </span>
          육아벨 운영자 콘솔
        </div>

        <div className="relative space-y-4">
          <h2 className="text-3xl leading-snug font-semibold tracking-tight">
            콘텐츠·사용자·리포트를
            <br />한 곳에서 운영하세요.
          </h2>
          <p className="text-primary-foreground/70 max-w-sm text-sm leading-relaxed">
            미션·마일스톤 콘텐츠 관리부터 사용자 현황, 주간 리포트 검수까지.
            등록된 운영자만 접근할 수 있는 내부 도구입니다.
          </p>
        </div>

        <p className="text-primary-foreground/50 relative text-xs">
          © 육아벨 · four-lovely-fairies
        </p>
      </aside>

      {/* 우측 로그인 폼 */}
      <main className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2 font-semibold lg:hidden">
            <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
              <Sparkles className="size-5" />
            </span>
            육아벨 운영자 콘솔
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
            <p className="text-muted-foreground text-sm">
              이메일로 로그인 링크를 받아 접속하세요. 비밀번호는 필요하지 않습니다.
            </p>
          </div>

          <LoginForm
            next={next}
            forbidden={error === "forbidden"}
            linkError={error === "auth" || error === "missing_code"}
          />

          <div className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
            <ShieldCheck className="size-3.5" />
            운영자 전용 · 접근 권한은 관리자에게 문의하세요
          </div>
        </div>
      </main>
    </div>
  );
}
