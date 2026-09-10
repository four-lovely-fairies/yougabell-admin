"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";

export function UsersFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [pending, startTransition] = useTransition();

  const apply = useCallback(
    (next: string) => {
      const url = new URLSearchParams(params.toString());
      if (next) url.set("q", next);
      else url.delete("q");
      url.delete("page"); // 검색 변경 시 1페이지로
      startTransition(() => {
        router.replace(`/users?${url.toString()}`);
      });
    },
    [params, router],
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply(q);
      }}
      className="flex items-center gap-2"
    >
      <Input
        placeholder="이름 또는 이메일 검색"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-xs"
        disabled={pending}
      />
      <button
        type="submit"
        className="h-9 px-3 rounded-md border border-zinc-200 text-sm hover:bg-zinc-50"
        disabled={pending}
      >
        검색
      </button>
      {q && (
        <button
          type="button"
          onClick={() => {
            setQ("");
            apply("");
          }}
          className="h-9 px-3 rounded-md text-sm text-zinc-500"
        >
          초기화
        </button>
      )}
    </form>
  );
}
