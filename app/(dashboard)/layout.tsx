import { AppSidebar } from "@/components/nav/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
