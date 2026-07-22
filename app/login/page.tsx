import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>육아벨 운영자 콘솔</CardTitle>
          <CardDescription>
            등록된 운영자만 접근할 수 있습니다. 이메일로 로그인 링크를 받으세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm next={next} forbidden={error === "forbidden"} />
        </CardContent>
      </Card>
    </div>
  );
}
