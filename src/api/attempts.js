import { apiClient } from "./client.js";

export async function startAttempt(quizId) {
  const { data } = await apiClient.post("/attempts/start", { quizId });
  return data.attempt;
}

export async function getAttempt(attemptId) {
  const { data } = await apiClient.get(`/attempts/${attemptId}`);
  return data.attempt;
}

export async function saveAnswers(attemptId, answers) {
  const { data } = await apiClient.patch(`/attempts/${attemptId}/answers`, { answers });
  return data.attempt;
}

export async function submitAttempt(attemptId) {
  const { data } = await apiClient.post(`/attempts/${attemptId}/submit`);
  return data;
}
