import { apiClient } from "./client.js";

export async function listMyResults(params) {
  const { data } = await apiClient.get("/results/me", { params });
  return data.results;
}

export async function getAttemptResult(attemptId) {
  const { data } = await apiClient.get(`/attempts/${attemptId}/result`);
  return data;
}

export async function getResult(resultId) {
  const { data } = await apiClient.get(`/results/${resultId}`);
  return data.result;
}

/** Org admin / counselor — scoped to requester's organization */
export async function listOrgResults(params) {
  const { data } = await apiClient.get("/results/org", { params });
  return data.results;
}
