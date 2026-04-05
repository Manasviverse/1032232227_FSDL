import { apiFetch } from "./api";
import type { Resource } from "../data/mockData";

export type ApiResource = Omit<Resource, "id"> & {
  _id: string;
  fileUrl?: string;
  fileType?: string;
};

export const resourceService = {
  async getAll(params?: { type?: string; subject?: string }): Promise<ApiResource[]> {
    const qs = params
      ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v) as any).toString()
      : "";
    return apiFetch<ApiResource[]>(`/resources${qs}`);
  },
  async getById(id: string): Promise<ApiResource> {
    return apiFetch<ApiResource>(`/resources/${id}`);
  },
  async create(data: Omit<ApiResource, "_id" | "downloads" | "likes">): Promise<ApiResource> {
    return apiFetch<ApiResource>("/resources", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  /**
   * Upload a file with metadata via multipart/form-data.
   * The Authorization header is set manually — Content-Type is NOT set
   * so the browser can set the correct multipart boundary automatically.
   */
  async upload(formData: FormData): Promise<ApiResource> {
    const token = localStorage.getItem("edusync_token");
    const res = await fetch("http://localhost:5000/api/resources/upload", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error((data as any)?.message || `Upload failed: HTTP ${res.status}`);
    }
    return data as ApiResource;
  },
  async like(id: string): Promise<{ likes: number; liked: boolean }> {
    return apiFetch(`/resources/${id}/like`, { method: "PUT" });
  },
  async remove(id: string): Promise<void> {
    return apiFetch<void>(`/resources/${id}`, { method: "DELETE" });
  },
};
