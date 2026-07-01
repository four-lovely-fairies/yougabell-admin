# yougabell-admin

육아벨 운영자가 쓰는 내부 CMS. 사용자가 보는 콘텐츠 — 미션, 마일스톤, 마음 케어 글, 성장 단계 — 를 여기서 만들고 고친다. 더불어 가입자 모니터링, 주간 리포트와 챗봇 응답 샘플 검수도 이 도구에서 한다.

사용자용 web과 같은 Next.js 16 + Tailwind 스택이지만, 성격은 정반대다. 모바일 한 손에 들어오는 화면이 아니라, 데이터가 빽빽한 데스크톱 그리드가 중심이다.

## 콘텐츠를 스프레드시트처럼 다루기

운영자가 미션 수백 개를 관리할 때, 항목 하나 고치자고 매번 모달을 열고 폼을 채우고 저장하는 건 고문이다. 그래서 테이블 셀을 직접 편집하는 방식으로 갔다. 구글 시트를 쓰는 감각에 가깝다.

`components/shared/`에 셀 종류별 에디터가 있다 — 텍스트, 숫자, 셀렉트, 태그 배열, 개월 수 범위. 셀을 클릭하면 인라인 입력으로 바뀌고, 포커스를 잃거나 Enter(여러 줄은 Cmd+Enter)를 누르면 저장된다. 값이 안 바뀌었으면 PATCH를 아예 안 쏴서 불필요한 요청을 줄이고, 저장이 실패하면 입력하던 초안을 그대로 둬서 다시 시도할 수 있게 한다.

목록은 커서 기반 무한 스크롤이다. offset 페이지네이션의 skip/take 산수를 피하고, `IntersectionObserver`로 바닥 근처에 센티넬이 들어오면 다음 50개를 당겨온다. 재밌는 디테일 하나 — `useInfiniteCursor` 훅이 상태를 `useEffect`가 아니라 렌더 시점에 동기화한다. 그래서 `router.refresh()`를 부르면 추가 라운드트립 없이 스크롤이 깔끔하게 리셋된다.

## 개인정보는 보여주는 순간 가린다

사용자/자녀 데이터를 운영자가 들여다볼 일이 있는데, 평문을 그대로 화면이나 콘솔에 흘리면 안 된다. `lib/mask.ts`에 마스킹 유틸을 모아두고 표시 직전에 건다 — 이름은 `홍**`, 이메일은 `abc***@*.com`, ID는 앞 8자만. URL 쿼리에 식별자를 평문으로 싣지 않는 것도 같은 원칙이다.

## API 클라이언트

`yougabell-api`를 호출하는 건 web과 같지만, 어드민은 거의 서버 컴포넌트에서 fetch한다. 클라이언트로 fetch가 새지 않아서 운영자 데이터를 다루기에 안전하다. `lib/api.ts`의 `adminApi` 객체 트리(`missions`, `milestones`, `growthStages`, `categories`)가 백엔드 라우트 구조를 그대로 거울처럼 따라가고, 모든 호출은 `adminRequest<T>()` 하나를 거친다. 응답이 실패하면 `AdminApiError(status, body)`로 감싸는데, status 0(네트워크 자체가 안 닿음)이면 `ApiUnreachable` 폴백 화면을 띄운다.

## shadcn/ui와 Tailwind v4

UI는 shadcn/ui로 깐다. 핵심은 이게 npm 의존성이 아니라 코드를 내 레포로 복사해 오는 방식이라는 것. 그래서 사이드바를 접히는 아이콘 모드로 바꾸는 식의 커스터마이즈를 컴포넌트 안에서 직접 할 수 있다(`radix-ui` 프리미티브 위에 올라간다).

Tailwind는 v4라 JS 설정 파일이 없다. `globals.css`에서 `@import "tailwindcss"`와 shadcn 토큰을 불러오고, `@theme inline`으로 CSS 변수를 잡고, `@custom-variant dark`로 별도 프로바이더 없이 다크 모드를 처리한다. 디자인 토큰 자체는 web의 [`DESIGN.md`](https://github.com/four-lovely-fairies/yougabell-web/blob/main/DESIGN.md)를 그대로 재사용하고, 어드민 전용 보강만 이 레포의 [`DESIGN.md`](./DESIGN.md)에서 다룬다.

## 라이브러리 메모

- **`shadcn` + `radix-ui`** — 접근성이 챙겨진 헤드리스 프리미티브 위에 스타일을 입히는 방식. 다이얼로그·드롭다운·사이드바를 직접 ARIA 맞춰 짜는 수고를 던다.
- **`react-hook-form` + `zod` + `@hookform/resolvers`** — 미션/마일스톤 생성·편집 다이얼로그의 폼 검증. zod 스키마 하나로 타입과 런타임 검증을 같이 얻는다.
- **`sonner`** — 저장·삭제 결과 토스트. `richColors`로 성공/실패가 색으로 구분된다.
- **`tailwind-merge` + `clsx`** — `cn()`으로 클래스 충돌 정리.
- **`next-themes`** — 다크 모드 토글.

## 시작하기

```bash
nvm use
pnpm install
cp .env.example .env.local
pnpm dev          # :3002
```

web이 `:3000`/`:3001`을 쓰므로 어드민은 `:3002`로 띄워 충돌을 피한다.

## 스택

Next.js 16(App Router) · React 19 · Tailwind CSS v4 · shadcn/ui · TypeScript(strict) · pnpm · Node 24 LTS. Vercel에 배포하며, 사용자 도메인과 분리된 운영자 전용 서브도메인(`admin.youth.kr` 검토)으로 나간다. 모든 라우트는 Supabase Auth + 운영자 role 게이트를 통과해야 한다.

## 관련 문서

- 어드민 디자인 보강: [`DESIGN.md`](./DESIGN.md)
- 레포 전략 / 스키마 / 기능 기획: umbrella 레포 `yougabell`
  - [`yougabell/docs/design/00-repo-strategy.md`](https://github.com/four-lovely-fairies/yougabell/blob/main/docs/design/00-repo-strategy.md)
  - [`yougabell/docs/schema/`](https://github.com/four-lovely-fairies/yougabell/tree/main/docs/schema)
  - [`yougabell/docs/features/`](https://github.com/four-lovely-fairies/yougabell/tree/main/docs/features)
