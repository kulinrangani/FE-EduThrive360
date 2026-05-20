import { apiClient } from "./client.js";

export async function listPublishedQuizzes() {
  const { data } = await apiClient.get("/attempts/quizzes");
  return data.quizzes;
}

export async function getQuizForPlay(quizId) {
  const { data } = await apiClient.get(`/attempts/quizzes/${quizId}`);
  return data.quiz;
}
