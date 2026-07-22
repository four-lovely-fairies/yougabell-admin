/**
 * 운영자 이메일 allowlist. API(`AdminRoleGuard`)와 동일한 `ADMIN_ALLOWED_EMAILS`
 * env를 공유해 프론트 게이트와 API 가드가 한 소스로 정렬된다.
 * 값: 쉼표로 구분된 이메일 목록. 대소문자·공백 무시.
 *
 * NEXT_PUBLIC_ 접두사 없음 — 브라우저로 노출하지 않고 middleware(서버)에서만 평가.
 */
export function parseAdminAllowlist(raw: string | undefined): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0),
  );
}

export function isAllowlistedAdminEmail(
  email: string | null | undefined,
  raw: string | undefined = process.env.ADMIN_ALLOWED_EMAILS,
): boolean {
  if (!email) return false;
  return parseAdminAllowlist(raw).has(email.trim().toLowerCase());
}
