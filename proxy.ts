import { NextResponse, type NextRequest } from "next/server";
import { isAllowlistedAdminEmail } from "@/lib/admin-allowlist";
import { updateSession } from "@/lib/supabase/middleware";

// 인증 없이 접근 가능한 경로 (로그인·매직링크 콜백·로그아웃).
const PUBLIC_PATHS = ["/login", "/auth/callback", "/auth/sign-out"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/**
 * 갱신된 세션 쿠키(updateSession이 base에 심음)를 리다이렉트 응답으로 옮긴다.
 * 이 복사를 빼먹으면 토큰 갱신이 유실돼 로그인 루프가 생긴다.
 */
function redirectPreservingCookies(
  url: URL,
  base: NextResponse,
): NextResponse {
  const redirect = NextResponse.redirect(url);
  for (const cookie of base.cookies.getAll()) {
    redirect.cookies.set(cookie);
  }
  return redirect;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 자산·내부 경로는 인증 게이트를 태우지 않는다. config.matcher로도 걸러지지만,
  // matcher 파싱이 어긋나도 자산이 /login으로 튕기지 않도록 방어적으로 재확인.
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const { response, email } = await updateSession(request);
  const allowed = isAllowlistedAdminEmail(email);

  // 이미 인가된 사용자가 로그인 페이지에 오면 대시보드로 보낸다.
  if (allowed && pathname === "/login") {
    return redirectPreservingCookies(new URL("/", request.url), response);
  }

  if (isPublicPath(pathname)) {
    return response;
  }

  // 세션이 없거나 allowlist에 없으면 로그인으로.
  if (!allowed) {
    const loginUrl = new URL("/login", request.url);
    // 로그인은 됐지만 allowlist 밖인 경우(권한 없음)를 구분해 안내한다.
    if (email) loginUrl.searchParams.set("error", "forbidden");
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
    return redirectPreservingCookies(loginUrl, response);
  }

  return response;
}

// Next.js 16은 proxy 파일에서도 export 이름 `config`의 `matcher`를 읽는다.
// (`proxyConfig`가 아님 — 그 경우 matcher가 무시돼 모든 경로에 프록시가 돈다.)
export const config = {
  matcher: [
    // 정적 자원·이미지·파비콘을 제외한 모든 경로를 게이트한다.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
