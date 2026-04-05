import { apiFetch } from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  color: string;
  role: string;
  level: number;
  xp: number;
  totalXP: number;
  rank: number;
  badge: string;
  badgeColor: string;
  streak: number;
  quizWins: number;
  resourcesShared: number;
  joinedRooms: number;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    avatar?: string;
  }): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
