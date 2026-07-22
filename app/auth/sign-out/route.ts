import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  // 303 — POST를 GET 리다이렉트로 전환.
  return NextResponse.redirect(new URL("/login", request.nextUrl.origin), {
    status: 303,
  });
}
