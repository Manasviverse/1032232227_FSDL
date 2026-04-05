import { apiFetch } from "./api";
import type { AuthUser } from "./authService";

export const userService = {
  async getAll(): Promise<AuthUser[]> {
    return apiFetch<AuthUser[]>("/users");
  },
  async getMe(): Promise<AuthUser> {
    return apiFetch<AuthUser>("/users/me");
  },
  async getById(id: string): Promise<AuthUser> {
    return apiFetch<AuthUser>(`/users/${id}`);
  },
  async update(id: string, data: Partial<AuthUser>): Promise<AuthUser> {
    return apiFetch<AuthUser>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
