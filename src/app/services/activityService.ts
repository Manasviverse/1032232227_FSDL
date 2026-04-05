import { apiFetch } from "./api";
import type { Activity } from "../data/mockData";

export type ApiActivity = Omit<Activity, "id"> & { _id: string };

export const activityService = {
  async getAll(): Promise<ApiActivity[]> {
    return apiFetch<ApiActivity[]>("/activities");
  },
  async create(data: Omit<ApiActivity, "_id">): Promise<ApiActivity> {
    return apiFetch<ApiActivity>("/activities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
