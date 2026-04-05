import { apiFetch } from './api';

export interface ApiWeeklyStats {
  studyHours: number;
  quizzesTaken: number;
  rank: number;
  xpEarned: number;
  streak: number;
  roomsJoined: number;
}

export interface ApiStudyHourData {
  day: string;
  hours: number;
  quizzes: number;
}

export interface ApiQuizPerformance {
  subject: string;
  score: number;
  attempts: number;
}

export interface ApiContribution {
  name: string;
  value: number;
  color: string;
}

export const analyticsService = {
  getWeeklyStats: () => apiFetch<ApiWeeklyStats>('/analytics/weekly-stats'),
  getStudyHours: () => apiFetch<ApiStudyHourData[]>('/analytics/study-hours'),
  getQuizPerformance: () => apiFetch<ApiQuizPerformance[]>('/analytics/quiz-performance'),
  getContributions: () => apiFetch<ApiContribution[]>('/analytics/contributions'),
};
