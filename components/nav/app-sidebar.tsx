"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby,
  ClipboardList,
  Heart,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  Milestone,
  Sparkles,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const overviewItems = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
];

const userItems = [{ href: "/users", label: "사용자", icon: Users }];

const contentItems = [
  { href: "/content/missions", label: "미션", icon: ClipboardList },
  { href: "/content/care", label: "마음 케어", icon: Heart },
  { href: "/content/milestones", label: "발달 마일스톤", icon: Baby },
  { href: "/content/growth-stages", label: "성장 단계", icon: Milestone },
  { href: "/content/tips", label: "팁·인용구", icon: Lightbulb },
];

const reviewItems = [
  { href: "/reports", label: "리포트 검수", icon: Sparkles },
  { href: "/chats", label: "챗 검수", icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
            육
          </div>
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-semibold">육아벨 운영자</span>
            <span className="text-muted-foreground text-xs">yougabell-admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>개요</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>사용자</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>콘텐츠</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>검수</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reviewItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2 text-xs text-muted-foreground">
          v0.1.0 · dev
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
