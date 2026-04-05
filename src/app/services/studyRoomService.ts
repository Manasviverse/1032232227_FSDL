import { apiFetch } from "./api";
import type { StudyRoom } from "../data/mockData";

// We'll accept StudyRoom from mockData shape but with MongoDB _id
export type ApiStudyRoom = Omit<StudyRoom, "id"> & { _id: string; createdAt?: string; };

export const studyRoomService = {
  async getAll(): Promise<ApiStudyRoom[]> {
    return apiFetch<ApiStudyRoom[]>("/study-rooms");
  },
  async getById(id: string): Promise<ApiStudyRoom> {
    return apiFetch<ApiStudyRoom>(`/study-rooms/${id}`);
  },
  async create(data: Omit<ApiStudyRoom, "_id">): Promise<ApiStudyRoom> {
    return apiFetch<ApiStudyRoom>("/study-rooms", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async update(id: string, data: Partial<ApiStudyRoom>): Promise<ApiStudyRoom> {
    return apiFetch<ApiStudyRoom>(`/study-rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async remove(id: string): Promise<void> {
    return apiFetch<void>(`/study-rooms/${id}`, { method: "DELETE" });
  },
};
