// ============================================================
// 통계 (참여도 — 접속 로그 대체 지표)
// ============================================================

export type StatsRange = {
  from: string;
  to: string;
  days: number;
  timezone: string;
};

export type StatsTotals = {
  users: number;
  children: number;
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
  returningRate: number;
  avgActiveDays: number;
  missionExecutions: number;
  missionCompleted: number;
  missionCompletionRate: number;
  moodChecks: number;
  avgMoodLevel: number | null;
  careExecutions: number;
  chatMessages: number;
};

export type StatsDailyPoint = {
  date: string;
  activeUsers: number;
  newUsers: number;
  mission: number;
  mood: number;
  care: number;
  chat: number;
};

export type StatsActiveDaysBucket = {
  bucket: "1" | "2-3" | "4-7" | "8-14" | "15+";
  users: number;
};

export type StatsWeekdayPoint = {
  weekday: number;
  events: number;
  activeUsers: number;
};

export type StatsHourPoint = { hour: number; events: number };
export type StatsMoodLevelPoint = { level: number; count: number };
export type StatsMoodDailyPoint = {
  date: string;
  avgLevel: number | null;
  count: number;
};
export type StatsMissionStatusPoint = { status: string; count: number };
export type StatsTopMissionPoint = {
  missionId: string;
  title: string;
  categoryId: string;
  executions: number;
  completed: number;
  avgSatisfaction: number | null;
};
export type StatsCategoryPoint = {
  categoryId: string;
  label: string;
  executions: number;
};
export type StatsFeedbackSummary = {
  count: number;
  avgChildReaction: number | null;
  avgParentEnergy: number | null;
  avgMissionSatisfaction: number | null;
};
export type StatsKeywordPoint = { keyword: string; count: number };

export type EngagementStats = {
  range: StatsRange;
  totals: StatsTotals;
  daily: StatsDailyPoint[];
  activeDays: StatsActiveDaysBucket[];
  weekday: StatsWeekdayPoint[];
  hourly: StatsHourPoint[];
  moodLevels: StatsMoodLevelPoint[];
  moodDaily: StatsMoodDailyPoint[];
  missionStatus: StatsMissionStatusPoint[];
  topMissions: StatsTopMissionPoint[];
  categories: StatsCategoryPoint[];
  feedback: StatsFeedbackSummary;
  keywords: StatsKeywordPoint[];
};
