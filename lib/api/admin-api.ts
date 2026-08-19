import { adminRequest, buildSearch } from "./client";
import type {
  CreateGrowthStageBody,
  CreateMilestoneBody,
  CreateMissionBody,
  CursorPage,
  GrowthStage,
  Milestone,
  MilestoneCategory,
  MilestoneListQuery,
  Mission,
  MissionListQuery,
  UpdateGrowthStageBody,
  UpdateMilestoneBody,
  UpdateMissionBody,
} from "./content";
import type { EngagementStats } from "./stats";
import type { TestPushResult } from "./users";

export const adminApi = {
  stats: {
    engagement: (days: number, token?: string) =>
      adminRequest<EngagementStats>(
        `/admin/stats/engagement${buildSearch({ days })}`,
        { token },
      ),
  },
  categories: {
    list: (token?: string) =>
      adminRequest<MilestoneCategory[]>("/admin/categories", { token }),
  },
  milestones: {
    list: (q: MilestoneListQuery = {}, token?: string) =>
      adminRequest<CursorPage<Milestone>>(
        `/admin/milestones${buildSearch(q)}`,
        {
          token,
        },
      ),
    create: (body: CreateMilestoneBody) =>
      adminRequest<Milestone>("/admin/milestones", {
        method: "POST",
        json: body,
      }),
    update: (id: string, body: UpdateMilestoneBody) =>
      adminRequest<Milestone>(`/admin/milestones/${id}`, {
        method: "PATCH",
        json: body,
      }),
    remove: (id: string) =>
      adminRequest<void>(`/admin/milestones/${id}`, { method: "DELETE" }),
  },
  growthStages: {
    list: (token?: string) =>
      adminRequest<GrowthStage[]>("/admin/growth-stages", { token }),
    create: (body: CreateGrowthStageBody) =>
      adminRequest<GrowthStage>("/admin/growth-stages", {
        method: "POST",
        json: body,
      }),
    update: (id: string, body: UpdateGrowthStageBody) =>
      adminRequest<GrowthStage>(`/admin/growth-stages/${id}`, {
        method: "PATCH",
        json: body,
      }),
    remove: (id: string) =>
      adminRequest<void>(`/admin/growth-stages/${id}`, { method: "DELETE" }),
  },
  missions: {
    list: (q: MissionListQuery = {}, token?: string) =>
      adminRequest<CursorPage<Mission>>(`/admin/missions${buildSearch(q)}`, {
        token,
      }),
    create: (body: CreateMissionBody) =>
      adminRequest<Mission>("/admin/missions", { method: "POST", json: body }),
    update: (id: string, body: UpdateMissionBody) =>
      adminRequest<Mission>(`/admin/missions/${id}`, {
        method: "PATCH",
        json: body,
      }),
    remove: (id: string) =>
      adminRequest<void>(`/admin/missions/${id}`, { method: "DELETE" }),
  },
  notifications: {
    testPush: (userId: string) =>
      adminRequest<TestPushResult>("/admin/notifications/test-push", {
        method: "POST",
        json: { userId },
      }),
  },
};
