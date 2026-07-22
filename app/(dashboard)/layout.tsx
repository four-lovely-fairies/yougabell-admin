import { LogOut } from "lucide-react";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const email =
    typeof data?.claims.email === "string" ? data.claims.email : null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <div className="ml-auto flex items-center gap-3">
            {email ? (
              <span className="text-muted-foreground text-sm">{email}</span>
            ) : null}
            <form action="/auth/sign-out" method="post">
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="size-4" />
                로그아웃
              </Button>
            </form>
          </div>
        </header>
        {children}
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
