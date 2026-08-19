// ============================================================
// admin 콘텐츠 운영 (milestones / growth-stages / missions / categories) 타입
// ============================================================

export type MilestoneCategory = {
  id: string;
  label: string;
  iconKey: string;
  color: string;
  displayOrder: number;
};

export type Milestone = {
  id: string;
  categoryId: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  title: string | null;
  description: string;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateMilestoneBody = {
  categoryId: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  title?: string;
  description: string;
  displayOrder?: number;
};

export type UpdateMilestoneBody = Partial<CreateMilestoneBody>;

export type MilestoneListQuery = {
  categoryId?: string;
  ageMonths?: number;
  cursor?: string;
  take?: number;
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

export type GrowthStage = {
  id: string;
  name: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  summary: string;
};

export type CreateGrowthStageBody = {
  id: string;
  name: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  summary: string;
};

export type UpdateGrowthStageBody = Omit<Partial<CreateGrowthStageBody>, "id">;

export type MissionSource = {
  citation: string;
  url: string | null;
  note: string | null;
};

export type Mission = {
  id: string;
  categoryId: string;
  title: string;
  shortTitle: string;
  description: string;
  durationMinutes: number;
  effect: string;
  subThemeLabel: string | null;
  goal: string | null;
  recommendedAgeMonthsMin: number | null;
  recommendedAgeMonthsMax: number | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  tags: string[];
  sources: MissionSource[];
  createdAt: string;
  updatedAt: string;
};

export type CreateMissionBody = {
  categoryId: string;
  title: string;
  shortTitle: string;
  description: string;
  durationMinutes: number;
  effect: string;
  subThemeLabel?: string;
  goal?: string;
  recommendedAgeMonthsMin?: number;
  recommendedAgeMonthsMax?: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  tags?: string[];
  sources?: { citation: string; url?: string; note?: string }[];
};

export type UpdateMissionBody = Partial<CreateMissionBody>;

export type MissionListQuery = {
  categoryId?: string;
  ageMonths?: number;
  cursor?: string;
  take?: number;
};
