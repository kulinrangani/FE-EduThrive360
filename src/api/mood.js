import { apiClient } from "./client.js";

export async function createMoodCheckIn(score, note) {
  const { data } = await apiClient.post("/mood", { score, note });
  return data;
}

export async function getMoodHistory(limit = 30) {
  const { data } = await apiClient.get(`/mood/history?limit=${limit}`);
  return data;
}
