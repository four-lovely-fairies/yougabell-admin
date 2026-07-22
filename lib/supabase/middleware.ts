import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 매 요청마다 Supabase 세션을 새로고침하고 라우팅 분기에 쓸 claims를 반환.
 * - `getClaims()`는 JWKS 로컬 검증 (api·web와 동일 방식)
 * - setAll 콜백은 @supabase/ssr 최신 시그니처(`(cookiesToSet, headers)`)를 따른다.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          if (headers) {
            for (const [key, value] of Object.entries(headers)) {
              response.headers.set(key, value);
            }
          }
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const email =
    typeof data?.claims.email === "string" ? data.claims.email : null;

  return { response, email };
}
