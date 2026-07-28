/**
 * 통계 화면 시각화 공통 토큰·포매터.
 *
 * 색은 전부 `app/globals.css` 의 `.viz` 스코프 CSS 변수를 가리킨다 —
 * light/dark 각각 검증된 값이 한 곳에서만 바뀌도록.
 */

/** 카테고리(정체성) 슬롯. 순서 고정 — 시리즈가 줄어도 살아남은 시리즈 색은 그대로. */
export type VizSlot = 1 | 2 | 3 | 4 | 5;

export const seriesColor = (slot: VizSlot) => `var(--viz-series-${slot})`;

/** 1~5 순서 척도(기분 레벨) 램프. */
export const moodColor = (level: number) => `var(--viz-mood-${level})`;

export const formatInt = (n: number) => n.toLocaleString("ko-KR");

export const formatPercent = (ratio: number, digits = 1) =>
  `${(ratio * 100).toFixed(digits)}%`;

export const formatDecimal = (n: number | null, digits = 1) =>
  n === null ? "—" : n.toFixed(digits);

/** "2026-07-28" → "7/28" (축 라벨용 축약) */
export const shortDate = (iso: string) => {
  const [, month, day] = iso.split("-");
  return `${Number(month)}/${Number(day)}`;
};

export const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export const MOOD_LEVEL_LABELS: Record<number, string> = {
  1: "1 고갈",
  2: "2 조금 힘듦",
  3: "3 보통",
  4: "4 조금 좋음",
  5: "5 최고예요",
};

export const MISSION_STATUS_LABELS: Record<string, string> = {
  completed: "완료",
  early_completed: "조기 완료",
  in_progress: "진행 중",
  paused: "일시정지",
  cancelled: "취소",
};

export const ACTIVITY_LABELS = {
  mission: "오늘의 놀이",
  mood: "오늘의 기분",
  care: "마음 케어",
  chat: "챗",
} as const;
