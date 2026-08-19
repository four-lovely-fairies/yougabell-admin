"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INQUIRY_CATEGORY_LABELS,
  INQUIRY_STATUS_LABELS,
  type InquiryCategory,
  type InquiryStatus,
} from "@/lib/api";

const STATUSES = Object.keys(INQUIRY_STATUS_LABELS) as InquiryStatus[];
const CATEGORIES = Object.keys(INQUIRY_CATEGORY_LABELS) as InquiryCategory[];

export function InquiriesFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [pending, startTransition] = useTransition();

  const apply = useCallback(
    (patch: Record<string, string | null>) => {
      const url = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value) url.set(key, value);
        else url.delete(key);
      }
      url.delete("page"); // 필터 변경 시 1페이지로
      startTransition(() => {
        router.replace(`/inquiries?${url.toString()}`);
      });
    },
    [params, router],
  );

  return (
    <div className="flex items-center gap-2">
      <Select
        value={params.get("status") ?? "all"}
        onValueChange={(v) => apply({ status: v === "all" ? null : v })}
        disabled={pending}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 상태</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {INQUIRY_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("category") ?? "all"}
        onValueChange={(v) => apply({ category: v === "all" ? null : v })}
        disabled={pending}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="유형" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 유형</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {INQUIRY_CATEGORY_LABELS[c]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q: q || null });
        }}
        className="flex items-center gap-2"
      >
        <Input
          placeholder="제목·본문 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
          disabled={pending}
        />
        <button
          type="submit"
          className="h-9 rounded-md border border-zinc-200 px-3 text-sm hover:bg-zinc-50"
          disabled={pending}
        >
          검색
        </button>
      </form>
    </div>
  );
}
