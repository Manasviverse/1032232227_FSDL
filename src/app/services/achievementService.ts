import { apiFetch } from './api';

export interface ApiAchievement {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  rarity: string;
  userId?: string;
}

export const achievementService = {
  getAll: () => apiFetch<ApiAchievement[]>('/achievements'),
  getMine: () => apiFetch<ApiAchievement[]>('/achievements/me'),
};
